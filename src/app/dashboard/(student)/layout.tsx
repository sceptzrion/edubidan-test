import { Role } from "@prisma/client";
import type { ReactNode } from "react";

import { StudentDashboardShell } from "@/components/dashboard/student/layout/StudentDashboardShell";
import { requireRole } from "@/lib/auth/guards";

interface StudentLayoutProps {
  children: ReactNode;
}

export default async function StudentLayout({ children }: StudentLayoutProps) {
  const currentUser = await requireRole("/dashboard", [Role.MAHASISWA]);

  return (
    <StudentDashboardShell currentUser={currentUser}>
      {children}
    </StudentDashboardShell>
  );
}