"use client";

import { useActionState } from "react";
import { LogIn } from "lucide-react";

import { loginAction } from "./actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function LoginForm({ next = "/dashboard" }: { next?: string }) {
  const [state, formAction, pending] = useActionState(loginAction, {});

  return (
    <form action={formAction} className="space-y-5">
      <input type="hidden" name="next" value={next} />
      <div className="space-y-2">
        <Label htmlFor="usuario">Usuario o email</Label>
        <Input id="usuario" name="usuario" autoComplete="username" required placeholder="admin@motormarket.com" />
      </div>
      <div className="space-y-2">
        <Label htmlFor="contrasena">Contraseña</Label>
        <Input id="contrasena" name="contrasena" type="password" autoComplete="current-password" required />
      </div>
      {state.error ? <p className="rounded-xl bg-red-50 p-3 text-sm text-red-700">{state.error}</p> : null}
      <Button className="w-full" disabled={pending} type="submit">
        <LogIn className="size-4" /> {pending ? "Validando..." : "Iniciar sesión"}
      </Button>
    </form>
  );
}
