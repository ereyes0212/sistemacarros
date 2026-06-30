"use client";

import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { saveVehicle } from "../actions";

export function VehicleForm({ data, vehicle }: { data: any; vehicle?: any }) {
  const image = vehicle?.images?.[0]?.url ?? "";
  const initialBrandId = vehicle?.brandId ?? data.brands[0]?.id ?? "";
  const [selectedBrandId, setSelectedBrandId] = useState(initialBrandId);
  const [selectedModelId, setSelectedModelId] = useState(vehicle?.modelId ?? "");
  const [selectedCategoryId, setSelectedCategoryId] = useState(vehicle?.categoryId ?? data.categories[0]?.id ?? "");
  const [selectedFuelType, setSelectedFuelType] = useState(vehicle?.fuelType ?? "GASOLINE");
  const [selectedTransmission, setSelectedTransmission] = useState(vehicle?.transmission ?? "AUTOMATIC");
  const filteredModels = useMemo(
    () => data.models.filter((model: any) => model.brandId === selectedBrandId),
    [data.models, selectedBrandId]
  );

  return <Card className="mx-auto max-w-4xl border-cyan-100/70 shadow-sm"><CardHeader><CardTitle>{vehicle ? "Editar vehículo" : "Publicar vehículo"}</CardTitle></CardHeader><CardContent>
    <form action={saveVehicle} className="grid gap-5 md:grid-cols-2">
      <input type="hidden" name="id" value={vehicle?.id ?? ""} />
      <input type="hidden" name="brandId" value={selectedBrandId} />
      <input type="hidden" name="modelId" value={selectedModelId} />
      <input type="hidden" name="categoryId" value={selectedCategoryId} />
      <input type="hidden" name="fuelType" value={selectedFuelType} />
      <input type="hidden" name="transmission" value={selectedTransmission} />
      <div className="md:col-span-2 space-y-2"><Label>Título</Label><Input name="title" defaultValue={vehicle?.title} required placeholder="Toyota RAV4 XLE 2022 impecable" /></div>
      <div className="md:col-span-2 space-y-2"><Label>Descripción</Label><Textarea name="description" defaultValue={vehicle?.description} required rows={5} placeholder="Describe estado, historial, extras y condiciones de venta." /></div>
      <div className="space-y-2"><Label>Marca</Label><Select value={selectedBrandId} onValueChange={(value) => { setSelectedBrandId(value); setSelectedModelId(""); }}><SelectTrigger className="h-10 w-full"><SelectValue placeholder="Selecciona una marca" /></SelectTrigger><SelectContent>{data.brands.map((brand: any) => <SelectItem key={brand.id} value={brand.id}>{brand.name}</SelectItem>)}</SelectContent></Select></div>
      <div className="space-y-2"><Label>Modelo</Label><Select value={selectedModelId} onValueChange={setSelectedModelId} disabled={!filteredModels.length}><SelectTrigger className="h-10 w-full"><SelectValue placeholder={filteredModels.length ? "Selecciona un modelo" : "Sin modelos para esta marca"} /></SelectTrigger><SelectContent>{filteredModels.map((model: any) => <SelectItem key={model.id} value={model.id}>{model.name}</SelectItem>)}</SelectContent></Select></div>
      <div className="space-y-2"><Label>Categoría</Label><Select value={selectedCategoryId} onValueChange={setSelectedCategoryId}><SelectTrigger className="h-10 w-full"><SelectValue placeholder="Selecciona una categoría" /></SelectTrigger><SelectContent>{data.categories.map((category: any) => <SelectItem key={category.id} value={category.id}>{category.name}</SelectItem>)}</SelectContent></Select></div>
      <div className="space-y-2"><Label>Precio Lempiras (HNL)</Label><Input name="price" type="number" min="1" defaultValue={vehicle ? Number(vehicle.price) : ""} required /></div>
      <div className="space-y-2"><Label>Año</Label><Input name="year" type="number" min="1900" max="2030" defaultValue={vehicle?.year} required /></div>
      <div className="space-y-2"><Label>Kilometraje</Label><Input name="mileage" type="number" min="0" defaultValue={vehicle?.mileage} required /></div>
      <div className="space-y-2"><Label>Combustible</Label><Select value={selectedFuelType} onValueChange={setSelectedFuelType}><SelectTrigger className="h-10 w-full"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="GASOLINE">Gasolina</SelectItem><SelectItem value="DIESEL">Diésel</SelectItem><SelectItem value="HYBRID">Híbrido</SelectItem><SelectItem value="ELECTRIC">Eléctrico</SelectItem><SelectItem value="LPG">GLP</SelectItem><SelectItem value="OTHER">Otro</SelectItem></SelectContent></Select></div>
      <div className="space-y-2"><Label>Transmisión</Label><Select value={selectedTransmission} onValueChange={setSelectedTransmission}><SelectTrigger className="h-10 w-full"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="AUTOMATIC">Automática</SelectItem><SelectItem value="MANUAL">Manual</SelectItem><SelectItem value="CVT">CVT</SelectItem><SelectItem value="SEMI_AUTOMATIC">Semi automática</SelectItem></SelectContent></Select></div>
      <div className="space-y-2"><Label>Ciudad</Label><Input name="city" defaultValue={vehicle?.city} required /></div>
      <div className="space-y-2"><Label>País</Label><Input name="country" defaultValue={vehicle?.country ?? "Honduras"} required /></div>
      <div className="space-y-2"><Label>VIN</Label><Input name="vin" defaultValue={vehicle?.vin ?? ""} /></div>
      <div className="space-y-2"><Label>Imagen principal URL</Label><Input name="imageUrl" type="url" defaultValue={image} placeholder="https://..." /></div>
      <div className="md:col-span-2 flex justify-end gap-3"><Button type="submit">Enviar a revisión</Button></div>
    </form></CardContent></Card>;
}
