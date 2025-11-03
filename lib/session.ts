import "server-only";
import { cookies } from "next/headers";
import { SignJWT, jwtVerify, JWTPayload } from "jose";
import { cache } from "react";
import { redirect } from "next/navigation";

const secretKey = process.env.SESSION_SECRET;
if (!secretKey) throw new Error("SESSION_SECRET is not set");
const encodedKey = new TextEncoder().encode(secretKey);

export type Session = {
  isAuth: boolean;
  userId: number;
  role: "ADMIN" | "USER" | "SUPER_ADMIN" | string;
};

type SessionPayload = JWTPayload & {
  userId: number;
  role: string;
  expiresAt: string;
};

export async function encrypt(payload: SessionPayload): Promise<string> {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(encodedKey);
}

export async function decrypt(token: string): Promise<SessionPayload | null> {
  try {
    const { payload } = await jwtVerify(token, encodedKey, {
      algorithms: ["HS256"],
    });
    return payload as SessionPayload;
  } catch {
    console.log("❌ Failed to verify session token");
    return null;
  }
}

export async function verifySession(): Promise<SessionPayload> {
  const cookie = (await cookies()).get("session")?.value;
  if (!cookie) redirect("/login");

  const session = await decrypt(cookie!);
  if (!session?.userId) redirect("/login");

  return session;
}

export async function createSession(userId: number, role: string) {
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
  const payload: SessionPayload = {
    userId,
    role,
    expiresAt: expiresAt.toISOString(),
  };

  const token = await encrypt(payload);
  const cookieStore = await cookies();

  cookieStore.set("session", token, {
    httpOnly: true,
    secure: true,
    expires: expiresAt,
    sameSite: "lax",
    path: "/",
  });
}

export const getSession = cache(async (): Promise<Session | null> => {
  const cookieStore = await cookies();
  const token = cookieStore.get("session")?.value;
  if (!token) return null;

  const payload = await decrypt(token);
  if (!payload || !payload.userId) return null;

  return {
    isAuth: true,
    userId: payload.userId,
    role: payload.role,
  };
});

export async function deleteSession() {
  const cookieStore = await cookies();
  cookieStore.delete("session");
}
