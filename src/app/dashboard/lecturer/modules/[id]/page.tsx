import { Role } from "@prisma/client";
import { notFound } from "next/navigation";

import { LecturerModuleDetailClient } from "@/components/dashboard/lecturer/modules/detail/LecturerModuleDetailClient";
import { getLecturerModuleDetailData } from "@/data/learning/lecturer/lecturer-module-detail";
import { requireRole } from "@/lib/auth/guards";

type LecturerModuleEditorPageProps = {
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

export default async function LecturerModuleEditorPage({
  params,
}: LecturerModuleEditorPageProps) {
  const currentUser = await requireRole("/dashboard/lecturer/modules", [
    Role.DOSEN,
  ]);

  const { id } = await params;
  const moduleId = parseModuleId(id);

  if (!moduleId || !currentUser.dosenProfile?.id) {
    notFound();
  }

  const detailData = await getLecturerModuleDetailData(
    moduleId,
    currentUser.dosenProfile.id
  );

  if (!detailData) {
    notFound();
  }

  return (
    <LecturerModuleDetailClient
      moduleId={String(moduleId)}
      initialInfo={detailData.info}
      initialPlaylistItems={detailData.playlistItems}
    />
  );
}