import { notFound } from "next/navigation";

import { prisma } from "@/lib/prisma";
import { Button } from "@/components/ui/button";
import { LeadForm } from "./lead-form";

export default async function VehicleDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const vehicle = await prisma.vehicle.findFirst({ where: { slug, listingStatus: "APPROVED" }, include: { brand: true, model: true, category: true, images: true, seller: true } });
  if (!vehicle) notFound();

  return (
    <main className="min-h-screen bg-slate-50 px-6 py-10">
      <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[1fr_420px]">
        <section className="space-y-6">
          <div className="h-[420px] rounded-3xl bg-slate-200 bg-cover bg-center" style={{ backgroundImage: `url(${vehicle.images[0]?.url ?? "/window.svg"})` }} />
          <div className="rounded-3xl bg-white p-8 shadow-sm">
            <p className="text-sm font-semibold text-blue-700">{vehicle.brand.name} {vehicle.model?.name} · {vehicle.category.name}</p>
            <h1 className="mt-2 text-4xl font-black">{vehicle.title}</h1>
            <p className="mt-4 text-muted-foreground">{vehicle.description}</p>
            <div className="mt-6 grid gap-3 md:grid-cols-4"><span>{vehicle.year}</span><span>{vehicle.mileage.toLocaleString("es-US")} km</span><span>{vehicle.fuelType}</span><span>{vehicle.transmission}</span></div>
          </div>
        </section>
        <aside className="space-y-4">
          <div className="rounded-3xl border bg-white p-6 shadow-sm">
            <p className="text-sm text-muted-foreground">Precio publicado</p>
            <p className="text-4xl font-black">US$ {Number(vehicle.price).toLocaleString("es-US")}</p>
            <p className="mt-2 text-sm text-muted-foreground">{vehicle.city}, {vehicle.country}</p>
            <Button asChild variant="outline" className="mt-4 w-full"><a href={`/api/favorites?vehicleId=${vehicle.id}`}>Agregar a favoritos</a></Button>
          </div>
          <LeadForm vehicleId={vehicle.id} />
        </aside>
      </div>
    </main>
  );
}
