"use server";
import { prisma } from "@/lib/prisma";

export async function getDashboardData() {
  const [vehicles, approved, pending, sold, leads, comments] = await Promise.all([
    prisma.vehicle.count(),
    prisma.vehicle.count({ where: { listingStatus: "APPROVED" } }),
    prisma.vehicle.count({ where: { listingStatus: "PENDING_REVIEW" } }),
    prisma.vehicle.count({ where: { status: "SOLD" } }),
    prisma.vehicleLead.count(),
    prisma.vehicleComment.count({ where: { status: "PENDING" } }),
  ]);
  const byStatus = await prisma.vehicle.groupBy({ by: ["listingStatus"], _count: { _all: true } });
  return { vehicles, approved, pending, sold, leads, comments, byStatus };
}
