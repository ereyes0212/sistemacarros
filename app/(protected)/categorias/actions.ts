"use server";

import { prisma } from "@/lib/prisma";

export async function getCategorias() {
  return prisma.vehicleCategory.findMany({ include: { parent: true, _count: { select: { vehicles: true } } }, orderBy: { name: "asc" } });
}
