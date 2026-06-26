"use server";

import { redirect } from "next/navigation";

import { login } from "@/auth";
import { requireString } from "@/lib/schemas";

export async function loginAction(_prevState: { error?: string }, formData: FormData) {
  const result = await login(
    {
      usuario: requireString(formData.get("usuario"), "usuario"),
      contrasena: requireString(formData.get("contrasena"), "contraseña"),
    },
    String(formData.get("next") || "/dashboard"),
  );

  if (result.redirect) redirect(result.redirect);
  return { error: result.error };
}
