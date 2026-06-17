import {
  ContentType,
  ModuleStatus,
  NotificationType,
  Role,
} from "@prisma/client";

import { prisma } from "@/lib/prisma";
import { createNotificationWithPreference } from "@/services/notification-preference.service";

const enrollmentSelect = {
  id: true,
  userId: true,
  moduleId: true,
  isKicked: true,
  kickReason: true,
  joinedAt: true,
  updatedAt: true,
  user: {
    select: {
      id: true,
      name: true,
      email: true,
      avatarUrl: true,
      phoneNumber: true,
      isActive: true,
      mahasiswaProfile: {
        select: {
          id: true,
          npm: true,
        },
      },
    },
  },
  module: {
    select: {
      id: true,
      title: true,
      description: true,
      bannerUrl: true,
      accessCode: true,
      status: true,
      estimatedMinutes: true,
    },
  },
};

function normalizeRequiredString(value: unknown) {
  if (typeof value !== "string") return null;

  const trimmed = value.trim();

  return trimmed.length > 0 ? trimmed : null;
}

export type ModuleParticipant = {
  enrollmentId: number;
  userId: number;
  name: string;
  email: string;
  npm: string;
  avatarUrl: string | null;
  joinedAt: Date;
  progress: number;
};

export type JoinModuleResult =
  | {
      success: true;
      enrollment: Awaited<ReturnType<typeof getEnrollmentById>>;
      error: null;
    }
  | {
      success: false;
      enrollment: null;
      error:
        | "USER_ID_REQUIRED"
        | "ACCESS_CODE_REQUIRED"
        | "USER_NOT_FOUND"
        | "USER_INACTIVE"
        | "USER_NOT_MAHASISWA"
        | "MODULE_NOT_FOUND"
        | "MODULE_NOT_PUBLISHED"
        | "ALREADY_JOINED";
    };

async function getEnrollmentById(id: number) {
  return prisma.enrollment.findUnique({
    where: {
      id,
    },
    select: enrollmentSelect,
  });
}

async function notifyLecturerStudentJoined(params: {
  lecturerUserId: number;
  moduleId: number;
  moduleTitle: string;
  studentName: string;
  studentNpm?: string | null;
}) {
  const studentIdentity = params.studentNpm
    ? `${params.studentName} (${params.studentNpm})`
    : params.studentName;

  await createNotificationWithPreference({
    userId: params.lecturerUserId,
    moduleId: params.moduleId,
    type: NotificationType.MAHASISWA_BERGABUNG,
    title: "Mahasiswa baru bergabung",
    body: `${studentIdentity} bergabung ke modul ${params.moduleTitle}.`,
    href: `/dashboard/lecturer/modules/${params.moduleId}`,
  });
}

export async function joinModuleByAccessCode(params: {
  userId: unknown;
  accessCode: unknown;
}): Promise<JoinModuleResult> {
  const userId = Number(params.userId);
  const accessCode = normalizeRequiredString(params.accessCode)?.toUpperCase();

  if (!Number.isInteger(userId) || userId <= 0) {
    return {
      success: false,
      enrollment: null,
      error: "USER_ID_REQUIRED",
    };
  }

  if (!accessCode) {
    return {
      success: false,
      enrollment: null,
      error: "ACCESS_CODE_REQUIRED",
    };
  }

  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
    select: {
      id: true,
      name: true,
      role: true,
      isActive: true,
      mahasiswaProfile: {
        select: {
          npm: true,
        },
      },
    },
  });

  if (!user) {
    return {
      success: false,
      enrollment: null,
      error: "USER_NOT_FOUND",
    };
  }

  if (!user.isActive) {
    return {
      success: false,
      enrollment: null,
      error: "USER_INACTIVE",
    };
  }

  if (user.role !== Role.MAHASISWA) {
    return {
      success: false,
      enrollment: null,
      error: "USER_NOT_MAHASISWA",
    };
  }

  const moduleData = await prisma.module.findUnique({
    where: {
      accessCode,
    },
    select: {
      id: true,
      title: true,
      status: true,
      dosenProfile: {
        select: {
          userId: true,
        },
      },
    },
  });

  if (!moduleData) {
    return {
      success: false,
      enrollment: null,
      error: "MODULE_NOT_FOUND",
    };
  }

  if (moduleData.status !== ModuleStatus.PUBLIK) {
    return {
      success: false,
      enrollment: null,
      error: "MODULE_NOT_PUBLISHED",
    };
  }

  const existingEnrollment = await prisma.enrollment.findUnique({
    where: {
      userId_moduleId: {
        userId,
        moduleId: moduleData.id,
      },
    },
    select: {
      id: true,
      isKicked: true,
    },
  });

  if (existingEnrollment && !existingEnrollment.isKicked) {
    return {
      success: false,
      enrollment: null,
      error: "ALREADY_JOINED",
    };
  }

  if (existingEnrollment?.isKicked) {
    const updatedEnrollment = await prisma.enrollment.update({
      where: {
        id: existingEnrollment.id,
      },
      data: {
        isKicked: false,
        kickReason: null,
        joinedAt: new Date(),
      },
      select: {
        id: true,
      },
    });

    const enrollment = await getEnrollmentById(updatedEnrollment.id);

    await notifyLecturerStudentJoined({
      lecturerUserId: moduleData.dosenProfile.userId,
      moduleId: moduleData.id,
      moduleTitle: moduleData.title,
      studentName: user.name,
      studentNpm: user.mahasiswaProfile?.npm,
    });

    return {
      success: true,
      enrollment,
      error: null,
    };
  }

  const createdEnrollment = await prisma.enrollment.create({
    data: {
      userId,
      moduleId: moduleData.id,
    },
    select: {
      id: true,
    },
  });

  const enrollment = await getEnrollmentById(createdEnrollment.id);

  await notifyLecturerStudentJoined({
    lecturerUserId: moduleData.dosenProfile.userId,
    moduleId: moduleData.id,
    moduleTitle: moduleData.title,
    studentName: user.name,
    studentNpm: user.mahasiswaProfile?.npm,
  });

  return {
    success: true,
    enrollment,
    error: null,
  };
}

export async function getModuleParticipants(moduleId: number) {
  return prisma.enrollment.findMany({
    where: {
      moduleId,
    },
    select: enrollmentSelect,
    orderBy: {
      joinedAt: "desc",
    },
  });
}

export async function getActiveModuleParticipantsWithProgress(
  moduleId: number
): Promise<ModuleParticipant[]> {
  const [enrollments, totalMaterials] = await Promise.all([
    prisma.enrollment.findMany({
      where: {
        moduleId,
        isKicked: false,
      },
      select: {
        id: true,
        userId: true,
        joinedAt: true,
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            avatarUrl: true,
            mahasiswaProfile: {
              select: {
                npm: true,
              },
            },
          },
        },
      },
      orderBy: {
        joinedAt: "desc",
      },
    }),
    prisma.moduleContent.count({
      where: {
        moduleId,
        kind: ContentType.MATERI,
      },
    }),
  ]);

  if (enrollments.length === 0) {
    return [];
  }

  const progressRows = await prisma.lessonProgress.findMany({
    where: {
      isCompleted: true,
      userId: {
        in: enrollments.map((enrollment) => enrollment.userId),
      },
      materi: {
        content: {
          moduleId,
        },
      },
    },
    select: {
      userId: true,
      materiId: true,
    },
  });

  const completedByUser = new Map<number, Set<number>>();

  progressRows.forEach((progress) => {
    const currentSet = completedByUser.get(progress.userId) ?? new Set<number>();
    currentSet.add(progress.materiId);
    completedByUser.set(progress.userId, currentSet);
  });

  return enrollments.map((enrollment) => {
    const completedCount = completedByUser.get(enrollment.userId)?.size ?? 0;
    const progress =
      totalMaterials > 0 ? Math.round((completedCount / totalMaterials) * 100) : 0;

    return {
      enrollmentId: enrollment.id,
      userId: enrollment.userId,
      name: enrollment.user.name,
      email: enrollment.user.email,
      npm: enrollment.user.mahasiswaProfile?.npm ?? "-",
      avatarUrl: enrollment.user.avatarUrl,
      joinedAt: enrollment.joinedAt,
      progress,
    };
  });
}

export type UpdateParticipantKickStatusResult =
  | {
      success: true;
      enrollment: Awaited<ReturnType<typeof getEnrollmentById>>;
      error: null;
    }
  | {
      success: false;
      enrollment: null;
      error:
        | "MODULE_NOT_FOUND"
        | "USER_NOT_FOUND"
        | "ENROLLMENT_NOT_FOUND"
        | "KICK_STATUS_REQUIRED";
    };

export async function updateParticipantKickStatus(params: {
  moduleId: number;
  userId: number;
  isKicked: unknown;
  kickReason?: unknown;
}): Promise<UpdateParticipantKickStatusResult> {
  if (typeof params.isKicked !== "boolean") {
    return {
      success: false,
      enrollment: null,
      error: "KICK_STATUS_REQUIRED",
    };
  }

  const moduleData = await prisma.module.findUnique({
    where: {
      id: params.moduleId,
    },
    select: {
      id: true,
    },
  });

  if (!moduleData) {
    return {
      success: false,
      enrollment: null,
      error: "MODULE_NOT_FOUND",
    };
  }

  const user = await prisma.user.findUnique({
    where: {
      id: params.userId,
    },
    select: {
      id: true,
    },
  });

  if (!user) {
    return {
      success: false,
      enrollment: null,
      error: "USER_NOT_FOUND",
    };
  }

  const existingEnrollment = await prisma.enrollment.findUnique({
    where: {
      userId_moduleId: {
        userId: params.userId,
        moduleId: params.moduleId,
      },
    },
    select: {
      id: true,
    },
  });

  if (!existingEnrollment) {
    return {
      success: false,
      enrollment: null,
      error: "ENROLLMENT_NOT_FOUND",
    };
  }

  const kickReason = normalizeRequiredString(params.kickReason);

  const updatedEnrollment = await prisma.enrollment.update({
    where: {
      id: existingEnrollment.id,
    },
    data: {
      isKicked: params.isKicked,
      kickReason: params.isKicked ? kickReason : null,
    },
    select: {
      id: true,
    },
  });

  const enrollment = await getEnrollmentById(updatedEnrollment.id);

  return {
    success: true,
    enrollment,
    error: null,
  };
}