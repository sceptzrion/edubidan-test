import { ContentType, Prisma } from "@prisma/client";

import { prisma } from "@/lib/prisma";
import { deleteCloudinaryAsset } from "@/services/media/cloudinary.service";

const managedQuizSelect = {
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
          dosenProfileId: true,
        },
      },
    },
  },
  soals: {
    select: {
      id: true,
      questionText: true,
      mediaUrl: true,
      mediaPublicId: true,
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
    orderBy: {
      order: "asc",
    },
  },
} satisfies Prisma.KuisSelect;

export type ManagedQuiz = Prisma.KuisGetPayload<{
  select: typeof managedQuizSelect;
}>;

type NormalizedOption = {
  id: number | null;
  text: string;
  isCorrect: boolean;
  order: number;
};

type NormalizedQuestion = {
  id: number | null;
  questionText: string;
  mediaUrl: string | null;
  mediaPublicId: string | null;
  order: number;
  options: NormalizedOption[];
};

type ExistingQuestion = {
  id: number;
  mediaPublicId: string | null;
  options: Array<{
    id: number;
  }>;
};

function normalizePositiveId(value: unknown) {
  const id = Number(value);

  if (!Number.isInteger(id) || id <= 0) return null;

  return id;
}

function normalizeRequiredString(value: unknown) {
  if (typeof value !== "string") return null;

  const trimmed = value.trim();

  return trimmed.length > 0 ? trimmed : null;
}

function normalizeOptionalString(value: unknown) {
  if (value === undefined) return undefined;
  if (value === null) return null;
  if (typeof value !== "string") return undefined;

  const trimmed = value.trim();

  return trimmed.length > 0 ? trimmed : null;
}

function normalizeBoolean(value: unknown, fallback = false) {
  if (typeof value === "boolean") return value;

  return fallback;
}

function normalizeTimeLimit(value: unknown, hasTimeLimit: boolean) {
  if (!hasTimeLimit) return null;

  const minutes = Number(value);

  if (!Number.isInteger(minutes) || minutes <= 0) {
    return null;
  }

  return minutes;
}

function normalizeQuestions(value: unknown): NormalizedQuestion[] {
  if (!Array.isArray(value)) return [];

  return value
    .map((item, questionIndex) => {
      if (!item || typeof item !== "object") return null;

      const question = item as {
        id?: unknown;
        questionText?: unknown;
        mediaUrl?: unknown;
        mediaPublicId?: unknown;
        options?: unknown;
        correctOptionId?: unknown;
      };

      const id = normalizePositiveId(question.id);
      const questionText = normalizeRequiredString(question.questionText);
      const mediaUrl = normalizeOptionalString(question.mediaUrl) ?? null;
      const mediaPublicId =
        normalizeOptionalString(question.mediaPublicId) ?? null;

      if (!questionText || !Array.isArray(question.options)) {
        return null;
      }

      const correctOptionId = normalizePositiveId(question.correctOptionId);

      const options = question.options
        .map((optionItem, optionIndex) => {
          if (!optionItem || typeof optionItem !== "object") return null;

          const option = optionItem as {
            id?: unknown;
            text?: unknown;
          };

          const optionId = normalizePositiveId(option.id);
          const text = normalizeRequiredString(option.text);

          if (!text) return null;

          return {
            id: optionId,
            text,
            isCorrect:
              correctOptionId !== null &&
              optionId !== null &&
              optionId === correctOptionId,
            order: optionIndex + 1,
          };
        })
        .filter((option): option is NormalizedOption => option !== null);

      if (options.length < 2) return null;

      const hasCorrectOption = options.some((option) => option.isCorrect);

      return {
        id,
        questionText,
        mediaUrl,
        mediaPublicId,
        order: questionIndex + 1,
        options: hasCorrectOption
          ? options
          : options.map((option, index) => ({
              ...option,
              isCorrect: index === 0,
            })),
      };
    })
    .filter((question): question is NormalizedQuestion => question !== null);
}

function getQuestionMediaPublicIds(
  questions: Array<{ mediaPublicId: string | null }>
) {
  return questions
    .map((question) => question.mediaPublicId)
    .filter((publicId): publicId is string => Boolean(publicId));
}

async function deleteQuestionImages(publicIds: string[]) {
  const uniquePublicIds = Array.from(new Set(publicIds));

  await Promise.allSettled(
    uniquePublicIds.map((publicId) => deleteCloudinaryAsset(publicId, "image"))
  );
}

function getRemovedMediaPublicIds(params: {
  existingQuestions: ExistingQuestion[];
  nextQuestions: NormalizedQuestion[];
}) {
  const { existingQuestions, nextQuestions } = params;
  const removedPublicIds: string[] = [];

  const nextQuestionsById = new Map<number, NormalizedQuestion>();

  nextQuestions.forEach((question) => {
    if (question.id !== null) {
      nextQuestionsById.set(question.id, question);
    }
  });

  existingQuestions.forEach((existingQuestion) => {
    const nextQuestion = nextQuestionsById.get(existingQuestion.id);

    if (!existingQuestion.mediaPublicId) return;

    if (!nextQuestion) {
      removedPublicIds.push(existingQuestion.mediaPublicId);
      return;
    }

    if (nextQuestion.mediaPublicId !== existingQuestion.mediaPublicId) {
      removedPublicIds.push(existingQuestion.mediaPublicId);
    }
  });

  return removedPublicIds;
}

async function syncQuestionOptions(params: {
  tx: Prisma.TransactionClient;
  soalId: number;
  options: NormalizedOption[];
}) {
  const { tx, soalId, options } = params;

  const existingOptions = await tx.soalOption.findMany({
    where: {
      soalId,
    },
    select: {
      id: true,
    },
  });

  const existingOptionIds = new Set(
    existingOptions.map((option) => option.id)
  );
  const keptOptionIds: number[] = [];

  for (const option of options) {
    const shouldUpdateExisting =
      option.id !== null && existingOptionIds.has(option.id);

    if (shouldUpdateExisting && option.id !== null) {
      await tx.soalOption.update({
        where: {
          id: option.id,
        },
        data: {
          text: option.text,
          isCorrect: option.isCorrect,
          order: option.order,
        },
      });

      keptOptionIds.push(option.id);
      continue;
    }

    const createdOption = await tx.soalOption.create({
      data: {
        soalId,
        text: option.text,
        isCorrect: option.isCorrect,
        order: option.order,
      },
      select: {
        id: true,
      },
    });

    keptOptionIds.push(createdOption.id);
  }

  const removedOptionIds = existingOptions
    .map((option) => option.id)
    .filter((optionId) => !keptOptionIds.includes(optionId));

  if (removedOptionIds.length === 0) return;

  await tx.attemptAnswer.updateMany({
    where: {
      optionId: {
        in: removedOptionIds,
      },
    },
    data: {
      optionId: null,
    },
  });

  await tx.soalOption.deleteMany({
    where: {
      id: {
        in: removedOptionIds,
      },
    },
  });
}

async function syncQuestions(params: {
  tx: Prisma.TransactionClient;
  kuisId: number;
  questions: NormalizedQuestion[];
}) {
  const { tx, kuisId, questions } = params;

  const existingQuestions = await tx.soal.findMany({
    where: {
      kuisId,
    },
    select: {
      id: true,
      mediaPublicId: true,
      options: {
        select: {
          id: true,
        },
      },
    },
    orderBy: {
      order: "asc",
    },
  });

  const existingQuestionIds = new Set(
    existingQuestions.map((question) => question.id)
  );
  const keptQuestionIds: number[] = [];

  for (const question of questions) {
    const shouldUpdateExisting =
      question.id !== null && existingQuestionIds.has(question.id);

    if (shouldUpdateExisting && question.id !== null) {
      await tx.soal.update({
        where: {
          id: question.id,
        },
        data: {
          questionText: question.questionText,
          mediaUrl: question.mediaUrl,
          mediaPublicId: question.mediaPublicId,
          order: question.order,
        },
      });

      await syncQuestionOptions({
        tx,
        soalId: question.id,
        options: question.options,
      });

      keptQuestionIds.push(question.id);
      continue;
    }

    const createdQuestion = await tx.soal.create({
      data: {
        kuisId,
        questionText: question.questionText,
        mediaUrl: question.mediaUrl,
        mediaPublicId: question.mediaPublicId,
        order: question.order,
        options: {
          create: question.options.map((option) => ({
            text: option.text,
            isCorrect: option.isCorrect,
            order: option.order,
          })),
        },
      },
      select: {
        id: true,
      },
    });

    keptQuestionIds.push(createdQuestion.id);
  }

  const removedQuestionIds = existingQuestions
    .map((question) => question.id)
    .filter((questionId) => !keptQuestionIds.includes(questionId));

  if (removedQuestionIds.length === 0) {
    return existingQuestions;
  }

  await tx.attemptAnswer.deleteMany({
    where: {
      soalId: {
        in: removedQuestionIds,
      },
    },
  });

  await tx.soalOption.deleteMany({
    where: {
      soalId: {
        in: removedQuestionIds,
      },
    },
  });

  await tx.soal.deleteMany({
    where: {
      id: {
        in: removedQuestionIds,
      },
    },
  });

  return existingQuestions;
}

async function getNextContentOrder(moduleId: number) {
  const aggregate = await prisma.moduleContent.aggregate({
    where: {
      moduleId,
    },
    _max: {
      order: true,
    },
  });

  return (aggregate._max.order ?? 0) + 1;
}

export async function getManagedQuizById(id: number) {
  return prisma.kuis.findUnique({
    where: {
      id,
    },
    select: managedQuizSelect,
  });
}

export type CreateQuizResult =
  | {
      success: true;
      quiz: ManagedQuiz | null;
      error: null;
    }
  | {
      success: false;
      quiz: null;
      error:
        | "MODULE_NOT_FOUND"
        | "TITLE_REQUIRED"
        | "TIME_LIMIT_INVALID"
        | "QUESTIONS_INVALID";
    };

export async function createQuiz(params: {
  moduleId: number;
  title: unknown;
  description?: unknown;
  hasTimeLimit?: unknown;
  timeLimitMinutes?: unknown;
  questions?: unknown;
}): Promise<CreateQuizResult> {
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
      quiz: null,
      error: "MODULE_NOT_FOUND",
    };
  }

  const title = normalizeRequiredString(params.title);
  const description = normalizeOptionalString(params.description);
  const hasTimeLimit = normalizeBoolean(params.hasTimeLimit);
  const timeLimitMinutes = normalizeTimeLimit(
    params.timeLimitMinutes,
    hasTimeLimit
  );
  const questions = normalizeQuestions(params.questions);

  if (!title) {
    return {
      success: false,
      quiz: null,
      error: "TITLE_REQUIRED",
    };
  }

  if (hasTimeLimit && timeLimitMinutes === null) {
    return {
      success: false,
      quiz: null,
      error: "TIME_LIMIT_INVALID",
    };
  }

  if (questions.length === 0) {
    return {
      success: false,
      quiz: null,
      error: "QUESTIONS_INVALID",
    };
  }

  const order = await getNextContentOrder(params.moduleId);

  const createdContent = await prisma.moduleContent.create({
    data: {
      moduleId: params.moduleId,
      kind: ContentType.KUIS,
      order,
      kuis: {
        create: {
          title,
          description,
          hasTimeLimit,
          timeLimitMinutes,
          soals: {
            create: questions.map((question) => ({
              questionText: question.questionText,
              mediaUrl: question.mediaUrl,
              mediaPublicId: question.mediaPublicId,
              order: question.order,
              options: {
                create: question.options.map((option) => ({
                  text: option.text,
                  isCorrect: option.isCorrect,
                  order: option.order,
                })),
              },
            })),
          },
        },
      },
    },
    select: {
      kuis: {
        select: {
          id: true,
        },
      },
    },
  });

  if (!createdContent.kuis) {
    return {
      success: false,
      quiz: null,
      error: "MODULE_NOT_FOUND",
    };
  }

  const quiz = await getManagedQuizById(createdContent.kuis.id);

  return {
    success: true,
    quiz,
    error: null,
  };
}

export type UpdateQuizResult =
  | {
      success: true;
      quiz: ManagedQuiz | null;
      error: null;
    }
  | {
      success: false;
      quiz: null;
      error:
        | "QUIZ_NOT_FOUND"
        | "TITLE_REQUIRED"
        | "TIME_LIMIT_INVALID"
        | "QUESTIONS_INVALID";
    };

export async function updateQuiz(params: {
  id: number;
  title?: unknown;
  description?: unknown;
  hasTimeLimit?: unknown;
  timeLimitMinutes?: unknown;
  questions?: unknown;
}): Promise<UpdateQuizResult> {
  const existingQuiz = await prisma.kuis.findUnique({
    where: {
      id: params.id,
    },
    select: {
      id: true,
      soals: {
        select: {
          id: true,
          mediaPublicId: true,
          options: {
            select: {
              id: true,
            },
          },
        },
      },
    },
  });

  if (!existingQuiz) {
    return {
      success: false,
      quiz: null,
      error: "QUIZ_NOT_FOUND",
    };
  }

  const data: Prisma.KuisUpdateInput = {};

  if (params.title !== undefined) {
    const title = normalizeRequiredString(params.title);

    if (!title) {
      return {
        success: false,
        quiz: null,
        error: "TITLE_REQUIRED",
      };
    }

    data.title = title;
  }

  if (params.description !== undefined) {
    data.description = normalizeOptionalString(params.description);
  }

  const nextHasTimeLimit =
    params.hasTimeLimit === undefined
      ? undefined
      : normalizeBoolean(params.hasTimeLimit);

  if (nextHasTimeLimit !== undefined) {
    data.hasTimeLimit = nextHasTimeLimit;
    data.timeLimitMinutes = normalizeTimeLimit(
      params.timeLimitMinutes,
      nextHasTimeLimit
    );

    if (nextHasTimeLimit && data.timeLimitMinutes === null) {
      return {
        success: false,
        quiz: null,
        error: "TIME_LIMIT_INVALID",
      };
    }
  } else if (params.timeLimitMinutes !== undefined) {
    const minutes = Number(params.timeLimitMinutes);

    if (!Number.isInteger(minutes) || minutes <= 0) {
      return {
        success: false,
        quiz: null,
        error: "TIME_LIMIT_INVALID",
      };
    }

    data.timeLimitMinutes = minutes;
  }

  const normalizedQuestions =
    params.questions === undefined ? null : normalizeQuestions(params.questions);

  if (params.questions !== undefined && normalizedQuestions?.length === 0) {
    return {
      success: false,
      quiz: null,
      error: "QUESTIONS_INVALID",
    };
  }

  const removedMediaPublicIds =
    normalizedQuestions === null
      ? []
      : getRemovedMediaPublicIds({
          existingQuestions: existingQuiz.soals,
          nextQuestions: normalizedQuestions,
        });

  await prisma.$transaction(async (tx) => {
    await tx.kuis.update({
      where: {
        id: params.id,
      },
      data,
    });

    if (normalizedQuestions !== null) {
      await syncQuestions({
        tx,
        kuisId: params.id,
        questions: normalizedQuestions,
      });
    }
  });

  await deleteQuestionImages(removedMediaPublicIds);

  const quiz = await getManagedQuizById(params.id);

  return {
    success: true,
    quiz,
    error: null,
  };
}

export type DeleteQuizResult =
  | {
      success: true;
      deletedQuizId: number;
      deletedContentId: number;
      error: null;
    }
  | {
      success: false;
      deletedQuizId: null;
      deletedContentId: null;
      error: "QUIZ_NOT_FOUND";
    };

export async function deleteQuiz(id: number): Promise<DeleteQuizResult> {
  const quiz = await prisma.kuis.findUnique({
    where: {
      id,
    },
    select: {
      id: true,
      contentId: true,
      soals: {
        select: {
          mediaPublicId: true,
        },
      },
    },
  });

  if (!quiz) {
    return {
      success: false,
      deletedQuizId: null,
      deletedContentId: null,
      error: "QUIZ_NOT_FOUND",
    };
  }

  const mediaPublicIds = getQuestionMediaPublicIds(quiz.soals);

  await prisma.moduleContent.delete({
    where: {
      id: quiz.contentId,
    },
  });

  await deleteQuestionImages(mediaPublicIds);

  return {
    success: true,
    deletedQuizId: quiz.id,
    deletedContentId: quiz.contentId,
    error: null,
  };
}