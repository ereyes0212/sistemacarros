"use server";

import { revalidatePath } from "next/cache";
import { requireSession, signOut } from "@/auth";
import { prisma } from "@/lib/prisma";
import { optionalString, requireNumber, requireString } from "@/lib/schemas";

function slugify(value: string) {
  return value.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

export async function signOutAction() {
  await signOut();
}

export async function createVehicleAction(_prevState: { error?: string; success?: string }, formData: FormData) {
  const session = await requireSession();

  try {
    const title = requireString(formData.get("title"), "título");
    const brandName = requireString(formData.get("brandName"), "marca");
    const modelName = optionalString(formData.get("modelName"));
    const categoryName = requireString(formData.get("categoryName"), "categoría");
    const baseSlug = slugify(`${title}-${Date.now()}`);

    const brand = await prisma.vehicleBrand.upsert({
      where: { slug: slugify(brandName) },
      update: { name: brandName },
      create: { name: brandName, slug: slugify(brandName) },
    });
    const model = modelName
      ? await prisma.vehicleModel.upsert({
          where: { brandId_slug: { brandId: brand.id, slug: slugify(modelName) } },
          update: { name: modelName },
          create: { brandId: brand.id, name: modelName, slug: slugify(modelName) },
        })
      : null;
    const category = await prisma.vehicleCategory.upsert({
      where: { slug: slugify(categoryName) },
      update: { name: categoryName },
      create: { name: categoryName, slug: slugify(categoryName) },
    });

    const vehicle = await prisma.vehicle.create({
      data: {
        title,
        slug: baseSlug,
        description: requireString(formData.get("description"), "descripción"),
        year: requireNumber(formData.get("year"), "año"),
        mileage: requireNumber(formData.get("mileage"), "kilometraje"),
        fuelType: requireString(formData.get("fuelType"), "combustible") as never,
        transmission: requireString(formData.get("transmission"), "transmisión") as never,
        price: requireNumber(formData.get("price"), "precio"),
        country: requireString(formData.get("country"), "país"),
        city: requireString(formData.get("city"), "ciudad"),
        vin: optionalString(formData.get("vin")),
        sellerId: session.IdUser,
        brandId: brand.id,
        modelId: model?.id,
        categoryId: category.id,
        images: optionalString(formData.get("imageUrl"))
          ? { create: { url: String(formData.get("imageUrl")), alt: title, isMain: true } }
          : undefined,
      },
    });

    revalidatePath("/vehiculos");
    return { success: `Vehículo ${vehicle.id} creado correctamente.` };
  } catch (error) {
    return { error: error instanceof Error ? error.message : "No se pudo crear el vehículo." };
  }
}
