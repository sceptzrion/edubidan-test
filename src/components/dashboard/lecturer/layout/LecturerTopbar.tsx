"use client";

import { useState } from "react";
import { Menu } from "lucide-react";

import { LecturerAccountMenu } from "@/components/dashboard/lecturer/layout/LecturerAccountMenu";
import { DashboardNotificationMenu } from "@/components/dashboard/shared/DashboardNotificationMenu";
import { EduBidanLogo } from "@/components/ui/EduBidanLogo";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import type { DashboardSessionUser } from "@/lib/auth/session-user";

interface LecturerTopbarProps {
  currentUser: DashboardSessionUser;
  sidebarOpen: boolean;
  setSidebarOpen: (value: boolean) => void;
}

export function LecturerTopbar({
  currentUser,
  sidebarOpen,
  setSidebarOpen,
}: LecturerTopbarProps) {
  const [showAccount, setShowAccount] = useState(false);
  const [showNotif, setShowNotif] = useState(false);

  return (
    <header className="h-16 md:h-18 shrink-0 border-b border-border bg-card/80 backdrop-blur-md flex items-center justify-between px-4 md:px-8 z-30 sticky top-0">
      <div className="flex items-center gap-4">
        <button
          type="button"
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="hidden lg:block p-2.5 rounded-xl hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
          aria-label={sidebarOpen ? "Tutup sidebar" : "Buka sidebar"}
        >
          <Menu size={22} />
        </button>

        <div className="lg:hidden flex items-center gap-2">
          <EduBidanLogo size="sm" showText={true} />
          <span className="text-[10px] font-extrabold bg-primary/10 text-primary px-2 py-0.5 rounded-full uppercase tracking-wider hidden sm:block">
            Dosen
          </span>
        </div>
      </div>

      <div className="flex items-center gap-2 md:gap-4">
        <ThemeToggle />

        <DashboardNotificationMenu
          title="Notifikasi Dosen"
          emptyTitle="Belum ada notifikasi"
          emptyDescription="Aktivitas modul dan kuis mahasiswa akan muncul di sini."
          isOpen={showNotif}
          onToggle={() => {
            setShowNotif((current) => !current);
            setShowAccount(false);
          }}
          onClose={() => setShowNotif(false)}
        />

        <LecturerAccountMenu
          currentUser={currentUser}
          isOpen={showAccount}
          onToggle={() => {
            setShowAccount((current) => !current);
            setShowNotif(false);
          }}
          onClose={() => setShowAccount(false)}
        />
      </div>
    </header>
  );
}