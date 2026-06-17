import { Role } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

import { requireApiRole } from "@/lib/auth/api-guards";
import { createUserByAdmin, getUsers } from "@/services/user.service";

export const dynamic = "force-dynamic";

function getCreateUserErrorMessage(
  error: NonNullable<Awaited<ReturnType<typeof createUserByAdmin>>["error"]>
) {
  const messages = {
    NAME_REQUIRED: "Name is required",
    EMAIL_REQUIRED: "Email is required",
    PASSWORD_REQUIRED: "Password is required",
    PASSWORD_TOO_SHORT: "Password must be at least 8 characters",
    ROLE_INVALID: "Role must be MAHASISWA or DOSEN",
    IDENTIFIER_REQUIRED: "NPM or NIDN/NIP is required",
    INVALID_NPM_FORMAT: "NPM must contain 10 to 20 digits",
    INVALID_NIDN_NIP_FORMAT:
      "NIDN/NIP must contain 5 to 30 letters, numbers, dots, or dashes",
    INVALID_STUDENT_EMAIL_FORMAT:
      "Mahasiswa email must match npm@student.unsika.ac.id",
    INVALID_DOSEN_EMAIL_FORMAT:
      "Dosen email must use @staff.unsika.ac.id domain",
    EMAIL_ALREADY_USED: "Email is already used",
    IDENTIFIER_ALREADY_USED: "NPM or NIDN/NIP is already used",
  };

  return messages[error];
}

export async function GET() {
  try {
    const auth = await requireApiRole([Role.ADMIN]);

    if (!auth.success) {
      return auth.response;
    }

    const users = await getUsers();

    return NextResponse.json({
      success: true,
      message: "Users retrieved successfully",
      data: users,
    });
  } catch (error) {
    console.error("GET /api/users error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to retrieve users",
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
    const auth = await requireApiRole([Role.ADMIN]);

    if (!auth.success) {
      return auth.response;
    }

    const body = await request.json();

    const result = await createUserByAdmin({
      name: body.name,
      email: body.email,
      password: body.password,
      role: body.role,
      identifier: body.identifier,
      phoneNumber: body.phoneNumber,
      avatarUrl: body.avatarUrl,
    });

    if (!result.success) {
      return NextResponse.json(
        {
          success: false,
          message: getCreateUserErrorMessage(result.error),
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
        message: "User created successfully",
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
    console.error("POST /api/users error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to create user",
        data: null,
      },
      {
        status: 500,
      }
    );
  }
}