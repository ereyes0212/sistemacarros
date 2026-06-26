import HeaderComponent from "@/components/HeaderComponent";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileBarChart } from "lucide-react";
import { getReportesData } from "./actions";

export default async function ReportesPage() {
  const { leads, vehiclesByBrand, brands, latestLeads } = await getReportesData();
  const brandName = new Map(brands.map((brand) => [brand.id, brand.name]));
  return <div className="container mx-auto py-2"><HeaderComponent Icon={FileBarChart} description="Reporte de leads e inventario automotriz" screenName="Reportes" /><div className="grid gap-4 md:grid-cols-2"><Card><CardHeader><CardTitle>Leads por estado</CardTitle></CardHeader><CardContent className="space-y-2">{leads.map((lead) => <div key={lead.status} className="flex justify-between rounded-md border p-3"><span>{lead.status}</span><strong>{lead._count._all}</strong></div>)}</CardContent></Card><Card><CardHeader><CardTitle>Inventario por marca</CardTitle></CardHeader><CardContent className="space-y-2">{vehiclesByBrand.map((item) => <div key={item.brandId} className="flex justify-between rounded-md border p-3"><span>{brandName.get(item.brandId) ?? "Marca"}</span><strong>{item._count._all}</strong></div>)}</CardContent></Card></div><Card className="mt-4"><CardHeader><CardTitle>Últimos leads</CardTitle></CardHeader><CardContent className="space-y-3">{latestLeads.map((lead) => <div key={lead.id} className="rounded-md border p-3"><p className="font-medium">{lead.name} · {lead.email}</p><p className="text-sm text-muted-foreground">{lead.vehicle.brand.name} {lead.vehicle.title} · {lead.status}</p></div>)}</CardContent></Card></div>;
}
