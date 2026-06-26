import { NextResponse, type NextRequest } from "next/server";

const protectedPrefixes = ["/dashboard", "/vehiculos", "/leads", "/favoritos", "/roles"];

export function middleware(request: NextRequest) {
  const hasSession = request.cookies.has("session");
  const isProtected = protectedPrefixes.some((prefix) => request.nextUrl.pathname.startsWith(prefix));

  if (isProtected && !hasSession) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("next", request.nextUrl.pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = { matcher: ["/dashboard/:path*", "/vehiculos/:path*", "/leads/:path*", "/favoritos/:path*", "/roles/:path*"] };
