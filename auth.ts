"use server";

import bcrypt from "bcryptjs";
import { SignJWT, jwtVerify, type JWTPayload } from "jose";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { prisma } from "@/lib/prisma";
import type { SignInInput } from "@/lib/schemas";
import { Prisma } from "@/lib/generated/prisma";

const SESSION_COOKIE = "session";
const SESSION_HOURS = 6;

function getJwtKey() {
  const secret = process.env.AUTH_SECRET;
  if (!secret) throw new Error("AUTH_SECRET no está configurado.");
  return new TextEncoder().encode(secret);
}

export interface UsuarioSesion extends JWTPayload {
  IdUser: string;
  Usuario: string;
  Email: string;
  Nombre?: string | null;
  FotoUrl?: string | null;
  Rol: string;
  IdRol: string;
  Permiso: string[];
  DebeCambiar: boolean;
}

export interface LoginResult {
  success?: string;
  error?: string;
  redirect?: string;
}

type AuthDbResult = { token: string; debeCambiar: boolean };

const usuarioWithRolArgs = Prisma.validator<Prisma.UsuarioDefaultArgs>()({
  include: { rol: { include: { permisos: { include: { permiso: true } } } } },
});

type UsuarioConRol = Prisma.UsuarioGetPayload<typeof usuarioWithRolArgs>;

export async function encrypt(payload: UsuarioSesion) {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setIssuer("motormarket")
    .setAudience("motormarket-web")
    .setExpirationTime(`${SESSION_HOURS}h`)
    .sign(getJwtKey());
}

export async function decrypt(token: string): Promise<UsuarioSesion | null> {
  try {
    const { payload } = await jwtVerify(token, getJwtKey(), {
      algorithms: ["HS256"],
      issuer: "motormarket",
      audience: "motormarket-web",
    });

    return {
      IdUser: String(payload.IdUser),
      Usuario: String(payload.Usuario),
      Email: String(payload.Email),
      Rol: String(payload.Rol),
      Nombre: (payload.Nombre as string | null | undefined) ?? null,
      FotoUrl: (payload.FotoUrl as string | null | undefined) ?? null,
      IdRol: String(payload.IdRol),
      Permiso: Array.isArray(payload.Permiso) ? payload.Permiso.map(String) : [],
      DebeCambiar: payload.DebeCambiar === true,
      iss: payload.iss,
      aud: payload.aud,
      exp: payload.exp,
      iat: payload.iat,
    };
  } catch (error) {
    console.error("Error al decodificar token de sesión:", error);
    return null;
  }
}

async function setSessionCookie(token: string) {
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, token, {
    expires: new Date(Date.now() + SESSION_HOURS * 60 * 60 * 1000),
    httpOnly: true,
    path: "/",
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
  });
}

export async function getSession(): Promise<UsuarioSesion | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;
  return token ? decrypt(token) : null;
}

export async function requireSession() {
  const session = await getSession();
  if (!session) redirect("/login");
  if (session.DebeCambiar) redirect("/login?message=cambiar-password");
  return session;
}

export async function getSessionPermisos(): Promise<string[]> {
  const session = await getSession();
  return session?.Permiso ?? [];
}

export async function signOut() {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE);
  redirect("/login");
}

export async function login(credentials: SignInInput, nextPath = "/dashboard"): Promise<LoginResult> {
  const usuario = credentials.usuario?.trim();
  const contrasena = credentials.contrasena?.trim();
  if (!usuario || !contrasena) return { error: "Usuario y contraseña son obligatorios." };

  const authResult = await authenticateDB(usuario, contrasena);
  if (!authResult) return { error: "Usuario o contraseña inválidos." };

  await setSessionCookie(authResult.token);
  return { success: "Sesión iniciada correctamente.", redirect: authResult.debeCambiar ? "/login?message=cambiar-password" : nextPath };
}

function buildPayload(user: UsuarioConRol): UsuarioSesion {
  return {
    IdUser: user.id,
    Usuario: user.usuario,
    Email: user.email,
    Rol: user.rol.nombre,
    Nombre: user.nombre,
    FotoUrl: user.fotoUrl,
    IdRol: user.rol_id,
    Permiso: user.rol.permisos.filter((rp) => rp.permiso.activo).map((rp) => rp.permiso.nombre),
    DebeCambiar: user.DebeCambiarPassword ?? false,
  };
}

async function authenticateDB(usernameOrEmail: string, password: string): Promise<AuthDbResult | null> {
  const user = await prisma.usuario.findFirst({
    where: {
      activo: true,
      OR: [{ usuario: usernameOrEmail }, { email: usernameOrEmail }],
    },
    include: usuarioWithRolArgs.include,
  });

  if (!user || !user.rol.activo) return null;
  const passwordOk = await bcrypt.compare(password, user.contrasena);
  if (!passwordOk) return null;

  const payload = buildPayload(user);
  return { token: await encrypt(payload), debeCambiar: payload.DebeCambiar };
}

export async function changePassword(username: string, newPassword: string): Promise<LoginResult> {
  if (newPassword.trim().length < 8) return { error: "La contraseña debe tener al menos 8 caracteres." };
  const user = await prisma.usuario.findFirst({ where: { usuario: username }, include: usuarioWithRolArgs.include });
  if (!user) return { error: "No se encontró el usuario." };

  const updated = await prisma.usuario.update({
    where: { id: user.id },
    data: { contrasena: await bcrypt.hash(newPassword, 12), DebeCambiarPassword: false },
    include: usuarioWithRolArgs.include,
  });

  await setSessionCookie(await encrypt(buildPayload(updated)));
  return { success: "Contraseña actualizada correctamente.", redirect: "/dashboard" };
}
