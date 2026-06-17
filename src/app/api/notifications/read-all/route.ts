import { NextResponse } from "next/server";

import { getCurrentSessionUser } from "@/lib/auth/session";
import { markAllNotificationsAsRead } from "@/services/notification.service";

export const dynamic = "force-dynamic";

function getReadAllErrorMessage(
  error: NonNullable<
    Awaited<ReturnType<typeof markAllNotificationsAsRead>>["error"]
  >
) {
  const messages = {
    USER_ID_REQUIRED: "User id is required",
    USER_NOT_FOUND: "User not found",
  };

  return messages[error];
}

function getReadAllStatusCode(
  error: NonNullable<
    Awaited<ReturnType<typeof markAllNotificationsAsRead>>["error"]
  >
) {
  if (error === "USER_ID_REQUIRED") {
    return 400;
  }

  return 404;
}

export async function PATCH() {
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

    const result = await markAllNotificationsAsRead({
      userId: currentUser.id,
    });

    if (!result.success) {
      return NextResponse.json(
        {
          success: false,
          message: getReadAllErrorMessage(result.error),
          data: null,
        },
        {
          status: getReadAllStatusCode(result.error),
        }
      );
    }

    return NextResponse.json({
      success: true,
      message: "All notifications marked as read",
      data: result.data,
    });
  } catch (error) {
    console.error("PATCH /api/notifications/read-all error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to mark all notifications as read",
        data: null,
      },
      {
        status: 500,
      }
    );
  }
}