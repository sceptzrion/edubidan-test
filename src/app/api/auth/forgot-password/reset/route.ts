import { NextRequest, NextResponse } from "next/server";

import { resetPasswordWithOtp } from "@/services/auth.service";

export const dynamic = "force-dynamic";

function getResetPasswordErrorMessage(
  error: NonNullable<Awaited<ReturnType<typeof resetPasswordWithOtp>>["error"]>
) {
  const messages = {
    EMAIL_REQUIRED: "Email is required",
    OTP_REQUIRED: "OTP is required",
    PASSWORD_REQUIRED: "Password is required",
    PASSWORD_CONFIRMATION_REQUIRED: "Password confirmation is required",
    PASSWORD_TOO_SHORT: "Password must be at least 8 characters",
    PASSWORD_MISMATCH: "Password confirmation does not match",
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

    const result = await resetPasswordWithOtp({
      email: typeof body.email === "string" ? body.email : null,
      otpCode: typeof body.otpCode === "string" ? body.otpCode : null,
      password: typeof body.password === "string" ? body.password : null,
      confirmPassword:
        typeof body.confirmPassword === "string" ? body.confirmPassword : null,
    });

    if (!result.success) {
      return NextResponse.json(
        {
          success: false,
          message: getResetPasswordErrorMessage(result.error),
          data: null,
        },
        {
          status: result.error === "USER_NOT_FOUND" ? 404 : 400,
        }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Password reset successfully",
      data: null,
    });
  } catch (error) {
    console.error("POST /api/auth/forgot-password/reset error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to reset password",
        data: null,
      },
      {
        status: 500,
      }
    );
  }
}