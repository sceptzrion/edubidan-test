import { NextRequest, NextResponse } from "next/server";

import { requireApiDosenProfile } from "@/lib/auth/api-guards";
import { prisma } from "@/lib/prisma";
import { updateModulePublishStatus } from "@/services/module.service";

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

export async function PATCH(request: NextRequest, context: RouteContext) {
  try {
    const auth = await requireApiDosenProfile();

    if (!auth.success) {
      return auth.response;
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

    const ownedModule = await prisma.module.findFirst({
      where: {
        id: moduleId,
        dosenProfileId: auth.dosenProfileId,
      },
      select: {
        id: true,
      },
    });

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

    const result = await updateModulePublishStatus({
      id: moduleId,
      status: body.status,
    });

    if (!result.success) {
      if (result.error === "STATUS_INVALID") {
        return NextResponse.json(
          {
            success: false,
            message: "Status must be PUBLIK or DRAFT",
            data: null,
          },
          {
            status: 400,
          }
        );
      }

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
      message:
        result.module?.status === "PUBLIK"
          ? "Module published successfully"
          : "Module moved to draft successfully",
      data: result.module,
    });
  } catch (error) {
    console.error("PATCH /api/modules/[id]/publish error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to update module publish status",
        data: null,
      },
      {
        status: 500,
      }
    );
  }
}