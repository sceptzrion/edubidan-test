"use client";

import { useState, type ReactNode } from "react";

import { AdminBottomNav } from "@/components/dashboard/admin/layout/AdminBottomNav";
import { AdminSidebar } from "@/components/dashboard/admin/layout/AdminSidebar";
import { AdminTopbar } from "@/components/dashboard/admin/layout/AdminTopbar";
import { adminMenuItems } from "@/components/dashboard/admin/layout/menuItems";
import type { DashboardSessionUser } from "@/lib/auth/session-user";

interface AdminDashboardShellProps {
  children: ReactNode;
  currentUser: DashboardSessionUser;
}

export function AdminDashboardShell({
  children,
  currentUser,
}: AdminDashboardShellProps) {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="min-h-screen flex bg-background font-sans text-foreground transition-colors duration-300">
      <AdminSidebar sidebarOpen={sidebarOpen} menuItems={adminMenuItems} />

      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden relative">
        <AdminTopbar
          currentUser={currentUser}
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
        />

        <main className="flex-1 overflow-y-auto bg-background p-3 sm:p-4 md:p-8 pb-20 sm:pb-24 md:pb-8 scrollbar-thin">
          <div className="absolute top-0 right-0 -mr-20 -mt-20 w-72 h-72 rounded-full bg-primary/5 blur-3xl pointer-events-none" />

          <div className="max-w-6xl mx-auto relative z-10">{children}</div>
        </main>
      </div>

      <AdminBottomNav menuItems={adminMenuItems} />
    </div>
  );
}