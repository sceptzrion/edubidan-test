import { Role } from "@prisma/client";
import { notFound } from "next/navigation";

import { LecturerQuizAnalysisPageContent } from "@/components/dashboard/lecturer/gradebook/LecturerQuizAnalysisPageContent";
import { getLecturerQuizAnalysisData } from "@/data/learning/lecturer/lecturer-quiz-analysis.server";
import { requireRole } from "@/lib/auth/guards";

type LecturerQuizAnalysisPageProps = {
  params: Promise<{
    id: string;
  }>;
};

function parseModuleId(value: string) {
  const moduleId = Number(value);

  if (!Number.isInteger(moduleId) || moduleId <= 0) {
    return null;
  }

  return moduleId;
}

export default async function LecturerQuizAnalysisPage({
  params,
}: LecturerQuizAnalysisPageProps) {
  const currentUser = await requireRole("/dashboard/lecturer/gradebook", [
    Role.DOSEN,
  ]);

  const { id } = await params;
  const moduleId = parseModuleId(id);

  if (!moduleId) {
    notFound();
  }

  const data = await getLecturerQuizAnalysisData({
    moduleId,
    dosenProfileId: currentUser.dosenProfile?.id,
  });

  if (!data) {
    notFound();
  }

  return <LecturerQuizAnalysisPageContent data={data} />;
}