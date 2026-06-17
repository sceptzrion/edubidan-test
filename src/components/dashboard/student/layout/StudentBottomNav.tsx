"use client";

import { useState, useTransition } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

import type { MenuItem } from "@/components/dashboard/student/layout/menuItems";

interface StudentBottomNavProps {
  menuItems: MenuItem[];
}

export function StudentBottomNav({ menuItems }: StudentBottomNavProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();
  const [openingPath, setOpeningPath] = useState<string | null>(null);

  const isActive = (path: string) => {
    if (path === "/dashboard") return pathname === "/dashboard";
    return pathname.startsWith(path);
  };

  const handleNavigate = (path: string) => {
    if (path === pathname || isPending) return;

    setOpeningPath(path);

    startTransition(() => {
      router.push(path);
    });
  };

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 h-16 sm:h-18 bg-card border-t border-border z-40 flex items-center justify-around px-2 pb-safe shadow-[0_-4px_20px_rgba(0,0,0,0.05)]">
      {menuItems.map((item) => {
        const active = isActive(item.path);
        const isOpening = isPending && openingPath === item.path;

        return (
          <button
            key={item.path}
            type="button"
            onClick={() => handleNavigate(item.path)}
            disabled={isPending}
            aria-busy={isOpening}
            className={`flex flex-col items-center justify-center w-full h-full space-y-1 sm:space-y-1.5 transition-colors disabled:cursor-wait ${
              active
                ? "text-primary"
                : "text-muted-foreground hover:text-foreground disabled:opacity-70"
            }`}
          >
            <div className="relative">
              {isOpening ? (
                <Loader2 size={22} className="sm:w-6 sm:h-6 animate-spin" />
              ) : (
                <item.icon
                  size={22}
                  className={`sm:w-6 sm:h-6 ${
                    active ? "fill-primary/20" : ""
                  }`}
                />
              )}

              {active && !isOpening && (
                <span className="absolute -top-2 left-1/2 -translate-x-1/2 w-1 h-1 sm:w-1.5 sm:h-1.5 rounded-full bg-primary" />
              )}
            </div>

            <span
              className={`text-[10px] sm:text-[11px] font-extrabold ${
                active || isOpening ? "text-primary" : ""
              }`}
            >
              {isOpening ? "Membuka" : item.label}
            </span>
          </button>
        );
      })}
    </nav>
  );
}