"use client";

import { useEffect, useRef, useState } from "react";
import {
  ChevronDown,
  LayoutDashboard,
  LogOut,
  Settings,
} from "lucide-react";
import { useRouter } from "next/navigation";

import {
  clearStoredUser,
  getDashboardPathByRole,
  getRoleLabel,
  getUserInitials,
  type StoredUser,
} from "@/lib/auth/client-auth";

type UserAccountDropdownProps = {
  user: StoredUser;
  compactTrigger?: boolean;
  logoutRedirectPath?: string;
};

export function UserAccountDropdown({
  user,
  compactTrigger = false,
  logoutRedirectPath = "/login",
}: UserAccountDropdownProps) {
  const router = useRouter();
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  const [isOpen, setIsOpen] = useState(false);

  const dashboardPath = getDashboardPathByRole(user.role);
  const roleLabel = getRoleLabel(user.role);
  const initials = getUserInitials(user.name);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }

    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  const handleDashboardClick = () => {
    setIsOpen(false);
    router.push(dashboardPath);
  };

  const handleSettingsClick = () => {
    setIsOpen(false);

    if (user.role === "ADMIN") {
      router.push("/dashboard/admin/settings");
      return;
    }

    if (user.role === "DOSEN") {
      router.push("/dashboard/lecturer/settings");
      return;
    }

    router.push("/dashboard/settings");
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
      setIsOpen(false);
      router.replace(logoutRedirectPath);
      router.refresh();
    }
  };

  return (
    <div ref={dropdownRef} className="relative">
      <button
        type="button"
        onClick={() => setIsOpen((current) => !current)}
        className={
          compactTrigger
            ? "flex items-center gap-1.5 rounded-full hover:bg-muted transition-colors"
            : "flex items-center gap-2 rounded-full border border-border bg-card px-2 py-1.5 hover:bg-muted transition-colors"
        }
        aria-expanded={isOpen}
        aria-haspopup="menu"
      >
        <span className="h-9 w-9 overflow-hidden rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold">
          {user.avatarUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={user.avatarUrl}
              alt={user.name}
              className="h-full w-full object-cover"
            />
          ) : (
            initials
          )}
        </span>

        {!compactTrigger && (
          <span className="hidden sm:flex flex-col items-start leading-tight">
            <span className="max-w-32 truncate text-sm font-semibold text-foreground">
              {user.name}
            </span>
            <span className="text-xs text-muted-foreground">{roleLabel}</span>
          </span>
        )}

        <ChevronDown
          size={compactTrigger ? 14 : 16}
          className={`text-muted-foreground transition-transform ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {isOpen && (
        <div
          role="menu"
          className="absolute right-0 mt-2 w-[min(92vw,16rem)] overflow-hidden rounded-2xl border border-border bg-card shadow-xl shadow-black/10 z-50 animate-in fade-in zoom-in-95 duration-150"
        >
          <div className="border-b border-border p-3">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 overflow-hidden rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold shrink-0">
                {user.avatarUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={user.avatarUrl}
                    alt={user.name}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  initials
                )}
              </div>

              <div className="min-w-0">
                <p className="truncate text-sm font-bold text-foreground">
                  {user.name}
                </p>
                <p className="truncate text-xs text-muted-foreground">
                  {user.email}
                </p>
                <p className="mt-1 inline-flex rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-semibold text-primary">
                  {roleLabel}
                </p>
              </div>
            </div>
          </div>

          <div className="p-2">
            <button
              type="button"
              onClick={handleDashboardClick}
              className="group w-full flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
              role="menuitem"
            >
              <LayoutDashboard
                size={17}
                className="text-muted-foreground group-hover:text-foreground transition-colors"
              />
              Dashboard
            </button>

            <button
              type="button"
              onClick={handleSettingsClick}
              className="group w-full flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
              role="menuitem"
            >
              <Settings
                size={17}
                className="text-muted-foreground group-hover:text-foreground transition-colors"
              />
              Profil & Pengaturan
            </button>
          </div>

          <div className="border-t border-border p-2">
            <button
              type="button"
              onClick={handleLogout}
              className="w-full flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-semibold text-destructive hover:bg-destructive/10 transition-colors"
              role="menuitem"
            >
              <LogOut size={17} />
              Keluar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}