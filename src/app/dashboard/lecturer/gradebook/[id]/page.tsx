import { Role } from "@prisma/client";
import { notFound } from "next/navigation";

import { LecturerGradebookDetailClient } from "@/components/dashboard/lecturer/gradebook/LecturerGradebookDetailClient";
import { getLecturerGradebookDetailData } from "@/data/learning/lecturer/lecturer-gradebook.server";
import { requireRole } from "@/lib/auth/guards";

type LecturerGradebookDetailPageProps = {
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

export default async function LecturerGradebookDetailPage({
  params,
}: LecturerGradebookDetailPageProps) {
  const currentUser = await requireRole("/dashboard/lecturer/gradebook", [
    Role.DOSEN,
  ]);

  const { id } = await params;
  const moduleId = parseModuleId(id);

  if (!moduleId) {
    notFound();
  }

  const data = await getLecturerGradebookDetailData({
    moduleId,
    dosenProfileId: currentUser.dosenProfile?.id,
  });

  if (!data) {
    notFound();
  }

  return <LecturerGradebookDetailClient data={data} />;
}