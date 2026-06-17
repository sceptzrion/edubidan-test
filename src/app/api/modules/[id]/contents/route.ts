import { ContentType, NotificationType, Role } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

import { createQuiz } from "@/services/quiz-management.service";
import { createMaterial, getModuleContents } from "@/services/material.service";
import { reorderModuleContents } from "@/services/module-content.service";
import { getCurrentSessionUser } from "@/lib/auth/session";
import { prisma } from "@/lib/prisma";
import { filterUserIdsByNotificationPreference } from "@/services/notification-preference.service";

export const dynamic = "force-dynamic";

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

function parseModuleId(id: string) {
  const moduleId = Number(id);

  if (!Number.isInteger(moduleId) || moduleId <= 0) {
    return null;
  }

  return moduleId;
}

function getCreateMaterialErrorMessage(
  error: NonNullable<Awaited<ReturnType<typeof createMaterial>>["error"]>
) {
  const messages = {
    MODULE_NOT_FOUND: "Module not found",
    TITLE_REQUIRED: "Title is required",
    VIDEO_SOURCE_INVALID: "Video source is invalid",
  };

  return messages[error];
}

function getCreateQuizErrorMessage(
  error: NonNullable<Awaited<ReturnType<typeof createQuiz>>["error"]>
) {
  const messages = {
    MODULE_NOT_FOUND: "Module not found",
    TITLE_REQUIRED: "Title is required",
    TIME_LIMIT_INVALID: "Time limit must be a positive integer",
    QUESTIONS_INVALID: "Quiz questions are invalid",
  };

  return messages[error];
}

function getReorderContentErrorMessage(
  error: NonNullable<Awaited<ReturnType<typeof reorderModuleContents>>["error"]>
) {
  const messages = {
    MODULE_NOT_FOUND: "Module not found",
    CONTENT_IDS_REQUIRED: "Ordered content ids are required",
    CONTENT_IDS_INVALID: "Ordered content ids are invalid",
    CONTENT_NOT_FOUND: "Some contents were not found in this module",
  };

  return messages[error];
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
      message: "Only lecturers can manage module contents",
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
      title: true,
    },
  });
}

function normalizeContentKind(value: unknown) {
  if (value === ContentType.MATERI || value === "materi") {
    return ContentType.MATERI;
  }

  if (value === ContentType.KUIS || value === "kuis") {
    return ContentType.KUIS;
  }

  return null;
}

async function notifyParticipantsNewContent(params: {
  moduleId: number;
  moduleTitle: string;
  contentTitle: string;
  contentKind: ContentType;
}) {
  const activeEnrollments = await prisma.enrollment.findMany({
    where: {
      moduleId: params.moduleId,
      isKicked: false,
    },
    select: {
      userId: true,
    },
  });

  if (activeEnrollments.length === 0) {
    return;
  }

  const isMaterial = params.contentKind === ContentType.MATERI;
  const notificationType = isMaterial
    ? NotificationType.MATERI_BARU
    : NotificationType.KUIS_BARU;

  const allowedUserIds = await filterUserIdsByNotificationPreference({
    userIds: activeEnrollments.map((enrollment) => enrollment.userId),
    type: notificationType,
  });

  if (allowedUserIds.length === 0) {
    return;
  }

  await prisma.notification.createMany({
    data: allowedUserIds.map((userId) => ({
      userId,
      moduleId: params.moduleId,
      type: notificationType,
      title: isMaterial ? "Materi baru tersedia" : "Kuis baru tersedia",
      body: isMaterial
        ? `Materi "${params.contentTitle}" telah ditambahkan pada modul ${params.moduleTitle}.`
        : `Kuis "${params.contentTitle}" telah ditambahkan pada modul ${params.moduleTitle}.`,
      href: `/dashboard/modules/${params.moduleId}`,
    })),
  });
}

export async function GET(_request: Request, context: RouteContext) {
  try {
    const { id } = await context.params;
    const moduleId = parseModuleId(id);

    if (!moduleId) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid module id",
          data: null,
        },
        {
          status: 400,
        }
      );
    }

    const result = await getModuleContents(moduleId);

    if (!result) {
      return NextResponse.json(
        {
          success: false,
          message: "Module not found",
          data: null,
        },
        {
          status: 404,
        }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Module contents retrieved successfully",
      data: result,
    });
  } catch (error) {
    console.error("GET /api/modules/[id]/contents error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to retrieve module contents",
        data: null,
      },
      {
        status: 500,
      }
    );
  }
}

export async function POST(request: NextRequest, context: RouteContext) {
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

    const { id } = await context.params;
    const moduleId = parseModuleId(id);

    if (!moduleId) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid module id",
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
    const kind = normalizeContentKind(body.kind);

    if (!kind) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid content kind",
          data: null,
        },
        {
          status: 400,
        }
      );
    }

    if (kind === ContentType.MATERI) {
      const result = await createMaterial({
        moduleId,
        title: body.title,
        description: body.description,
        videoSource: body.videoSource,
        videoUrl: body.videoUrl,
        estimatedMinutes: body.estimatedMinutes,
        objectives: body.objectives,
        tools: body.tools,
      });

      if (!result.success) {
        return NextResponse.json(
          {
            success: false,
            message: getCreateMaterialErrorMessage(result.error),
            data: null,
          },
          {
            status: result.error === "MODULE_NOT_FOUND" ? 404 : 400,
          }
        );
      }

      await notifyParticipantsNewContent({
        moduleId,
        moduleTitle: ownedModule.title,
        contentTitle: result.material?.title ?? body.title ?? "Materi baru",
        contentKind: ContentType.MATERI,
      });

      return NextResponse.json(
        {
          success: true,
          message: "Material created successfully",
          data: result.material,
        },
        {
          status: 201,
        }
      );
    }

    const result = await createQuiz({
      moduleId,
      title: body.title,
      description: body.description,
      hasTimeLimit: body.hasTimeLimit,
      timeLimitMinutes: body.timeLimitMinutes,
      questions: body.questions,
    });

    if (!result.success) {
      return NextResponse.json(
        {
          success: false,
          message: getCreateQuizErrorMessage(result.error),
          data: null,
        },
        {
          status: result.error === "MODULE_NOT_FOUND" ? 404 : 400,
        }
      );
    }

    await notifyParticipantsNewContent({
      moduleId,
      moduleTitle: ownedModule.title,
      contentTitle: result.quiz?.title ?? body.title ?? "Kuis baru",
      contentKind: ContentType.KUIS,
    });

    return NextResponse.json(
      {
        success: true,
        message: "Quiz created successfully",
        data: result.quiz,
      },
      {
        status: 201,
      }
    );
  } catch (error) {
    console.error("POST /api/modules/[id]/contents error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to create module content",
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

    const { id } = await context.params;
    const moduleId = parseModuleId(id);

    if (!moduleId) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid module id",
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

    const result = await reorderModuleContents({
      moduleId,
      orderedContentIds: body.orderedContentIds,
    });

    if (!result.success) {
      return NextResponse.json(
        {
          success: false,
          message: getReorderContentErrorMessage(result.error),
          data: null,
        },
        {
          status: result.error === "MODULE_NOT_FOUND" ? 404 : 400,
        }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Module contents reordered successfully",
      data: {
        orderedContentIds: body.orderedContentIds,
      },
    });
  } catch (error) {
    console.error("PATCH /api/modules/[id]/contents error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to reorder module contents",
        data: null,
      },
      {
        status: 500,
      }
    );
  }
}