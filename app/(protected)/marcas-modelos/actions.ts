"use server";

import { getSession } from "@/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

function slugify(value: string) {
  return value.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

async function requireAdmin() {
  const session = await getSession();
  if (!session) redirect("/login");
  if (!session.Permiso.includes("moderar_carros") && session.Rol !== "Administrador") redirect("/dashboard");
  return session;
}

export async function getBrandsWithModels() {
  await requireAdmin();
  return prisma.vehicleBrand.findMany({ include: { models: { orderBy: { name: "asc" } }, _count: { select: { vehicles: true } } }, orderBy: { name: "asc" } });
}

export async function createBrand(formData: FormData) {
  await requireAdmin();
  const name = String(formData.get("name") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  if (!name) return;
  await prisma.vehicleBrand.create({ data: { name, slug: slugify(name), description: description || null } });
  revalidatePath("/marcas-modelos");
}

export async function createModel(formData: FormData) {
  await requireAdmin();
  const brandId = String(formData.get("brandId") ?? "");
  const name = String(formData.get("name") ?? "").trim();
  if (!brandId || !name) return;
  await prisma.vehicleModel.create({ data: { brandId, name, slug: slugify(name) } });
  revalidatePath("/marcas-modelos");
}
