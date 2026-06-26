"use server";

import { getSession } from "@/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function getVehicleMetadata(slug: string) {
  return prisma.vehicle.findFirst({ where: { slug, listingStatus: "APPROVED" }, include: { brand: true, model: true } });
}

export async function getVehicleDetail(slug: string) {
  return prisma.vehicle.findFirst({
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
