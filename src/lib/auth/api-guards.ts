import { Role } from "@prisma/client";
import { NextResponse } from "next/server";

import { getCurrentSessionUser } from "@/lib/auth/session";

type CurrentSessionUser = NonNullable<
  Awaited<ReturnType<typeof getCurrentSessionUser>>
>;

type ApiGuardFailure = {
  success: false;
  response: NextResponse;
  user: null;
};

type ApiGuardSuccess = {
  success: true;
  response: null;
  user: CurrentSessionUser;
};

type ApiGuardResult = ApiGuardFailure | ApiGuardSuccess;

type ApiDosenProfileGuardResult =
  | ApiGuardFailure
  | (ApiGuardSuccess & {
      dosenProfileId: number;
    });

function createApiErrorResponse(status: number, message: string): ApiGuardFailure {
  return {
    success: false,
    response: NextResponse.json(
      {
        success: false,
        message,
        data: null,
      },
      {
        status,
      }
    ),
    user: null,
  };
}

export async function requireApiRole(
  allowedRoles: Role[]
): Promise<ApiGuardResult> {
  const currentUser = await getCurrentSessionUser();

  if (!currentUser) {
    return createApiErrorResponse(401, "Authentication required");
  }

  if (!allowedRoles.includes(currentUser.role)) {
    return createApiErrorResponse(403, "Forbidden");
  }

  return {
    success: true,
    response: null,
    user: currentUser,
  };
}

export async function requireApiDosenProfile(): Promise<ApiDosenProfileGuardResult> {
  const auth = await requireApiRole([Role.DOSEN]);

  if (!auth.success) {
    return auth;
  }

  if (!auth.user.dosenProfile?.id) {
    return createApiErrorResponse(403, "Dosen profile not found");
  }

  return {
    ...auth,
    dosenProfileId: auth.user.dosenProfile.id,
  };
}