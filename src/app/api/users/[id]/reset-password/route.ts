import { Role } from "@prisma/client";
import { NextResponse } from "next/server";

import { requireApiRole } from "@/lib/auth/api-guards";
import { resetUserPasswordByAdmin } from "@/services/user.service";

export const dynamic = "force-dynamic";

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

function parseUserId(id: string) {
  const userId = Number(id);

  if (!Number.isInteger(userId) || userId <= 0) {
    return null;
  }

  return userId;
}

function getResetPasswordErrorMessage(
  error: NonNullable<
    Awaited<ReturnType<typeof resetUserPasswordByAdmin>>["error"]
  >
) {
  const messages = {
    USER_NOT_FOUND: "User not found",
    ADMIN_CANNOT_BE_RESET: "Admin account password cannot be reset here",
  };

  return messages[error];
}

export async function POST(_request: Request, context: RouteContext) {
  try {
    const auth = await requireApiRole([Role.ADMIN]);

    if (!auth.success) {
      return auth.response;
    }

    const { id } = await context.params;
    const userId = parseUserId(id);

    if (!userId) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid user id",
          data: null,
        },
        {
          status: 400,
        }
      );
    }

    const result = await resetUserPasswordByAdmin(userId);

    if (!result.success) {
      return NextResponse.json(
        {
          success: false,
          message: getResetPasswordErrorMessage(result.error),
          data: null,
        },
        {
          status: result.error === "USER_NOT_FOUND" ? 404 : 409,
        }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Password reset successfully",
      data: {
        temporaryPassword:
          result.email.skipped || result.email.error
            ? result.temporaryPassword
            : null,
      },
      meta: {
        email: result.email,
      },
    });
  } catch (error) {
    console.error("POST /api/users/[id]/reset-password error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to reset password",
        data: null,
      },
      {
        status: 500,
      }
    );
  }
}