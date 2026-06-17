import { Role } from "@prisma/client";
import { notFound } from "next/navigation";

import { StudentLessonClient } from "@/components/dashboard/student/modules/lesson/StudentLessonClient";
import { getStudentLessonData } from "@/data/learning/student/student-learning.server";
import { requireRole } from "@/lib/auth/guards";

type StudentLessonPageProps = {
  params: Promise<{
    id: string;
    lessonId: string;
  }>;
};

function parsePositiveId(value: string) {
  const id = Number(value);

  if (!Number.isInteger(id) || id <= 0) {
    return null;
  }

  return id;
}

export default async function StudentLessonPage({
  params,
}: StudentLessonPageProps) {
  const currentUser = await requireRole("/dashboard/modules", [Role.MAHASISWA]);

  const { id, lessonId } = await params;
  const moduleId = parsePositiveId(id);
  const parsedLessonId = parsePositiveId(lessonId);

  if (!moduleId || !parsedLessonId) {
    notFound();
  }

  const data = await getStudentLessonData({
    userId: currentUser.id,
    moduleId,
    itemId: parsedLessonId,
  });

  if (!data) {
    notFound();
  }

  return <StudentLessonClient data={data} />;
}