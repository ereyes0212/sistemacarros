import { getSession } from "@/auth";
import NoAcceso from "@/components/noAccess";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { prisma } from "@/lib/prisma";

export default async function PerfilPage() {
  const session = await getSession();
  if (!session?.IdUser) return <NoAcceso />;

  const [misVehiculos, misLeads] = await Promise.all([
    prisma.vehicle.findMany({ where: { sellerId: session.IdUser }, include: { brand: true, model: true }, orderBy: { createdAt: "desc" }, take: 20 }),
    prisma.vehicleLead.findMany({ where: { buyerId: session.IdUser }, include: { vehicle: true }, orderBy: { createdAt: "desc" }, take: 20 }),
  ]);

  return (
    <main className="mx-auto max-w-6xl space-y-6 p-4 md:p-6">
      <div className="space-y-1"><h1 className="text-3xl font-bold">Mi perfil</h1><p className="text-sm text-muted-foreground">Actividad dentro del marketplace de carros.</p></div>
      <div className="grid gap-4 md:grid-cols-2">
        <Card><CardHeader><CardTitle>Mis publicaciones</CardTitle></CardHeader><CardContent className="space-y-3">{misVehiculos.map((vehicle) => <div key={vehicle.id} className="rounded-md border p-3"><p className="font-medium">{vehicle.title}</p><p className="text-sm text-muted-foreground">{vehicle.brand.name} {vehicle.model?.name ?? ""} · {vehicle.listingStatus} · {vehicle.status}</p></div>)}{misVehiculos.length === 0 && <p className="text-sm text-muted-foreground">Aún no has publicado vehículos.</p>}</CardContent></Card>
        <Card><CardHeader><CardTitle>Mis consultas</CardTitle></CardHeader><CardContent className="space-y-3">{misLeads.map((lead) => <div key={lead.id} className="rounded-md border p-3"><p className="font-medium">{lead.vehicle.title}</p><p className="text-sm text-muted-foreground">{lead.status} · {lead.createdAt.toLocaleDateString("es-HN")}</p></div>)}{misLeads.length === 0 && <p className="text-sm text-muted-foreground">Aún no has enviado consultas.</p>}</CardContent></Card>
      </div>
    </main>
  );
}
