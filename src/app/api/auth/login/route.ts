import { NextRequest, NextResponse } from "next/server";

import { createAuthSession } from "@/lib/auth/session";
import { loginUser } from "@/services/auth.service";

export const dynamic = "force-dynamic";

function getLoginErrorMessage(
  error: NonNullable<Awaited<ReturnType<typeof loginUser>>["error"]>
) {
  if (error === "EMAIL_REQUIRED") {
    return "Email is required";
  }

  if (error === "PASSWORD_REQUIRED") {
    return "Password is required";
  }

  if (error === "USER_INACTIVE") {
    return "User account is inactive";
  }

  return "Invalid email or password";
}

function getLoginStatusCode(
  error: NonNullable<Awaited<ReturnType<typeof loginUser>>["error"]>
) {
  if (error === "EMAIL_REQUIRED" || error === "PASSWORD_REQUIRED") {
    return 400;
  }

  if (error === "USER_INACTIVE") {
    return 403;
  }

  return 401;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const result = await loginUser({
      email: typeof body.email === "string" ? body.email : null,
      password: typeof body.password === "string" ? body.password : null,
    });

    if (!result.success) {
      return NextResponse.json(
        {
          success: false,
          message: getLoginErrorMessage(result.error),
          data: null,
        },
        {
          status: getLoginStatusCode(result.error),
        }
      );
    }

    await createAuthSession({
      id: result.user.id,
      role: result.user.role,
    });

    return NextResponse.json({
      success: true,
      message: "Login successful",
      data: {
        user: result.user,
        redirectTo: result.redirectTo,
      },
    });
  } catch (error) {
    console.error("POST /api/auth/login error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to login",
        data: null,
      },
      {
        status: 500,
      }
    );
  }
}