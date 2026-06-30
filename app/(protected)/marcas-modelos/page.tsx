import HeaderComponent from "@/components/HeaderComponent";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tags } from "lucide-react";
import { createBrand, createModel, getBrandsWithModels } from "./actions";

export default async function BrandsModelsPage() {
  const brands = await getBrandsWithModels();
  return <div className="container mx-auto py-4 space-y-6">
    <HeaderComponent Icon={Tags} screenName="Marcas y modelos" description="Administra el catálogo que se muestra al publicar y buscar vehículos." />
    <div className="grid gap-6 lg:grid-cols-[0.8fr_1.2fr]">
      <Card><CardHeader><CardTitle>Crear marca</CardTitle></CardHeader><CardContent><form action={createBrand} className="space-y-3"><div className="space-y-2"><Label>Marca</Label><Input name="name" placeholder="Honda" required /></div><div className="space-y-2"><Label>Descripción</Label><Input name="description" placeholder="Opcional" /></div><Button type="submit">Guardar marca</Button></form></CardContent></Card>
      <Card><CardHeader><CardTitle>Añadir modelo</CardTitle></CardHeader><CardContent><form action={createModel} className="grid gap-3 sm:grid-cols-[1fr_1fr_auto] sm:items-end"><div className="space-y-2"><Label>Marca</Label><select name="brandId" className="h-10 w-full rounded-md border bg-background px-3 text-sm" required>{brands.map((brand) => <option key={brand.id} value={brand.id}>{brand.name}</option>)}</select></div><div className="space-y-2"><Label>Modelo</Label><Input name="name" placeholder="Civic" required /></div><Button type="submit">Añadir</Button></form></CardContent></Card>
    </div>
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">{brands.map((brand) => <Card key={brand.id}><CardHeader><CardTitle className="flex justify-between gap-2"><span>{brand.name}</span><span className="text-sm font-normal text-muted-foreground">{brand._count.vehicles} carros</span></CardTitle></CardHeader><CardContent><div className="flex flex-wrap gap-2">{brand.models.length ? brand.models.map((model) => <span key={model.id} className="rounded-full bg-muted px-3 py-1 text-sm">{model.name}</span>) : <span className="text-sm text-muted-foreground">Sin modelos todavía</span>}</div></CardContent></Card>)}</div>
  </div>;
}
