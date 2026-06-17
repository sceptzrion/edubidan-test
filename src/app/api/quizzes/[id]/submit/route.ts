import { Role } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

import { submitQuiz } from "@/services/quiz.service";
import { getCurrentSessionUser } from "@/lib/auth/session";

export const dynamic = "force-dynamic";

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

function parseQuizId(id: string) {
  const quizId = Number(id);

  if (!Number.isInteger(quizId) || quizId <= 0) {
    return null;
  }

  return quizId;
}

function getSubmitQuizErrorMessage(
  error: NonNullable<Awaited<ReturnType<typeof submitQuiz>>["error"]>
) {
  const messages = {
    USER_ID_REQUIRED: "User id is required",
    ANSWERS_REQUIRED: "Answers are required",
    DURATION_INVALID: "Duration must be a positive integer or zero",
    USER_NOT_FOUND: "User not found",
    USER_INACTIVE: "User account is inactive",
    USER_NOT_MAHASISWA: "Only mahasiswa can submit quiz",
    QUIZ_NOT_FOUND: "Quiz not found",
    USER_NOT_ENROLLED: "User has not joined this module",
    USER_KICKED: "User has been kicked from this module",
    INVALID_ANSWERS: "Submitted answers are invalid",
  };

  return messages[error];
}

function getSubmitQuizStatusCode(
  error: NonNullable<Awaited<ReturnType<typeof submitQuiz>>["error"]>
) {
  if (
    error === "USER_ID_REQUIRED" ||
    error === "ANSWERS_REQUIRED" ||
    error === "DURATION_INVALID" ||
    error === "INVALID_ANSWERS"
  ) {
    return 400;
  }

  if (error === "USER_NOT_FOUND" || error === "QUIZ_NOT_FOUND") {
    return 404;
  }

  if (
    error === "USER_INACTIVE" ||
    error === "USER_NOT_MAHASISWA" ||
    error === "USER_NOT_ENROLLED" ||
    error === "USER_KICKED"
  ) {
    return 403;
  }

  return 400;
}

export async function POST(request: NextRequest, context: RouteContext) {
  try {
    const currentUser = await getCurrentSessionUser();

    if (!currentUser) {
      return NextResponse.json(
        {
          success: false,
          message: "Authentication required",
          data: null,
        },
        {
          status: 401,
        }
      );
    }

    if (currentUser.role !== Role.MAHASISWA) {
      return NextResponse.json(
        {
          success: false,
          message: "Only mahasiswa can submit quiz",
          data: null,
        },
        {
          status: 403,
        }
      );
    }

    const { id } = await context.params;
    const quizId = parseQuizId(id);

    if (!quizId) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid quiz id",
          data: null,
        },
        {
          status: 400,
        }
      );
    }

    const body = await request.json();

    const result = await submitQuiz({
      kuisId: quizId,
      userId: currentUser.id,
      answers: body.answers,
      durationSeconds: body.durationSeconds,
    });

    if (!result.success) {
      return NextResponse.json(
        {
          success: false,
          message: getSubmitQuizErrorMessage(result.error),
          data: null,
        },
        {
          status: getSubmitQuizStatusCode(result.error),
        }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "Quiz submitted successfully",
        data: result.attempt,
      },
      {
        status: 201,
      }
    );
  } catch (error) {
    console.error("POST /api/quizzes/[id]/submit error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to submit quiz",
        data: null,
      },
      {
        status: 500,
      }
    );
  }
}