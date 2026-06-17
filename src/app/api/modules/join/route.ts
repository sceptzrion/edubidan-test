import { Role } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

import { joinModuleByAccessCode } from "@/services/enrollment.service";
import { getCurrentSessionUser } from "@/lib/auth/session";

export const dynamic = "force-dynamic";

function getJoinModuleErrorMessage(
  error: NonNullable<Awaited<ReturnType<typeof joinModuleByAccessCode>>["error"]>
) {
  const messages = {
    USER_ID_REQUIRED: "User id is required",
    ACCESS_CODE_REQUIRED: "Access code is required",
    USER_NOT_FOUND: "User not found",
    USER_INACTIVE: "User account is inactive",
    USER_NOT_MAHASISWA: "Only mahasiswa can join modules",
    MODULE_NOT_FOUND: "Module not found",
    MODULE_NOT_PUBLISHED: "Module is not published",
    ALREADY_JOINED: "User has already joined this module",
  };

  return messages[error];
}

function getJoinModuleStatusCode(
  error: NonNullable<Awaited<ReturnType<typeof joinModuleByAccessCode>>["error"]>
) {
  if (error === "USER_ID_REQUIRED" || error === "ACCESS_CODE_REQUIRED") {
    return 400;
  }

  if (error === "USER_NOT_FOUND" || error === "MODULE_NOT_FOUND") {
    return 404;
  }

  if (
    error === "USER_INACTIVE" ||
    error === "USER_NOT_MAHASISWA" ||
    error === "MODULE_NOT_PUBLISHED"
  ) {
    return 403;
  }

  if (error === "ALREADY_JOINED") {
    return 409;
  }

  return 400;
}

export async function POST(request: NextRequest) {
  try {
    const currentUser = await getCurrentSessionUser();

    if (!currentUser) {
      return NextResponse.json(
        {
          success: false,
          message: "Authentication required",
          data: null,
        },
        {
          status: 401,
        }
      );
    }

    if (currentUser.role !== Role.MAHASISWA) {
      return NextResponse.json(
        {
          success: false,
          message: "Only mahasiswa can join modules",
          data: null,
        },
        {
          status: 403,
        }
      );
    }

    const body = await request.json();

    const result = await joinModuleByAccessCode({
      userId: currentUser.id,
      accessCode: body.accessCode,
    });

    if (!result.success) {
      return NextResponse.json(
        {
          success: false,
          message: getJoinModuleErrorMessage(result.error),
          data: null,
        },
        {
          status: getJoinModuleStatusCode(result.error),
        }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "Module joined successfully",
        data: result.enrollment,
      },
      {
        status: 201,
      }
    );
  } catch (error) {
    console.error("POST /api/modules/join error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to join module",
        data: null,
      },
      {
        status: 500,
      }
    );
  }
}