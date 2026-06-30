"use server";

import { getSession, encrypt } from "@/auth";
import bcrypt from "bcryptjs";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export type MiPerfilActionState = {
  ok: boolean;
  message: string;
};

export async function updateMiPerfil(
  _prevState: MiPerfilActionState,
  formData: FormData
): Promise<MiPerfilActionState> {
  const session = await getSession();

  if (!session?.IdUser) {
    return { ok: false, message: "No autenticado." };
  }

  const direccion = String(formData.get("direccion") ?? "").trim();
  const ciudad = String(formData.get("ciudad") ?? "").trim();
  const telefono = String(formData.get("telefono") ?? "").trim();

  await prisma.usuario.update({
    where: { id: session.IdUser },
    data: {
      direccion: direccion || null,
      ciudad: ciudad || null,
      telefono: telefono || null,
      onboardingCompleted: true,
    },
  });

  revalidatePath("/mi-perfil");

  return { ok: true, message: "Perfil actualizado correctamente." };
}


export async function changeMiPerfilPassword(
  _prevState: MiPerfilActionState,
  formData: FormData
): Promise<MiPerfilActionState> {
  const session = await getSession();

  if (!session?.IdUser) {
    return { ok: false, message: "No autenticado." };
  }

  const actual = String(formData.get("actual") ?? "").trim();
  const nueva = String(formData.get("nueva") ?? "").trim();

  if (!actual || !nueva) {
    return { ok: false, message: "Debes completar la contraseña actual y la nueva." };
  }

  if (nueva.length < 8) {
    return { ok: false, message: "La nueva contraseña debe tener mínimo 8 caracteres." };
  }

  const user = await prisma.usuario.findUnique({
    where: { id: session.IdUser },
    include: { rol: { include: { permisos: { include: { permiso: true } } } } },
  });

  if (!user) {
    return { ok: false, message: "Usuario no encontrado." };
  }

  const validActual = await bcrypt.compare(actual, user.contrasena);
  if (!validActual) {
    return { ok: false, message: "La contraseña actual es incorrecta." };
  }

  const hashedPassword = await bcrypt.hash(nueva, 10);
  const updated = await prisma.usuario.update({
    where: { id: user.id },
    data: {
      contrasena: hashedPassword,
      DebeCambiarPassword: false,
    },
    include: { rol: { include: { permisos: { include: { permiso: true } } } } },
  });

  const permisos = updated.rol.permisos.map((rp) => rp.permiso.nombre);

  const token = await encrypt({
    IdUser: updated.id,
    Usuario: updated.usuario,
    Email: updated.email,
    Rol: updated.rol.nombre,
    Nombre: updated.nombre,
    FotoUrl: updated.fotoUrl,
    IdRol: updated.rol_id,
    Permiso: permisos,
    DebeCambiar: updated.DebeCambiarPassword ?? false,
    OnboardingCompleted: updated.onboardingCompleted,
    iss: "your-issuer",
    aud: "your-audience",
  });

  const cookieStore = await cookies();
  cookieStore.set("session", token, {
    expires: new Date(Date.now() + 6 * 60 * 60 * 1000),
    httpOnly: true,
    path: "/",
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
  });

  revalidatePath("/mi-perfil");

  return { ok: true, message: "Contraseña actualizada correctamente." };
}

export async function becomeSeller() {
  const session = await getSession();
  if (!session?.IdUser) return { ok: false, message: "No autenticado." };
  const sellerRole = await prisma.rol.findUnique({ where: { nombre: "Vendedor" }, include: { permisos: { include: { permiso: true } } } });
  if (!sellerRole) return { ok: false, message: "No existe el rol Vendedor." };
  const current = await prisma.usuario.findUnique({ where: { id: session.IdUser }, include: { rol: true } });
  if (!current || current.rol.nombre !== "Comprador") return { ok: false, message: "Este cambio solo aplica a compradores." };
  const updated = await prisma.usuario.update({ where: { id: session.IdUser }, data: { rol_id: sellerRole.id, onboardingCompleted: true }, include: { rol: { include: { permisos: { include: { permiso: true } } } } } });
  const token = await encrypt({ IdUser: updated.id, Usuario: updated.usuario, Email: updated.email, Rol: updated.rol.nombre, Nombre: updated.nombre, FotoUrl: updated.fotoUrl, IdRol: updated.rol_id, Permiso: updated.rol.permisos.filter((rp) => rp.permiso.activo).map((rp) => rp.permiso.nombre), DebeCambiar: updated.DebeCambiarPassword ?? false, OnboardingCompleted: true });
  const cookieStore = await cookies();
  cookieStore.set("session", token, { expires: new Date(Date.now() + 6 * 60 * 60 * 1000), httpOnly: true, path: "/", sameSite: "lax", secure: process.env.NODE_ENV === "production" });
  revalidatePath("/mi-perfil");
  return { ok: true, message: "Ahora eres vendedor. Este cambio no se puede revertir a comprador." };
}
