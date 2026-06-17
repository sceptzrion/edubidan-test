import { NextRequest, NextResponse } from "next/server";

import { getCurrentSessionUser } from "@/lib/auth/session";
import { prisma } from "@/lib/prisma";
import { deleteCloudinaryAsset } from "@/services/media/cloudinary.service";

export const dynamic = "force-dynamic";

function normalizeOptionalString(value: unknown) {
  if (value === undefined) return undefined;
  if (value === null) return null;
  if (typeof value !== "string") return null;

  const trimmed = value.trim();

  return trimmed.length > 0 ? trimmed : null;
}

function normalizeRequiredString(value: unknown) {
  if (typeof value !== "string") return null;

  const trimmed = value.trim();

  return trimmed.length > 0 ? trimmed : null;
}

function normalizeOptionalUrl(value: unknown) {
  if (value === undefined) return undefined;
  if (value === null) return null;
  if (typeof value !== "string") return null;

  const trimmed = value.trim();

  if (trimmed.length === 0) return null;

  try {
    const url = new URL(trimmed);

    if (url.protocol !== "https:" && url.protocol !== "http:") {
      return null;
    }

    return trimmed;
  } catch {
    return null;
  }
}

function normalizeOptionalPublicId(value: unknown) {
  if (value === undefined) return undefined;
  if (value === null) return null;
  if (typeof value !== "string") return null;

  const trimmed = value.trim();

  return trimmed.length > 0 ? trimmed : null;
}

async function getAccountProfile(userId: number) {
  return prisma.user.findUnique({
    where: {
      id: userId,
    },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      avatarUrl: true,
      avatarPublicId: true,
      phoneNumber: true,
      mahasiswaProfile: {
        select: {
          id: true,
          npm: true,
        },
      },
      dosenProfile: {
        select: {
          id: true,
          nidnNip: true,
        },
      },
    },
  });
}

async function deleteOldAvatarIfNeeded(params: {
  oldPublicId: string | null;
  newPublicId?: string | null;
  shouldUpdateAvatar: boolean;
}) {
  const { oldPublicId, newPublicId, shouldUpdateAvatar } = params;

  if (!shouldUpdateAvatar) return;
  if (!oldPublicId) return;
  if (oldPublicId === newPublicId) return;

  try {
    await deleteCloudinaryAsset(oldPublicId, "image");
  } catch (error) {
    console.error("Failed to delete old avatar from Cloudinary:", error);
  }
}

export async function GET() {
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

    const profile = await getAccountProfile(currentUser.id);

    if (!profile) {
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
      message: "Profile retrieved successfully",
      data: profile,
    });
  } catch (error) {
    console.error("GET /api/account/profile error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to retrieve profile",
        data: null,
      },
      {
        status: 500,
      }
    );
  }
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

    const existingUser = await prisma.user.findUnique({
      where: {
        id: currentUser.id,
      },
      select: {
        id: true,
        avatarPublicId: true,
      },
    });

    if (!existingUser) {
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

    const body = await request.json();
    const name = normalizeRequiredString(body.name);
    const phoneNumber = normalizeOptionalString(body.phoneNumber);
    const avatarUrl = normalizeOptionalUrl(body.avatarUrl);
    const avatarPublicId = normalizeOptionalPublicId(body.avatarPublicId);

    const shouldUpdateAvatar = body.avatarUrl !== undefined;

    if (!name) {
      return NextResponse.json(
        {
          success: false,
          message: "Name is required",
          data: null,
        },
        {
          status: 400,
        }
      );
    }

    if (phoneNumber === null && body.phoneNumber !== null && body.phoneNumber !== "") {
      return NextResponse.json(
        {
          success: false,
          message: "Phone number is invalid",
          data: null,
        },
        {
          status: 400,
        }
      );
    }

    if (
      avatarUrl === null &&
      body.avatarUrl !== undefined &&
      body.avatarUrl !== null &&
      body.avatarUrl !== ""
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "Avatar URL is invalid",
          data: null,
        },
        {
          status: 400,
        }
      );
    }

    if (
      avatarPublicId === null &&
      body.avatarPublicId !== undefined &&
      body.avatarPublicId !== null &&
      body.avatarPublicId !== ""
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "Avatar public id is invalid",
          data: null,
        },
        {
          status: 400,
        }
      );
    }

    await prisma.user.update({
      where: {
        id: currentUser.id,
      },
      data: {
        name,
        phoneNumber,
        ...(shouldUpdateAvatar
          ? {
              avatarUrl,
              avatarPublicId,
            }
          : {}),
      },
    });

    await deleteOldAvatarIfNeeded({
      oldPublicId: existingUser.avatarPublicId,
      newPublicId: avatarPublicId,
      shouldUpdateAvatar,
    });

    const profile = await getAccountProfile(currentUser.id);

    return NextResponse.json({
      success: true,
      message: "Profile updated successfully",
      data: profile,
    });
  } catch (error) {
    console.error("PATCH /api/account/profile error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to update profile",
        data: null,
      },
      {
        status: 500,
      }
    );
  }
}