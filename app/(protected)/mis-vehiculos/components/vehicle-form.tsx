import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { saveVehicle } from "../actions";

export function VehicleForm({ data, vehicle }: { data: any; vehicle?: any }) {
  const image = vehicle?.images?.[0]?.url ?? "";
  return <Card className="mx-auto max-w-4xl border-cyan-100/70 shadow-sm"><CardHeader><CardTitle>{vehicle ? "Editar vehículo" : "Publicar vehículo"}</CardTitle></CardHeader><CardContent>
    <form action={saveVehicle} className="grid gap-5 md:grid-cols-2">
      <input type="hidden" name="id" value={vehicle?.id ?? ""} />
      <div className="md:col-span-2 space-y-2"><Label>Título</Label><Input name="title" defaultValue={vehicle?.title} required placeholder="Toyota RAV4 XLE 2022 impecable" /></div>
      <div className="md:col-span-2 space-y-2"><Label>Descripción</Label><Textarea name="description" defaultValue={vehicle?.description} required rows={5} placeholder="Describe estado, historial, extras y condiciones de venta." /></div>
      <div className="space-y-2"><Label>Marca</Label><select name="brandId" defaultValue={vehicle?.brandId} required className="h-10 w-full rounded-md border bg-background px-3 text-sm">{data.brands.map((b: any) => <option key={b.id} value={b.id}>{b.name}</option>)}</select></div>
      <div className="space-y-2"><Label>Modelo</Label><select name="modelId" defaultValue={vehicle?.modelId ?? ""} className="h-10 w-full rounded-md border bg-background px-3 text-sm"><option value="">Sin modelo</option>{data.models.map((m: any) => <option key={m.id} value={m.id}>{m.brand.name} · {m.name}</option>)}</select></div>
      <div className="space-y-2"><Label>Categoría</Label><select name="categoryId" defaultValue={vehicle?.categoryId} required className="h-10 w-full rounded-md border bg-background px-3 text-sm">{data.categories.map((c: any) => <option key={c.id} value={c.id}>{c.name}</option>)}</select></div>
      <div className="space-y-2"><Label>Precio Lempiras (HNL)</Label><Input name="price" type="number" min="1" defaultValue={vehicle ? Number(vehicle.price) : ""} required /></div>
      <div className="space-y-2"><Label>Año</Label><Input name="year" type="number" min="1900" max="2030" defaultValue={vehicle?.year} required /></div>
      <div className="space-y-2"><Label>Kilometraje</Label><Input name="mileage" type="number" min="0" defaultValue={vehicle?.mileage} required /></div>
      <div className="space-y-2"><Label>Combustible</Label><select name="fuelType" defaultValue={vehicle?.fuelType ?? "GASOLINE"} className="h-10 w-full rounded-md border bg-background px-3 text-sm"><option value="GASOLINE">Gasolina</option><option value="DIESEL">Diésel</option><option value="HYBRID">Híbrido</option><option value="ELECTRIC">Eléctrico</option><option value="LPG">GLP</option><option value="OTHER">Otro</option></select></div>
      <div className="space-y-2"><Label>Transmisión</Label><select name="transmission" defaultValue={vehicle?.transmission ?? "AUTOMATIC"} className="h-10 w-full rounded-md border bg-background px-3 text-sm"><option value="AUTOMATIC">Automática</option><option value="MANUAL">Manual</option><option value="CVT">CVT</option><option value="SEMI_AUTOMATIC">Semi automática</option></select></div>
      <div className="space-y-2"><Label>Ciudad</Label><Input name="city" defaultValue={vehicle?.city} required /></div>
      <div className="space-y-2"><Label>País</Label><Input name="country" defaultValue={vehicle?.country ?? "Honduras"} required /></div>
      <div className="space-y-2"><Label>VIN</Label><Input name="vin" defaultValue={vehicle?.vin ?? ""} /></div>
      <div className="space-y-2"><Label>Imagen principal URL</Label><Input name="imageUrl" type="url" defaultValue={image} placeholder="https://..." /></div>
      <div className="md:col-span-2 flex justify-end gap-3"><Button type="submit">Enviar a revisión</Button></div>
    </form></CardContent></Card>;
}
