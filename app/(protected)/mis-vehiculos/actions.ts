"use server";

import { getSession } from "@/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

function slugify(value: string) {
  return value.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

async function uniqueSlug(title: string, id?: string) {
  const base = slugify(title) || "vehiculo";
  let slug = base;
  let index = 1;
  while (await prisma.vehicle.findFirst({ where: { slug, ...(id ? { NOT: { id } } : {}) }, select: { id: true } })) {
    slug = `${base}-${index++}`;
  }
  return slug;
}

export async function getVehicleFormData() {
  const [brands, models, categories] = await Promise.all([
    prisma.vehicleBrand.findMany({ orderBy: { name: "asc" } }),
    prisma.vehicleModel.findMany({ include: { brand: true }, orderBy: [{ brand: { name: "asc" } }, { name: "asc" }] }),
    prisma.vehicleCategory.findMany({ orderBy: { name: "asc" } }),
  ]);
  return { brands, models, categories };
}

export async function getMyVehicles() {
  const session = await getSession();
  if (!session) redirect("/login");
  return prisma.vehicle.findMany({
    where: { sellerId: session.IdUser },
    include: { brand: true, model: true, category: true, images: { orderBy: [{ isMain: "desc" }, { sortOrder: "asc" }], take: 1 } },
    orderBy: { updatedAt: "desc" },
  });
}

export async function getMyVehicle(id: string) {
  const session = await getSession();
  if (!session) redirect("/login");
  return prisma.vehicle.findFirst({ where: { id, sellerId: session.IdUser }, include: { images: true } });
}

export async function saveVehicle(formData: FormData) {
  const session = await getSession();
  if (!session) redirect("/login");
  if (!session.Permiso.includes("crear_carros") && !session.Permiso.includes("editar_carros")) redirect("/dashboard");

  const id = String(formData.get("id") || "");
  const title = String(formData.get("title") || "").trim();
  const description = String(formData.get("description") || "").trim();
  const brandId = String(formData.get("brandId") || "");
  const modelIdRaw = String(formData.get("modelId") || "");
  const categoryId = String(formData.get("categoryId") || "");
  const imageUrl = String(formData.get("imageUrl") || "").trim();
  if (!title || !description || !brandId || !categoryId) throw new Error("Faltan campos obligatorios.");

  const data = {
    title,
    slug: await uniqueSlug(title, id || undefined),
    description,
    year: Number(formData.get("year")),
    mileage: Number(formData.get("mileage")),
    fuelType: String(formData.get("fuelType")) as "GASOLINE",
    transmission: String(formData.get("transmission")) as "MANUAL",
    price: Number(formData.get("price")),
    country: String(formData.get("country") || "Estados Unidos"),
    city: String(formData.get("city") || ""),
    vin: String(formData.get("vin") || "") || null,
    brandId,
    modelId: modelIdRaw || null,
    categoryId,
    listingStatus: "PENDING_REVIEW" as const,
    rejectionReason: null,
    reviewedById: null,
    reviewedAt: null,
  };

  let vehicle;
  if (id) {
    const owned = await prisma.vehicle.findFirstOrThrow({ where: { id, sellerId: session.IdUser }, select: { id: true } });
    vehicle = await prisma.vehicle.update({ where: { id: owned.id }, data });
  } else {
    vehicle = await prisma.vehicle.create({ data: { ...data, sellerId: session.IdUser } });
  }

  if (imageUrl) {
    await prisma.vehicleImage.upsert({
      where: { id: `${vehicle.id}-main` },
      update: { url: imageUrl, alt: title, isMain: true },
      create: { id: `${vehicle.id}-main`, vehicleId: vehicle.id, url: imageUrl, alt: title, isMain: true },
    });
  }
  revalidatePath("/mis-vehiculos");
  redirect("/mis-vehiculos");
}

export async function deleteVehicle(id: string) {
  const session = await getSession();
  if (!session) redirect("/login");
  await prisma.vehicle.deleteMany({ where: { id, sellerId: session.IdUser } });
  revalidatePath("/mis-vehiculos");
}
