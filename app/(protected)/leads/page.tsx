import { prisma } from "@/lib/prisma";
import { PERMISSIONS, requirePermission } from "@/lib/permissions";
import { Card, CardContent } from "@/components/ui/card";

export default async function LeadsPage() {
  await requirePermission(PERMISSIONS.leadsView);
  const leads = await prisma.vehicleLead.findMany({ orderBy: { createdAt: "desc" }, include: { vehicle: true }, take: 50 });

  return (
    <div className="space-y-6">
      <div>
        <p className="font-semibold text-blue-700">CRM básico</p>
        <h2 className="text-3xl font-black">Leads de compradores</h2>
      </div>
      <div className="grid gap-4">
        {leads.map((lead) => (
          <Card key={lead.id}>
            <CardContent className="p-5">
              <div className="flex flex-col justify-between gap-3 md:flex-row">
                <div>
                  <h3 className="font-bold">{lead.name}</h3>
                  <p className="text-sm text-muted-foreground">{lead.email} {lead.phone ? `· ${lead.phone}` : ""}</p>
                  <p className="mt-2 text-sm">{lead.message || "Sin mensaje"}</p>
                </div>
                <div className="text-sm text-muted-foreground md:text-right">
                  <p className="font-semibold text-slate-900">{lead.vehicle.title}</p>
                  <p>{lead.type} · {lead.status}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
        {!leads.length ? <p className="rounded-2xl border border-dashed bg-white p-8 text-center text-muted-foreground">Aún no hay leads registrados.</p> : null}
      </div>
    </div>
  );
}
