"use server";

import type { Prisma } from "@/lib/generated/prisma";
import { prisma } from "@/lib/prisma";

export async function getVehiculosCatalogo(
  where: Prisma.VehicleWhereInput,
  orderBy: Prisma.VehicleOrderByWithRelationInput,
  page: number,
  pageSize: number,
) {
  const vehicleInclude = {
    brand: true,
    model: true,
    category: true,
    images: { orderBy: [{ isMain: "desc" as const }, { sortOrder: "asc" as const }], take: 1 },
    seller: { select: { nombre: true, usuario: true } },
  };

  const [categories, brands, vehicles, totalCount, suggestions] = await Promise.all([
    prisma.vehicleCategory.findMany({ select: { slug: true, name: true, _count: { select: { vehicles: true } } }, orderBy: { name: "asc" } }),
    prisma.vehicleBrand.findMany({ select: { slug: true, name: true, _count: { select: { vehicles: true } } }, orderBy: { name: "asc" } }),
    prisma.vehicle.findMany({
      where,
      orderBy,
      include: vehicleInclude,
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
    prisma.vehicle.count({ where }),
    prisma.vehicle.findMany({
      where: { listingStatus: "APPROVED", status: { in: ["AVAILABLE", "RESERVED"] } },
      orderBy: { createdAt: "desc" },
      include: vehicleInclude,
      take: 4,
    }),
  ]);

  return { categories, brands, vehicles, totalCount, suggestions };
}
