"use client";

import { Heart } from "lucide-react";
import { useTransition } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { toggleFavorite } from "@/app/(public)/productos/[slug]/actions";

export function FavoriteButton({ vehicleId }: { vehicleId: string }) {
  const [pending, startTransition] = useTransition();
  return <Button type="button" disabled={pending} onClick={(event) => { event.preventDefault(); event.stopPropagation(); startTransition(async () => { const result = await toggleFavorite(vehicleId); if (!result.ok) { toast.error(result.message); if (result.loginRequired) window.location.href = `/login?callbackUrl=${encodeURIComponent(window.location.pathname + window.location.search)}`; return; } toast.success(result.message); }); }} className="absolute right-4 top-4 rounded-full bg-white/90 text-zinc-900 hover:bg-white" size="icon" variant="ghost"><Heart className="fill-transparent" /><span className="sr-only">Guardar en favoritos</span></Button>;
}
