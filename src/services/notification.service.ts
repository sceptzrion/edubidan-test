import { Prisma } from "@prisma/client";

import { prisma } from "@/lib/prisma";

const notificationSelect = {
  id: true,
  userId: true,
  moduleId: true,
  type: true,
  title: true,
  body: true,
  href: true,
  isRead: true,
  readAt: true,
  createdAt: true,
  module: {
    select: {
      id: true,
      title: true,
      accessCode: true,
      status: true,
    },
  },
} satisfies Prisma.NotificationSelect;

type NotificationItem = Prisma.NotificationGetPayload<{
  select: typeof notificationSelect;
}>;

function normalizeBooleanFilter(value: string | null) {
  if (value === "true") return true;
  if (value === "false") return false;

  return null;
}

export type GetUserNotificationsResult =
  | {
      success: true;
      data: {
        notifications: NotificationItem[];
        unreadCount: number;
        totalCount: number;
      };
      error: null;
    }
  | {
      success: false;
      data: null;
      error: "USER_ID_REQUIRED" | "USER_NOT_FOUND";
    };

export async function getUserNotifications(params: {
  userId: unknown;
  isRead?: string | null;
}): Promise<GetUserNotificationsResult> {
  const userId = Number(params.userId);
  const isRead = normalizeBooleanFilter(params.isRead ?? null);

  if (!Number.isInteger(userId) || userId <= 0) {
    return {
      success: false,
      data: null,
      error: "USER_ID_REQUIRED",
    };
  }

  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
    select: {
      id: true,
    },
  });

  if (!user) {
    return {
      success: false,
      data: null,
      error: "USER_NOT_FOUND",
    };
  }

  const where: Prisma.NotificationWhereInput = {
    userId,
    ...(typeof isRead === "boolean" ? { isRead } : {}),
  };

  const [notifications, unreadCount, totalCount] = await Promise.all([
    prisma.notification.findMany({
      where,
      select: notificationSelect,
      orderBy: {
        createdAt: "desc",
      },
    }),
    prisma.notification.count({
      where: {
        userId,
        isRead: false,
      },
    }),
    prisma.notification.count({
      where: {
        userId,
      },
    }),
  ]);

  return {
    success: true,
    data: {
      notifications,
      unreadCount,
      totalCount,
    },
    error: null,
  };
}

export type MarkNotificationReadResult =
  | {
      success: true;
      notification: NotificationItem;
      error: null;
    }
  | {
      success: false;
      notification: null;
      error:
        | "USER_ID_REQUIRED"
        | "NOTIFICATION_ID_REQUIRED"
        | "NOTIFICATION_NOT_FOUND";
    };

export async function markNotificationAsRead(params: {
  notificationId: number;
  userId: unknown;
}): Promise<MarkNotificationReadResult> {
  const userId = Number(params.userId);

  if (!Number.isInteger(params.notificationId) || params.notificationId <= 0) {
    return {
      success: false,
      notification: null,
      error: "NOTIFICATION_ID_REQUIRED",
    };
  }

  if (!Number.isInteger(userId) || userId <= 0) {
    return {
      success: false,
      notification: null,
      error: "USER_ID_REQUIRED",
    };
  }

  const existingNotification = await prisma.notification.findFirst({
    where: {
      id: params.notificationId,
      userId,
    },
    select: {
      id: true,
      readAt: true,
    },
  });

  if (!existingNotification) {
    return {
      success: false,
      notification: null,
      error: "NOTIFICATION_NOT_FOUND",
    };
  }

  const notification = await prisma.notification.update({
    where: {
      id: params.notificationId,
    },
    data: {
      isRead: true,
      readAt: existingNotification.readAt ?? new Date(),
    },
    select: notificationSelect,
  });

  return {
    success: true,
    notification,
    error: null,
  };
}

export type MarkAllNotificationsReadResult =
  | {
      success: true;
      data: {
        updatedCount: number;
        unreadCount: number;
        notifications: NotificationItem[];
      };
      error: null;
    }
  | {
      success: false;
      data: null;
      error: "USER_ID_REQUIRED" | "USER_NOT_FOUND";
    };

export async function markAllNotificationsAsRead(params: {
  userId: unknown;
}): Promise<MarkAllNotificationsReadResult> {
  const userId = Number(params.userId);

  if (!Number.isInteger(userId) || userId <= 0) {
    return {
      success: false,
      data: null,
      error: "USER_ID_REQUIRED",
    };
  }

  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
    select: {
      id: true,
    },
  });

  if (!user) {
    return {
      success: false,
      data: null,
      error: "USER_NOT_FOUND",
    };
  }

  const result = await prisma.notification.updateMany({
    where: {
      userId,
      isRead: false,
    },
    data: {
      isRead: true,
      readAt: new Date(),
    },
  });

  const notifications = await prisma.notification.findMany({
    where: {
      userId,
    },
    select: notificationSelect,
    orderBy: {
      createdAt: "desc",
    },
  });

  return {
    success: true,
    data: {
      updatedCount: result.count,
      unreadCount: 0,
      notifications,
    },
    error: null,
  };
}