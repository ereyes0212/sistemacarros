import { ShieldCheck } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { PERMISSIONS, requirePermission } from "@/lib/permissions";
import { prisma } from "@/lib/prisma";

export default async function RolesPage() {
  await requirePermission(PERMISSIONS.rolesView);
  const roles = await prisma.rol.findMany({ include: { permisos: { include: { permiso: true } }, _count: { select: { usuarios: true } } }, orderBy: { nombre: "asc" } });

  return (
    <div className="space-y-6">
      <div>
        <p className="font-semibold text-blue-700">Seguridad</p>
        <h2 className="text-3xl font-black">Roles y permisos</h2>
      </div>
      <div className="grid gap-4">
        {roles.map((rol) => (
          <Card key={rol.id}>
            <CardContent className="space-y-3 p-5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3"><ShieldCheck className="size-5 text-blue-600" /><h3 className="font-bold">{rol.nombre}</h3></div>
                <p className="text-sm text-muted-foreground">{rol._count.usuarios} usuarios</p>
              </div>
              <p className="text-sm text-muted-foreground">{rol.descripcion}</p>
              <div className="flex flex-wrap gap-2">
                {rol.permisos.map(({ permiso }) => <span key={permiso.id} className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">{permiso.nombre}</span>)}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
