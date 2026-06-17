import { Role } from "@prisma/client";

import { StudentModulesClient } from "@/components/dashboard/student/modules/StudentModulesClient";
import { getStudentModuleCards } from "@/data/learning/student/student-learning.server";
import { requireRole } from "@/lib/auth/guards";

export default async function StudentModulesPage() {
  const currentUser = await requireRole("/dashboard/modules", [Role.MAHASISWA]);

  const modules = await getStudentModuleCards(currentUser.id);

  return <StudentModulesClient initialModules={modules} />;
}