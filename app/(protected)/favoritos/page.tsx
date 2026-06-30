import Link from "next/link";
import { getSession } from "@/auth";
import HeaderComponent from "@/components/HeaderComponent";
import { VehicleCard } from "@/components/marketplace/vehicle-card";
import { Button } from "@/components/ui/button";
import { prisma } from "@/lib/prisma";
import { Heart } from "lucide-react";
import { redirect } from "next/navigation";

const fallbackImage = "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&w=900&q=80";

export default async function FavoritesPage() {
  const session = await getSession();
  if (!session) redirect("/login");
  const wishlist = await prisma.vehicleWishlist.findUnique({
    where: { userId: session.IdUser },
    include: { items: { include: { vehicle: { include: { brand: true, model: true, images: { orderBy: [{ isMain: "desc" }, { sortOrder: "asc" }], take: 1 }, seller: { select: { nombre: true, usuario: true } } } } }, orderBy: { createdAt: "desc" } } },
  });
  const vehicles = wishlist?.items.map((item) => item.vehicle).filter((vehicle) => vehicle.listingStatus === "APPROVED") ?? [];

  return <div className="container mx-auto py-2"><HeaderComponent Icon={Heart} description="Guarda carros para compararlos y contactar al vendedor cuando estés listo." screenName="Mis favoritos" />{vehicles.length ? <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">{vehicles.map((vehicle) => <Link key={vehicle.id} href={`/productos/${vehicle.slug}`}><VehicleCard vehicle={{ id: vehicle.id, title: vehicle.title, brand: vehicle.brand.name, model: vehicle.model?.name ?? "", year: vehicle.year, mileage: vehicle.mileage, fuelType: vehicle.fuelType, transmission: vehicle.transmission, price: Number(vehicle.price), city: vehicle.city, country: vehicle.country, image: vehicle.images[0]?.url ?? fallbackImage, status: vehicle.status, seller: vehicle.seller.nombre ?? vehicle.seller.usuario, isFavorite: true }} /></Link>)}</div> : <div className="rounded-3xl border border-dashed p-10 text-center"><h2 className="text-xl font-semibold">Todavía no tienes favoritos</h2><p className="mt-2 text-muted-foreground">Explora el marketplace y guarda carros para evaluarlos después.</p><Button asChild className="mt-4"><Link href="/productos">Explorar carros</Link></Button></div>}</div>;
}
