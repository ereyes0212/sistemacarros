"use server";
import { prisma } from "@/lib/prisma";

export async function getReportesData() {
  const [leads, vehiclesByBrand, latestLeads] = await Promise.all([
    prisma.vehicleLead.groupBy({ by: ["status"], _count: { _all: true } }),
    prisma.vehicle.groupBy({ by: ["brandId"], _count: { _all: true }, orderBy: { _count: { brandId: "desc" } }, take: 10 }),
    prisma.vehicleLead.findMany({ include: { vehicle: { include: { brand: true } }, buyer: { select: { nombre: true, email: true } } }, orderBy: { createdAt: "desc" }, take: 25 }),
  ]);
  const brands = await prisma.vehicleBrand.findMany({ where: { id: { in: vehiclesByBrand.map((item) => item.brandId) } }, select: { id: true, name: true } });
  return { leads, vehiclesByBrand, brands, latestLeads };
}
