import { Role } from "@prisma/client";
import { NextResponse } from "next/server";

import { getLatestQuizReview } from "@/services/quiz.service";
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

function getReviewErrorMessage(
  error: NonNullable<Awaited<ReturnType<typeof getLatestQuizReview>>["error"]>
) {
  const messages = {
    USER_ID_REQUIRED: "User id is required",
    QUIZ_NOT_FOUND: "Quiz not found",
    ATTEMPT_NOT_FOUND: "Quiz attempt not found",
  };

  return messages[error];
}

function getReviewStatusCode(
  error: NonNullable<Awaited<ReturnType<typeof getLatestQuizReview>>["error"]>
) {
  if (error === "USER_ID_REQUIRED") {
    return 400;
  }

  return 404;
}

export async function GET(_request: Request, context: RouteContext) {
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
          message: "Only mahasiswa can review quiz",
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

    const result = await getLatestQuizReview({
      kuisId: quizId,
      userId: currentUser.id,
    });

    if (!result.success) {
      return NextResponse.json(
        {
          success: false,
          message: getReviewErrorMessage(result.error),
          data: null,
        },
        {
          status: getReviewStatusCode(result.error),
        }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Quiz review retrieved successfully",
      data: result.attempt,
    });
  } catch (error) {
    console.error("GET /api/quizzes/[id]/review error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to retrieve quiz review",
        data: null,
      },
      {
        status: 500,
      }
    );
  }
}