import { ModuleStatus, Role } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

import {
  getModuleById,
  updateModule,
  updateModulePublishStatus,
} from "@/services/module.service";
import { getCurrentSessionUser } from "@/lib/auth/session";
import { prisma } from "@/lib/prisma";
import { deleteCloudinaryAsset } from "@/services/media/cloudinary.service";

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

function normalizeLecturerModuleStatus(value: unknown) {
  if (value === "Publik" || value === ModuleStatus.PUBLIK) {
    return ModuleStatus.PUBLIK;
  }

  if (value === "Draft" || value === ModuleStatus.DRAFT) {
    return ModuleStatus.DRAFT;
  }

  if (value === undefined || value === null || value === "") {
    return undefined;
  }

  return null;
}

function getUpdateModuleErrorMessage(
  error: NonNullable<Awaited<ReturnType<typeof updateModule>>["error"]>
) {
  const messages = {
    MODULE_NOT_FOUND: "Module not found",
    TITLE_EMPTY: "Title cannot be empty",
    ACCESS_CODE_EMPTY: "Access code cannot be empty",
    ACCESS_CODE_ALREADY_USED: "Access code is already used",
    ESTIMATED_MINUTES_INVALID: "Estimated minutes must be a positive integer",
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
      message: "Only lecturers can manage modules",
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
      bannerPublicId: true,
    },
  });
}

async function deleteModuleBannerIfNeeded(publicId: string | null) {
  if (!publicId) return;

  try {
    await deleteCloudinaryAsset(publicId, "image");
  } catch (error) {
    console.error("Failed to delete module banner from Cloudinary:", error);
  }
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

    const moduleData = await getModuleById(moduleId);

    if (!moduleData) {
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
      message: "Module retrieved successfully",
      data: moduleData,
    });
  } catch (error) {
    console.error("GET /api/modules/[id] error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to retrieve module",
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
    const status = normalizeLecturerModuleStatus(body.status);

    if (status === null) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid module status",
          data: null,
        },
        {
          status: 400,
        }
      );
    }

    const result = await updateModule({
      id: moduleId,
      title: body.title,
      description: body.description,
      bannerUrl: body.bannerUrl,
      bannerPublicId: body.bannerPublicId,
      accessCode: body.accessCode,
      estimatedMinutes: body.estimatedMinutes,
      objectives: body.objectives,
    });

    if (!result.success) {
      return NextResponse.json(
        {
          success: false,
          message: getUpdateModuleErrorMessage(result.error),
          data: null,
        },
        {
          status: result.error === "MODULE_NOT_FOUND" ? 404 : 400,
        }
      );
    }

    if (status) {
      const publishResult = await updateModulePublishStatus({
        id: moduleId,
        status,
      });

      if (!publishResult.success) {
        return NextResponse.json(
          {
            success: false,
            message: "Failed to update module status",
            data: null,
          },
          {
            status: publishResult.error === "MODULE_NOT_FOUND" ? 404 : 400,
          }
        );
      }

      return NextResponse.json({
        success: true,
        message: "Module updated successfully",
        data: publishResult.module,
      });
    }

    return NextResponse.json({
      success: true,
      message: "Module updated successfully",
      data: result.module,
    });
  } catch (error) {
    console.error("PATCH /api/modules/[id] error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to update module",
        data: null,
      },
      {
        status: 500,
      }
    );
  }
}

export async function DELETE(_request: NextRequest, context: RouteContext) {
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

    await prisma.module.delete({
      where: {
        id: moduleId,
      },
    });

    await deleteModuleBannerIfNeeded(ownedModule.bannerPublicId);

    return NextResponse.json({
      success: true,
      message: "Module deleted successfully",
      data: {
        id: moduleId,
      },
    });
  } catch (error) {
    console.error("DELETE /api/modules/[id] error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to delete module",
        data: null,
      },
      {
        status: 500,
      }
    );
  }
}