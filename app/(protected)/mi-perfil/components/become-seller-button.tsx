"use client";

import { useTransition } from "react";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { becomeSeller } from "../actions";

export function BecomeSellerButton() {
  const [pending, startTransition] = useTransition();

  function handleBecomeSeller() {
    startTransition(async () => {
      const result = await becomeSeller();
      result.ok ? toast.success(result.message) : toast.error(result.message);
      if (result.ok) window.location.reload();
    });
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="destructive" disabled={pending}>Pasarme a vendedor</Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>¿Confirmas el cambio a vendedor?</AlertDialogTitle>
          <AlertDialogDescription>
            Al pasarte a vendedor podrás publicar carros, pero no podrás volver al rol comprador después de confirmar este cambio.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={pending}>Cancelar</AlertDialogCancel>
          <AlertDialogAction variant="destructive" disabled={pending} onClick={handleBecomeSeller}>
            {pending ? "Cambiando..." : "Sí, cambiar a vendedor"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
