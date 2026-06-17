import { NextRequest, NextResponse } from "next/server";

import { getCurrentSessionUser } from "@/lib/auth/session";
import { getUserNotifications } from "@/services/notification.service";

export const dynamic = "force-dynamic";

function getNotificationsErrorMessage(
  error: NonNullable<Awaited<ReturnType<typeof getUserNotifications>>["error"]>
) {
  const messages = {
    USER_ID_REQUIRED: "User id is required",
    USER_NOT_FOUND: "User not found",
  };

  return messages[error];
}

function getNotificationsStatusCode(
  error: NonNullable<Awaited<ReturnType<typeof getUserNotifications>>["error"]>
) {
  if (error === "USER_ID_REQUIRED") {
    return 400;
  }

  return 404;
}

export async function GET(request: NextRequest) {
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

    const isRead = request.nextUrl.searchParams.get("isRead");

    const result = await getUserNotifications({
      userId: currentUser.id,
      isRead,
    });

    if (!result.success) {
      return NextResponse.json(
        {
          success: false,
          message: getNotificationsErrorMessage(result.error),
          data: null,
        },
        {
          status: getNotificationsStatusCode(result.error),
        }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Notifications retrieved successfully",
      data: result.data,
    });
  } catch (error) {
    console.error("GET /api/notifications error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to retrieve notifications",
        data: null,
      },
      {
        status: 500,
      }
    );
  }
}