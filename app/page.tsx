import { ShieldCheck, SlidersHorizontal, Users, Wrench } from "lucide-react";

import { VehicleCard } from "@/components/marketplace/vehicle-card";
import { VehicleSearchBar } from "@/components/marketplace/vehicle-search-bar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { featuredVehicles, vehicleTypes } from "@/lib/marketplace/vehicles";

const workflows = [
  {
    icon: Users,
    title: "Compradores",
    text: "Buscan por marca, precio, año, kilometraje, transmisión y guardan favoritos.",
  },
  {
    icon: Wrench,
    title: "Vendedores",
    text: "Publican vehículos con galería, ficha técnica, ubicación y seguimiento de leads.",
  },
  {
    icon: ShieldCheck,
    title: "Moderación",
    text: "Administradores aprueban o rechazan publicaciones antes de hacerlas públicas.",
  },
];

export default function Home() {
  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top_left,#dbeafe,transparent_32%),linear-gradient(180deg,#f8fafc_0%,#eef2ff_45%,#ffffff_100%)] text-zinc-950">
      <section className="mx-auto flex w-full max-w-7xl flex-col gap-12 px-6 py-8 lg:px-8 lg:py-12">
        <nav className="flex items-center justify-between rounded-full border border-white/70 bg-white/80 px-5 py-3 shadow-sm backdrop-blur">
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-full bg-blue-600 text-lg font-black text-white">M</div>
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.28em] text-blue-700">MotorMarket</p>
              <p className="text-xs text-muted-foreground">Marketplace multi-rol de vehículos</p>
            </div>
          </div>
          <div className="hidden items-center gap-6 text-sm font-medium md:flex">
            <a href="#vehiculos">Vehículos</a>
            <a href="#arquitectura">Arquitectura</a>
            <a href="#moderacion">Moderación</a>
          </div>
          <Button>Publicar vehículo</Button>
        </nav>

        <div className="grid items-center gap-10 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="space-y-8">
            <Badge className="bg-blue-100 text-blue-700">Cars.com + MercadoLibre Autos para tu ecommerce</Badge>
            <div className="space-y-5">
              <h1 className="max-w-4xl text-5xl font-black tracking-tight md:text-7xl">
                Marketplace de carros con publicaciones, leads y moderación.
              </h1>
              <p className="max-w-2xl text-lg leading-8 text-zinc-600">
                Refactorizamos el dominio de productos a vehículos: vendedores publican, compradores filtran y contactan, y el equipo de administración controla roles, permisos y aprobaciones.
              </p>
            </div>
            <VehicleSearchBar />
            <div className="flex flex-wrap gap-2">
              {vehicleTypes.map((type) => (
                <Badge key={type} className="bg-white text-zinc-700 ring-1 ring-zinc-200" variant="outline">
                  {type}
                </Badge>
              ))}
            </div>
          </div>

          <div className="rounded-[2rem] border border-white bg-white/70 p-4 shadow-2xl shadow-blue-950/10 backdrop-blur">
            <VehicleCard vehicle={featuredVehicles[0]} />
          </div>
        </div>
      </section>

      <section id="vehiculos" className="mx-auto max-w-7xl px-6 py-14 lg:px-8">
        <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <p className="font-semibold text-blue-700">Inventario destacado</p>
            <h2 className="mt-2 text-3xl font-bold tracking-tight md:text-4xl">Vehículos aprobados para el marketplace</h2>
          </div>
          <Button variant="outline"><SlidersHorizontal /> Filtros avanzados</Button>
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {featuredVehicles.map((vehicle) => (
            <VehicleCard key={vehicle.id} vehicle={vehicle} />
          ))}
        </div>
      </section>

      <section id="arquitectura" className="mx-auto max-w-7xl px-6 py-14 lg:px-8">
        <div className="grid gap-6 md:grid-cols-3">
          {workflows.map((item) => (
            <Card key={item.title} className="border-white bg-white/85 shadow-sm">
              <CardHeader>
                <div className="mb-4 flex size-12 items-center justify-center rounded-2xl bg-blue-100 text-blue-700">
                  <item.icon className="size-6" />
                </div>
                <CardTitle>{item.title}</CardTitle>
              </CardHeader>
              <CardContent className="text-muted-foreground">{item.text}</CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section id="moderacion" className="mx-auto max-w-7xl px-6 pb-20 lg:px-8">
        <div className="rounded-[2rem] bg-zinc-950 p-8 text-white md:p-12">
          <div className="grid gap-8 md:grid-cols-[0.9fr_1.1fr] md:items-center">
            <div>
              <p className="font-semibold text-blue-300">Flujo crítico</p>
              <h2 className="mt-3 text-3xl font-bold tracking-tight">Nada se publica sin revisión.</h2>
              <p className="mt-4 text-zinc-300">
                Cada vehículo nace como pending_review, queda visible sólo al aprobarse y conserva auditoría de moderador, fecha y motivo de rechazo cuando aplique.
              </p>
            </div>
            <div className="grid gap-3 sm:grid-cols-3">
              {['Crear publicación', 'Revisión admin', 'Visible / rechazado'].map((step, index) => (
                <div key={step} className="rounded-2xl border border-white/10 bg-white/10 p-5">
                  <p className="text-3xl font-black text-blue-300">0{index + 1}</p>
                  <p className="mt-3 font-semibold">{step}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
