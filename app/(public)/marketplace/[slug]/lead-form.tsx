"use client";

import { useActionState } from "react";

import { createLeadAction } from "./actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export function LeadForm({ vehicleId }: { vehicleId: string }) {
  const [state, formAction, pending] = useActionState(createLeadAction, {});

  return (
    <form action={formAction} className="space-y-4 rounded-3xl border bg-white p-6 shadow-sm">
      <input type="hidden" name="vehicleId" value={vehicleId} />
      <div className="space-y-2"><Label>Nombre</Label><Input name="name" required /></div>
      <div className="space-y-2"><Label>Email</Label><Input name="email" type="email" required /></div>
      <div className="space-y-2"><Label>Teléfono</Label><Input name="phone" /></div>
      <div className="space-y-2"><Label>Interés</Label><select name="type" className="h-10 w-full rounded-md border bg-background px-3 text-sm"><option value="CONTACT">Contacto</option><option value="TEST_DRIVE">Test drive</option><option value="FINANCING">Financiamiento</option><option value="PURCHASE_REQUEST">Compra</option></select></div>
      <div className="space-y-2"><Label>Mensaje</Label><Textarea name="message" rows={4} /></div>
      {state.error ? <p className="rounded-xl bg-red-50 p-3 text-sm text-red-700">{state.error}</p> : null}
      {state.success ? <p className="rounded-xl bg-emerald-50 p-3 text-sm text-emerald-700">{state.success}</p> : null}
      <Button disabled={pending} className="w-full" type="submit">{pending ? "Enviando..." : "Solicitar información"}</Button>
    </form>
  );
}
