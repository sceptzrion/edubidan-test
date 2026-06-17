import { redirect } from "next/navigation";
import type { Role } from "@prisma/client";

import {
  getCurrentSessionUser,
  getLoginRedirectUrl,
  getUnauthorizedRedirectUrl,
} from "@/lib/auth/session";

export async function requireAuth(pathname: string) {
  const user = await getCurrentSessionUser();

  if (!user) {
    redirect(await getLoginRedirectUrl(pathname));
  }

  return user;
}

export async function requireRole(pathname: string, allowedRoles: Role[]) {
  const user = await requireAuth(pathname);

  if (!allowedRoles.includes(user.role)) {
    redirect(getUnauthorizedRedirectUrl(user.role));
  }

  return user;
}