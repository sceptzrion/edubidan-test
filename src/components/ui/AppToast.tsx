"use client";

import { createPortal } from "react-dom";
import { CheckCircle2, Info, TriangleAlert, X, XCircle } from "lucide-react";

import { useIsClient } from "@/hooks/useIsClient";

export type AppToastType = "success" | "error" | "info" | "warning";

export type AppToastState = {
  type: AppToastType;
  title: string;
  message?: string;
  durationMs?: number;
} | null;

type AppToastProps = {
  toast: AppToastState;
  onClose: () => void;
};

const toastStyles = {
  success: {
    icon: CheckCircle2,
    iconClassName: "text-teal-400",
    iconBoxClassName: "bg-teal-500/15",
    borderClassName: "border-teal-500/25",
  },
  error: {
    icon: XCircle,
    iconClassName: "text-red-400",
    iconBoxClassName: "bg-red-500/15",
    borderClassName: "border-red-500/25",
  },
  warning: {
    icon: TriangleAlert,
    iconClassName: "text-amber-400",
    iconBoxClassName: "bg-amber-500/15",
    borderClassName: "border-amber-500/25",
  },
  info: {
    icon: Info,
    iconClassName: "text-primary",
    iconBoxClassName: "bg-primary/15",
    borderClassName: "border-primary/25",
  },
};

export function AppToast({ toast, onClose }: AppToastProps) {
  const mounted = useIsClient();

  if (!mounted || !toast) return null;

  const style = toastStyles[toast.type];
  const Icon = style.icon;

  return createPortal(
    <div className="fixed inset-x-0 top-5 z-100000 flex justify-center px-4 pointer-events-none sm:top-7">
      <div
        className={`pointer-events-auto w-full max-w-md overflow-hidden rounded-2xl border ${
          style.borderClassName
        } bg-card/95 shadow-2xl shadow-black/30 backdrop-blur-xl animate-in fade-in slide-in-from-top-4 zoom-in-95 duration-200`}
      >
        <div className="flex items-start gap-3 p-4">
          <div
            className={`mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${style.iconBoxClassName}`}
          >
            <Icon size={20} className={style.iconClassName} />
          </div>

          <div className="min-w-0 flex-1">
            <p className="text-sm font-extrabold text-foreground">
              {toast.title}
            </p>

            {toast.message && (
              <p className="mt-1 text-xs font-medium leading-relaxed text-muted-foreground">
                {toast.message}
              </p>
            )}
          </div>

          <button
            type="button"
            onClick={onClose}
            className="shrink-0 rounded-lg p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            aria-label="Tutup notifikasi"
          >
            <X size={16} />
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}