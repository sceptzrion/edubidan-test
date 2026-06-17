import { Role } from "@prisma/client";
import type { ReactNode } from "react";

import { LecturerDashboardShell } from "@/components/dashboard/lecturer/layout/LecturerDashboardShell";
import { requireRole } from "@/lib/auth/guards";

interface LecturerLayoutProps {
  children: ReactNode;
}

export default async function LecturerLayout({
  children,
}: LecturerLayoutProps) {
  const currentUser = await requireRole("/dashboard/lecturer", [Role.DOSEN]);

  return (
    <LecturerDashboardShell currentUser={currentUser}>
      {children}
    </LecturerDashboardShell>
  );
}