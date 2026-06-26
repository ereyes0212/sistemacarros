"use server";

import type { Prisma } from "@/lib/generated/prisma";
import { prisma } from "@/lib/prisma";

export async function getVehiculosCatalogo(
  where: Prisma.VehicleWhereInput,
  orderBy: Prisma.VehicleOrderByWithRelationInput,
  page: number,
  pageSize: number,
) {
  const [categories, brands, vehicles, totalCount] = await Promise.all([
    prisma.vehicleCategory.findMany({ select: { slug: true, name: true, _count: { select: { vehicles: true } } }, orderBy: { name: "asc" } }),
    prisma.vehicleBrand.findMany({ select: { slug: true, name: true, _count: { select: { vehicles: true } } }, orderBy: { name: "asc" } }),
    prisma.vehicle.findMany({
      where,
      orderBy,
      include: {
        brand: true,
        model: true,
        category: true,
        images: { orderBy: [{ isMain: "desc" }, { sortOrder: "asc" }], take: 1 },
        seller: { select: { nombre: true, usuario: true } },
      },
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
    prisma.vehicle.count({ where }),
  ]);

  return { categories, brands, vehicles, totalCount };
}
