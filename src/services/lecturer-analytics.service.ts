import { ContentType } from "@prisma/client";

import { prisma } from "@/lib/prisma";

const PASSING_SCORE = 70;

function roundScore(value: number) {
  return Math.round(value * 100) / 100;
}

function calculateAverage(scores: number[]) {
  if (scores.length === 0) return null;

  const total = scores.reduce((sum, score) => sum + score, 0);

  return roundScore(total / scores.length);
}

function getLatestAttemptKey(userId: number, kuisId: number) {
  return `${userId}-${kuisId}`;
}

export type ModuleGradebookResult =
  | {
      success: true;
      data: {
        module: {
          id: number;
          title: string;
          accessCode: string;
        };
        summary: {
          totalParticipants: number;
          totalQuizzes: number;
          totalCompletedAttempts: number;
          participantsWithAttempt: number;
          averageScore: number | null;
          passingScore: number;
          passRate: number;
        };
        quizzes: Array<{
          id: number;
          title: string;
          totalQuestions: number;
        }>;
        participants: Array<{
          userId: number;
          name: string;
          email: string;
          npm: string | null;
          isKicked: boolean;
          joinedAt: Date;
          completedQuizCount: number;
          averageScore: number | null;
          passedQuizCount: number;
          quizResults: Array<{
            kuisId: number;
            title: string;
            attemptId: number | null;
            score: number | null;
            totalCorrect: number | null;
            totalQuestions: number | null;
            durationSeconds: number | null;
            submittedAt: Date | null;
            isPassed: boolean | null;
          }>;
        }>;
      };
      error: null;
    }
  | {
      success: false;
      data: null;
      error: "MODULE_NOT_FOUND";
    };

export async function getModuleGradebook(
  moduleId: number
): Promise<ModuleGradebookResult> {
  const learningModule = await prisma.module.findUnique({
    where: {
      id: moduleId,
    },
    select: {
      id: true,
      title: true,
      accessCode: true,
      contents: {
        where: {
          kind: ContentType.KUIS,
        },
        select: {
          order: true,
          kuis: {
            select: {
              id: true,
              title: true,
              soals: {
                select: {
                  id: true,
                },
              },
            },
          },
        },
        orderBy: {
          order: "asc",
        },
      },
      enrollments: {
        select: {
          userId: true,
          isKicked: true,
          joinedAt: true,
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              mahasiswaProfile: {
                select: {
                  npm: true,
                },
              },
            },
          },
        },
        orderBy: {
          joinedAt: "asc",
        },
      },
    },
  });

  if (!learningModule) {
    return {
      success: false,
      data: null,
      error: "MODULE_NOT_FOUND",
    };
  }

  const quizzes = learningModule.contents
    .map((content) => content.kuis)
    .filter((quiz): quiz is NonNullable<typeof quiz> => quiz !== null)
    .map((quiz) => ({
      id: quiz.id,
      title: quiz.title,
      totalQuestions: quiz.soals.length,
    }));

  const quizIds = quizzes.map((quiz) => quiz.id);
  const participantIds = learningModule.enrollments.map(
    (enrollment) => enrollment.userId
  );

  const attempts = await prisma.quizAttempt.findMany({
    where: {
      userId: {
        in: participantIds,
      },
      kuisId: {
        in: quizIds,
      },
      isCompleted: true,
    },
    select: {
      id: true,
      userId: true,
      kuisId: true,
      score: true,
      totalCorrect: true,
      totalQuestions: true,
      durationSeconds: true,
      submittedAt: true,
    },
    orderBy: {
      submittedAt: "desc",
    },
  });

  const latestAttemptMap = new Map<string, (typeof attempts)[number]>();

  for (const attempt of attempts) {
    const key = getLatestAttemptKey(attempt.userId, attempt.kuisId);

    if (!latestAttemptMap.has(key)) {
      latestAttemptMap.set(key, attempt);
    }
  }

  const participants = learningModule.enrollments.map((enrollment) => {
    const quizResults = quizzes.map((quiz) => {
      const attempt =
        latestAttemptMap.get(getLatestAttemptKey(enrollment.userId, quiz.id)) ??
        null;

      return {
        kuisId: quiz.id,
        title: quiz.title,
        attemptId: attempt?.id ?? null,
        score: attempt?.score ?? null,
        totalCorrect: attempt?.totalCorrect ?? null,
        totalQuestions: attempt?.totalQuestions ?? null,
        durationSeconds: attempt?.durationSeconds ?? null,
        submittedAt: attempt?.submittedAt ?? null,
        isPassed:
          attempt?.score === null || attempt?.score === undefined
            ? null
            : attempt.score >= PASSING_SCORE,
      };
    });

    const completedScores = quizResults
      .map((result) => result.score)
      .filter((score): score is number => typeof score === "number");

    const passedQuizCount = quizResults.filter(
      (result) => result.isPassed === true
    ).length;

    return {
      userId: enrollment.user.id,
      name: enrollment.user.name,
      email: enrollment.user.email,
      npm: enrollment.user.mahasiswaProfile?.npm ?? null,
      isKicked: enrollment.isKicked,
      joinedAt: enrollment.joinedAt,
      completedQuizCount: completedScores.length,
      averageScore: calculateAverage(completedScores),
      passedQuizCount,
      quizResults,
    };
  });

  const allScores = participants
    .flatMap((participant) =>
      participant.quizResults.map((result) => result.score)
    )
    .filter((score): score is number => typeof score === "number");

  const passedCount = allScores.filter((score) => score >= PASSING_SCORE).length;
  const passRate =
    allScores.length > 0 ? roundScore((passedCount / allScores.length) * 100) : 0;

  const participantsWithAttempt = participants.filter(
    (participant) => participant.completedQuizCount > 0
  ).length;

  return {
    success: true,
    data: {
      module: {
        id: learningModule.id,
        title: learningModule.title,
        accessCode: learningModule.accessCode,
      },
      summary: {
        totalParticipants: participants.length,
        totalQuizzes: quizzes.length,
        totalCompletedAttempts: allScores.length,
        participantsWithAttempt,
        averageScore: calculateAverage(allScores),
        passingScore: PASSING_SCORE,
        passRate,
      },
      quizzes,
      participants,
    },
    error: null,
  };
}

export type QuizAnalysisResult =
  | {
      success: true;
      data: {
        module: {
          id: number;
          title: string;
          accessCode: string;
        };
        summary: {
          totalQuizzes: number;
          totalAttempts: number;
          averageScore: number | null;
          passingScore: number;
          passRate: number;
        };
        quizzes: Array<{
          id: number;
          title: string;
          description: string | null;
          totalQuestions: number;
          totalAttempts: number;
          averageScore: number | null;
          passRate: number;
          questions: Array<{
            id: number;
            questionText: string;
            order: number;
            correctOptionId: number | null;
            totalAnswers: number;
            correctCount: number;
            wrongCount: number;
            correctRate: number;
            options: Array<{
              id: number;
              text: string;
              isCorrect: boolean;
              selectedCount: number;
              selectedRate: number;
            }>;
          }>;
        }>;
      };
      error: null;
    }
  | {
      success: false;
      data: null;
      error: "MODULE_NOT_FOUND";
    };

export async function getModuleQuizAnalysis(
  moduleId: number
): Promise<QuizAnalysisResult> {
  const learningModule = await prisma.module.findUnique({
    where: {
      id: moduleId,
    },
    select: {
      id: true,
      title: true,
      accessCode: true,
      contents: {
        where: {
          kind: ContentType.KUIS,
        },
        select: {
          order: true,
          kuis: {
            select: {
              id: true,
              title: true,
              description: true,
              soals: {
                select: {
                  id: true,
                  questionText: true,
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
              attempts: {
                where: {
                  isCompleted: true,
                },
                select: {
                  id: true,
                  score: true,
                  answers: {
                    select: {
                      soalId: true,
                      optionId: true,
                    },
                  },
                },
              },
            },
          },
        },
        orderBy: {
          order: "asc",
        },
      },
    },
  });

  if (!learningModule) {
    return {
      success: false,
      data: null,
      error: "MODULE_NOT_FOUND",
    };
  }

  const quizzes = learningModule.contents
    .map((content) => content.kuis)
    .filter((quiz): quiz is NonNullable<typeof quiz> => quiz !== null)
    .map((quiz) => {
      const scores = quiz.attempts
        .map((attempt) => attempt.score)
        .filter((score): score is number => typeof score === "number");

      const passedCount = scores.filter((score) => score >= PASSING_SCORE).length;
      const passRate =
        scores.length > 0 ? roundScore((passedCount / scores.length) * 100) : 0;

      const questions = quiz.soals.map((question) => {
        const correctOption =
          question.options.find((option) => option.isCorrect) ?? null;

        const answersForQuestion = quiz.attempts.flatMap((attempt) =>
          attempt.answers.filter((answer) => answer.soalId === question.id)
        );

        const totalAnswers = answersForQuestion.length;
        const correctCount = answersForQuestion.filter(
          (answer) =>
            correctOption !== null && answer.optionId === correctOption.id
        ).length;
        const wrongCount = totalAnswers - correctCount;
        const correctRate =
          totalAnswers > 0
            ? roundScore((correctCount / totalAnswers) * 100)
            : 0;

        const options = question.options.map((option) => {
          const selectedCount = answersForQuestion.filter(
            (answer) => answer.optionId === option.id
          ).length;

          return {
            id: option.id,
            text: option.text,
            isCorrect: option.isCorrect,
            selectedCount,
            selectedRate:
              totalAnswers > 0
                ? roundScore((selectedCount / totalAnswers) * 100)
                : 0,
          };
        });

        return {
          id: question.id,
          questionText: question.questionText,
          order: question.order,
          correctOptionId: correctOption?.id ?? null,
          totalAnswers,
          correctCount,
          wrongCount,
          correctRate,
          options,
        };
      });

      return {
        id: quiz.id,
        title: quiz.title,
        description: quiz.description,
        totalQuestions: quiz.soals.length,
        totalAttempts: quiz.attempts.length,
        averageScore: calculateAverage(scores),
        passRate,
        questions,
      };
    });

  const allScores = learningModule.contents.flatMap((content) => {
    if (!content.kuis) {
      return [];
    }

    return content.kuis.attempts
      .map((attempt) => attempt.score)
      .filter((score): score is number => typeof score === "number");
  });

  const passedCount = allScores.filter((score) => score >= PASSING_SCORE).length;

  return {
    success: true,
    data: {
      module: {
        id: learningModule.id,
        title: learningModule.title,
        accessCode: learningModule.accessCode,
      },
      summary: {
        totalQuizzes: quizzes.length,
        totalAttempts: allScores.length,
        averageScore: calculateAverage(allScores),
        passingScore: PASSING_SCORE,
        passRate:
          allScores.length > 0
            ? roundScore((passedCount / allScores.length) * 100)
            : 0,
      },
      quizzes,
    },
    error: null,
  };
}