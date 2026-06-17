"use client";

import {
  Bell,
  BookOpen,
  ClipboardCheck,
  TrendingUp,
  UserPlus,
} from "lucide-react";
import { useRouter } from "next/navigation";

import type {
  LecturerNotification,
  LecturerNotificationType,
} from "@/data/learning/lecturer/lecturer-notifications";

interface LecturerNotificationMenuProps {
  isOpen: boolean;
  notifications: LecturerNotification[];
  onToggle: () => void;
  onClose: () => void;
}

const notificationIcons: Record<
  LecturerNotificationType,
  typeof ClipboardCheck
> = {
  submission: ClipboardCheck,
  module: BookOpen,
  progress: TrendingUp,
  participant: UserPlus,
};

export function LecturerNotificationMenu({
  isOpen,
  notifications,
  onToggle,
  onClose,
}: LecturerNotificationMenuProps) {
  const router = useRouter();
  const hasUnread = notifications.some((notification) => !notification.read);

  const handleOpenNotification = (href: string) => {
    router.push(href);
    onClose();
  };

  return (
    <div className="relative">
      <button
        type="button"
        onClick={onToggle}
        className="p-2.5 rounded-xl hover:bg-muted text-muted-foreground hover:text-foreground transition-colors relative"
        aria-label="Buka notifikasi dosen"
      >
        <Bell size={20} />

        {hasUnread && (
          <span className="absolute top-2 right-2 w-2.5 h-2.5 rounded-full bg-red-500 border-2 border-card" />
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 lg:right-auto lg:left-1/2 lg:-translate-x-1/2 top-[calc(100%+8px)] w-72 sm:w-80 bg-card border border-border rounded-2xl shadow-xl z-50 animate-in slide-in-from-top-2 duration-200">
          <div className="px-4 py-3 sm:px-5 sm:py-4 border-b border-border flex items-center justify-between bg-muted/30 rounded-t-2xl">
            <span className="text-sm sm:text-base font-extrabold text-foreground">
              Notifikasi Dosen
            </span>

            {hasUnread && (
              <span className="text-[10px] font-extrabold text-primary bg-primary/10 px-2 py-1 rounded-full">
                Baru
              </span>
            )}
          </div>

          <div className="max-h-[60vh] overflow-y-auto scrollbar-thin">
            {notifications.length > 0 ? (
              notifications.map((notification) => {
                const Icon = notificationIcons[notification.type];

                return (
                  <button
                    key={notification.id}
                    type="button"
                    onClick={() => handleOpenNotification(notification.href)}
                    className={`w-full text-left px-4 py-3 sm:px-5 sm:py-4 border-b border-border last:border-0 hover:bg-muted/50 cursor-pointer transition-colors ${
                      !notification.read ? "bg-primary/5" : ""
                    }`}
                  >
                    <div className="flex items-start gap-2.5 sm:gap-3">
                      <div
                        className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                          !notification.read
                            ? "bg-primary/10 text-primary"
                            : "bg-muted text-muted-foreground"
                        }`}
                      >
                        <Icon size={16} />
                      </div>

                      <div className="min-w-0">
                        <p
                          className={`text-xs sm:text-sm ${
                            notification.read
                              ? "font-bold text-foreground"
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
                );
              })
            ) : (
              <div className="px-5 py-8 text-center">
                <p className="text-sm font-extrabold text-foreground mb-1">
                  Belum ada notifikasi
                </p>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Aktivitas modul dan kuis mahasiswa akan muncul di sini.
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}