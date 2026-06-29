import Link from "next/link";
import HeaderComponent from "@/components/HeaderComponent";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Car, Plus } from "lucide-react";
import { deleteVehicle, getMyVehicles } from "./actions";

const currency = new Intl.NumberFormat("es-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });

export default async function MyVehiclesPage() {
  const vehicles = await getMyVehicles();
  return <div className="container mx-auto py-2"><div className="flex items-center justify-between gap-3"><HeaderComponent Icon={Car} description="Crea y administra tus publicaciones. Cada cambio vuelve a revisión del equipo." screenName="Mis vehículos" /><Button asChild><Link href="/mis-vehiculos/create"><Plus className="mr-2 size-4" />Nuevo</Link></Button></div>
    <div className="grid gap-4">{vehicles.map((v) => <Card key={v.id} className="overflow-hidden"><CardContent className="flex flex-col gap-4 p-4 md:flex-row md:items-center md:justify-between"><div><div className="mb-2 flex gap-2"><Badge>{v.listingStatus}</Badge><Badge variant="outline">{v.status}</Badge></div><h3 className="text-lg font-semibold">{v.title}</h3><p className="text-sm text-muted-foreground">{v.brand.name} {v.model?.name ?? ""} · {v.year} · {v.mileage.toLocaleString("es-US")} km · {v.city}</p><p className="font-medium">{currency.format(Number(v.price))}</p>{v.rejectionReason && <p className="mt-2 text-sm text-rose-600">Motivo: {v.rejectionReason}</p>}</div><div className="flex gap-2"><Button asChild variant="outline"><Link href={`/mis-vehiculos/${v.id}/edit`}>Editar</Link></Button><form action={deleteVehicle.bind(null, v.id)}><Button variant="destructive" type="submit">Eliminar</Button></form></div></CardContent></Card>)}{vehicles.length === 0 && <div className="rounded-3xl border border-dashed p-10 text-center"><h2 className="text-xl font-semibold">Aún no tienes publicaciones</h2><p className="mt-2 text-muted-foreground">Publica tu primer carro y quedará pendiente de revisión antes de aparecer en el marketplace.</p><Button asChild className="mt-4"><Link href="/mis-vehiculos/create">Crear publicación</Link></Button></div>}</div></div>;
}
