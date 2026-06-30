"use client";

import { useTransition } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { becomeSeller } from "../actions";

export function BecomeSellerButton() {
  const [pending, startTransition] = useTransition();
  return <Button variant="destructive" disabled={pending} onClick={() => { if (!confirm("Al pasarte a vendedor podrás publicar carros, pero no podrás volver al rol comprador. ¿Deseas continuar?")) return; startTransition(async () => { const result = await becomeSeller(); result.ok ? toast.success(result.message) : toast.error(result.message); if (result.ok) window.location.reload(); }); }}>Pasarme a vendedor</Button>;
}
