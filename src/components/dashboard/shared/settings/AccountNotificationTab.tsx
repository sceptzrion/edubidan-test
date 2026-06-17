"use client";

import { useEffect, useState } from "react";
import { AlertCircle, CheckCircle2, Loader2 } from "lucide-react";

type NotificationPreferenceKey =
  | "moduleUpdate"
  | "newMaterial"
  | "newQuiz"
  | "quizResult"
  | "quizActivity"
  | "accountActivity"
  | "systemAlert";

type NotificationPreferenceData = Record<NotificationPreferenceKey, boolean> & {
  id: number;
  userId: number;
};

type NotificationPreferenceApiResponse = {
  success: boolean;
  message: string;
  data: NotificationPreferenceData | null;
};

type NotificationStatus = "idle" | "loading" | "saving" | "saved" | "error";

export interface AccountNotificationItem {
  key: NotificationPreferenceKey;
  label: string;
  description: string;
}

interface AccountNotificationTabProps {
  description: string;
  items: AccountNotificationItem[];
}

const defaultPreferences: Record<NotificationPreferenceKey, boolean> = {
  moduleUpdate: true,
  newMaterial: true,
  newQuiz: true,
  quizResult: true,
  quizActivity: true,
  accountActivity: true,
  systemAlert: true,
};

function getFriendlyPreferenceError(message: string) {
  if (message === "No valid notification preference provided") {
    return "Preferensi notifikasi tidak valid.";
  }

  if (message === "Authentication required") {
    return "Sesi login sudah berakhir. Silakan login kembali.";
  }

  return "Gagal menyimpan preferensi notifikasi. Silakan coba lagi.";
}

function mapPreferenceData(
  data: NotificationPreferenceData
): Record<NotificationPreferenceKey, boolean> {
  return {
    moduleUpdate: data.moduleUpdate,
    newMaterial: data.newMaterial,
    newQuiz: data.newQuiz,
    quizResult: data.quizResult,
    quizActivity: data.quizActivity,
    accountActivity: data.accountActivity,
    systemAlert: data.systemAlert,
  };
}

export function AccountNotificationTab({
  description,
  items,
}: AccountNotificationTabProps) {
  const [notifications, setNotifications] =
    useState<Record<NotificationPreferenceKey, boolean>>(defaultPreferences);
  const [status, setStatus] = useState<NotificationStatus>("loading");
  const [message, setMessage] = useState("");

  const fetchPreferences = async () => {
    setStatus("loading");
    setMessage("");

    try {
      const response = await fetch("/api/account/notification-preferences", {
        method: "GET",
        credentials: "same-origin",
      });

      const result =
        (await response.json()) as NotificationPreferenceApiResponse;

      if (!response.ok || !result.success || !result.data) {
        setStatus("error");
        setMessage(getFriendlyPreferenceError(result.message));
        return;
      }

      setNotifications(mapPreferenceData(result.data));
      setStatus("idle");
    } catch (error) {
      console.error("Fetch notification preferences error:", error);
      setStatus("error");
      setMessage("Gagal memuat preferensi notifikasi. Silakan muat ulang halaman.");
    }
  };

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      void fetchPreferences();
    }, 0);

    return () => window.clearTimeout(timeoutId);
  }, []);

  const toggleNotification = async (key: NotificationPreferenceKey) => {
    if (status === "saving" || status === "loading") return;

    const previousValue = notifications[key];
    const nextValue = !previousValue;

    setNotifications((current) => ({
      ...current,
      [key]: nextValue,
    }));
    setStatus("saving");
    setMessage("");

    try {
      const response = await fetch("/api/account/notification-preferences", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "same-origin",
        body: JSON.stringify({
          [key]: nextValue,
        }),
      });

      const result =
        (await response.json()) as NotificationPreferenceApiResponse;

      if (!response.ok || !result.success || !result.data) {
        setNotifications((current) => ({
          ...current,
          [key]: previousValue,
        }));
        setStatus("error");
        setMessage(getFriendlyPreferenceError(result.message));
        return;
      }

      setNotifications(mapPreferenceData(result.data));
      setStatus("saved");
      setMessage("Preferensi notifikasi berhasil disimpan.");

      window.setTimeout(() => {
        setStatus("idle");
        setMessage("");
      }, 1800);
    } catch (error) {
      console.error("Update notification preference error:", error);
      setNotifications((current) => ({
        ...current,
        [key]: previousValue,
      }));
      setStatus("error");
      setMessage("Terjadi kesalahan koneksi. Silakan coba lagi.");
    }
  };

  if (status === "loading") {
    return (
      <div className="animate-in fade-in duration-300 flex items-center gap-2 text-sm font-bold text-muted-foreground">
        <Loader2 size={18} className="animate-spin text-primary" />
        Memuat preferensi notifikasi...
      </div>
    );
  }

  return (
    <div className="animate-in fade-in duration-300">
      <div className="mb-6">
        <h2 className="text-base sm:text-lg font-extrabold text-foreground mb-1.5">
          Preferensi Notifikasi
        </h2>

        <p className="text-xs sm:text-sm text-muted-foreground font-medium leading-relaxed">
          {description}
        </p>
      </div>

      {(status === "error" || status === "saved") && message && (
        <div
          className={`mb-6 flex items-center gap-2.5 p-3 sm:p-4 rounded-xl border text-xs sm:text-sm font-bold animate-in slide-in-from-top-2 ${
            status === "error"
              ? "bg-red-500/10 border-red-500/20 text-red-500"
              : "bg-emerald-500/10 border-emerald-500/20 text-emerald-600"
          }`}
        >
          {status === "error" ? (
            <AlertCircle size={18} className="shrink-0" />
          ) : (
            <CheckCircle2 size={18} className="shrink-0" />
          )}
          {message}
        </div>
      )}

      <div className="space-y-3 sm:space-y-4">
        {items.map((item) => {
          const isActive = notifications[item.key];

          return (
            <div
              key={item.key}
              className="flex items-center justify-between gap-4 p-4 sm:p-5 rounded-2xl border border-border hover:bg-muted/30 transition-colors"
            >
              <div className="min-w-0">
                <p className="text-sm font-extrabold text-foreground mb-1">
                  {item.label}
                </p>

                <p className="text-xs text-muted-foreground leading-relaxed font-medium">
                  {item.description}
                </p>
              </div>

              <button
                type="button"
                onClick={() => void toggleNotification(item.key)}
                disabled={status === "saving"}
                aria-pressed={isActive}
                className={`w-12 h-6 sm:w-14 sm:h-7 rounded-full transition-colors relative shrink-0 border-2 disabled:opacity-70 disabled:cursor-not-allowed ${
                  isActive ? "bg-primary border-primary" : "bg-muted border-border"
                }`}
              >
                <span
                  className={`w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-white absolute top-0.5 transition-all shadow-sm ${
                    isActive
                      ? "left-5.5 sm:left-6.5"
                      : "left-0.5 sm:left-0.75"
                  }`}
                />
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}