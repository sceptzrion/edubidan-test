import { Role } from "@prisma/client";

import { LecturerModulesClient } from "@/components/dashboard/lecturer/modules/LecturerModulesClient";
import { getLecturerModulesByDosenProfileId } from "@/data/learning/lecturer/lecturer-modules.server";
import { requireRole } from "@/lib/auth/guards";

export default async function LecturerModulesPage() {
  const currentUser = await requireRole("/dashboard/lecturer/modules", [
    Role.DOSEN,
  ]);

  const modules = await getLecturerModulesByDosenProfileId(
    currentUser.dosenProfile?.id
  );

  return <LecturerModulesClient initialModules={modules} />;
}