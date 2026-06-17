import { NextResponse } from "next/server";

import { requireApiDosenProfile } from "@/lib/auth/api-guards";
import { prisma } from "@/lib/prisma";
import { getModuleGradebook } from "@/services/lecturer-analytics.service";

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

export async function GET(_request: Request, context: RouteContext) {
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

    const result = await getModuleGradebook(moduleId);

    if (!result.success) {
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
      message: "Module gradebook retrieved successfully",
      data: result.data,
    });
  } catch (error) {
    console.error("GET /api/lecturer/modules/[id]/gradebook error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to retrieve module gradebook",
        data: null,
      },
      {
        status: 500,
      }
    );
  }
}