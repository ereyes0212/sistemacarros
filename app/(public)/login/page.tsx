import { redirect } from "next/navigation";

import { getSession } from "@/auth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LoginForm } from "./login-form";

export default async function LoginPage({ searchParams }: { searchParams?: Promise<{ next?: string; message?: string }> }) {
  const session = await getSession();
  const params = await searchParams;
  if (session && !session.DebeCambiar) redirect(params?.next || "/dashboard");

  return (
    <main className="grid min-h-screen place-items-center bg-gradient-to-br from-blue-50 via-white to-slate-100 px-6 py-12">
      <Card className="w-full max-w-md border-white/80 shadow-2xl shadow-blue-950/10">
        <CardHeader>
          <p className="text-sm font-bold uppercase tracking-[0.3em] text-blue-700">MotorMarket</p>
          <CardTitle className="text-3xl">Acceso al panel</CardTitle>
          <p className="text-sm text-muted-foreground">Gestiona inventario, leads, moderación y clientes desde un solo lugar.</p>
        </CardHeader>
        <CardContent>
          {params?.message ? <p className="mb-4 rounded-xl bg-amber-50 p-3 text-sm text-amber-800">Debes actualizar tu contraseña antes de continuar.</p> : null}
          <LoginForm next={params?.next} />
        </CardContent>
      </Card>
    </main>
  );
}
