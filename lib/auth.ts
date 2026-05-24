import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import type { SessionUser, UserRole } from "./types";

const COOKIE_NAME = "cody_session";
const SESSION_MAX_AGE = 60 * 60 * 24 * 7; // 7 days

function getSecret() {
  const secret = process.env.SESSION_SECRET;
  if (!secret) throw new Error("SESSION_SECRET is not set");
  return new TextEncoder().encode(secret);
}

export async function createSessionToken(user: SessionUser): Promise<string> {
  return new SignJWT({
    userId: user.userId,
    name: user.name,
    role: user.role,
  })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${SESSION_MAX_AGE}s`)
    .sign(getSecret());
}

export async function verifySessionToken(
  token: string
): Promise<SessionUser | null> {
  try {
    const { payload } = await jwtVerify(token, getSecret());
    const userId = payload.userId as string;
    const name = payload.name as string;
    const role = payload.role as UserRole;
    if (!userId || !name || !role) return null;
    return { userId, name, role };
  } catch {
    return null;
  }
}

export async function getSession(): Promise<SessionUser | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  if (!token) return null;
  return verifySessionToken(token);
}

export { COOKIE_NAME, SESSION_MAX_AGE };
