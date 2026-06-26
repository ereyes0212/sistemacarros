import { unstable_cache, revalidateTag } from "next/cache";

import { prisma } from "@/lib/prisma";

export const MARKETPLACE_TAG = "marketplace-vehicles";
export const FAVORITES_TAG = "wishlist";

export const getPublicVehicles = unstable_cache(
  async () =>
    prisma.vehicle.findMany({
      where: { listingStatus: "APPROVED", status: { in: ["AVAILABLE", "RESERVED"] } },
      include: { brand: true, model: true, category: true, images: { orderBy: { sortOrder: "asc" }, take: 1 } },
      orderBy: { createdAt: "desc" },
      take: 24,
    }),
  ["public-vehicles"],
  { tags: [MARKETPLACE_TAG], revalidate: 300 },
);

export function revalidateMarketplace() {
  revalidateTag(MARKETPLACE_TAG);
}

export function revalidateFavorites() {
  revalidateTag(FAVORITES_TAG);
}
