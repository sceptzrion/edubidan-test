"use client";

import { useState, type ReactNode } from "react";
import { usePathname } from "next/navigation";

import { StudentBottomNav } from "@/components/dashboard/student/layout/StudentBottomNav";
import { StudentSidebar } from "@/components/dashboard/student/layout/StudentSidebar";
import { StudentTopbar } from "@/components/dashboard/student/layout/StudentTopbar";
import { studentMenuItems } from "@/components/dashboard/student/layout/menuItems";
import type { DashboardSessionUser } from "@/lib/auth/session-user";

interface StudentDashboardShellProps {
  children: ReactNode;
  currentUser: DashboardSessionUser;
}

export function StudentDashboardShell({
  children,
  currentUser,
}: StudentDashboardShellProps) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const isQuizPage = pathname.includes("/quiz/");

  if (isQuizPage) {
    return <div className="min-h-screen bg-background">{children}</div>;
  }

  return (
    <div className="min-h-screen flex bg-background font-sans text-foreground transition-colors duration-300">
      <StudentSidebar sidebarOpen={sidebarOpen} menuItems={studentMenuItems} />

      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden relative">
        <StudentTopbar
          currentUser={currentUser}
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
        />

        <main className="flex-1 overflow-y-auto bg-background p-3 sm:p-4 md:p-8 pb-20 sm:pb-24 md:pb-8 scrollbar-thin">
          <div className="absolute top-0 right-0 -mr-20 -mt-20 w-72 h-72 rounded-full bg-primary/5 blur-3xl pointer-events-none" />
          <div className="max-w-6xl mx-auto relative z-10">{children}</div>
        </main>
      </div>

      <StudentBottomNav menuItems={studentMenuItems} />
    </div>
  );
}