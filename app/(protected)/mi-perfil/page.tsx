import { getSession } from "@/auth";
import NoAcceso from "@/components/noAccess";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { PerfilContactoForm } from "./components/perfil-contacto-form";
import { BecomeSellerButton } from "./components/become-seller-button";
import { getMiPerfil } from "@/app/services/cliente-service";

export default async function MiPerfilPage() {
  const session = await getSession();
  if (!session?.IdUser) return <NoAcceso />;
  if (!session.Permiso?.includes("ver_mi_perfil")) return <NoAcceso />;

  const user = await getMiPerfil(session.IdUser);
  if (!user) return <NoAcceso />;

  return (
    <main className="container mx-auto py-4">
      <Card className="max-w-2xl">
        <CardHeader>
          <CardTitle>Mi Perfil</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16">
              <AvatarImage src={user.fotoUrl ?? undefined} alt={user.nombre ?? user.usuario} />
              <AvatarFallback>{(user.nombre ?? user.usuario).charAt(0).toUpperCase()}</AvatarFallback>
            </Avatar>
            <div>
              <p className="text-lg font-semibold">{user.nombre ?? user.usuario}</p>
              <p className="text-sm text-muted-foreground">{user.email}</p>
            </div>
          </div>



          <div className="grid gap-3 sm:grid-cols-2">
            <Card>
              <CardContent className="py-3">
                <p className="text-xs text-muted-foreground">Usuario</p>
                <p className="font-medium">{user.usuario}</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="py-3">
                <p className="text-xs text-muted-foreground">Rol</p>
                <p className="font-medium">{user.rol.nombre}</p>
              </CardContent>
            </Card>
          </div>

          {!user.onboardingCompleted && <div className="rounded-2xl border border-blue-200 bg-blue-50 p-4"><p className="font-semibold text-blue-900">Completa tu onboarding</p><p className="text-sm text-blue-800">Esto solo se solicita una vez: confirma tus datos y tu rol para mejorar tu experiencia.</p></div>}
          {user.rol.nombre === "Comprador" && <div className="rounded-2xl border p-4"><p className="font-semibold">¿Quieres vender carros?</p><p className="mb-3 text-sm text-muted-foreground">Puedes pasar tu perfil a vendedor. Después de cambiarte no podrás volver a comprador.</p><BecomeSellerButton /></div>}
          <PerfilContactoForm direccion={user.direccion} ciudad={user.ciudad} telefono={user.telefono} />
        </CardContent>
      </Card>
    </main>
  );
}
