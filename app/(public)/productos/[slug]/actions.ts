"use server";

import { getSession } from "@/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function getVehicleMetadata(slug: string) {
  return prisma.vehicle.findFirst({ where: { slug, listingStatus: "APPROVED" }, include: { brand: true, model: true } });
}

export async function getVehicleDetail(slug: string) {
  const session = await getSession();
  const vehicle = await prisma.vehicle.findFirst({
    where: { slug, listingStatus: "APPROVED" },
    include: {
      brand: true,
      model: true,
      category: true,
      images: { orderBy: [{ isMain: "desc" }, { sortOrder: "asc" }] },
      versions: true,
      seller: { select: { id: true, nombre: true, usuario: true, email: true, telefono: true, ciudad: true } },
      comments: { where: { status: "APPROVED" }, include: { user: { select: { nombre: true, usuario: true } } }, orderBy: { createdAt: "desc" } },
    },
  });
  if (!vehicle) return null;
  const favorite = session?.IdUser
    ? await prisma.vehicleWishlistItem.findFirst({ where: { vehicleId: vehicle.id, wishlist: { userId: session.IdUser } }, select: { id: true } })
    : null;
  return { ...vehicle, isFavorite: Boolean(favorite) };
}

export async function createVehicleLead(vehicleId: string, formData: FormData) {
  const name = String(formData.get("name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const phone = String(formData.get("phone") ?? "").trim();
  const message = String(formData.get("message") ?? "").trim();
  if (!name || !email) return { ok: false, error: "Nombre y correo son requeridos." };
  const session = await getSession();
  const vehicle = await prisma.vehicle.findUnique({ where: { id: vehicleId }, select: { slug: true } });
  await prisma.vehicleLead.create({ data: { vehicleId, buyerId: session?.IdUser, name, email, phone: phone || null, message: message || null, type: "CONTACT" } });
  if (vehicle?.slug) revalidatePath(`/productos/${vehicle.slug}`);
  return { ok: true };
}


export async function toggleFavorite(vehicleId: string) {
  const session = await getSession();
  if (!session?.IdUser) return { ok: false, loginRequired: true, message: "Inicia sesión para guardar favoritos." };
  const vehicle = await prisma.vehicle.findUnique({ where: { id: vehicleId }, select: { slug: true } });
  if (!vehicle) return { ok: false, message: "Vehículo no encontrado." };
  const wishlist = await prisma.vehicleWishlist.upsert({ where: { userId: session.IdUser }, update: {}, create: { userId: session.IdUser } });
  const existing = await prisma.vehicleWishlistItem.findUnique({ where: { wishlistId_vehicleId: { wishlistId: wishlist.id, vehicleId } } });
  if (existing) {
    await prisma.vehicleWishlistItem.delete({ where: { id: existing.id } });
    revalidatePath("/favoritos");
    revalidatePath(`/productos/${vehicle.slug}`);
    return { ok: true, favorited: false, message: "Carro eliminado de favoritos." };
  }
  await prisma.vehicleWishlistItem.create({ data: { wishlistId: wishlist.id, vehicleId } });
  revalidatePath("/favoritos");
  revalidatePath(`/productos/${vehicle.slug}`);
  return { ok: true, favorited: true, message: "Carro agregado a favoritos." };
}

export async function createVehicleComment(vehicleId: string, formData: FormData) {
  const session = await getSession();
  if (!session?.IdUser) return { ok: false, message: "Inicia sesión para comentar." };
  const content = String(formData.get("content") ?? "").trim();
  if (content.length < 3) return { ok: false, message: "El comentario debe tener al menos 3 caracteres." };
  const vehicle = await prisma.vehicle.findUnique({ where: { id: vehicleId }, select: { slug: true } });
  if (!vehicle) return { ok: false, message: "Vehículo no encontrado." };
  await prisma.vehicleComment.create({ data: { vehicleId, userId: session.IdUser, content, status: "APPROVED" } });
  revalidatePath(`/productos/${vehicle.slug}`);
  return { ok: true, message: "Comentario publicado." };
}
