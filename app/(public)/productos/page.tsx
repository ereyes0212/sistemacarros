import Link from "next/link";
import type { Metadata } from "next";
import type { Prisma } from "@/lib/generated/prisma";
import { VehicleCard } from "@/components/marketplace/vehicle-card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { getVehiculosCatalogo } from "./actions";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Vehículos | MotorMarket",
  description: "Explora carros disponibles con filtros por categoría, marca, precio, año y kilometraje.",
};

const fallbackImage = "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&w=900&q=80";

function buildHref(searchParams: Record<string, string | string[] | undefined>, page: number) {
  const params = new URLSearchParams();
  for (const [key, rawValue] of Object.entries(searchParams)) {
    if (key === "page") continue;
    if (typeof rawValue === "string" && rawValue.length > 0) params.set(key, rawValue);
  }
  params.set("page", String(page));
  return `/productos?${params.toString()}`;
}

export default async function ProductosPage({ searchParams }: { searchParams: Record<string, string | string[] | undefined> }) {
  const categorySlug = typeof searchParams.categoria === "string" ? searchParams.categoria : undefined;
  const brandFilter = typeof searchParams.marca === "string" ? searchParams.marca.trim() : undefined;
  const city = typeof searchParams.ciudad === "string" ? searchParams.ciudad.trim() : undefined;
  const min = searchParams.min ? Number(searchParams.min) : undefined;
  const max = searchParams.max ? Number(searchParams.max) : undefined;
  const query = typeof searchParams.q === "string" ? searchParams.q : undefined;
  const sort = typeof searchParams.orden === "string" ? searchParams.orden : "reciente";
  const page = Math.max(1, Number(typeof searchParams.page === "string" ? searchParams.page : "1") || 1);
  const pageSize = 12;

  const where: Prisma.VehicleWhereInput = {
    listingStatus: "APPROVED",
    status: { in: ["AVAILABLE", "RESERVED"] },
    ...(categorySlug && { category: { slug: categorySlug } }),
    ...(brandFilter && { brand: { OR: [{ slug: brandFilter.toLowerCase() }, { name: { contains: brandFilter } }] } }),
    ...(city && { city: { contains: city } }),
    ...(query && { OR: [{ title: { contains: query } }, { description: { contains: query } }, { city: { contains: query } }] }),
    ...((min || max) && { price: { ...(min && { gte: min }), ...(max && { lte: max }) } }),
  };

  const orderBy: Prisma.VehicleOrderByWithRelationInput =
    sort === "precio-asc" ? { price: "asc" } : sort === "precio-desc" ? { price: "desc" } : sort === "anio" ? { year: "desc" } : { createdAt: "desc" };

  const { categories, brands, vehicles, totalCount, suggestions } = await getVehiculosCatalogo(where, orderBy, page, pageSize);
  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-blue-50/40 px-4 py-8">
      <div className="container mx-auto"><div className="mb-8 rounded-[2rem] border bg-white/85 p-6 shadow-sm flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <Badge variant="outline">Marketplace automotriz</Badge>
          <h1 className="mt-3 text-3xl font-bold tracking-tight md:text-4xl">Vehículos disponibles</h1>
          <p className="mt-2 text-sm text-muted-foreground">{totalCount} carro{totalCount !== 1 ? "s" : ""} aprobado{totalCount !== 1 ? "s" : ""} para contactar vendedores.</p>
        </div>
        <form className="flex flex-wrap gap-2" action="/productos">
          <input name="q" defaultValue={query} placeholder="Marca, modelo o ciudad" className="rounded-md border px-3 py-2 text-sm" />
          <select name="orden" defaultValue={sort} className="rounded-md border px-3 py-2 text-sm">
            <option value="reciente">Más recientes</option>
            <option value="precio-asc">Precio menor</option>
            <option value="precio-desc">Precio mayor</option>
            <option value="anio">Año más nuevo</option>
          </select>
          <Button type="submit">Buscar carros</Button>
        </form>
      </div>

      <div className="mb-6 flex flex-wrap gap-2">
        {brands.filter((b) => b._count.vehicles > 0).slice(0, 12).map((brand) => (
          <Button key={brand.slug} asChild variant={brandFilter === brand.slug ? "default" : "outline"} size="sm">
            <Link href={`/productos?marca=${brand.slug}`}>{brand.name}</Link>
          </Button>
        ))}
        {categories.filter((c) => c._count.vehicles > 0).slice(0, 8).map((category) => (
          <Button key={category.slug} asChild variant={categorySlug === category.slug ? "default" : "secondary"} size="sm">
            <Link href={`/productos?categoria=${category.slug}`}>{category.name}</Link>
          </Button>
        ))}
      </div>

      {vehicles.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {vehicles.map((vehicle) => (
            <Link key={vehicle.id} href={`/productos/${vehicle.slug}`} className="block">
              <VehicleCard vehicle={{ id: vehicle.id, title: vehicle.title, brand: vehicle.brand.name, model: vehicle.model?.name ?? "", year: vehicle.year, mileage: vehicle.mileage, fuelType: vehicle.fuelType, transmission: vehicle.transmission, price: Number(vehicle.price), city: vehicle.city, country: vehicle.country, image: vehicle.images[0]?.url ?? fallbackImage, status: vehicle.status, seller: vehicle.seller.nombre ?? vehicle.seller.usuario }} />
            </Link>
          ))}
        </div>
      ) : (
        <div className="space-y-8">
          <div className="rounded-xl border bg-white/80 py-16 text-center shadow-sm"><p className="font-semibold">No hay resultados para tu búsqueda</p><p className="text-sm text-muted-foreground">Prueba con otros filtros o revisa estas opciones que te pueden interesar.</p></div>
          {suggestions.length > 0 && <section className="space-y-4"><div><p className="font-semibold text-blue-700">Te puede interesar</p><h2 className="text-2xl font-bold tracking-tight">Otras opciones disponibles</h2></div><div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">{suggestions.map((vehicle) => <Link key={vehicle.id} href={`/productos/${vehicle.slug}`} className="block"><VehicleCard vehicle={{ id: vehicle.id, title: vehicle.title, brand: vehicle.brand.name, model: vehicle.model?.name ?? "", year: vehicle.year, mileage: vehicle.mileage, fuelType: vehicle.fuelType, transmission: vehicle.transmission, price: Number(vehicle.price), city: vehicle.city, country: vehicle.country, image: vehicle.images[0]?.url ?? fallbackImage, status: vehicle.status, seller: vehicle.seller.nombre ?? vehicle.seller.usuario }} /></Link>)}</div></section>}
        </div>
      )}

      {totalPages > 1 && <div className="mt-8 flex justify-center gap-3"><Button asChild variant="outline" disabled={page <= 1}><Link href={buildHref(searchParams, page - 1)}>Anterior</Link></Button><Button asChild variant="outline" disabled={page >= totalPages}><Link href={buildHref(searchParams, page + 1)}>Siguiente</Link></Button></div>}
    </div></div>
  );
}
