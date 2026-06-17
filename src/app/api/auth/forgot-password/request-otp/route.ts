import { NextRequest, NextResponse } from "next/server";

import { requestForgotPasswordOtp } from "@/services/auth.service";

export const dynamic = "force-dynamic";

function getRequestOtpErrorMessage(
  error: NonNullable<
    Awaited<ReturnType<typeof requestForgotPasswordOtp>>["error"]
  >
) {
  const messages = {
    EMAIL_REQUIRED: "Email is required",
    USER_NOT_FOUND: "User not found",
    USER_INACTIVE: "User is inactive",
  };

  return messages[error];
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const result = await requestForgotPasswordOtp({
      email: typeof body.email === "string" ? body.email : null,
    });

    if (!result.success) {
      return NextResponse.json(
        {
          success: false,
          message: getRequestOtpErrorMessage(result.error),
          data: null,
        },
        {
          status: result.error === "USER_NOT_FOUND" ? 404 : 400,
        }
      );
    }

    return NextResponse.json({
      success: true,
      message: "OTP sent successfully",
      data: null,
      meta: {
        email: result.email,
      },
    });
  } catch (error) {
    console.error("POST /api/auth/forgot-password/request-otp error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to request OTP",
        data: null,
      },
      {
        status: 500,
      }
    );
  }
}