import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { prisma } from "@/lib/prisma";
import { PERMISSIONS, requirePermission } from "@/lib/permissions";

export default async function VehiclesPage() {
  await requirePermission(PERMISSIONS.carsView);
  const vehicles = await prisma.vehicle.findMany({
    orderBy: { createdAt: "desc" },
    include: { brand: true, model: true, category: true, leads: true },
    take: 50,
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="font-semibold text-blue-700">Inventario</p>
          <h2 className="text-3xl font-black">Vehículos publicados</h2>
        </div>
        <Button asChild><Link href="/vehiculos/nuevo">Nuevo vehículo</Link></Button>
      </div>
      <div className="grid gap-4">
        {vehicles.map((vehicle) => (
          <Card key={vehicle.id}>
            <CardContent className="flex flex-col justify-between gap-4 p-5 md:flex-row md:items-center">
              <div>
                <h3 className="text-lg font-bold">{vehicle.title}</h3>
                <p className="text-sm text-muted-foreground">{vehicle.brand.name} {vehicle.model?.name} · {vehicle.city}, {vehicle.country} · {vehicle.leads.length} leads</p>
              </div>
              <div className="text-right">
                <p className="font-bold">US$ {Number(vehicle.price).toLocaleString("es-US")}</p>
                <p className="text-xs uppercase tracking-widest text-muted-foreground">{vehicle.listingStatus} · {vehicle.status}</p>
              </div>
            </CardContent>
          </Card>
        ))}
        {!vehicles.length ? <p className="rounded-2xl border border-dashed bg-white p-8 text-center text-muted-foreground">Aún no hay vehículos. Crea el primero para iniciar el MVP.</p> : null}
      </div>
    </div>
  );
}
