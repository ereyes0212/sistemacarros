"use client";

import { useActionState } from "react";
import { Save } from "lucide-react";

import { createVehicleAction } from "../../actions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export function VehicleForm() {
  const [state, formAction, pending] = useActionState(createVehicleAction, {});

  return (
    <form action={formAction} className="grid gap-6 lg:grid-cols-[1fr_360px]">
      <Card>
        <CardHeader><CardTitle>Ficha comercial</CardTitle></CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2 md:col-span-2"><Label>Título</Label><Input name="title" required placeholder="Toyota RAV4 XLE Hybrid" /></div>
          <div className="space-y-2 md:col-span-2"><Label>Descripción</Label><Textarea name="description" required rows={5} placeholder="Estado, equipamiento, historial y observaciones" /></div>
          <div className="space-y-2"><Label>Marca</Label><Input name="brandName" required /></div>
          <div className="space-y-2"><Label>Modelo</Label><Input name="modelName" /></div>
          <div className="space-y-2"><Label>Categoría</Label><Input name="categoryName" required placeholder="SUV" /></div>
          <div className="space-y-2"><Label>VIN</Label><Input name="vin" /></div>
          <div className="space-y-2"><Label>Año</Label><Input name="year" type="number" min="1900" required /></div>
          <div className="space-y-2"><Label>Kilometraje</Label><Input name="mileage" type="number" min="0" required /></div>
          <div className="space-y-2"><Label>Precio USD</Label><Input name="price" type="number" min="0" step="0.01" required /></div>
          <div className="space-y-2"><Label>Imagen principal URL</Label><Input name="imageUrl" type="url" /></div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader><CardTitle>Clasificación</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2"><Label>Combustible</Label><select name="fuelType" className="h-10 w-full rounded-md border bg-background px-3 text-sm"><option value="GASOLINE">Gasolina</option><option value="DIESEL">Diesel</option><option value="HYBRID">Híbrido</option><option value="ELECTRIC">Eléctrico</option><option value="LPG">GLP</option><option value="OTHER">Otro</option></select></div>
          <div className="space-y-2"><Label>Transmisión</Label><select name="transmission" className="h-10 w-full rounded-md border bg-background px-3 text-sm"><option value="AUTOMATIC">Automática</option><option value="MANUAL">Manual</option><option value="CVT">CVT</option><option value="SEMI_AUTOMATIC">Semi automática</option></select></div>
          <div className="space-y-2"><Label>País</Label><Input name="country" required defaultValue="Estados Unidos" /></div>
          <div className="space-y-2"><Label>Ciudad</Label><Input name="city" required /></div>
          {state.error ? <p className="rounded-xl bg-red-50 p-3 text-sm text-red-700">{state.error}</p> : null}
          {state.success ? <p className="rounded-xl bg-emerald-50 p-3 text-sm text-emerald-700">{state.success}</p> : null}
          <Button className="w-full" disabled={pending} type="submit"><Save className="size-4" /> {pending ? "Guardando..." : "Crear publicación"}</Button>
        </CardContent>
      </Card>
    </form>
  );
}
