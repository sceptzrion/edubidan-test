import { NextRequest, NextResponse } from "next/server";

import { getCurrentUserByEmail } from "@/services/auth.service";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const email = request.nextUrl.searchParams.get("email");
    const result = await getCurrentUserByEmail(email);

    if (!result.success) {
      if (result.error === "EMAIL_REQUIRED") {
        return NextResponse.json(
          {
            success: false,
            message: "Email query parameter is required",
            data: null,
          },
          {
            status: 400,
          }
        );
      }

      if (result.error === "USER_NOT_FOUND") {
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

      if (result.error === "USER_INACTIVE") {
        return NextResponse.json(
          {
            success: false,
            message: "User account is inactive",
            data: null,
          },
          {
            status: 403,
          }
        );
      }
    }

    return NextResponse.json({
      success: true,
      message: "Current user retrieved successfully",
      data: result.user,
    });
  } catch (error) {
    console.error("GET /api/auth/me error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to retrieve current user",
        data: null,
      },
      {
        status: 500,
      }
    );
  }
}