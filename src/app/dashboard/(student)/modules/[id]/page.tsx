import { Role } from "@prisma/client";
import { notFound } from "next/navigation";

import { StudentModuleDetailClient } from "@/components/dashboard/student/modules/detail/StudentModuleDetailClient";
import { getStudentModuleDetailData } from "@/data/learning/student/student-learning.server";
import { requireRole } from "@/lib/auth/guards";

type StudentModuleDetailPageProps = {
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

export default async function StudentModuleDetailPage({
  params,
}: StudentModuleDetailPageProps) {
  const currentUser = await requireRole("/dashboard/modules", [Role.MAHASISWA]);

  const { id } = await params;
  const moduleId = parseModuleId(id);

  if (!moduleId) {
    notFound();
  }

  const learningModule = await getStudentModuleDetailData({
    userId: currentUser.id,
    moduleId,
  });

  if (!learningModule) {
    notFound();
  }

  return <StudentModuleDetailClient module={learningModule} />;
}