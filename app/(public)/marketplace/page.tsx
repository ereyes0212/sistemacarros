import Link from "next/link";

import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { getPublicVehicles } from "@/lib/marketplace/db";

export default async function MarketplacePage() {
  const vehicles = await getPublicVehicles();

  return (
    <main className="min-h-screen bg-slate-50 px-6 py-10">
      <div className="mx-auto max-w-7xl space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <p className="font-semibold text-blue-700">Marketplace público</p>
            <h1 className="text-4xl font-black">Compra y venta de vehículos verificados</h1>
          </div>
          <Button asChild><Link href="/login">Acceder</Link></Button>
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {vehicles.map((vehicle) => (
            <Card key={vehicle.id} className="overflow-hidden">
              <div className="h-48 bg-slate-200 bg-cover bg-center" style={{ backgroundImage: `url(${vehicle.images[0]?.url ?? "/window.svg"})` }} />
              <CardContent className="space-y-2 p-5">
                <p className="text-sm text-muted-foreground">{vehicle.brand.name} {vehicle.model?.name}</p>
                <h2 className="text-xl font-bold">{vehicle.title}</h2>
                <p className="text-sm text-muted-foreground">{vehicle.year} · {vehicle.mileage.toLocaleString("es-US")} km · {vehicle.city}</p>
                <p className="text-2xl font-black">US$ {Number(vehicle.price).toLocaleString("es-US")}</p>
              </CardContent>
              <CardFooter className="gap-2">
                <Button asChild className="flex-1"><Link href={`/marketplace/${vehicle.slug}`}>Ver detalle</Link></Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </main>
  );
}
