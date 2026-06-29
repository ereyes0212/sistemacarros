import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { createVehicleLead, getVehicleDetail, getVehicleMetadata } from "./actions";

const currency = new Intl.NumberFormat("es-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });
const fallbackImage = "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&w=1200&q=80";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const vehicle = await getVehicleMetadata(slug);
  if (!vehicle) return { title: "Vehículo no encontrado" };
  return { title: `${vehicle.title} | MotorMarket`, description: `${vehicle.brand.name} ${vehicle.model?.name ?? ""} ${vehicle.year}` };
}

export default async function VehicleDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const vehicle = await getVehicleDetail(slug);
  if (!vehicle) notFound();
  const mainImage = vehicle.images[0]?.url ?? fallbackImage;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="space-y-4">
          <div className="relative h-[420px] overflow-hidden rounded-2xl border bg-muted">
            <Image src={mainImage} alt={vehicle.title} fill className="object-cover" priority sizes="(min-width: 1024px) 60vw, 100vw" />
          </div>
          <div className="grid grid-cols-3 gap-3">
            {vehicle.images.slice(1, 4).map((image) => <div key={image.id} className="relative h-28 overflow-hidden rounded-xl border"><Image src={image.url} alt={image.alt ?? vehicle.title} fill className="object-cover" /></div>)}
          </div>
        </div>

        <aside className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex flex-wrap gap-2"><Badge>{vehicle.status}</Badge><Badge variant="outline">{vehicle.category.name}</Badge></div>
              <CardTitle className="text-3xl">{vehicle.title}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-4xl font-bold">{currency.format(Number(vehicle.price))}</p>
              <dl className="grid grid-cols-2 gap-3 text-sm">
                <div><dt className="text-muted-foreground">Marca</dt><dd className="font-medium">{vehicle.brand.name}</dd></div>
                <div><dt className="text-muted-foreground">Modelo</dt><dd className="font-medium">{vehicle.model?.name ?? "N/D"}</dd></div>
                <div><dt className="text-muted-foreground">Año</dt><dd className="font-medium">{vehicle.year}</dd></div>
                <div><dt className="text-muted-foreground">Kilometraje</dt><dd className="font-medium">{vehicle.mileage.toLocaleString("es-US")} km</dd></div>
                <div><dt className="text-muted-foreground">Combustible</dt><dd className="font-medium">{vehicle.fuelType}</dd></div>
                <div><dt className="text-muted-foreground">Transmisión</dt><dd className="font-medium">{vehicle.transmission}</dd></div>
                <div className="col-span-2"><dt className="text-muted-foreground">Ubicación</dt><dd className="font-medium">{vehicle.city}, {vehicle.country}</dd></div>
              </dl>
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle>Contactar vendedor</CardTitle></CardHeader>
            <CardContent>
              <p className="mb-4 text-sm text-muted-foreground">Vendedor: {vehicle.seller.nombre ?? vehicle.seller.usuario}</p>
              <form action={createVehicleLead.bind(null, vehicle.id)} className="space-y-3">
                <Input name="name" placeholder="Nombre" required />
                <Input name="email" type="email" placeholder="Correo" required />
                <Input name="phone" placeholder="Teléfono" />
                <Textarea name="message" placeholder="Estoy interesado en este carro..." />
                <Button type="submit" className="w-full">Enviar consulta</Button>
              </form>
            </CardContent>
          </Card>
        </aside>
      </div>

      <Card className="mt-8">
        <CardHeader><CardTitle>Descripción</CardTitle></CardHeader>
        <CardContent className="whitespace-pre-line text-muted-foreground">{vehicle.description}</CardContent>
      </Card>
    </div>
  );
}
