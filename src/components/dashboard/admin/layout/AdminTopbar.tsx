"use client";

import { useState } from "react";
import { ChevronDown, Menu } from "lucide-react";

import { AdminAccountMenu } from "@/components/dashboard/admin/layout/AdminAccountMenu";
import { DashboardNotificationMenu } from "@/components/dashboard/shared/DashboardNotificationMenu";
import { EduBidanLogo } from "@/components/ui/EduBidanLogo";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { getUserInitials } from "@/lib/auth/client-auth";
import type { DashboardSessionUser } from "@/lib/auth/session-user";

interface AdminTopbarProps {
  currentUser: DashboardSessionUser;
  sidebarOpen: boolean;
  setSidebarOpen: (value: boolean) => void;
}

export function AdminTopbar({
  currentUser,
  sidebarOpen,
  setSidebarOpen,
}: AdminTopbarProps) {
  const [showAccount, setShowAccount] = useState(false);
  const [showNotification, setShowNotification] = useState(false);

  const initials = getUserInitials(currentUser.name);

  const toggleAccountMenu = () => {
    setShowAccount((current) => !current);
    setShowNotification(false);
  };

  const toggleNotificationMenu = () => {
    setShowNotification((current) => !current);
    setShowAccount(false);
  };

  return (
    <header className="h-16 md:h-18 shrink-0 border-b border-border bg-card/80 backdrop-blur-md flex items-center justify-between px-4 md:px-8 z-30 sticky top-0">
      <div className="flex items-center gap-4">
        <button
          type="button"
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="hidden lg:block p-2.5 rounded-xl hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
          aria-label="Toggle sidebar admin"
        >
          <Menu size={22} />
        </button>

        <div className="lg:hidden flex items-center gap-2">
          <EduBidanLogo size="sm" showText />

          <span className="text-[10px] font-extrabold bg-primary/10 text-primary px-2 py-0.5 rounded-full uppercase tracking-wider hidden sm:block">
            Admin
          </span>
        </div>
      </div>

      <div className="flex items-center gap-2 md:gap-4">
        <ThemeToggle />

        <DashboardNotificationMenu
          title="Notifikasi Admin"
          emptyTitle="Belum ada notifikasi"
          emptyDescription="Aktivitas sistem akan muncul di sini."
          isOpen={showNotification}
          onToggle={toggleNotificationMenu}
          onClose={() => setShowNotification(false)}
        />

        <div className="relative">
          <button
            type="button"
            onClick={toggleAccountMenu}
            className="flex items-center gap-3 p-1.5 md:pr-3 rounded-full hover:bg-muted transition-colors border border-transparent hover:border-border group"
            aria-label="Buka menu akun admin"
            aria-expanded={showAccount}
          >
            <div className="w-8 h-8 md:w-9 md:h-9 overflow-hidden rounded-full bg-linear-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white font-extrabold shadow-sm group-hover:scale-105 transition-transform">
              {currentUser.avatarUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={currentUser.avatarUrl}
                  alt={currentUser.name}
                  className="h-full w-full object-cover"
                />
              ) : (
                initials
              )}
            </div>

            <span className="max-w-32 truncate text-xs md:text-sm font-extrabold text-foreground hidden md:block">
              {currentUser.name}
            </span>

            <ChevronDown
              size={14}
              className={`text-muted-foreground hidden md:block transition-transform duration-300 ${
                showAccount ? "rotate-180" : ""
              }`}
            />
          </button>

          {showAccount && (
            <AdminAccountMenu
              currentUser={currentUser}
              onClose={() => setShowAccount(false)}
            />
          )}
        </div>
      </div>
    </header>
  );
}