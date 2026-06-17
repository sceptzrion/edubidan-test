import { Role } from "@prisma/client";

import { LecturerGradebookHeader } from "@/components/dashboard/lecturer/gradebook/LecturerGradebookHeader";
import { LecturerGradebookModuleGrid } from "@/components/dashboard/lecturer/gradebook/LecturerGradebookModuleGrid";
import { getLecturerGradebookModules } from "@/data/learning/lecturer/lecturer-gradebook.server";
import { requireRole } from "@/lib/auth/guards";

export default async function LecturerGradebookPage() {
  const currentUser = await requireRole("/dashboard/lecturer/gradebook", [
    Role.DOSEN,
  ]);

  const modules = await getLecturerGradebookModules(
    currentUser.dosenProfile?.id
  );

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 pb-10 sm:pb-12">
      <LecturerGradebookHeader totalModules={modules.length} />

      <LecturerGradebookModuleGrid modules={modules} />
    </div>
  );
}