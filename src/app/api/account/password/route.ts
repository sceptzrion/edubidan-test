import bcrypt from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";

import { getCurrentSessionUser } from "@/lib/auth/session";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

function normalizePassword(value: unknown) {
  if (typeof value !== "string") return null;

  return value;
}

export async function PATCH(request: NextRequest) {
  try {
    const currentUser = await getCurrentSessionUser();

    if (!currentUser) {
      return NextResponse.json(
        {
          success: false,
          message: "Authentication required",
          data: null,
        },
        {
          status: 401,
        }
      );
    }

    const body = await request.json();

    const currentPassword = normalizePassword(body.currentPassword);
    const newPassword = normalizePassword(body.newPassword);
    const confirmPassword = normalizePassword(body.confirmPassword);

    if (!currentPassword || !newPassword || !confirmPassword) {
      return NextResponse.json(
        {
          success: false,
          message: "All password fields are required",
          data: null,
        },
        {
          status: 400,
        }
      );
    }

    if (newPassword.length < 8) {
      return NextResponse.json(
        {
          success: false,
          message: "New password must be at least 8 characters",
          data: null,
        },
        {
          status: 400,
        }
      );
    }

    if (newPassword !== confirmPassword) {
      return NextResponse.json(
        {
          success: false,
          message: "Password confirmation does not match",
          data: null,
        },
        {
          status: 400,
        }
      );
    }

    if (currentPassword === newPassword) {
      return NextResponse.json(
        {
          success: false,
          message: "New password must be different",
          data: null,
        },
        {
          status: 400,
        }
      );
    }

    const user = await prisma.user.findUnique({
      where: {
        id: currentUser.id,
      },
      select: {
        id: true,
        password: true,
      },
    });

    if (!user) {
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

    const isCurrentPasswordValid = await bcrypt.compare(
      currentPassword,
      user.password
    );

    if (!isCurrentPasswordValid) {
      return NextResponse.json(
        {
          success: false,
          message: "Current password is incorrect",
          data: null,
        },
        {
          status: 400,
        }
      );
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await prisma.user.update({
      where: {
        id: currentUser.id,
      },
      data: {
        password: hashedPassword,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Password updated successfully",
      data: null,
    });
  } catch (error) {
    console.error("PATCH /api/account/password error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to update password",
        data: null,
      },
      {
        status: 500,
      }
    );
  }
}