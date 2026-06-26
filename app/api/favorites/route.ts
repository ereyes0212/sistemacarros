import { NextResponse } from "next/server";

import { getSession } from "@/auth";
import { revalidateFavorites } from "@/lib/marketplace/db";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const vehicleId = url.searchParams.get("vehicleId");
  const session = await getSession();
  if (!session) return NextResponse.redirect(new URL(`/login?next=${encodeURIComponent(url.pathname + url.search)}`, url.origin));
  if (!vehicleId) return NextResponse.json({ error: "vehicleId es obligatorio." }, { status: 400 });

  const wishlist = await prisma.vehicleWishlist.upsert({ where: { userId: session.IdUser }, update: {}, create: { userId: session.IdUser } });
  const existing = await prisma.vehicleWishlistItem.findUnique({ where: { wishlistId_vehicleId: { wishlistId: wishlist.id, vehicleId } } });
  if (existing) await prisma.vehicleWishlistItem.delete({ where: { id: existing.id } });
  else await prisma.vehicleWishlistItem.create({ data: { wishlistId: wishlist.id, vehicleId } });

  revalidateFavorites();
  return NextResponse.redirect(new URL("/favoritos", url.origin));
}
