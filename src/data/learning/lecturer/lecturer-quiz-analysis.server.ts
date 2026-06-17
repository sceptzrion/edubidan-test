import { ContentType } from "@prisma/client";

import { prisma } from "@/lib/prisma";

export interface LecturerQuizAnalysisOption {
  id: number;
  text: string;
  isCorrect: boolean;
  selectedCount: number;
  selectedRate: number;
}

export interface LecturerQuizAnalysisQuestion {
  id: number;
  questionText: string;
  mediaUrl: string | null;
  order: number;
  totalAnswers: number;
  correctCount: number;
  wrongCount: number;
  correctRate: number;
  options: LecturerQuizAnalysisOption[];
}

export interface LecturerQuizAnalysisQuiz {
  id: number;
  title: string;
  description: string | null;
  totalQuestions: number;
  totalAttempts: number;
  averageScore: number | null;
  highestScore: number | null;
  lowestScore: number | null;
  questions: LecturerQuizAnalysisQuestion[];
}

export interface LecturerQuizAnalysisData {
  module: {
    id: number;
    title: string;
    accessCode: string;
  };
  summary: {
    totalQuizzes: number;
    totalAttempts: number;
    averageScore: number | null;
    highestScore: number | null;
    lowestScore: number | null;
  };
  quizzes: LecturerQuizAnalysisQuiz[];
}

function roundNumber(value: number) {
  return Math.round(value * 100) / 100;
}

function calculateAverage(values: number[]) {
  if (values.length === 0) return null;

  const total = values.reduce((sum, value) => sum + value, 0);

  return roundNumber(total / values.length);
}

function calculateRate(part: number, total: number) {
  if (total <= 0) return 0;

  return roundNumber((part / total) * 100);
}

function getMin(values: number[]) {
  if (values.length === 0) return null;

  return Math.min(...values);
}

function getMax(values: number[]) {
  if (values.length === 0) return null;

  return Math.max(...values);
}

export async function getLecturerQuizAnalysisData(params: {
  moduleId: number;
  dosenProfileId: number | null | undefined;
}): Promise<LecturerQuizAnalysisData | null> {
  if (!params.dosenProfileId) return null;

  const moduleData = await prisma.module.findFirst({
    where: {
      id: params.moduleId,
      dosenProfileId: params.dosenProfileId,
    },
    select: {
      id: true,
      title: true,
      accessCode: true,
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
              description: true,
              soals: {
                orderBy: {
                  order: "asc",
                },
                select: {
                  id: true,
                  questionText: true,
                  mediaUrl: true,
                  order: true,
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
              attempts: {
                where: {
                  isCompleted: true,
                  submittedAt: {
                    not: null,
                  },
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
      },
    },
  });

  if (!moduleData) return null;

  const quizzes = moduleData.contents
    .map((content) => content.kuis)
    .filter((quiz): quiz is NonNullable<typeof quiz> => Boolean(quiz))
    .map((quiz) => {
      const scores = quiz.attempts
        .map((attempt) => attempt.score)
        .filter((score): score is number => typeof score === "number");

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

        const options = question.options.map((option) => {
          const selectedCount = answersForQuestion.filter(
            (answer) => answer.optionId === option.id
          ).length;

          return {
            id: option.id,
            text: option.text,
            isCorrect: option.isCorrect,
            selectedCount,
            selectedRate: calculateRate(selectedCount, totalAnswers),
          };
        });

        return {
          id: question.id,
          questionText: question.questionText,
          mediaUrl: question.mediaUrl,
          order: question.order,
          totalAnswers,
          correctCount,
          wrongCount,
          correctRate: calculateRate(correctCount, totalAnswers),
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
        highestScore: getMax(scores),
        lowestScore: getMin(scores),
        questions,
      };
    });

  const allScores = quizzes
    .flatMap((quiz) => [quiz.highestScore, quiz.lowestScore, quiz.averageScore])
    .filter((score): score is number => typeof score === "number");

  const attemptScores = moduleData.contents
    .flatMap((content) => content.kuis?.attempts ?? [])
    .map((attempt) => attempt.score)
    .filter((score): score is number => typeof score === "number");

  return {
    module: {
      id: moduleData.id,
      title: moduleData.title,
      accessCode: moduleData.accessCode,
    },
    summary: {
      totalQuizzes: quizzes.length,
      totalAttempts: quizzes.reduce(
        (total, quiz) => total + quiz.totalAttempts,
        0
      ),
      averageScore: calculateAverage(attemptScores),
      highestScore: getMax(allScores),
      lowestScore: getMin(allScores),
    },
    quizzes,
  };
}