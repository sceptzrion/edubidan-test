"use client";

import { useState, type ReactNode } from "react";

import { LecturerBottomNav } from "@/components/dashboard/lecturer/layout/LecturerBottomNav";
import { LecturerSidebar } from "@/components/dashboard/lecturer/layout/LecturerSidebar";
import { LecturerTopbar } from "@/components/dashboard/lecturer/layout/LecturerTopbar";
import { lecturerMenuItems } from "@/components/dashboard/lecturer/layout/menuItems";
import type { DashboardSessionUser } from "@/lib/auth/session-user";

interface LecturerDashboardShellProps {
  children: ReactNode;
  currentUser: DashboardSessionUser;
}

export function LecturerDashboardShell({
  children,
  currentUser,
}: LecturerDashboardShellProps) {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="min-h-screen flex bg-background font-sans text-foreground transition-colors duration-300">
      <LecturerSidebar sidebarOpen={sidebarOpen} menuItems={lecturerMenuItems} />

      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden relative">
        <LecturerTopbar
          currentUser={currentUser}
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
        />

        <main className="flex-1 overflow-y-auto bg-background p-3 sm:p-4 md:p-8 pb-20 sm:pb-24 md:pb-8 scrollbar-thin">
          <div className="absolute top-0 right-0 -mr-20 -mt-20 w-72 h-72 rounded-full bg-primary/5 blur-3xl pointer-events-none" />
          <div className="max-w-6xl mx-auto relative z-10">{children}</div>
        </main>
      </div>

      <LecturerBottomNav menuItems={lecturerMenuItems} />
    </div>
  );
}