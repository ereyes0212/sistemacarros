import Link from "next/link";
import { Car, LayoutDashboard, MessageSquare, PlusCircle } from "lucide-react";

import { requireSession } from "@/auth";
import { Button } from "@/components/ui/button";
import { signOutAction } from "./actions";

const nav = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/vehiculos", label: "Vehículos", icon: Car },
  { href: "/leads", label: "Leads", icon: MessageSquare },
  { href: "/vehiculos/nuevo", label: "Publicar", icon: PlusCircle },
];

export default async function ProtectedLayout({ children }: { children: React.ReactNode }) {
  const session = await requireSession();

  return (
    <div className="min-h-screen bg-slate-50 text-slate-950">
      <aside className="fixed inset-y-0 left-0 hidden w-72 border-r bg-white p-6 lg:block">
        <Link href="/dashboard" className="flex items-center gap-3">
          <div className="grid size-11 place-items-center rounded-2xl bg-blue-600 font-black text-white">M</div>
          <div>
            <p className="font-black">MotorMarket</p>
            <p className="text-xs text-muted-foreground">MVP operativo</p>
          </div>
        </Link>
        <nav className="mt-10 space-y-2">
          {nav.map((item) => (
            <Link key={item.href} href={item.href} className="flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold text-slate-700 hover:bg-blue-50 hover:text-blue-700">
              <item.icon className="size-4" /> {item.label}
            </Link>
          ))}
        </nav>
      </aside>
      <div className="lg:pl-72">
        <header className="sticky top-0 z-10 flex items-center justify-between border-b bg-white/85 px-6 py-4 backdrop-blur">
          <div>
            <p className="text-sm text-muted-foreground">Sesión activa</p>
            <h1 className="font-bold">{session.Nombre || session.Usuario} · {session.Rol}</h1>
          </div>
          <form action={signOutAction}>
            <Button variant="outline" type="submit">Cerrar sesión</Button>
          </form>
        </header>
        <main className="p-6 lg:p-10">{children}</main>
      </div>
    </div>
  );
}
