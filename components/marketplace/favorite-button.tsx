"use client";

import { Heart } from "lucide-react";
import { useState, useTransition } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { toggleFavorite } from "@/app/(public)/productos/[slug]/actions";

export function FavoriteButton({ vehicleId }: { vehicleId: string }) {
  const [pending, startTransition] = useTransition();
  const [isFavorite, setIsFavorite] = useState(false);

  return <Button type="button" disabled={pending} onClick={(event) => { event.preventDefault(); event.stopPropagation(); startTransition(async () => { const result = await toggleFavorite(vehicleId); if (!result.ok) { toast.error(result.message); if (result.loginRequired) window.location.href = `/login?callbackUrl=${encodeURIComponent(window.location.pathname + window.location.search)}`; return; } setIsFavorite(result.favorited ?? false); toast.success(result.message); }); }} className={`absolute right-4 top-4 rounded-full bg-white/90 hover:bg-white ${isFavorite ? "text-pink-600" : "text-zinc-900"}`} size="icon" variant="ghost"><Heart className={isFavorite ? "fill-pink-500 text-pink-600" : "fill-transparent"} /><span className="sr-only">Guardar en favoritos</span></Button>;
}
