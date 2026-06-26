import Link from "next/link";
import { unstable_cache } from "next/cache";

import { requireSession } from "@/auth";
import { FAVORITES_TAG } from "@/lib/marketplace/db";
import { PERMISSIONS, requirePermission } from "@/lib/permissions";
import { prisma } from "@/lib/prisma";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const getWishlist = (userId: string) =>
  unstable_cache(
    () => prisma.vehicleWishlist.findUnique({ where: { userId }, include: { items: { include: { vehicle: { include: { brand: true, model: true, images: { take: 1 } } } }, orderBy: { createdAt: "desc" } } } }),
    ["wishlist", userId],
    { tags: [FAVORITES_TAG, `wishlist-${userId}`], revalidate: 300 },
  )();

export default async function FavoritesPage() {
  const session = await requirePermission(PERMISSIONS.wishlistView);
  await requireSession();
  const wishlist = await getWishlist(session.IdUser);

  return (
    <div className="space-y-6">
      <div>
        <p className="font-semibold text-blue-700">Favoritos cacheados</p>
        <h2 className="text-3xl font-black">Vehículos guardados</h2>
      </div>
      <div className="grid gap-4">
        {wishlist?.items.map((item) => (
          <Card key={item.id}>
            <CardContent className="flex items-center justify-between p-5">
              <div>
                <h3 className="font-bold">{item.vehicle.title}</h3>
                <p className="text-sm text-muted-foreground">{item.vehicle.brand.name} {item.vehicle.model?.name}</p>
              </div>
              <Button asChild variant="outline"><Link href={`/marketplace/${item.vehicle.slug}`}>Ver</Link></Button>
            </CardContent>
          </Card>
        ))}
        {!wishlist?.items.length ? <p className="rounded-2xl border border-dashed bg-white p-8 text-center text-muted-foreground">No tienes favoritos guardados.</p> : null}
      </div>
    </div>
  );
}
