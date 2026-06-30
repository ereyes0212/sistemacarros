"use client";

import { useTransition } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { createVehicleComment } from "@/app/(public)/productos/[slug]/actions";

export function CommentForm({ vehicleId }: { vehicleId: string }) {
  const [pending, startTransition] = useTransition();
  return <form action={(formData) => startTransition(async () => { const result = await createVehicleComment(vehicleId, formData); if (result.ok) toast.success(result.message); else toast.error(result.message); })} className="space-y-3"><Textarea name="content" placeholder="Comparte una pregunta o comentario sobre este carro..." required /><Button disabled={pending} type="submit">Publicar comentario</Button></form>;
}
