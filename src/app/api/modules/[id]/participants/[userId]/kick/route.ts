import { Role } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

import { updateParticipantKickStatus } from "@/services/enrollment.service";
import { getCurrentSessionUser } from "@/lib/auth/session";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

type RouteContext = {
  params: Promise<{
    id: string;
    userId: string;
  }>;
};

function parsePositiveId(value: string) {
  const id = Number(value);

  if (!Number.isInteger(id) || id <= 0) {
    return null;
  }

  return id;
}

function getKickStatusErrorMessage(
  error: NonNullable<
    Awaited<ReturnType<typeof updateParticipantKickStatus>>["error"]
  >
) {
  const messages = {
    MODULE_NOT_FOUND: "Module not found",
    USER_NOT_FOUND: "User not found",
    ENROLLMENT_NOT_FOUND: "Enrollment not found",
    KICK_STATUS_REQUIRED: "isKicked boolean is required",
  };

  return messages[error];
}

function getKickStatusCode(
  error: NonNullable<
    Awaited<ReturnType<typeof updateParticipantKickStatus>>["error"]
  >
) {
  if (error === "KICK_STATUS_REQUIRED") {
    return 400;
  }

  return 404;
}

async function getAuthenticatedDosenProfileId() {
  const currentUser = await getCurrentSessionUser();

  if (!currentUser) {
    return {
      success: false as const,
      status: 401,
      message: "Authentication required",
      dosenProfileId: null,
    };
  }

  if (currentUser.role !== Role.DOSEN) {
    return {
      success: false as const,
      status: 403,
      message: "Only lecturers can manage participants",
      dosenProfileId: null,
    };
  }

  if (!currentUser.dosenProfile?.id) {
    return {
      success: false as const,
      status: 403,
      message: "Dosen profile not found",
      dosenProfileId: null,
    };
  }

  return {
    success: true as const,
    status: 200,
    message: "OK",
    dosenProfileId: currentUser.dosenProfile.id,
  };
}

async function getOwnedModule(moduleId: number, dosenProfileId: number) {
  return prisma.module.findFirst({
    where: {
      id: moduleId,
      dosenProfileId,
    },
    select: {
      id: true,
    },
  });
}

export async function PATCH(request: NextRequest, context: RouteContext) {
  try {
    const auth = await getAuthenticatedDosenProfileId();

    if (!auth.success) {
      return NextResponse.json(
        {
          success: false,
          message: auth.message,
          data: null,
        },
        {
          status: auth.status,
        }
      );
    }

    const { id, userId } = await context.params;
    const moduleId = parsePositiveId(id);
    const parsedUserId = parsePositiveId(userId);

    if (!moduleId || !parsedUserId) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid module id or user id",
          data: null,
        },
        {
          status: 400,
        }
      );
    }

    const ownedModule = await getOwnedModule(moduleId, auth.dosenProfileId);

    if (!ownedModule) {
      return NextResponse.json(
        {
          success: false,
          message: "Module not found or not owned by lecturer",
          data: null,
        },
        {
          status: 404,
        }
      );
    }

    const body = await request.json();

    const result = await updateParticipantKickStatus({
      moduleId,
      userId: parsedUserId,
      isKicked: body.isKicked,
      kickReason: body.kickReason,
    });

    if (!result.success) {
      return NextResponse.json(
        {
          success: false,
          message: getKickStatusErrorMessage(result.error),
          data: null,
        },
        {
          status: getKickStatusCode(result.error),
        }
      );
    }

    return NextResponse.json({
      success: true,
      message: result.enrollment?.isKicked
        ? "Participant kicked successfully"
        : "Participant restored successfully",
      data: result.enrollment,
    });
  } catch (error) {
    console.error(
      "PATCH /api/modules/[id]/participants/[userId]/kick error:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message: "Failed to update participant kick status",
        data: null,
      },
      {
        status: 500,
      }
    );
  }
}