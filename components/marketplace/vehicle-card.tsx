import Image from "next/image";
import { Gauge, MapPin, Fuel, Heart } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import type { Vehicle } from "@/lib/marketplace/vehicles";
import { VehicleStatusBadge } from "./vehicle-status-badge";

const currency = new Intl.NumberFormat("es-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

export function VehicleCard({ vehicle }: { vehicle: Vehicle }) {
  return (
    <Card className="group border-white/70 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl">
      <div className="relative h-52 overflow-hidden">
        <Image
          src={vehicle.image}
          alt={vehicle.title}
          fill
          className="object-cover transition duration-500 group-hover:scale-105"
          sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
        />
        <div className="absolute left-4 top-4">
          <VehicleStatusBadge status={vehicle.status} />
        </div>
        <Button className="absolute right-4 top-4 rounded-full bg-white/90 text-zinc-900 hover:bg-white" size="icon" variant="ghost">
          <Heart />
          <span className="sr-only">Guardar en favoritos</span>
        </Button>
      </div>
      <CardContent className="space-y-4 pt-1">
        <div>
          <p className="text-sm text-muted-foreground">{vehicle.brand} · {vehicle.model}</p>
          <h3 className="mt-1 text-xl font-semibold tracking-tight">{vehicle.title}</h3>
        </div>
        <div className="grid grid-cols-2 gap-3 text-sm text-muted-foreground">
          <span className="flex items-center gap-2"><Gauge className="size-4" />{vehicle.mileage.toLocaleString("es-US")} km</span>
          <span className="flex items-center gap-2"><Fuel className="size-4" />{vehicle.fuelType}</span>
          <span>{vehicle.year}</span>
          <span>{vehicle.transmission}</span>
        </div>
        <p className="flex items-center gap-2 text-sm text-muted-foreground"><MapPin className="size-4" />{vehicle.city}, {vehicle.country}</p>
      </CardContent>
      <CardFooter className="justify-between bg-zinc-50">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Precio</p>
          <p className="text-2xl font-bold">{currency.format(vehicle.price)}</p>
        </div>
        <Button>Contactar</Button>
      </CardFooter>
    </Card>
  );
}
