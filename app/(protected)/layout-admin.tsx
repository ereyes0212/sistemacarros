import Link from "next/link";
import { ReactNode } from "react";
import { Card } from "@/components/ui/card";

const links = [
  ["Dashboard", "/dashboard"],
  ["Vehículos", "/productos-admin"],
  ["Categorías", "/categorias"],
  ["Leads", "/reportes"],
  ["Comentarios", "/comentarios"],
  ["Usuarios", "/usuarios"],
  ["Roles", "/roles"],
  ["Permisos", "/permisos"],
];

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className="container mx-auto px-4 py-8 grid md:grid-cols-[250px_1fr] gap-6">
      <Card className="p-4 space-y-2 h-fit">
        {links.map(([label, href]) => <Link key={href} href={href} className="block rounded px-3 py-2 hover:bg-muted">{label}</Link>)}
      </Card>
      {children}
    </div>
  );
}
