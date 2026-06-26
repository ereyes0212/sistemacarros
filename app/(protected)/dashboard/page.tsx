import { Car, CheckCircle2, Clock, MessageSquare } from "lucide-react";

import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default async function DashboardPage() {
  const [vehicles, approved, pending, leads] = await Promise.all([
    prisma.vehicle.count(),
    prisma.vehicle.count({ where: { listingStatus: "APPROVED" } }),
    prisma.vehicle.count({ where: { listingStatus: "PENDING_REVIEW" } }),
    prisma.vehicleLead.count(),
  ]);

  const stats = [
    { label: "Vehículos", value: vehicles, icon: Car },
    { label: "Aprobados", value: approved, icon: CheckCircle2 },
    { label: "Pendientes", value: pending, icon: Clock },
    { label: "Leads", value: leads, icon: MessageSquare },
  ];

  return (
    <div className="space-y-8">
      <div>
        <p className="font-semibold text-blue-700">Panel de control</p>
        <h2 className="text-4xl font-black tracking-tight">Operación comercial del marketplace</h2>
      </div>
      <div className="grid gap-4 md:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.label}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">{stat.label}</CardTitle>
              <stat.icon className="size-5 text-blue-600" />
            </CardHeader>
            <CardContent><p className="text-4xl font-black">{stat.value}</p></CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
