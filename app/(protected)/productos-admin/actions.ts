"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function getVehiculosAdmin() {
  return prisma.vehicle.findMany({
    include: { brand: true, model: true, category: true, seller: { select: { nombre: true, usuario: true } } },
    orderBy: { createdAt: "desc" },
    take: 100,
  });
}

export async function aprobarVehiculo(id: string, reviewerId?: string) {
  await prisma.vehicle.update({ where: { id }, data: { listingStatus: "APPROVED", reviewedById: reviewerId, reviewedAt: new Date(), rejectionReason: null } });
  revalidatePath("/productos-admin");
}

export async function rechazarVehiculo(id: string, reviewerId?: string) {
  await prisma.vehicle.update({ where: { id }, data: { listingStatus: "REJECTED", reviewedById: reviewerId, reviewedAt: new Date(), rejectionReason: "Rechazado desde panel administrativo" } });
  revalidatePath("/productos-admin");
}
