import { createSessionTokenForUserId } from "@/auth";
import { prisma } from "@/lib/prisma";

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

export async function getOrCreateGoogleSessionToken(profile: GoogleProfile) {
  const existing = await prisma.usuario.findUnique({ where: { email: profile.email } });
  if (!existing) throw new Error("El correo de Google no está registrado en el sistema.");
  const token = await createSessionTokenForUserId(existing.id);
  if (!token) throw new Error("No se pudo crear la sesión para el usuario de Google.");
  return token;
}
