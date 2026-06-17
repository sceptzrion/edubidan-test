import { Role } from "@prisma/client";
import { notFound } from "next/navigation";

import { LecturerLessonPreviewSidebar } from "@/components/dashboard/lecturer/modules/preview/LecturerLessonPreviewSidebar";
import { LecturerLessonSummaryCard } from "@/components/dashboard/lecturer/modules/preview/LecturerLessonSummaryCard";
import { LecturerLessonVideoPreview } from "@/components/dashboard/lecturer/modules/preview/LecturerLessonVideoPreview";
import { LecturerPreviewBackButton } from "@/components/dashboard/lecturer/modules/preview/LecturerPreviewBackButton";
import { LecturerPreviewModeBadge } from "@/components/dashboard/lecturer/modules/preview/LecturerPreviewModeBadge";
import { getLecturerLessonPreviewData } from "@/data/learning/lecturer/lecturer-content-preview.server";
import { requireRole } from "@/lib/auth/guards";

type LecturerLessonPreviewPageProps = {
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

export default async function LecturerLessonPreviewPage({
  params,
}: LecturerLessonPreviewPageProps) {
  const currentUser = await requireRole("/dashboard/lecturer/modules", [
    Role.DOSEN,
  ]);

  const { id, lessonId } = await params;
  const moduleId = parsePositiveId(id);
  const parsedLessonId = parsePositiveId(lessonId);

  if (!moduleId || !parsedLessonId) {
    notFound();
  }

  const data = await getLecturerLessonPreviewData({
    moduleId,
    lessonId: parsedLessonId,
    dosenProfileId: currentUser.dosenProfile?.id,
  });

  if (!data) {
    notFound();
  }

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 pb-10 sm:pb-12 max-w-350 mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 sm:mb-8">
        <LecturerPreviewBackButton moduleId={String(moduleId)} />

        <LecturerPreviewModeBadge label="Mode Pratinjau Dosen" />
      </div>

      <div className="grid lg:grid-cols-3 gap-6 lg:gap-8 items-start">
        <div className="lg:col-span-2 space-y-6">
          <LecturerLessonVideoPreview lesson={data.lesson} />
          <LecturerLessonSummaryCard lesson={data.lesson} />
        </div>

        <LecturerLessonPreviewSidebar
          lesson={data.lesson}
          playlist={data.playlist}
        />
      </div>
    </div>
  );
}