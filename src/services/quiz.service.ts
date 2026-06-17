import { NotificationType, Prisma, Role } from "@prisma/client";

import { prisma } from "@/lib/prisma";
import { createNotificationWithPreference } from "@/services/notification-preference.service";

const quizDetailSelect = {
  id: true,
  title: true,
  description: true,
  hasTimeLimit: true,
  timeLimitMinutes: true,
  createdAt: true,
  updatedAt: true,
  content: {
    select: {
      id: true,
      moduleId: true,
      order: true,
      module: {
        select: {
          id: true,
          title: true,
          accessCode: true,
          status: true,
        },
      },
    },
  },
  soals: {
    select: {
      id: true,
      questionText: true,
      mediaUrl: true,
      order: true,
      options: {
        select: {
          id: true,
          text: true,
          order: true,
        },
        orderBy: {
          order: "asc",
        },
      },
    },
    orderBy: {
      order: "asc",
    },
  },
} satisfies Prisma.KuisSelect;

const quizReviewSelect = {
  id: true,
  userId: true,
  kuisId: true,
  score: true,
  totalCorrect: true,
  totalQuestions: true,
  durationSeconds: true,
  startedAt: true,
  submittedAt: true,
  isCompleted: true,
  kuis: {
    select: {
      id: true,
      title: true,
      description: true,
      hasTimeLimit: true,
      timeLimitMinutes: true,
      content: {
        select: {
          moduleId: true,
          module: {
            select: {
              id: true,
              title: true,
            },
          },
        },
      },
    },
  },
  answers: {
    select: {
      id: true,
      soalId: true,
      optionId: true,
      soal: {
        select: {
          id: true,
          questionText: true,
          mediaUrl: true,
          order: true,
          options: {
            select: {
              id: true,
              text: true,
              isCorrect: true,
              order: true,
            },
            orderBy: {
              order: "asc",
            },
          },
        },
      },
      option: {
        select: {
          id: true,
          text: true,
          isCorrect: true,
          order: true,
        },
      },
    },
    orderBy: {
      soal: {
        order: "asc",
      },
    },
  },
} satisfies Prisma.QuizAttemptSelect;

type QuizDetail = Prisma.KuisGetPayload<{
  select: typeof quizDetailSelect;
}>;

type QuizReview = Prisma.QuizAttemptGetPayload<{
  select: typeof quizReviewSelect;
}>;

function mapQuizDetail(quiz: QuizDetail) {
  return {
    ...quiz,
    totalQuestions: quiz.soals.length,
  };
}

function mapQuizReview(attempt: QuizReview) {
  return {
    ...attempt,
    answers: attempt.answers.map((answer) => {
      const correctOption =
        answer.soal.options.find((option) => option.isCorrect) ?? null;

      return {
        ...answer,
        correctOption,
        isCorrect:
          answer.optionId !== null &&
          correctOption !== null &&
          answer.optionId === correctOption.id,
      };
    }),
  };
}

function normalizeAnswers(value: unknown) {
  if (!Array.isArray(value)) return null;

  const answers = value
    .map((item) => {
      if (!item || typeof item !== "object") return null;

      const answer = item as {
        soalId?: unknown;
        optionId?: unknown;
      };

      const soalId = Number(answer.soalId);
      const optionId =
        answer.optionId === null || answer.optionId === undefined
          ? null
          : Number(answer.optionId);

      if (!Number.isInteger(soalId) || soalId <= 0) return null;

      if (
        optionId !== null &&
        (!Number.isInteger(optionId) || optionId <= 0)
      ) {
        return null;
      }

      return {
        soalId,
        optionId,
      };
    })
    .filter(
      (answer): answer is { soalId: number; optionId: number | null } =>
        answer !== null
    );

  return answers;
}

async function notifyLecturerQuizSubmitted(params: {
  lecturerUserId: number;
  moduleId: number;
  moduleTitle: string;
  quizTitle: string;
  studentName: string;
  studentNpm?: string | null;
  score: number;
  totalCorrect: number;
  totalQuestions: number;
}) {
  const studentIdentity = params.studentNpm
    ? `${params.studentName} (${params.studentNpm})`
    : params.studentName;

  await createNotificationWithPreference({
    userId: params.lecturerUserId,
    moduleId: params.moduleId,
    type: NotificationType.KUIS_DIKERJAKAN,
    title: "Kuis telah dikerjakan",
    body: `${studentIdentity} mengerjakan ${params.quizTitle} pada modul ${params.moduleTitle}. Nilai: ${params.score.toFixed(
      1
    )} (${params.totalCorrect}/${params.totalQuestions} benar).`,
    href: `/dashboard/lecturer/gradebook/${params.moduleId}`,
  });
}

export async function getQuizById(id: number) {
  const quiz = await prisma.kuis.findUnique({
    where: {
      id,
    },
    select: quizDetailSelect,
  });

  if (!quiz) {
    return null;
  }

  return mapQuizDetail(quiz);
}

export type SubmitQuizResult =
  | {
      success: true;
      attempt: ReturnType<typeof mapQuizReview>;
      error: null;
    }
  | {
      success: false;
      attempt: null;
      error:
        | "USER_ID_REQUIRED"
        | "ANSWERS_REQUIRED"
        | "DURATION_INVALID"
        | "USER_NOT_FOUND"
        | "USER_INACTIVE"
        | "USER_NOT_MAHASISWA"
        | "QUIZ_NOT_FOUND"
        | "USER_NOT_ENROLLED"
        | "USER_KICKED"
        | "INVALID_ANSWERS";
    };

export async function submitQuiz(params: {
  userId: unknown;
  kuisId: number;
  answers: unknown;
  durationSeconds?: unknown;
}): Promise<SubmitQuizResult> {
  const userId = Number(params.userId);
  const durationSeconds =
    params.durationSeconds === undefined || params.durationSeconds === null
      ? null
      : Number(params.durationSeconds);
  const normalizedAnswers = normalizeAnswers(params.answers);

  if (!Number.isInteger(userId) || userId <= 0) {
    return {
      success: false,
      attempt: null,
      error: "USER_ID_REQUIRED",
    };
  }

  if (!normalizedAnswers || normalizedAnswers.length === 0) {
    return {
      success: false,
      attempt: null,
      error: "ANSWERS_REQUIRED",
    };
  }

  if (
    durationSeconds !== null &&
    (!Number.isInteger(durationSeconds) || durationSeconds < 0)
  ) {
    return {
      success: false,
      attempt: null,
      error: "DURATION_INVALID",
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
      attempt: null,
      error: "USER_NOT_FOUND",
    };
  }

  if (!user.isActive) {
    return {
      success: false,
      attempt: null,
      error: "USER_INACTIVE",
    };
  }

  if (user.role !== Role.MAHASISWA) {
    return {
      success: false,
      attempt: null,
      error: "USER_NOT_MAHASISWA",
    };
  }

  const quiz = await prisma.kuis.findUnique({
    where: {
      id: params.kuisId,
    },
    select: {
      id: true,
      title: true,
      content: {
        select: {
          moduleId: true,
          module: {
            select: {
              id: true,
              title: true,
              dosenProfile: {
                select: {
                  userId: true,
                },
              },
            },
          },
        },
      },
      soals: {
        select: {
          id: true,
          options: {
            select: {
              id: true,
              isCorrect: true,
            },
          },
        },
        orderBy: {
          order: "asc",
        },
      },
    },
  });

  if (!quiz) {
    return {
      success: false,
      attempt: null,
      error: "QUIZ_NOT_FOUND",
    };
  }

  const enrollment = await prisma.enrollment.findUnique({
    where: {
      userId_moduleId: {
        userId,
        moduleId: quiz.content.moduleId,
      },
    },
    select: {
      id: true,
      isKicked: true,
    },
  });

  if (!enrollment) {
    return {
      success: false,
      attempt: null,
      error: "USER_NOT_ENROLLED",
    };
  }

  if (enrollment.isKicked) {
    return {
      success: false,
      attempt: null,
      error: "USER_KICKED",
    };
  }

  const questionMap = new Map(quiz.soals.map((soal) => [soal.id, soal]));
  const submittedAnswerMap = new Map(
    normalizedAnswers.map((answer) => [answer.soalId, answer.optionId])
  );

  const isAnswerValid = normalizedAnswers.every((answer) => {
    const question = questionMap.get(answer.soalId);

    if (!question) return false;

    if (answer.optionId === null) return true;

    return question.options.some((option) => option.id === answer.optionId);
  });

  if (!isAnswerValid) {
    return {
      success: false,
      attempt: null,
      error: "INVALID_ANSWERS",
    };
  }

  let totalCorrect = 0;

  const answersToCreate = quiz.soals.map((soal) => {
    const selectedOptionId = submittedAnswerMap.get(soal.id) ?? null;
    const correctOption = soal.options.find((option) => option.isCorrect);

    if (selectedOptionId !== null && selectedOptionId === correctOption?.id) {
      totalCorrect += 1;
    }

    return {
      soalId: soal.id,
      optionId: selectedOptionId,
    };
  });

  const totalQuestions = quiz.soals.length;
  const score = totalQuestions > 0 ? (totalCorrect / totalQuestions) * 100 : 0;

  const attempt = await prisma.quizAttempt.create({
    data: {
      userId,
      kuisId: quiz.id,
      score,
      totalCorrect,
      totalQuestions,
      durationSeconds,
      submittedAt: new Date(),
      isCompleted: true,
      answers: {
        create: answersToCreate,
      },
    },
    select: {
      id: true,
    },
  });

  const review = await prisma.quizAttempt.findUnique({
    where: {
      id: attempt.id,
    },
    select: quizReviewSelect,
  });

  if (!review) {
    return {
      success: false,
      attempt: null,
      error: "QUIZ_NOT_FOUND",
    };
  }

  await notifyLecturerQuizSubmitted({
    lecturerUserId: quiz.content.module.dosenProfile.userId,
    moduleId: quiz.content.module.id,
    moduleTitle: quiz.content.module.title,
    quizTitle: quiz.title,
    studentName: user.name,
    studentNpm: user.mahasiswaProfile?.npm,
    score,
    totalCorrect,
    totalQuestions,
  });

  return {
    success: true,
    attempt: mapQuizReview(review),
    error: null,
  };
}

export type GetQuizReviewResult =
  | {
      success: true;
      attempt: ReturnType<typeof mapQuizReview>;
      error: null;
    }
  | {
      success: false;
      attempt: null;
      error: "USER_ID_REQUIRED" | "QUIZ_NOT_FOUND" | "ATTEMPT_NOT_FOUND";
    };

export async function getLatestQuizReview(params: {
  userId: unknown;
  kuisId: number;
}): Promise<GetQuizReviewResult> {
  const userId = Number(params.userId);

  if (!Number.isInteger(userId) || userId <= 0) {
    return {
      success: false,
      attempt: null,
      error: "USER_ID_REQUIRED",
    };
  }

  const quiz = await prisma.kuis.findUnique({
    where: {
      id: params.kuisId,
    },
    select: {
      id: true,
    },
  });

  if (!quiz) {
    return {
      success: false,
      attempt: null,
      error: "QUIZ_NOT_FOUND",
    };
  }

  const attempt = await prisma.quizAttempt.findFirst({
    where: {
      userId,
      kuisId: params.kuisId,
      isCompleted: true,
    },
    select: quizReviewSelect,
    orderBy: {
      submittedAt: "desc",
    },
  });

  if (!attempt) {
    return {
      success: false,
      attempt: null,
      error: "ATTEMPT_NOT_FOUND",
    };
  }

  return {
    success: true,
    attempt: mapQuizReview(attempt),
    error: null,
  };
}