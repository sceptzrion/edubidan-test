import { NextRequest, NextResponse } from "next/server";

import { verifyForgotPasswordOtp } from "@/services/auth.service";

export const dynamic = "force-dynamic";

function getVerifyOtpErrorMessage(
  error: NonNullable<
    Awaited<ReturnType<typeof verifyForgotPasswordOtp>>["error"]
  >
) {
  const messages = {
    EMAIL_REQUIRED: "Email is required",
    OTP_REQUIRED: "OTP is required",
    OTP_INVALID: "OTP is invalid",
    OTP_EXPIRED: "OTP is expired",
    USER_NOT_FOUND: "User not found",
    USER_INACTIVE: "User is inactive",
  };

  return messages[error];
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const result = await verifyForgotPasswordOtp({
      email: typeof body.email === "string" ? body.email : null,
      otpCode: typeof body.otpCode === "string" ? body.otpCode : null,
    });

    if (!result.success) {
      return NextResponse.json(
        {
          success: false,
          message: getVerifyOtpErrorMessage(result.error),
          data: null,
        },
        {
          status:
            result.error === "USER_NOT_FOUND"
              ? 404
              : result.error === "OTP_INVALID" || result.error === "OTP_EXPIRED"
                ? 400
                : 400,
        }
      );
    }

    return NextResponse.json({
      success: true,
      message: "OTP verified successfully",
      data: {
        email: result.email,
      },
    });
  } catch (error) {
    console.error("POST /api/auth/forgot-password/verify-otp error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to verify OTP",
        data: null,
      },
      {
        status: 500,
      }
    );
  }
}