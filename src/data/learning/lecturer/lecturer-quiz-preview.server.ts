import { ContentType } from "@prisma/client";

import { prisma } from "@/lib/prisma";
import type {
  LecturerQuizLeaderboardItem,
  LecturerQuizPreviewData,
  LecturerQuizQuestionStat,
} from "@/data/learning/lecturer/lecturer-quiz-preview";

function roundNumber(value: number) {
  return Math.round(value * 100) / 100;
}

function calculateAverage(scores: number[]) {
  if (scores.length === 0) return null;

  return roundNumber(scores.reduce((total, score) => total + score, 0) / scores.length);
}

function getMin(scores: number[]) {
  if (scores.length === 0) return null;

  return Math.min(...scores);
}

function getMax(scores: number[]) {
  if (scores.length === 0) return null;

  return Math.max(...scores);
}

function calculateRate(part: number, total: number) {
  if (total <= 0) return 0;

  return roundNumber((part / total) * 100);
}

function formatDuration(seconds: number | null) {
  if (!seconds || seconds <= 0) {
    return "-";
  }

  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;

  return `${String(minutes).padStart(2, "0")}:${String(remainingSeconds).padStart(2, "0")}`;
}

function formatQuizDuration(hasTimeLimit: boolean, minutes: number | null) {
  if (!hasTimeLimit) {
    return "Tanpa batas waktu";
  }

  return minutes ? `${minutes} menit` : "-";
}

export async function getLecturerQuizPreviewData(params: {
  moduleId: number;
  quizId: number;
  dosenProfileId: number | null | undefined;
}): Promise<LecturerQuizPreviewData | null> {
  if (!params.dosenProfileId) return null;

  const moduleData = await prisma.module.findFirst({
    where: {
      id: params.moduleId,
      dosenProfileId: params.dosenProfileId,
      contents: {
        some: {
          kind: ContentType.KUIS,
          kuis: {
            id: params.quizId,
          },
        },
      },
    },
    select: {
      id: true,
    },
  });

  if (!moduleData) return null;

  const quiz = await prisma.kuis.findUnique({
    where: {
      id: params.quizId,
    },
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
      attempts: {
        where: {
          isCompleted: true,
          submittedAt: {
            not: null,
          },
        },
        orderBy: [
          {
            score: "desc",
          },
          {
            durationSeconds: "asc",
          },
          {
            submittedAt: "asc",
          },
        ],
        select: {
          id: true,
          userId: true,
          score: true,
          durationSeconds: true,
          submittedAt: true,
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
          answers: {
            select: {
              soalId: true,
              optionId: true,
            },
          },
        },
      },
    },
  });

  if (!quiz) return null;

  const scores = quiz.attempts
    .map((attempt) => attempt.score)
    .filter((score): score is number => typeof score === "number");

  const leaderboard: LecturerQuizLeaderboardItem[] = quiz.attempts
    .filter((attempt) => typeof attempt.score === "number")
    .map((attempt, index) => ({
      rank: index + 1,
      name: attempt.user.name,
      nim: attempt.user.mahasiswaProfile?.npm ?? "-",
      score: attempt.score ?? 0,
      time: formatDuration(attempt.durationSeconds),
    }));

  const questionStats: LecturerQuizQuestionStat[] = quiz.soals.map((question) => {
    const correctOption = question.options.find((option) => option.isCorrect);
    const answersForQuestion = quiz.attempts.flatMap((attempt) =>
      attempt.answers.filter((answer) => answer.soalId === question.id)
    );
    const totalAnswers = answersForQuestion.length;

    return {
      id: question.id,
      questionText: question.questionText,
      mediaUrl: question.mediaUrl,
      correctOptionId: String(correctOption?.id ?? ""),
      options: question.options.map((option) => {
        const pickedCount = answersForQuestion.filter(
          (answer) => answer.optionId === option.id
        ).length;

        return {
          id: String(option.id),
          text: option.text,
          pickedCount,
          percentage: calculateRate(pickedCount, totalAnswers),
        };
      }),
    };
  });

  return {
    quizInfo: {
      title: quiz.title,
      duration: formatQuizDuration(quiz.hasTimeLimit, quiz.timeLimitMinutes),
      totalQuestions: quiz.soals.length,
    },
    generalStats: {
      averageScore: calculateAverage(scores),
      highestScore: getMax(scores),
      lowestScore: getMin(scores),
      totalParticipants: quiz.attempts.length,
    },
    leaderboard,
    questionStats,
  };
}