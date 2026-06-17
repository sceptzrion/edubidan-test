import { ContentType, ModuleStatus } from "@prisma/client";

import { prisma } from "@/lib/prisma";
import type { DashboardSessionUser } from "@/lib/auth/session-user";
import { getDisplayNameParts } from "@/lib/text/name";

export type LecturerStatIconKey = "module" | "quiz" | "students" | "score";

export type LecturerActionIconKey = "add" | "gradebook";

export type LecturerActionBgIconKey = "module" | "graduation";

export interface LecturerDashboardStat {
  label: string;
  value: string;
  iconKey: LecturerStatIconKey;
  color: string;
}

export interface LecturerQuickAction {
  title: string;
  description: string;
  href: string;
  iconKey: LecturerActionIconKey;
  bgIconKey: LecturerActionBgIconKey;
  colorTheme: "primary" | "teal";
}

export interface LecturerRecentActivity {
  id: string;
  text: string;
  highlight: string;
  time: string;
}

export interface LecturerDashboardData {
  lecturerName: string;
  stats: LecturerDashboardStat[];
  quickActions: LecturerQuickAction[];
  recentActivities: LecturerRecentActivity[];
}

type LecturerActivityWithDate = LecturerRecentActivity & {
  createdAt: Date;
};

function formatRelativeTime(date: Date) {
  const diffMs = Date.now() - date.getTime();
  const diffMinutes = Math.max(0, Math.floor(diffMs / (1000 * 60)));

  if (diffMinutes < 1) return "Baru saja";
  if (diffMinutes < 60) return `${diffMinutes} menit lalu`;

  const diffHours = Math.floor(diffMinutes / 60);
  if (diffHours < 24) return `${diffHours} jam lalu`;

  const diffDays = Math.floor(diffHours / 24);
  if (diffDays < 7) return `${diffDays} hari lalu`;

  return new Intl.DateTimeFormat("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date);
}

function getQuickActions(): LecturerQuickAction[] {
  return [
    {
      iconKey: "add",
      bgIconKey: "module",
      title: "Kelola Modul",
      description: "Buat, ubah, dan publikasikan modul pembelajaran.",
      href: "/dashboard/lecturer/modules",
      colorTheme: "primary",
    },
    {
      iconKey: "gradebook",
      bgIconKey: "graduation",
      title: "Tinjau Rekap Nilai",
      description: "Pantau hasil kuis mahasiswa berdasarkan modul.",
      href: "/dashboard/lecturer/gradebook",
      colorTheme: "teal",
    },
  ];
}

function getEmptyStats(): LecturerDashboardStat[] {
  return [
    {
      label: "Modul Saya",
      value: "0",
      iconKey: "module",
      color: "bg-primary/15 text-primary border-primary/20",
    },
    {
      label: "Total Kuis",
      value: "0",
      iconKey: "quiz",
      color: "bg-teal-500/15 text-teal-600 border-teal-500/20",
    },
    {
      label: "Mahasiswa Terdaftar",
      value: "0",
      iconKey: "students",
      color: "bg-blue-500/15 text-blue-600 border-blue-500/20",
    },
    {
      label: "Rata-rata Skor",
      value: "0",
      iconKey: "score",
      color: "bg-amber-500/15 text-amber-500 border-amber-500/20",
    },
  ];
}

function getModuleStatusHighlight(status: ModuleStatus) {
  if (status === ModuleStatus.PUBLIK) {
    return "Publik";
  }

  return "Draft";
}

async function getRelevantLecturerActivities(dosenProfileId: number) {
  const [recentEnrollments, recentQuizAttempts, recentModules] =
    await Promise.all([
      prisma.enrollment.findMany({
        where: {
          isKicked: false,
          module: {
            dosenProfileId,
          },
        },
        orderBy: {
          joinedAt: "desc",
        },
        take: 3,
        select: {
          id: true,
          joinedAt: true,
          user: {
            select: {
              name: true,
            },
          },
          module: {
            select: {
              title: true,
            },
          },
        },
      }),
      prisma.quizAttempt.findMany({
        where: {
          isCompleted: true,
          kuis: {
            content: {
              module: {
                dosenProfileId,
              },
            },
          },
        },
        orderBy: {
          submittedAt: "desc",
        },
        take: 3,
        select: {
          id: true,
          score: true,
          startedAt: true,
          submittedAt: true,
          user: {
            select: {
              name: true,
            },
          },
          kuis: {
            select: {
              title: true,
            },
          },
        },
      }),
      prisma.module.findMany({
        where: {
          dosenProfileId,
        },
        orderBy: {
          updatedAt: "desc",
        },
        take: 3,
        select: {
          id: true,
          title: true,
          status: true,
          updatedAt: true,
        },
      }),
    ]);

  const enrollmentActivities: LecturerActivityWithDate[] =
    recentEnrollments.map((enrollment) => ({
      id: `enrollment-${enrollment.id}`,
      text: `${enrollment.user.name} bergabung pada modul ${enrollment.module.title}`,
      highlight: "Peserta baru",
      time: formatRelativeTime(enrollment.joinedAt),
      createdAt: enrollment.joinedAt,
    }));

  const quizAttemptActivities: LecturerActivityWithDate[] =
    recentQuizAttempts.map((attempt) => {
      const completedAt = attempt.submittedAt ?? attempt.startedAt;
      const roundedScore = Math.round(attempt.score ?? 0);

      return {
        id: `quiz-attempt-${attempt.id}`,
        text: `${attempt.user.name} menyelesaikan kuis ${attempt.kuis.title}`,
        highlight: `Skor: ${roundedScore}`,
        time: formatRelativeTime(completedAt),
        createdAt: completedAt,
      };
    });

  const moduleActivities: LecturerActivityWithDate[] = recentModules.map(
    (module) => ({
      id: `module-${module.id}`,
      text: `Modul ${module.title} diperbarui`,
      highlight: getModuleStatusHighlight(module.status),
      time: formatRelativeTime(module.updatedAt),
      createdAt: module.updatedAt,
    })
  );

  return [
    ...enrollmentActivities,
    ...quizAttemptActivities,
    ...moduleActivities,
  ]
    .sort((firstActivity, secondActivity) => {
      return secondActivity.createdAt.getTime() - firstActivity.createdAt.getTime();
    })
    .slice(0, 3)
    .map(({ createdAt: _createdAt, ...activity }) => activity);
}

export async function getLecturerDashboardData(
  currentUser: DashboardSessionUser
): Promise<LecturerDashboardData> {
  const dosenProfileId = currentUser.dosenProfile?.id;
  const lecturerName = getDisplayNameParts(currentUser.name);

  if (!dosenProfileId) {
    return {
      lecturerName,
      stats: getEmptyStats(),
      quickActions: getQuickActions(),
      recentActivities: [],
    };
  }

  const [moduleCount, quizCount, activeEnrollmentCount, averageScore] =
    await Promise.all([
      prisma.module.count({
        where: {
          dosenProfileId,
        },
      }),
      prisma.moduleContent.count({
        where: {
          kind: ContentType.KUIS,
          module: {
            dosenProfileId,
          },
        },
      }),
      prisma.enrollment.count({
        where: {
          isKicked: false,
          module: {
            dosenProfileId,
          },
        },
      }),
      prisma.quizAttempt.aggregate({
        where: {
          isCompleted: true,
          score: {
            not: null,
          },
          kuis: {
            content: {
              module: {
                dosenProfileId,
              },
            },
          },
        },
        _avg: {
          score: true,
        },
      }),
    ]);

  const roundedAverageScore = Math.round(averageScore._avg.score ?? 0);
  const recentActivities = await getRelevantLecturerActivities(dosenProfileId);

  return {
    lecturerName,
    stats: [
      {
        label: "Modul Saya",
        value: moduleCount.toLocaleString("id-ID"),
        iconKey: "module",
        color: "bg-primary/15 text-primary border-primary/20",
      },
      {
        label: "Total Kuis",
        value: quizCount.toLocaleString("id-ID"),
        iconKey: "quiz",
        color: "bg-teal-500/15 text-teal-600 border-teal-500/20",
      },
      {
        label: "Mahasiswa Terdaftar",
        value: activeEnrollmentCount.toLocaleString("id-ID"),
        iconKey: "students",
        color: "bg-blue-500/15 text-blue-600 border-blue-500/20",
      },
      {
        label: "Rata-rata Skor",
        value: roundedAverageScore.toLocaleString("id-ID"),
        iconKey: "score",
        color: "bg-amber-500/15 text-amber-500 border-amber-500/20",
      },
    ],
    quickActions: getQuickActions(),
    recentActivities,
  };
}