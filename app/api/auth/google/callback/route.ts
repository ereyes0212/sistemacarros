import bcrypt from "bcryptjs";
import { randomUUID } from "crypto";
import { NextResponse } from "next/server";

import { createSessionTokenForUserId } from "@/auth";
import { prisma } from "@/lib/prisma";

type GoogleProfile = { sub: string; email: string; name?: string; picture?: string };

export async function GET(request: Request) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state");
  const cookieState = request.headers.get("cookie")?.match(/google_oauth_state=([^;]+)/)?.[1];

  if (!code || !state || !cookieState || state !== decodeURIComponent(cookieState)) {
    return NextResponse.redirect(new URL("/login?error=google_state", url.origin));
  }

  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
  if (!clientId || !clientSecret) return NextResponse.redirect(new URL("/login?error=google_config", url.origin));

  const redirectUri = process.env.GOOGLE_REDIRECT_URI ?? `${url.origin}/api/auth/google/callback`;
  const tokenResponse = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "content-type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({ code, client_id: clientId, client_secret: clientSecret, redirect_uri: redirectUri, grant_type: "authorization_code" }),
  });

  if (!tokenResponse.ok) return NextResponse.redirect(new URL("/login?error=google_token", url.origin));
  const tokenJson = await tokenResponse.json();

  const profileResponse = await fetch("https://openidconnect.googleapis.com/v1/userinfo", { headers: { authorization: `Bearer ${tokenJson.access_token}` } });
  if (!profileResponse.ok) return NextResponse.redirect(new URL("/login?error=google_profile", url.origin));
  const profile = (await profileResponse.json()) as GoogleProfile;

  const buyerRole = await prisma.rol.upsert({ where: { nombre: "Comprador" }, update: { activo: true }, create: { nombre: "Comprador", descripcion: "Cliente comprador del marketplace" } });
  const existingAccount = await prisma.account.findUnique({ where: { provider_providerAccountId: { provider: "google", providerAccountId: profile.sub } } });
  const user = existingAccount
    ? await prisma.usuario.findUniqueOrThrow({ where: { id: existingAccount.userId } })
    : await prisma.usuario.upsert({
        where: { email: profile.email },
        update: { nombre: profile.name, fotoUrl: profile.picture, activo: true },
        create: {
          id: randomUUID(),
          usuario: profile.email.split("@")[0].slice(0, 50),
          email: profile.email,
          nombre: profile.name,
          fotoUrl: profile.picture,
          contrasena: await bcrypt.hash(randomUUID(), 12),
          rol_id: buyerRole.id,
          activo: true,
          DebeCambiarPassword: false,
        },
      });

  await prisma.account.upsert({
    where: { provider_providerAccountId: { provider: "google", providerAccountId: profile.sub } },
    update: { access_token: tokenJson.access_token, refresh_token: tokenJson.refresh_token, expires_at: tokenJson.expires_in ? Math.floor(Date.now() / 1000) + Number(tokenJson.expires_in) : null, token_type: tokenJson.token_type, scope: tokenJson.scope, id_token: tokenJson.id_token },
    create: { userId: user.id, type: "oauth", provider: "google", providerAccountId: profile.sub, access_token: tokenJson.access_token, refresh_token: tokenJson.refresh_token, expires_at: tokenJson.expires_in ? Math.floor(Date.now() / 1000) + Number(tokenJson.expires_in) : null, token_type: tokenJson.token_type, scope: tokenJson.scope, id_token: tokenJson.id_token },
  });

  const token = await createSessionTokenForUserId(user.id);
  if (!token) return NextResponse.redirect(new URL("/login?error=google_user", url.origin));

  const response = NextResponse.redirect(new URL("/dashboard", url.origin));
  response.cookies.set("session", token, { httpOnly: true, sameSite: "lax", secure: process.env.NODE_ENV === "production", path: "/", maxAge: 60 * 60 * 6 });
  response.cookies.delete("google_oauth_state");
  return response;
}
