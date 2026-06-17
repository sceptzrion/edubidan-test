import { ModuleStatus, Role } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

import {
  createModule,
  getModules,
  updateModulePublishStatus,
} from "@/services/module.service";
import { getCurrentSessionUser } from "@/lib/auth/session";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

function getCreateModuleErrorMessage(
  error: NonNullable<Awaited<ReturnType<typeof createModule>>["error"]>
) {
  const messages = {
    DOSEN_PROFILE_ID_REQUIRED: "Dosen profile id is required",
    DOSEN_PROFILE_NOT_FOUND: "Dosen profile not found",
    TITLE_REQUIRED: "Title is required",
    ACCESS_CODE_REQUIRED: "Access code is required",
    ACCESS_CODE_ALREADY_USED: "Access code is already used",
    ESTIMATED_MINUTES_INVALID: "Estimated minutes must be a positive integer",
  };

  return messages[error];
}

function normalizeLecturerModuleStatus(value: unknown) {
  if (value === "Publik" || value === ModuleStatus.PUBLIK) {
    return ModuleStatus.PUBLIK;
  }

  if (
    value === undefined ||
    value === null ||
    value === "" ||
    value === "Draft" ||
    value === ModuleStatus.DRAFT
  ) {
    return ModuleStatus.DRAFT;
  }

  return null;
}

function generateModuleAccessCode() {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let code = "";

  for (let index = 0; index < 6; index += 1) {
    code += chars[Math.floor(Math.random() * chars.length)];
  }

  return code;
}

async function generateUniqueModuleAccessCode() {
  for (let attempt = 0; attempt < 10; attempt += 1) {
    const accessCode = generateModuleAccessCode();

    const existingModule = await prisma.module.findUnique({
      where: {
        accessCode,
      },
      select: {
        id: true,
      },
    });

    if (!existingModule) {
      return accessCode;
    }
  }

  return null;
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

export async function GET(request: NextRequest) {
  try {
    const search = request.nextUrl.searchParams.get("search");
    const status = request.nextUrl.searchParams.get("status");

    const modules = await getModules({
      search,
      status,
    });

    return NextResponse.json({
      success: true,
      message: "Modules retrieved successfully",
      data: modules,
    });
  } catch (error) {
    console.error("GET /api/modules error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to retrieve modules",
        data: null,
      },
      {
        status: 500,
      }
    );
  }
}

export async function POST(request: NextRequest) {
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

    const body = await request.json();
    const status = normalizeLecturerModuleStatus(body.status);

    if (!status) {
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

    const accessCode = await generateUniqueModuleAccessCode();

    if (!accessCode) {
      return NextResponse.json(
        {
          success: false,
          message: "Failed to generate unique access code",
          data: null,
        },
        {
          status: 500,
        }
      );
    }

    const result = await createModule({
      dosenProfileId: auth.dosenProfileId,
      title: body.title,
      description: body.description,
      bannerUrl: body.bannerUrl,
      bannerPublicId: body.bannerPublicId,
      accessCode,
      estimatedMinutes: body.estimatedMinutes,
      objectives: body.objectives,
    });

    if (!result.success) {
      return NextResponse.json(
        {
          success: false,
          message: getCreateModuleErrorMessage(result.error),
          data: null,
        },
        {
          status: result.error === "DOSEN_PROFILE_NOT_FOUND" ? 404 : 400,
        }
      );
    }

    if (!result.module) {
      return NextResponse.json(
        {
          success: false,
          message: "Failed to retrieve created module",
          data: null,
        },
        {
          status: 500,
        }
      );
    }

    if (status === ModuleStatus.PUBLIK) {
      const publishResult = await updateModulePublishStatus({
        id: result.module.id,
        status,
      });

      if (!publishResult.success) {
        return NextResponse.json(
          {
            success: false,
            message: "Module created but failed to update publish status",
            data: result.module,
          },
          {
            status: 500,
          }
        );
      }

      return NextResponse.json(
        {
          success: true,
          message: "Module created successfully",
          data: publishResult.module,
        },
        {
          status: 201,
        }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "Module created successfully",
        data: result.module,
      },
      {
        status: 201,
      }
    );
  } catch (error) {
    console.error("POST /api/modules error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to create module",
        data: null,
      },
      {
        status: 500,
      }
    );
  }
}