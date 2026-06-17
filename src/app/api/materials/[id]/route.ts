import { Role } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

import {
  deleteMaterial,
  getMaterialById,
  updateMaterial,
  updateMaterialProgress,
} from "@/services/material.service";
import { getCurrentSessionUser } from "@/lib/auth/session";

export const dynamic = "force-dynamic";

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

function parseMaterialId(id: string) {
  const materialId = Number(id);

  if (!Number.isInteger(materialId) || materialId <= 0) {
    return null;
  }

  return materialId;
}

function getUpdateProgressErrorMessage(
  error: NonNullable<Awaited<ReturnType<typeof updateMaterialProgress>>["error"]>
) {
  const messages = {
    USER_ID_REQUIRED: "User id is required",
    MATERIAL_ID_REQUIRED: "Material id is required",
    COMPLETION_STATUS_INVALID: "isCompleted boolean is required",
    USER_NOT_FOUND: "User not found",
    MATERIAL_NOT_FOUND: "Material not found",
    USER_NOT_ENROLLED: "User has not joined this module",
    USER_KICKED: "User has been kicked from this module",
  };

  return messages[error];
}

function getUpdateProgressStatusCode(
  error: NonNullable<Awaited<ReturnType<typeof updateMaterialProgress>>["error"]>
) {
  if (
    error === "USER_ID_REQUIRED" ||
    error === "MATERIAL_ID_REQUIRED" ||
    error === "COMPLETION_STATUS_INVALID"
  ) {
    return 400;
  }

  if (error === "USER_NOT_FOUND" || error === "MATERIAL_NOT_FOUND") {
    return 404;
  }

  if (error === "USER_NOT_ENROLLED" || error === "USER_KICKED") {
    return 403;
  }

  return 400;
}

function getUpdateMaterialErrorMessage(
  error: NonNullable<Awaited<ReturnType<typeof updateMaterial>>["error"]>
) {
  const messages = {
    MATERIAL_NOT_FOUND: "Material not found",
    TITLE_REQUIRED: "Title is required",
    VIDEO_SOURCE_INVALID: "Video source is invalid",
  };

  return messages[error];
}

async function ensureLecturerOwnsMaterial(materialId: number) {
  const currentUser = await getCurrentSessionUser();

  if (!currentUser) {
    return {
      success: false as const,
      status: 401,
      message: "Authentication required",
    };
  }

  if (currentUser.role !== Role.DOSEN) {
    return {
      success: false as const,
      status: 403,
      message: "Only lecturers can manage materials",
    };
  }

  if (!currentUser.dosenProfile?.id) {
    return {
      success: false as const,
      status: 403,
      message: "Dosen profile not found",
    };
  }

  const material = await getMaterialById(materialId);

  if (
    !material ||
    material.content.module.dosenProfileId !== currentUser.dosenProfile.id
  ) {
    return {
      success: false as const,
      status: 404,
      message: "Material not found or not owned by lecturer",
    };
  }

  return {
    success: true as const,
    status: 200,
    message: "OK",
  };
}

export async function GET(_request: Request, context: RouteContext) {
  try {
    const { id } = await context.params;
    const materialId = parseMaterialId(id);

    if (!materialId) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid material id",
          data: null,
        },
        {
          status: 400,
        }
      );
    }

    const material = await getMaterialById(materialId);

    if (!material) {
      return NextResponse.json(
        {
          success: false,
          message: "Material not found",
          data: null,
        },
        {
          status: 404,
        }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Material retrieved successfully",
      data: material,
    });
  } catch (error) {
    console.error("GET /api/materials/[id] error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to retrieve material",
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
    const { id } = await context.params;
    const materialId = parseMaterialId(id);

    if (!materialId) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid material id",
          data: null,
        },
        {
          status: 400,
        }
      );
    }

    const body = await request.json();

    if (typeof body.isCompleted === "boolean") {
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
            message: "Only mahasiswa can update material progress",
            data: null,
          },
          {
            status: 403,
          }
        );
      }

      const result = await updateMaterialProgress({
        materialId,
        userId: currentUser.id,
        isCompleted: body.isCompleted,
      });

      if (!result.success) {
        return NextResponse.json(
          {
            success: false,
            message: getUpdateProgressErrorMessage(result.error),
            data: null,
          },
          {
            status: getUpdateProgressStatusCode(result.error),
          }
        );
      }

      return NextResponse.json({
        success: true,
        message: result.progress.isCompleted
          ? "Material marked as completed"
          : "Material marked as incomplete",
        data: result.progress,
      });
    }

    const ownership = await ensureLecturerOwnsMaterial(materialId);

    if (!ownership.success) {
      return NextResponse.json(
        {
          success: false,
          message: ownership.message,
          data: null,
        },
        {
          status: ownership.status,
        }
      );
    }

    const result = await updateMaterial({
      id: materialId,
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
          message: getUpdateMaterialErrorMessage(result.error),
          data: null,
        },
        {
          status: result.error === "MATERIAL_NOT_FOUND" ? 404 : 400,
        }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Material updated successfully",
      data: result.material,
    });
  } catch (error) {
    console.error("PATCH /api/materials/[id] error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to update material",
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
    const { id } = await context.params;
    const materialId = parseMaterialId(id);

    if (!materialId) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid material id",
          data: null,
        },
        {
          status: 400,
        }
      );
    }

    const ownership = await ensureLecturerOwnsMaterial(materialId);

    if (!ownership.success) {
      return NextResponse.json(
        {
          success: false,
          message: ownership.message,
          data: null,
        },
        {
          status: ownership.status,
        }
      );
    }

    const result = await deleteMaterial(materialId);

    if (!result.success) {
      return NextResponse.json(
        {
          success: false,
          message: "Material not found",
          data: null,
        },
        {
          status: 404,
        }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Material deleted successfully",
      data: {
        id: result.deletedMaterialId,
        contentId: result.deletedContentId,
      },
    });
  } catch (error) {
    console.error("DELETE /api/materials/[id] error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to delete material",
        data: null,
      },
      {
        status: 500,
      }
    );
  }
}