import { getSession, getSessionPermisos } from "@/auth";
import HeaderComponent from "@/components/HeaderComponent";
import NoAcceso from "@/components/noAccess";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Car } from "lucide-react";
import { aprobarVehiculo, getVehiculosAdmin, rechazarVehiculo } from "./actions";

const currency = new Intl.NumberFormat("es-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });

export default async function AdminVehiculosPage() {
  const [permisos, session, vehiculos] = await Promise.all([getSessionPermisos(), getSession(), getVehiculosAdmin()]);
  if (!permisos?.some((permiso) => ["ver_productos_admin", "ver_vehiculos_admin"].includes(permiso))) return <NoAcceso />;

  return (
    <div className="container mx-auto py-2">
      <HeaderComponent Icon={Car} description="Administra publicaciones de carros, estados y moderación" screenName="Vehículos" />
      <div className="grid gap-4">
        {vehiculos.map((vehiculo) => (
          <Card key={vehiculo.id}>
            <CardContent className="flex flex-col gap-4 p-4 md:flex-row md:items-center md:justify-between">
              <div>
                <div className="mb-2 flex flex-wrap gap-2"><Badge>{vehiculo.listingStatus}</Badge><Badge variant="outline">{vehiculo.status}</Badge></div>
                <h3 className="font-semibold">{vehiculo.title}</h3>
                <p className="text-sm text-muted-foreground">{vehiculo.brand.name} {vehiculo.model?.name ?? ""} · {vehiculo.year} · {vehiculo.mileage.toLocaleString("es-US")} km · {vehiculo.city}</p>
                <p className="text-sm font-medium">{currency.format(Number(vehiculo.price))} · Vendedor: {vehiculo.seller.nombre ?? vehiculo.seller.usuario}</p>
              </div>
              <div className="flex gap-2">
                <form action={aprobarVehiculo.bind(null, vehiculo.id, session?.IdUser)}><Button type="submit" size="sm">Aprobar</Button></form>
                <form action={rechazarVehiculo.bind(null, vehiculo.id, session?.IdUser)}><Button type="submit" size="sm" variant="outline">Rechazar</Button></form>
              </div>
            </CardContent>
          </Card>
        ))}
        {vehiculos.length === 0 && <p className="rounded-lg border p-8 text-center text-muted-foreground">No hay vehículos registrados.</p>}
      </div>
    </div>
  );
}
