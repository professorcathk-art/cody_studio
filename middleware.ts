import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";
import type { UserRole } from "@/lib/types";

const COOKIE_NAME = "cody_session";

function getSecret() {
  const secret = process.env.SESSION_SECRET;
  if (!secret) return null;
  return new TextEncoder().encode(secret);
}

async function getSessionFromRequest(request: NextRequest) {
  const token = request.cookies.get(COOKIE_NAME)?.value;
  if (!token) return null;

  const secret = getSecret();
  if (!secret) return null;

  try {
    const { payload } = await jwtVerify(token, secret);
    return {
      userId: payload.userId as string,
      name: payload.name as string,
      role: payload.role as UserRole,
    };
  } catch {
    return null;
  }
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const session = await getSessionFromRequest(request);

  const isLogin = pathname === "/login";
  const isAdminRoute = pathname.startsWith("/admin");
  const isBossRoute =
    pathname === "/" || pathname.startsWith("/design/");

  if (isLogin && session) {
    const dest = session.role === "admin" ? "/admin" : "/";
    return NextResponse.redirect(new URL(dest, request.url));
  }

  if (isBossRoute || isAdminRoute) {
    if (!session) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("from", pathname);
      return NextResponse.redirect(loginUrl);
    }

    if (isAdminRoute && session.role !== "admin") {
      return NextResponse.redirect(new URL("/", request.url));
    }

    if (isBossRoute && session.role === "admin") {
      return NextResponse.redirect(new URL("/admin", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/login", "/design/:path*", "/admin/:path*"],
};
