import { createSessionTokenForUserId } from "@/auth";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { randomBytes, randomUUID } from "crypto";

export type GoogleProfile = {
  sub: string;
  email: string;
  name?: string;
  picture?: string;
};

function getGoogleConfig(origin: string) {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
  const redirectUri = `${origin}/api/auth/google/callback`;
  if (!clientId || !clientSecret) throw new Error("Google OAuth no está configurado.");
  return { clientId, clientSecret, redirectUri };
}

export function buildGoogleAuthorizationUrl(state: string, origin: string) {
  const { clientId, redirectUri } = getGoogleConfig(origin);
  const url = new URL("https://accounts.google.com/o/oauth2/v2/auth");
  url.searchParams.set("client_id", clientId);
  url.searchParams.set("redirect_uri", redirectUri);
  url.searchParams.set("response_type", "code");
  url.searchParams.set("scope", "openid email profile");
  url.searchParams.set("state", state);
  return url.toString();
}

export async function exchangeCodeForGoogleProfile(code: string, origin: string): Promise<GoogleProfile> {
  const { clientId, clientSecret, redirectUri } = getGoogleConfig(origin);
  const response = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({ code, client_id: clientId, client_secret: clientSecret, redirect_uri: redirectUri, grant_type: "authorization_code" }),
  });
  if (!response.ok) throw new Error("No se pudo intercambiar el código de Google.");
  const token = await response.json() as { access_token?: string };
  if (!token.access_token) throw new Error("Google no devolvió access_token.");
  const profileResponse = await fetch("https://www.googleapis.com/oauth2/v3/userinfo", { headers: { Authorization: `Bearer ${token.access_token}` } });
  if (!profileResponse.ok) throw new Error("No se pudo obtener el perfil de Google.");
  return profileResponse.json() as Promise<GoogleProfile>;
}

function buildUsernameFromEmail(email: string) {
  const localPart = email.split("@")[0]?.toLowerCase().replace(/[^a-z0-9._-]/g, "") || "usuario";
  return localPart.slice(0, 40);
}

async function buildUniqueUsername(email: string) {
  const baseUsername = buildUsernameFromEmail(email);
  let username = baseUsername;
  let suffix = 1;

  while (await prisma.usuario.findFirst({ where: { usuario: username } })) {
    username = `${baseUsername}${suffix}`.slice(0, 50);
    suffix += 1;
  }

  return username;
}

async function getGoogleDefaultRoleId(requestedRole?: string) {
  const roleName = requestedRole === "Vendedor" ? "Vendedor" : "Comprador";
  const role = await prisma.rol.findFirst({
    where: {
      activo: true,
      nombre: roleName,
    },
  });

  if (!role) throw new Error(`No existe el rol activo ${roleName} para registrar usuarios de Google.`);
  return role.id;
}

export async function getOrCreateGoogleSessionToken(profile: GoogleProfile, requestedRole?: string) {
  const normalizedEmail = profile.email.trim().toLowerCase();
  const existing = await prisma.usuario.findUnique({ where: { email: normalizedEmail } });

  const user = existing ?? await prisma.usuario.create({
    data: {
      id: randomUUID(),
      usuario: await buildUniqueUsername(normalizedEmail),
      email: normalizedEmail,
      nombre: profile.name?.trim() || null,
      fotoUrl: profile.picture || null,
      rol_id: await getGoogleDefaultRoleId(requestedRole),
      contrasena: await bcrypt.hash(randomBytes(24).toString("base64"), 12),
      activo: true,
      DebeCambiarPassword: false,
    },
  });

  const token = await createSessionTokenForUserId(user.id);
  if (!token) throw new Error("No se pudo crear la sesión para el usuario de Google.");
  return token;
}
