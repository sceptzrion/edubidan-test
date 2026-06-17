"use client";

import { useRouter } from "next/navigation";

import type { AdminNotification } from "@/data/learning/admin/admin-notifications";

interface AdminNotificationMenuProps {
  notifications: AdminNotification[];
  onClose: () => void;
}

export function AdminNotificationMenu({
  notifications,
  onClose,
}: AdminNotificationMenuProps) {
  const router = useRouter();

  return (
    <div className="absolute right-0 lg:right-auto lg:left-1/2 lg:-translate-x-1/2 top-[calc(100%+8px)] w-72 sm:w-80 bg-card border border-border rounded-2xl shadow-xl z-50 animate-in slide-in-from-top-2 duration-200 overflow-hidden">
      <div className="px-4 py-3 sm:px-5 sm:py-4 border-b border-border flex items-center justify-between bg-muted/30">
        <span className="text-sm sm:text-base font-extrabold text-foreground">
          Notifikasi Admin
        </span>
      </div>

      <div className="max-h-[60vh] overflow-y-auto scrollbar-thin">
        {notifications.length > 0 ? (
          notifications.map((notification) => (
            <button
              key={notification.id}
              type="button"
              onClick={() => {
                router.push(notification.href);
                onClose();
              }}
              className={`w-full text-left px-4 py-3 sm:px-5 sm:py-4 border-b border-border last:border-0 hover:bg-muted/50 transition-colors ${
                !notification.read ? "bg-primary/5" : ""
              }`}
            >
              <div className="flex items-start gap-2.5 sm:gap-3">
                <div
                  className={`w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full mt-1.5 sm:mt-2 shrink-0 ${
                    !notification.read
                      ? "bg-primary shadow-[0_0_8px_rgba(13,148,136,0.8)]"
                      : "bg-transparent"
                  }`}
                />

                <div className="min-w-0">
                  <p
                    className={`text-xs sm:text-sm leading-snug ${
                      notification.read
                        ? "font-medium text-foreground"
                        : "font-extrabold text-foreground"
                    }`}
                  >
                    {notification.title}
                  </p>

                  <p className="text-[10px] sm:text-xs text-muted-foreground mt-0.5 sm:mt-1 leading-relaxed">
                    {notification.description}
                  </p>

                  <p className="text-[9px] sm:text-[10px] font-bold text-muted-foreground/80 mt-1.5 sm:mt-2 uppercase tracking-wider">
                    {notification.time}
                  </p>
                </div>
              </div>
            </button>
          ))
        ) : (
          <div className="px-5 py-8 text-center">
            <p className="text-sm font-bold text-foreground">
              Belum ada notifikasi.
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              Aktivitas sistem akan muncul di sini.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}