import { NextRequest, NextResponse } from "next/server";

import { updateUserStatusByAdmin } from "@/services/user.service";

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

export async function PATCH(request: NextRequest, context: RouteContext) {
  try {
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

    const result = await updateUserStatusByAdmin({
      id: userId,
      isActive: body.isActive,
    });

    if (!result.success) {
      if (result.error === "STATUS_REQUIRED") {
        return NextResponse.json(
          {
            success: false,
            message: "isActive boolean is required",
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
      message: result.user.isActive
        ? "User activated successfully"
        : "User deactivated successfully",
      data: result.user,
    });
  } catch (error) {
    console.error("PATCH /api/users/[id]/status error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to update user status",
        data: null,
      },
      {
        status: 500,
      }
    );
  }
}