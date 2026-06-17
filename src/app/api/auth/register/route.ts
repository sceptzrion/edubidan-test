import { NextRequest, NextResponse } from "next/server";

import { registerMahasiswa } from "@/services/auth.service";

export const dynamic = "force-dynamic";

function getRegisterErrorMessage(
  error: NonNullable<Awaited<ReturnType<typeof registerMahasiswa>>["error"]>
) {
  const messages = {
    NAME_REQUIRED: "Name is required",
    NPM_REQUIRED: "NPM is required",
    EMAIL_REQUIRED: "Email is required",
    PASSWORD_REQUIRED: "Password is required",
    PASSWORD_CONFIRMATION_REQUIRED: "Password confirmation is required",
    PASSWORD_TOO_SHORT: "Password must be at least 8 characters",
    PASSWORD_MISMATCH: "Password confirmation does not match",
    INVALID_NPM_FORMAT: "NPM must contain 10 to 20 digits",
    INVALID_STUDENT_EMAIL_FORMAT:
      "Student email must use @student.unsika.ac.id domain",
    EMAIL_NPM_MISMATCH: "Student email must match the NPM format",
    EMAIL_ALREADY_USED: "Email is already registered",
    NPM_ALREADY_USED: "NPM is already registered",
  };

  return messages[error];
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const result = await registerMahasiswa({
      name: typeof body.name === "string" ? body.name : null,
      npm: typeof body.npm === "string" ? body.npm : null,
      email: typeof body.email === "string" ? body.email : null,
      password: typeof body.password === "string" ? body.password : null,
      confirmPassword:
        typeof body.confirmPassword === "string" ? body.confirmPassword : null,
    });

    if (!result.success) {
      return NextResponse.json(
        {
          success: false,
          message: getRegisterErrorMessage(result.error),
          data: null,
        },
        {
          status: 400,
        }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "Registration successful",
        data: result.user,
        meta: {
          email: result.email,
        },
      },
      {
        status: 201,
      }
    );
  } catch (error) {
    console.error("POST /api/auth/register error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to register",
        data: null,
      },
      {
        status: 500,
      }
    );
  }
}