import { Role } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

import {
  deleteQuiz,
  getManagedQuizById,
  updateQuiz,
} from "@/services/quiz-management.service";
import { getQuizById } from "@/services/quiz.service";
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

function getUpdateQuizErrorMessage(
  error: NonNullable<Awaited<ReturnType<typeof updateQuiz>>["error"]>
) {
  const messages = {
    QUIZ_NOT_FOUND: "Quiz not found",
    TITLE_REQUIRED: "Title is required",
    TIME_LIMIT_INVALID: "Time limit must be a positive integer",
    QUESTIONS_INVALID: "Quiz questions are invalid",
  };

  return messages[error];
}

async function ensureLecturerOwnsQuiz(quizId: number) {
  const currentUser = await getCurrentSessionUser();

  if (!currentUser) {
    return {
      success: false as const,
      status: 401,
      message: "Authentication required",
    };
  }

  if (currentUser.role !== Role.DOSEN) {
    return {
      success: false as const,
      status: 403,
      message: "Only lecturers can manage quizzes",
    };
  }

  if (!currentUser.dosenProfile?.id) {
    return {
      success: false as const,
      status: 403,
      message: "Dosen profile not found",
    };
  }

  const quiz = await getManagedQuizById(quizId);

  if (!quiz || quiz.content.module.dosenProfileId !== currentUser.dosenProfile.id) {
    return {
      success: false as const,
      status: 404,
      message: "Quiz not found or not owned by lecturer",
    };
  }

  return {
    success: true as const,
    status: 200,
    message: "OK",
  };
}

export async function GET(_request: Request, context: RouteContext) {
  try {
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

    const quiz = await getQuizById(quizId);

    if (!quiz) {
      return NextResponse.json(
        {
          success: false,
          message: "Quiz not found",
          data: null,
        },
        {
          status: 404,
        }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Quiz retrieved successfully",
      data: quiz,
    });
  } catch (error) {
    console.error("GET /api/quizzes/[id] error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to retrieve quiz",
        data: null,
      },
      {
        status: 500,
      }
    );
  }
}

export async function PATCH(request: NextRequest, context: RouteContext) {
  try {
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

    const ownership = await ensureLecturerOwnsQuiz(quizId);

    if (!ownership.success) {
      return NextResponse.json(
        {
          success: false,
          message: ownership.message,
          data: null,
        },
        {
          status: ownership.status,
        }
      );
    }

    const body = await request.json();

    const result = await updateQuiz({
      id: quizId,
      title: body.title,
      description: body.description,
      hasTimeLimit: body.hasTimeLimit,
      timeLimitMinutes: body.timeLimitMinutes,
      questions: body.questions,
    });

    if (!result.success) {
      return NextResponse.json(
        {
          success: false,
          message: getUpdateQuizErrorMessage(result.error),
          data: null,
        },
        {
          status: result.error === "QUIZ_NOT_FOUND" ? 404 : 400,
        }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Quiz updated successfully",
      data: result.quiz,
    });
  } catch (error) {
    console.error("PATCH /api/quizzes/[id] error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to update quiz",
        data: null,
      },
      {
        status: 500,
      }
    );
  }
}

export async function DELETE(_request: NextRequest, context: RouteContext) {
  try {
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

    const ownership = await ensureLecturerOwnsQuiz(quizId);

    if (!ownership.success) {
      return NextResponse.json(
        {
          success: false,
          message: ownership.message,
          data: null,
        },
        {
          status: ownership.status,
        }
      );
    }

    const result = await deleteQuiz(quizId);

    if (!result.success) {
      return NextResponse.json(
        {
          success: false,
          message: "Quiz not found",
          data: null,
        },
        {
          status: 404,
        }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Quiz deleted successfully",
      data: {
        id: result.deletedQuizId,
        contentId: result.deletedContentId,
      },
    });
  } catch (error) {
    console.error("DELETE /api/quizzes/[id] error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to delete quiz",
        data: null,
      },
      {
        status: 500,
      }
    );
  }
}