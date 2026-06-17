import { ContentType, VideoSource } from "@prisma/client";

import { prisma } from "@/lib/prisma";
import { getDisplayNameParts } from "@/lib/text/name";
import {
  extractYouTubeVideoId,
  formatMinutes,
  formatRoundedModuleMinutes,
} from "@/lib/video/youtube";
import type { LearningItem, LearningModule } from "@/types/learning";

const fallbackModuleImage =
  "https://images.unsplash.com/photo-1559757175-5700dde675bc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080";

type LatestQuizAttemptSummary = {
  score: number | null;
  totalCorrect: number;
  totalQuestions: number;
};

export interface StudentModuleCardItem {
  id: number;
  title: string;
  desc: string;
  img: string;
  progress: number;
  lessons: number;
  quizzes: number;
  duration: string;
  instructor: string;
}

export interface StudentDashboardLearningProgressItem {
  id: number;
  title: string;
  progress: number;
  totalItems: number;
  completedItems: number;
}

export interface StudentDashboardPendingQuizItem {
  id: number;
  moduleId: number;
  title: string;
  status: string;
}

export interface StudentDashboardData {
  studentName: ReturnType<typeof getDisplayNameParts>;
  stats: {
    enrolledModules: number;
    completedMaterials: number;
    completedQuizzes: number;
    pendingQuizzes: number;
  };
  learningProgress: StudentDashboardLearningProgressItem[];
  pendingQuizzes: StudentDashboardPendingQuizItem[];
}

export interface StudentLessonData {
  module: LearningModule;
  item: LearningItem;
  itemIndex: number;
  previousItem: LearningItem | null;
  nextItem: LearningItem | null;
}

function formatDuration(minutes: number | null) {
  return formatMinutes(minutes);
}

function calculateModuleProgress(params: {
  totalMaterials: number;
  completedMaterials: number;
  totalQuizzes: number;
  completedQuizzes: number;
}) {
  const totalItems = params.totalMaterials + params.totalQuizzes;
  const completedItems = params.completedMaterials + params.completedQuizzes;

  if (totalItems === 0) {
    return {
      totalItems,
      completedItems,
      progress: 0,
    };
  }

  return {
    totalItems,
    completedItems,
    progress: Math.round((completedItems / totalItems) * 100),
  };
}

function getEmbedThumbnail(videoUrl: string | null) {
  const videoId = extractYouTubeVideoId(videoUrl);

  return videoId
    ? `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`
    : fallbackModuleImage;
}

async function getStudentEnrollmentData(userId: number) {
  const enrollments = await prisma.enrollment.findMany({
    where: {
      userId,
      isKicked: false,
    },
    orderBy: {
      joinedAt: "desc",
    },
    select: {
      module: {
        select: {
          id: true,
          title: true,
          description: true,
          bannerUrl: true,
          estimatedMinutes: true,
          objectives: {
            orderBy: {
              order: "asc",
            },
            select: {
              text: true,
            },
          },
          dosenProfile: {
            select: {
              user: {
                select: {
                  name: true,
                  email: true,
                },
              },
            },
          },
          enrollments: {
            where: {
              isKicked: false,
            },
            select: {
              user: {
                select: {
                  id: true,
                  name: true,
                  email: true,
                },
              },
            },
          },
          contents: {
            orderBy: {
              order: "asc",
            },
            select: {
              id: true,
              kind: true,
              materi: {
                select: {
                  id: true,
                  title: true,
                  description: true,
                  videoSource: true,
                  videoUrl: true,
                  estimatedMinutes: true,
                  objectives: {
                    orderBy: {
                      order: "asc",
                    },
                    select: {
                      text: true,
                    },
                  },
                  tools: {
                    select: {
                      name: true,
                    },
                  },
                },
              },
              kuis: {
                select: {
                  id: true,
                  title: true,
                  description: true,
                  hasTimeLimit: true,
                  timeLimitMinutes: true,
                  soals: {
                    orderBy: {
                      order: "asc",
                    },
                    select: {
                      id: true,
                      questionText: true,
                      mediaUrl: true,
                      options: {
                        orderBy: {
                          order: "asc",
                        },
                        select: {
                          id: true,
                          text: true,
                          isCorrect: true,
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
  });

  const materialIds = enrollments.flatMap((enrollment) =>
    enrollment.module.contents
      .map((content) => content.materi?.id)
      .filter((id): id is number => typeof id === "number")
  );

  const quizIds = enrollments.flatMap((enrollment) =>
    enrollment.module.contents
      .map((content) => content.kuis?.id)
      .filter((id): id is number => typeof id === "number")
  );

  const [completedMaterials, completedQuizAttempts] = await Promise.all([
    materialIds.length > 0
      ? prisma.lessonProgress.findMany({
          where: {
            userId,
            materiId: {
              in: materialIds,
            },
            isCompleted: true,
          },
          select: {
            materiId: true,
          },
        })
      : [],
    quizIds.length > 0
      ? prisma.quizAttempt.findMany({
          where: {
            userId,
            kuisId: {
              in: quizIds,
            },
            isCompleted: true,
            submittedAt: {
              not: null,
            },
          },
          orderBy: {
            submittedAt: "desc",
          },
          select: {
            kuisId: true,
            score: true,
            totalCorrect: true,
            totalQuestions: true,
            submittedAt: true,
          },
        })
      : [],
  ]);

  const latestQuizAttemptByQuizId = new Map<number, LatestQuizAttemptSummary>();

  completedQuizAttempts.forEach((attempt) => {
    if (!latestQuizAttemptByQuizId.has(attempt.kuisId)) {
      latestQuizAttemptByQuizId.set(attempt.kuisId, {
        score: attempt.score,
        totalCorrect: attempt.totalCorrect ?? 0,
        totalQuestions: attempt.totalQuestions ?? 0,
      });
    }
  });

  return {
    enrollments,
    completedMaterialIds: new Set(
      completedMaterials.map((progress) => progress.materiId)
    ),
    completedQuizIds: new Set(
      completedQuizAttempts.map((attempt) => attempt.kuisId)
    ),
    latestQuizAttemptByQuizId,
  };
}

function calculateLearningModuleDuration(items: LearningItem[]) {
  const totalMinutes = items.reduce((total, item) => {
    return total + (item.estimatedMinutes > 0 ? item.estimatedMinutes : 0);
  }, 0);

  return formatRoundedModuleMinutes(totalMinutes);
}

function mapModuleToLearningModule(params: {
  enrollment: Awaited<
    ReturnType<typeof getStudentEnrollmentData>
  >["enrollments"][number];
  completedMaterialIds: Set<number>;
  completedQuizIds: Set<number>;
  latestQuizAttemptByQuizId: Map<number, LatestQuizAttemptSummary>;
}): LearningModule {
  const moduleData = params.enrollment.module;

  const items: LearningItem[] = moduleData.contents.flatMap((content) => {
    if (content.kind === ContentType.MATERI && content.materi) {
      const isCompleted = params.completedMaterialIds.has(content.materi.id);

      const item: LearningItem = {
        id: content.materi.id,
        kind: "materi",
        title: content.materi.title,
        description: content.materi.description ?? "",
        duration: formatDuration(content.materi.estimatedMinutes),
        estimatedMinutes: content.materi.estimatedMinutes ?? 0,
        isCompleted,
        thumbnailUrl:
          content.materi.videoSource === VideoSource.EMBED
            ? getEmbedThumbnail(content.materi.videoUrl)
            : moduleData.bannerUrl ?? fallbackModuleImage,
        videoSource:
          content.materi.videoSource === VideoSource.UPLOAD ? "upload" : "embed",
        videoUrl: content.materi.videoUrl ?? undefined,
        objectives: content.materi.objectives.map((objective) => objective.text),
        tools: content.materi.tools.map((tool) => tool.name),
      };

      return [item];
    }

    if (content.kind === ContentType.KUIS && content.kuis) {
      const latestAttempt = params.latestQuizAttemptByQuizId.get(
        content.kuis.id
      );

      const questions = content.kuis.soals.map((soal) => {
        const correctIndex = soal.options.findIndex((option) => option.isCorrect);

        return {
          id: soal.id,
          question: soal.questionText,
          mediaUrl: soal.mediaUrl ?? undefined,
          options: soal.options.map((option) => option.text),
          correct: correctIndex >= 0 ? correctIndex : 0,
        };
      });

      const item: LearningItem = {
        id: content.kuis.id,
        kind: "kuis",
        title: content.kuis.title,
        description: content.kuis.description ?? "",
        duration: content.kuis.hasTimeLimit
          ? formatDuration(content.kuis.timeLimitMinutes)
          : "Tanpa Batas Waktu",
        estimatedMinutes: content.kuis.timeLimitMinutes ?? 0,
        isCompleted: params.completedQuizIds.has(content.kuis.id),
        timeLimitMinutes: content.kuis.timeLimitMinutes ?? undefined,
        latestScore: latestAttempt?.score ?? null,
        latestCorrectCount: latestAttempt?.totalCorrect ?? null,
        latestTotalQuestions: latestAttempt?.totalQuestions ?? null,
        questions,
      };

      return [item];
    }

    return [];
  });

  const materialCount = items.filter((item) => item.kind === "materi").length;
  const completedMaterialCount = items.filter(
    (item) => item.kind === "materi" && item.isCompleted
  ).length;
  const quizCount = items.filter((item) => item.kind === "kuis").length;
  const completedQuizCount = items.filter(
    (item) => item.kind === "kuis" && item.isCompleted
  ).length;

  const progress = calculateModuleProgress({
    totalMaterials: materialCount,
    completedMaterials: completedMaterialCount,
    totalQuizzes: quizCount,
    completedQuizzes: completedQuizCount,
  });

  return {
    id: moduleData.id,
    title: moduleData.title,
    description: moduleData.description ?? "Belum ada deskripsi modul.",
    banner: moduleData.bannerUrl ?? fallbackModuleImage,
    thumbnail: moduleData.bannerUrl ?? fallbackModuleImage,
    progress: progress.progress,
    estimatedTime: calculateLearningModuleDuration(items),
    instructor: {
      name: moduleData.dosenProfile.user.name,
      email: moduleData.dosenProfile.user.email,
    },
    objectives: moduleData.objectives.map((objective) => objective.text),
    participants: moduleData.enrollments.map((enrollment) => ({
      id: enrollment.user.id,
      name: enrollment.user.name,
      email: enrollment.user.email,
    })),
    items,
  };
}

export async function getStudentModuleCards(
  userId: number
): Promise<StudentModuleCardItem[]> {
  const {
    enrollments,
    completedMaterialIds,
    completedQuizIds,
    latestQuizAttemptByQuizId,
  } = await getStudentEnrollmentData(userId);

  return enrollments.map((enrollment) => {
    const learningModule = mapModuleToLearningModule({
      enrollment,
      completedMaterialIds,
      completedQuizIds,
      latestQuizAttemptByQuizId,
    });

    const lessons = learningModule.items.filter(
      (item) => item.kind === "materi"
    ).length;
    const quizzes = learningModule.items.filter(
      (item) => item.kind === "kuis"
    ).length;

    return {
      id: learningModule.id,
      title: learningModule.title,
      desc: learningModule.description,
      img: learningModule.thumbnail,
      progress: learningModule.progress,
      lessons,
      quizzes,
      duration: learningModule.estimatedTime,
      instructor: learningModule.instructor.name,
    };
  });
}

export async function getStudentDashboardData(params: {
  userId: number;
  studentFullName: string;
}): Promise<StudentDashboardData> {
  const {
    enrollments,
    completedMaterialIds,
    completedQuizIds,
    latestQuizAttemptByQuizId,
  } = await getStudentEnrollmentData(params.userId);

  const learningProgress: StudentDashboardLearningProgressItem[] = [];
  const pendingQuizzes: StudentDashboardPendingQuizItem[] = [];

  let totalCompletedMaterials = 0;
  let totalCompletedQuizzes = 0;

  enrollments.forEach((enrollment) => {
    const learningModule = mapModuleToLearningModule({
      enrollment,
      completedMaterialIds,
      completedQuizIds,
      latestQuizAttemptByQuizId,
    });

    const completedMaterials = learningModule.items.filter(
      (item) => item.kind === "materi" && item.isCompleted
    ).length;
    const completedQuizzes = learningModule.items.filter(
      (item) => item.kind === "kuis" && item.isCompleted
    ).length;

    totalCompletedMaterials += completedMaterials;
    totalCompletedQuizzes += completedQuizzes;

    learningProgress.push({
      id: learningModule.id,
      title: learningModule.title,
      progress: learningModule.progress,
      totalItems: learningModule.items.length,
      completedItems: learningModule.items.filter((item) => item.isCompleted)
        .length,
    });

    learningModule.items.forEach((item) => {
      if (item.kind === "kuis" && !item.isCompleted) {
        pendingQuizzes.push({
          id: item.id,
          moduleId: learningModule.id,
          title: item.title,
          status: "Belum Dikerjakan",
        });
      }
    });
  });

  return {
    studentName: getDisplayNameParts(params.studentFullName),
    stats: {
      enrolledModules: enrollments.length,
      completedMaterials: totalCompletedMaterials,
      completedQuizzes: totalCompletedQuizzes,
      pendingQuizzes: pendingQuizzes.length,
    },
    learningProgress,
    pendingQuizzes: pendingQuizzes.slice(0, 5),
  };
}

export async function getStudentModuleDetailData(params: {
  userId: number;
  moduleId: number;
}): Promise<LearningModule | null> {
  const {
    enrollments,
    completedMaterialIds,
    completedQuizIds,
    latestQuizAttemptByQuizId,
  } = await getStudentEnrollmentData(params.userId);

  const enrollment = enrollments.find(
    (item) => item.module.id === params.moduleId
  );

  if (!enrollment) return null;

  return mapModuleToLearningModule({
    enrollment,
    completedMaterialIds,
    completedQuizIds,
    latestQuizAttemptByQuizId,
  });
}

export async function getStudentLessonData(params: {
  userId: number;
  moduleId: number;
  itemId: number;
}): Promise<StudentLessonData | null> {
  const learningModule = await getStudentModuleDetailData({
    userId: params.userId,
    moduleId: params.moduleId,
  });

  if (!learningModule) return null;

  const itemIndex = learningModule.items.findIndex(
    (item) => item.id === params.itemId
  );
  const item = learningModule.items[itemIndex];

  if (!item) return null;

  return {
    module: learningModule,
    item,
    itemIndex,
    previousItem: learningModule.items[itemIndex - 1] ?? null,
    nextItem: learningModule.items[itemIndex + 1] ?? null,
  };
}