import { getSessionPermisos } from "@/auth";
import HeaderComponent from "@/components/HeaderComponent";
import NoAcceso from "@/components/noAccess";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Layers } from "lucide-react";
import { getCategorias } from "./actions";

export default async function CategoriasPage() {
  const permisos = await getSessionPermisos();
  if (!permisos?.some((permiso) => ["ver_categorias_admin", "ver_vehiculos_admin"].includes(permiso))) return <NoAcceso />;
  const categorias = await getCategorias();

  return (
    <div className="container mx-auto py-2">
      <HeaderComponent Icon={Layers} description="Segmentos del inventario automotriz" screenName="Categorías de vehículos" />
      <div className="grid gap-4 md:grid-cols-2">
        {categorias.map((categoria) => (
          <Card key={categoria.id}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between gap-4"><h3 className="font-semibold">{categoria.name}</h3><Badge variant="outline">{categoria._count.vehicles} carros</Badge></div>
              <p className="mt-2 text-sm text-muted-foreground">{categoria.description ?? "Sin descripción"}</p>
              {categoria.parent && <p className="mt-2 text-xs text-muted-foreground">Padre: {categoria.parent.name}</p>}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
