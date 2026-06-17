import { ContentType } from "@prisma/client";

import { prisma } from "@/lib/prisma";
import type {
  LecturerGradebookDetail,
  LecturerGradebookModule,
  LecturerGradebookStudent,
} from "@/data/learning/lecturer/lecturer-gradebook";

export async function getLecturerGradebookModules(
  dosenProfileId: number | null | undefined
): Promise<LecturerGradebookModule[]> {
  if (!dosenProfileId) return [];

  const modules = await prisma.module.findMany({
    where: {
      dosenProfileId,
    },
    orderBy: {
      updatedAt: "desc",
    },
    select: {
      id: true,
      title: true,
      contents: {
        where: {
          kind: ContentType.KUIS,
        },
        select: {
          id: true,
        },
      },
      enrollments: {
        where: {
          isKicked: false,
        },
        select: {
          id: true,
        },
      },
    },
  });

  return modules.map((module) => ({
    id: module.id,
    title: module.title,
    studentCount: module.enrollments.length,
    quizCount: module.contents.length,
  }));
}

export async function getLecturerGradebookDetailData(params: {
  moduleId: number;
  dosenProfileId: number | null | undefined;
}): Promise<LecturerGradebookDetail | null> {
  if (!params.dosenProfileId) return null;

  const moduleData = await prisma.module.findFirst({
    where: {
      id: params.moduleId,
      dosenProfileId: params.dosenProfileId,
    },
    select: {
      id: true,
      title: true,
      contents: {
        where: {
          kind: ContentType.KUIS,
        },
        orderBy: {
          order: "asc",
        },
        select: {
          kuis: {
            select: {
              id: true,
              title: true,
            },
          },
        },
      },
      enrollments: {
        where: {
          isKicked: false,
        },
        orderBy: {
          joinedAt: "asc",
        },
        select: {
          userId: true,
          user: {
            select: {
              name: true,
              mahasiswaProfile: {
                select: {
                  npm: true,
                },
              },
            },
          },
        },
      },
    },
  });

  if (!moduleData) return null;

  const quizzes = moduleData.contents
    .map((content) => content.kuis)
    .filter((quiz): quiz is NonNullable<typeof quiz> => Boolean(quiz));

  const quizIds = quizzes.map((quiz) => quiz.id);
  const userIds = moduleData.enrollments.map((enrollment) => enrollment.userId);

  const attempts =
    quizIds.length > 0 && userIds.length > 0
      ? await prisma.quizAttempt.findMany({
          where: {
            kuisId: {
              in: quizIds,
            },
            userId: {
              in: userIds,
            },
            isCompleted: true,
            submittedAt: {
              not: null,
            },
          },
          orderBy: [
            {
              submittedAt: "desc",
            },
            {
              id: "desc",
            },
          ],
          select: {
            userId: true,
            kuisId: true,
            score: true,
          },
        })
      : [];

  const latestScoreByUserQuiz = new Map<string, number | null>();

  attempts.forEach((attempt) => {
    const key = `${attempt.userId}-${attempt.kuisId}`;

    if (!latestScoreByUserQuiz.has(key)) {
      latestScoreByUserQuiz.set(
        key,
        typeof attempt.score === "number" ? attempt.score : null
      );
    }
  });

  const students: LecturerGradebookStudent[] = moduleData.enrollments.map(
    (enrollment) => ({
      name: enrollment.user.name,
      nim: enrollment.user.mahasiswaProfile?.npm ?? "-",
      scores: quizIds.map((quizId) => {
        const key = `${enrollment.userId}-${quizId}`;

        return latestScoreByUserQuiz.get(key) ?? null;
      }),
    })
  );

  return {
    id: moduleData.id,
    title: moduleData.title,
    quizzes: quizzes.map((quiz) => quiz.title),
    students,
  };
}