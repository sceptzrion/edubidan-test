import { NotificationType } from "@prisma/client";

import { prisma } from "@/lib/prisma";

type NotificationPreferenceKey =
  | "moduleUpdate"
  | "newMaterial"
  | "newQuiz"
  | "quizResult"
  | "quizActivity"
  | "accountActivity"
  | "systemAlert";

type NotificationPayload = {
  userId: number;
  moduleId?: number | null;
  type: NotificationType;
  title: string;
  body: string;
  href?: string | null;
};

const notificationPreferenceMap: Record<
  NotificationType,
  NotificationPreferenceKey
> = {
  MATERI_BARU: "newMaterial",
  KUIS_BARU: "newQuiz",
  HASIL_KUIS: "quizResult",
  GABUNG_MODUL: "moduleUpdate",
  KUIS_DIKERJAKAN: "quizActivity",
  MODUL_DIPUBLIKASI: "moduleUpdate",
  MODUL_DIPERBARUI: "moduleUpdate",
  MAHASISWA_BARU: "accountActivity",
  MAHASISWA_BERGABUNG: "accountActivity",
  AKUN_DIBUAT: "accountActivity",
  AKUN_DIAKTIFKAN: "accountActivity",
  AKUN_DINONAKTIFKAN: "accountActivity",
  SYSTEM_ALERT: "systemAlert",
};

async function getUserNotificationPreference(userId: number) {
  return prisma.notifPreference.findUnique({
    where: {
      userId,
    },
    select: {
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

export async function canCreateNotificationForUser(params: {
  userId: number;
  type: NotificationType;
}) {
  const preferenceKey = notificationPreferenceMap[params.type];
  const preference = await getUserNotificationPreference(params.userId);

  if (!preference) {
    return true;
  }

  return preference[preferenceKey] !== false;
}

export async function filterUserIdsByNotificationPreference(params: {
  userIds: number[];
  type: NotificationType;
}) {
  if (params.userIds.length === 0) {
    return [];
  }

  const preferenceKey = notificationPreferenceMap[params.type];

  const preferences = await prisma.notifPreference.findMany({
    where: {
      userId: {
        in: params.userIds,
      },
    },
    select: {
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

  const preferenceByUserId = new Map(
    preferences.map((preference) => [preference.userId, preference])
  );

  return params.userIds.filter((userId) => {
    const preference = preferenceByUserId.get(userId);

    if (!preference) {
      return true;
    }

    return preference[preferenceKey] !== false;
  });
}

export async function createNotificationWithPreference(
  payload: NotificationPayload
) {
  const isAllowed = await canCreateNotificationForUser({
    userId: payload.userId,
    type: payload.type,
  });

  if (!isAllowed) {
    return null;
  }

  return prisma.notification.create({
    data: {
      userId: payload.userId,
      moduleId: payload.moduleId,
      type: payload.type,
      title: payload.title,
      body: payload.body,
      href: payload.href,
    },
  });
}