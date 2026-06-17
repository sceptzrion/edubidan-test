import { Role } from "@prisma/client";
import { notFound } from "next/navigation";

import { LecturerQuizPreviewClient } from "@/components/dashboard/lecturer/modules/quiz-preview/LecturerQuizPreviewClient";
import { getLecturerQuizPreviewData } from "@/data/learning/lecturer/lecturer-quiz-preview.server";
import { requireRole } from "@/lib/auth/guards";

type LecturerQuizPreviewPageProps = {
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

export default async function LecturerQuizPreviewPage({
  params,
}: LecturerQuizPreviewPageProps) {
  const currentUser = await requireRole("/dashboard/lecturer/modules", [
    Role.DOSEN,
  ]);

  const { id, quizId } = await params;
  const moduleId = parsePositiveId(id);
  const parsedQuizId = parsePositiveId(quizId);

  if (!moduleId || !parsedQuizId) {
    notFound();
  }

  const data = await getLecturerQuizPreviewData({
    moduleId,
    quizId: parsedQuizId,
    dosenProfileId: currentUser.dosenProfile?.id,
  });

  if (!data) {
    notFound();
  }

  return <LecturerQuizPreviewClient moduleId={String(moduleId)} data={data} />;
}