import crypto from "crypto";

import { cookies } from "next/headers";
import { Role } from "@prisma/client";

import { prisma } from "@/lib/prisma";
import { getRedirectPathByRole } from "@/services/auth.service";

export const AUTH_SESSION_COOKIE = "edubidan-session";

const SESSION_MAX_AGE_SECONDS = 60 * 60 * 24 * 7; // 7 hari

type SessionPayload = {
  userId: number;
  role: Role;
  exp: number;
};

function getSessionSecret() {
  const secret = process.env.AUTH_SESSION_SECRET;

  if (secret && secret.length >= 32) {
    return secret;
  }

  if (process.env.NODE_ENV === "production") {
    throw new Error("AUTH_SESSION_SECRET must be set in production.");
  }

  return "edubidan-dev-session-secret-minimum-32-chars";
}

function encodeBase64Url(value: string) {
  return Buffer.from(value)
    .toString("base64")
    .replaceAll("+", "-")
    .replaceAll("/", "_")
    .replaceAll("=", "");
}

function decodeBase64Url(value: string) {
  const normalized = value.replaceAll("-", "+").replaceAll("_", "/");
  const padded = normalized.padEnd(
    normalized.length + ((4 - (normalized.length % 4)) % 4),
    "="
  );

  return Buffer.from(padded, "base64").toString("utf8");
}

function signPayload(payload: string) {
  return crypto
    .createHmac("sha256", getSessionSecret())
    .update(payload)
    .digest("base64url");
}

function createSessionToken(payload: SessionPayload) {
  const encodedPayload = encodeBase64Url(JSON.stringify(payload));
  const signature = signPayload(encodedPayload);

  return `${encodedPayload}.${signature}`;
}

function parseSessionToken(token: string): SessionPayload | null {
  const [encodedPayload, signature] = token.split(".");

  if (!encodedPayload || !signature) return null;

  const expectedSignature = signPayload(encodedPayload);

  if (
    !crypto.timingSafeEqual(
      Buffer.from(signature),
      Buffer.from(expectedSignature)
    )
  ) {
    return null;
  }

  try {
    const payload = JSON.parse(decodeBase64Url(encodedPayload)) as Partial<SessionPayload>;

    if (
      typeof payload.userId !== "number" ||
      (payload.role !== Role.ADMIN &&
        payload.role !== Role.DOSEN &&
        payload.role !== Role.MAHASISWA) ||
      typeof payload.exp !== "number"
    ) {
      return null;
    }

    if (payload.exp < Math.floor(Date.now() / 1000)) {
      return null;
    }

    return {
      userId: payload.userId,
      role: payload.role,
      exp: payload.exp,
    };
  } catch {
    return null;
  }
}

export async function createAuthSession(user: {
  id: number;
  role: Role;
}) {
  const cookieStore = await cookies();
  const expiresAt = Math.floor(Date.now() / 1000) + SESSION_MAX_AGE_SECONDS;

  const token = createSessionToken({
    userId: user.id,
    role: user.role,
    exp: expiresAt,
  });

  cookieStore.set(AUTH_SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: SESSION_MAX_AGE_SECONDS,
  });
}

export async function clearAuthSession() {
  const cookieStore = await cookies();

  cookieStore.set(AUTH_SESSION_COOKIE, "", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 0,
  });
}

export async function getAuthSession() {
  const cookieStore = await cookies();
  const token = cookieStore.get(AUTH_SESSION_COOKIE)?.value;

  if (!token) return null;

  return parseSessionToken(token);
}

export async function getCurrentSessionUser() {
  const session = await getAuthSession();

  if (!session) return null;

  const user = await prisma.user.findUnique({
    where: {
      id: session.userId,
    },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      avatarUrl: true,
      avatarPublicId: true,
      phoneNumber: true,
      isActive: true,
      mahasiswaProfile: {
        select: {
          id: true,
          npm: true,
        },
      },
      dosenProfile: {
        select: {
          id: true,
          nidnNip: true,
        },
      },
    },
  });

  if (!user || !user.isActive) {
    return null;
  }

  return user;
}

export async function getLoginRedirectUrl(pathname: string) {
  const next = encodeURIComponent(pathname);

  return `/login?reason=auth-required&next=${next}`;
}

export function getUnauthorizedRedirectUrl(role: Role) {
  return getRedirectPathByRole(role);
}