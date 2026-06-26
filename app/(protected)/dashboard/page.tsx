import HeaderComponent from "@/components/HeaderComponent";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart3 } from "lucide-react";
import { getDashboardData } from "./actions";

export default async function DashboardPage() {
  const data = await getDashboardData();
  const cards = [
    ["Vehículos", data.vehicles], ["Aprobados", data.approved], ["Pendientes", data.pending], ["Vendidos", data.sold], ["Leads", data.leads], ["Comentarios pendientes", data.comments],
  ];
  return <div className="container mx-auto py-2"><HeaderComponent Icon={BarChart3} description="Indicadores principales del marketplace automotriz" screenName="Dashboard" /><div className="grid gap-4 md:grid-cols-3">{cards.map(([label, value]) => <Card key={label}><CardHeader><CardTitle className="text-sm text-muted-foreground">{label}</CardTitle></CardHeader><CardContent className="text-3xl font-bold">{value}</CardContent></Card>)}</div><Card className="mt-4"><CardHeader><CardTitle>Publicaciones por estado</CardTitle></CardHeader><CardContent className="space-y-2">{data.byStatus.map((item) => <div key={item.listingStatus} className="flex justify-between rounded-md border p-3"><span>{item.listingStatus}</span><strong>{item._count._all}</strong></div>)}</CardContent></Card></div>;
}
