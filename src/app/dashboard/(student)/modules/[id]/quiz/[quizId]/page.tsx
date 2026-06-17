import { Role } from "@prisma/client";
import { notFound } from "next/navigation";

import { StudentQuizClient } from "@/components/dashboard/student/modules/quiz/StudentQuizClient";
import { getStudentQuizData } from "@/data/learning/student/student-quiz.server";
import { requireRole } from "@/lib/auth/guards";

type StudentQuizPageProps = {
  params: Promise<{
    id: string;
    quizId: string;
  }>;
};

function parsePositiveId(value: string) {
  const id = Number(value);

  if (!Number.isInteger(id) || id <= 0) {
    return null;
  }

  return id;
}

export default async function StudentQuizPage({ params }: StudentQuizPageProps) {
  const currentUser = await requireRole("/dashboard/modules", [Role.MAHASISWA]);

  const { id, quizId } = await params;
  const moduleId = parsePositiveId(id);
  const parsedQuizId = parsePositiveId(quizId);

  if (!moduleId || !parsedQuizId) {
    notFound();
  }

  const data = await getStudentQuizData({
    userId: currentUser.id,
    moduleId,
    quizId: parsedQuizId,
  });

  if (!data) {
    notFound();
  }

  return <StudentQuizClient data={data} />;
}