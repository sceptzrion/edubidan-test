"use client";

import { ChevronDown, Home, LogOut, User } from "lucide-react";
import { useRouter } from "next/navigation";

import { clearStoredUser, getUserInitials } from "@/lib/auth/client-auth";
import type { DashboardSessionUser } from "@/lib/auth/session-user";

interface LecturerAccountMenuProps {
  currentUser: DashboardSessionUser;
  isOpen: boolean;
  onToggle: () => void;
  onClose: () => void;
}

export function LecturerAccountMenu({
  currentUser,
  isOpen,
  onToggle,
  onClose,
}: LecturerAccountMenuProps) {
  const router = useRouter();
  const initials = getUserInitials(currentUser.name);

  const navigateTo = (path: string) => {
    router.push(path);
    onClose();
  };

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", {
        method: "POST",
        credentials: "same-origin",
      });
    } catch (error) {
      console.error("Logout request failed:", error);
    } finally {
      clearStoredUser();
      onClose();
      router.replace("/");
      router.refresh();
    }
  };

  return (
    <div className="relative">
      <button
        type="button"
        onClick={onToggle}
        className="flex items-center gap-3 p-1.5 md:pr-3 rounded-full hover:bg-muted transition-colors border border-transparent hover:border-border group"
      >
        <div className="w-8 h-8 md:w-9 md:h-9 overflow-hidden rounded-full bg-linear-to-br from-primary to-teal-500 flex items-center justify-center text-white font-extrabold shadow-sm group-hover:scale-105 transition-transform">
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
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {isOpen && (
        <div className="absolute right-0 top-[calc(100%+8px)] w-56 sm:w-64 bg-card border border-border rounded-2xl shadow-xl py-1.5 sm:py-2 z-100 animate-in slide-in-from-top-2 duration-200 overflow-hidden">
          <div className="px-3 py-2 sm:px-4 sm:py-3 border-b border-border mb-1 bg-muted/30">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 overflow-hidden rounded-full bg-linear-to-br from-primary to-teal-500 flex items-center justify-center text-sm font-extrabold text-white shrink-0">
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

              <div className="min-w-0">
                <p className="truncate text-xs sm:text-sm font-extrabold text-foreground">
                  {currentUser.name}
                </p>
                <p className="truncate text-[10px] sm:text-xs font-medium text-muted-foreground mt-0.5">
                  {currentUser.email}
                </p>
                <span className="mt-1 inline-flex rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-extrabold text-primary">
                  Dosen
                </span>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={() => navigateTo("/dashboard/lecturer/settings")}
            className="w-full flex items-center gap-2.5 sm:gap-3 px-3 py-2 sm:px-4 sm:py-2.5 text-xs sm:text-sm font-bold text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
          >
            <User size={16} className="sm:w-4.5 sm:h-4.5" />
            Profil Saya
          </button>

          <button
            type="button"
            onClick={() => navigateTo("/")}
            className="w-full flex items-center gap-2.5 sm:gap-3 px-3 py-2 sm:px-4 sm:py-2.5 text-xs sm:text-sm font-bold text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
          >
            <Home size={16} className="sm:w-4.5 sm:h-4.5" />
            Halaman Utama
          </button>

          <div className="border-t border-border mt-1 pt-1">
            <button
              type="button"
              onClick={handleLogout}
              className="w-full flex items-center gap-2.5 sm:gap-3 px-3 py-2 sm:px-4 sm:py-2.5 text-xs sm:text-sm font-extrabold text-red-500 hover:text-red-600 hover:bg-red-500/10 transition-colors"
            >
              <LogOut size={16} className="sm:w-4.5 sm:h-4.5" />
              Keluar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}