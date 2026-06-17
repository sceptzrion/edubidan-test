import { Role } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

import { requireApiRole } from "@/lib/auth/api-guards";
import {
  deleteUserByAdmin,
  getUserById,
  updateUserByAdmin,
} from "@/services/user.service";

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

function getUpdateUserErrorMessage(
  error: NonNullable<Awaited<ReturnType<typeof updateUserByAdmin>>["error"]>
) {
  const messages = {
    USER_NOT_FOUND: "User not found",
    NAME_EMPTY: "Name cannot be empty",
    EMAIL_EMPTY: "Email cannot be empty",
    IDENTIFIER_EMPTY: "NPM or NIDN/NIP cannot be empty",
    INVALID_NPM_FORMAT: "NPM must contain 10 to 20 digits",
    INVALID_NIDN_NIP_FORMAT:
      "NIDN/NIP must contain 5 to 30 letters, numbers, dots, or dashes",
    INVALID_STUDENT_EMAIL_FORMAT:
      "Mahasiswa email must match npm@student.unsika.ac.id",
    INVALID_DOSEN_EMAIL_FORMAT:
      "Dosen email must use @staff.unsika.ac.id domain",
    EMAIL_ALREADY_USED: "Email is already used",
    IDENTIFIER_ALREADY_USED: "NPM or NIDN/NIP is already used",
  };

  return messages[error];
}

function getDeleteUserErrorMessage(
  error: NonNullable<Awaited<ReturnType<typeof deleteUserByAdmin>>["error"]>
) {
  const messages = {
    USER_NOT_FOUND: "User not found",
    ADMIN_CANNOT_BE_DELETED: "Admin account cannot be deleted",
    USER_MUST_BE_INACTIVE: "User must be inactive before permanent deletion",
    USER_HAS_RELATED_DATA:
      "User cannot be deleted because related learning data already exists",
  };

  return messages[error];
}

function getDeleteUserStatusCode(
  error: NonNullable<Awaited<ReturnType<typeof deleteUserByAdmin>>["error"]>
) {
  if (error === "USER_NOT_FOUND") {
    return 404;
  }

  if (
    error === "ADMIN_CANNOT_BE_DELETED" ||
    error === "USER_MUST_BE_INACTIVE" ||
    error === "USER_HAS_RELATED_DATA"
  ) {
    return 409;
  }

  return 400;
}

export async function GET(_request: Request, context: RouteContext) {
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

    const user = await getUserById(userId);

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          message: "User not found",
          data: null,
        },
        {
          status: 404,
        }
      );
    }

    return NextResponse.json({
      success: true,
      message: "User retrieved successfully",
      data: user,
    });
  } catch (error) {
    console.error("GET /api/users/[id] error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to retrieve user",
        data: null,
      },
      {
        status: 500,
      }
    );
  }
}

export async function PATCH(request: NextRequest, context: RouteContext) {
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

    const body = await request.json();

    const result = await updateUserByAdmin({
      id: userId,
      name: body.name,
      email: body.email,
      identifier: body.identifier,
      phoneNumber: body.phoneNumber,
      avatarUrl: body.avatarUrl,
    });

    if (!result.success) {
      return NextResponse.json(
        {
          success: false,
          message: getUpdateUserErrorMessage(result.error),
          data: null,
        },
        {
          status: result.error === "USER_NOT_FOUND" ? 404 : 400,
        }
      );
    }

    return NextResponse.json({
      success: true,
      message: "User updated successfully",
      data: result.user,
    });
  } catch (error) {
    console.error("PATCH /api/users/[id] error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to update user",
        data: null,
      },
      {
        status: 500,
      }
    );
  }
}

export async function DELETE(_request: Request, context: RouteContext) {
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

    const result = await deleteUserByAdmin(userId);

    if (!result.success) {
      return NextResponse.json(
        {
          success: false,
          message: getDeleteUserErrorMessage(result.error),
          data: null,
        },
        {
          status: getDeleteUserStatusCode(result.error),
        }
      );
    }

    return NextResponse.json({
      success: true,
      message: "User deleted permanently",
      data: {
        id: result.deletedUserId,
      },
    });
  } catch (error) {
    console.error("DELETE /api/users/[id] error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to delete user",
        data: null,
      },
      {
        status: 500,
      }
    );
  }
}