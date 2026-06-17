"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Bell,
  BookOpen,
  CheckCircle2,
  ClipboardCheck,
  Megaphone,
  UserPlus,
} from "lucide-react";

type NotificationItem = {
  id: number;
  type: string;
  title: string;
  body: string;
  href: string | null;
  isRead: boolean;
  createdAt: string;
};

type NotificationsApiResponse = {
  success: boolean;
  message: string;
  data: {
    notifications: NotificationItem[];
    unreadCount: number;
    totalCount: number;
  } | null;
};

type ReadNotificationApiResponse = {
  success: boolean;
  message: string;
  data: NotificationItem | null;
};

type ReadAllNotificationApiResponse = {
  success: boolean;
  message: string;
  data: {
    updatedCount: number;
    unreadCount: number;
    notifications: NotificationItem[];
  } | null;
};

interface DashboardNotificationMenuProps {
  title: string;
  emptyTitle: string;
  emptyDescription: string;
  isOpen: boolean;
  onToggle: () => void;
  onClose: () => void;
}

function getNotificationIcon(type: string) {
  if (
    type === "KUIS_BARU" ||
    type === "KUIS_DIKERJAKAN" ||
    type === "HASIL_KUIS"
  ) {
    return ClipboardCheck;
  }

  if (
    type === "MATERI_BARU" ||
    type === "MODUL_DIPUBLIKASI" ||
    type === "MODUL_DIPERBARUI"
  ) {
    return BookOpen;
  }

  if (
    type === "GABUNG_MODUL" ||
    type === "MAHASISWA_BARU" ||
    type === "MAHASISWA_BERGABUNG"
  ) {
    return UserPlus;
  }

  if (
    type === "AKUN_DIBUAT" ||
    type === "AKUN_DIAKTIFKAN" ||
    type === "AKUN_DINONAKTIFKAN"
  ) {
    return CheckCircle2;
  }

  return Megaphone;
}

function formatNotificationTime(value: string) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "";
  }

  const diffMs = Date.now() - date.getTime();
  const diffMinutes = Math.floor(diffMs / 60_000);
  const diffHours = Math.floor(diffMinutes / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMinutes < 1) return "Baru saja";
  if (diffMinutes < 60) return `${diffMinutes} menit lalu`;
  if (diffHours < 24) return `${diffHours} jam lalu`;
  if (diffDays < 7) return `${diffDays} hari lalu`;

  return new Intl.DateTimeFormat("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date);
}

export function DashboardNotificationMenu({
  title,
  emptyTitle,
  emptyDescription,
  isOpen,
  onToggle,
  onClose,
}: DashboardNotificationMenuProps) {
  const router = useRouter();

  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [isMarkingAll, setIsMarkingAll] = useState(false);

  const fetchNotifications = useCallback(async () => {
    setIsLoading(true);

    try {
      const response = await fetch("/api/notifications", {
        method: "GET",
        credentials: "same-origin",
      });

      const result = (await response.json()) as NotificationsApiResponse;

      if (!response.ok || !result.success || !result.data) {
        setNotifications([]);
        setUnreadCount(0);
        return;
      }

      setNotifications(result.data.notifications);
      setUnreadCount(result.data.unreadCount);
    } catch (error) {
      console.error("Fetch notifications error:", error);
      setNotifications([]);
      setUnreadCount(0);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      void fetchNotifications();
    }, 0);

    return () => window.clearTimeout(timeoutId);
  }, [fetchNotifications]);

  useEffect(() => {
    if (!isOpen) return undefined;

    const timeoutId = window.setTimeout(() => {
      void fetchNotifications();
    }, 0);

    return () => window.clearTimeout(timeoutId);
  }, [fetchNotifications, isOpen]);

  const markAsRead = async (notificationId: number) => {
    try {
      const response = await fetch(`/api/notifications/${notificationId}/read`, {
        method: "PATCH",
        credentials: "same-origin",
      });

      const result = (await response.json()) as ReadNotificationApiResponse;

      if (!response.ok || !result.success) return;

      setNotifications((currentNotifications) =>
        currentNotifications.map((notification) =>
          notification.id === notificationId
            ? {
                ...notification,
                isRead: true,
              }
            : notification
        )
      );

      setUnreadCount((currentCount) => Math.max(currentCount - 1, 0));
    } catch (error) {
      console.error("Mark notification as read error:", error);
    }
  };

  const markAllAsRead = async () => {
    if (isMarkingAll || unreadCount === 0) return;

    setIsMarkingAll(true);

    try {
      const response = await fetch("/api/notifications/read-all", {
        method: "PATCH",
        credentials: "same-origin",
      });

      const result = (await response.json()) as ReadAllNotificationApiResponse;

      if (!response.ok || !result.success || !result.data) return;

      setNotifications(result.data.notifications);
      setUnreadCount(result.data.unreadCount);
    } catch (error) {
      console.error("Mark all notifications as read error:", error);
    } finally {
      setIsMarkingAll(false);
    }
  };

  const handleOpenNotification = async (notification: NotificationItem) => {
    if (!notification.isRead) {
      await markAsRead(notification.id);
    }

    if (notification.href) {
      router.push(notification.href);
    }

    onClose();
  };

  return (
    <div className="relative">
      <button
        type="button"
        onClick={onToggle}
        className="p-2.5 rounded-xl hover:bg-muted text-muted-foreground hover:text-foreground transition-colors relative"
        aria-label="Buka notifikasi"
        aria-expanded={isOpen}
      >
        <Bell size={20} />

        {unreadCount > 0 && (
          <span className="absolute top-2 right-2 w-2.5 h-2.5 rounded-full bg-red-500 border-2 border-card" />
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 lg:right-auto lg:left-1/2 lg:-translate-x-1/2 top-[calc(100%+8px)] w-72 sm:w-86 bg-card border border-border rounded-2xl shadow-xl z-50 animate-in slide-in-from-top-2 duration-200 overflow-hidden">
          <div className="px-4 py-3 sm:px-5 sm:py-4 border-b border-border flex items-center justify-between gap-3 bg-muted/30">
            <div>
              <span className="text-sm sm:text-base font-extrabold text-foreground">
                {title}
              </span>

              {unreadCount > 0 && (
                <p className="text-[10px] sm:text-xs font-bold text-primary mt-0.5">
                  {unreadCount} belum dibaca
                </p>
              )}
            </div>

            {unreadCount > 0 && (
              <button
                type="button"
                onClick={() => void markAllAsRead()}
                disabled={isMarkingAll}
                className="text-[10px] sm:text-xs font-extrabold text-primary hover:underline disabled:opacity-60 disabled:cursor-not-allowed shrink-0"
              >
                Tandai semua
              </button>
            )}
          </div>

          <div className="max-h-[60vh] overflow-y-auto scrollbar-thin">
            {isLoading ? (
              <div className="px-5 py-8 text-center">
                <p className="text-sm font-bold text-foreground">
                  Memuat notifikasi...
                </p>
              </div>
            ) : notifications.length > 0 ? (
              notifications.map((notification) => {
                const Icon = getNotificationIcon(notification.type);

                return (
                  <button
                    key={notification.id}
                    type="button"
                    onClick={() => void handleOpenNotification(notification)}
                    className={`w-full text-left px-4 py-3 sm:px-5 sm:py-4 border-b border-border last:border-0 hover:bg-muted/50 cursor-pointer transition-colors ${
                      !notification.isRead ? "bg-primary/5" : ""
                    }`}
                  >
                    <div className="flex items-start gap-2.5 sm:gap-3">
                      <div
                        className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                          !notification.isRead
                            ? "bg-primary/10 text-primary"
                            : "bg-muted text-muted-foreground"
                        }`}
                      >
                        <Icon size={16} />
                      </div>

                      <div className="min-w-0 flex-1">
                        <p
                          className={`text-xs sm:text-sm leading-snug ${
                            notification.isRead
                              ? "font-bold text-foreground"
                              : "font-extrabold text-foreground"
                          }`}
                        >
                          {notification.title}
                        </p>

                        <p className="text-[10px] sm:text-xs text-muted-foreground mt-0.5 sm:mt-1 leading-relaxed line-clamp-2">
                          {notification.body}
                        </p>

                        <p className="text-[9px] sm:text-[10px] font-bold text-muted-foreground/80 mt-1.5 sm:mt-2 uppercase tracking-wider">
                          {formatNotificationTime(notification.createdAt)}
                        </p>
                      </div>
                    </div>
                  </button>
                );
              })
            ) : (
              <div className="px-5 py-8 text-center">
                <p className="text-sm font-extrabold text-foreground mb-1">
                  {emptyTitle}
                </p>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {emptyDescription}
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}