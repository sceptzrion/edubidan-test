import { NextRequest, NextResponse } from "next/server";

import { getCurrentSessionUser } from "@/lib/auth/session";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

const preferenceKeys = [
  "moduleUpdate",
  "newMaterial",
  "newQuiz",
  "quizResult",
  "quizActivity",
  "accountActivity",
  "systemAlert",
] as const;

type PreferenceKey = (typeof preferenceKeys)[number];

function normalizePreferenceValue(value: unknown) {
  return typeof value === "boolean" ? value : null;
}

function buildPreferenceUpdateData(body: Record<string, unknown>) {
  const data: Partial<Record<PreferenceKey, boolean>> = {};

  preferenceKeys.forEach((key) => {
    if (!(key in body)) return;

    const value = normalizePreferenceValue(body[key]);

    if (value !== null) {
      data[key] = value;
    }
  });

  return data;
}

async function getOrCreateNotificationPreference(userId: number) {
  return prisma.notifPreference.upsert({
    where: {
      userId,
    },
    update: {},
    create: {
      userId,
    },
    select: {
      id: true,
      userId: true,
      moduleUpdate: true,
      newMaterial: true,
      newQuiz: true,
      quizResult: true,
      quizActivity: true,
      accountActivity: true,
      systemAlert: true,
    },
  });
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

    const preference = await getOrCreateNotificationPreference(currentUser.id);

    return NextResponse.json({
      success: true,
      message: "Notification preferences retrieved successfully",
      data: preference,
    });
  } catch (error) {
    console.error("GET /api/account/notification-preferences error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to retrieve notification preferences",
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

    const body = (await request.json()) as Record<string, unknown>;
    const data = buildPreferenceUpdateData(body);

    if (Object.keys(data).length === 0) {
      return NextResponse.json(
        {
          success: false,
          message: "No valid notification preference provided",
          data: null,
        },
        {
          status: 400,
        }
      );
    }

    const preference = await prisma.notifPreference.upsert({
      where: {
        userId: currentUser.id,
      },
      update: data,
      create: {
        userId: currentUser.id,
        ...data,
      },
      select: {
        id: true,
        userId: true,
        moduleUpdate: true,
        newMaterial: true,
        newQuiz: true,
        quizResult: true,
        quizActivity: true,
        accountActivity: true,
        systemAlert: true,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Notification preferences updated successfully",
      data: preference,
    });
  } catch (error) {
    console.error("PATCH /api/account/notification-preferences error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to update notification preferences",
        data: null,
      },
      {
        status: 500,
      }
    );
  }
}