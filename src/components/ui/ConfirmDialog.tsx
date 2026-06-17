"use client";

import { AlertTriangle, Loader2, X } from "lucide-react";
import { createPortal } from "react-dom";

import { useIsClient } from "@/hooks/useIsClient";

interface ConfirmDialogProps {
  open: boolean;
  title: string;
  description: string;
  confirmLabel?: string;
  cancelLabel?: string;
  isLoading?: boolean;
  variant?: "danger" | "default";
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmDialog({
  open,
  title,
  description,
  confirmLabel = "Konfirmasi",
  cancelLabel = "Batal",
  isLoading = false,
  variant = "default",
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  const mounted = useIsClient();

  if (!open || !mounted) return null;

  const isDanger = variant === "danger";

  return createPortal(
    <div className="fixed inset-0 z-99999 flex items-center justify-center p-4 sm:p-6">
      <button
        type="button"
        onClick={isLoading ? undefined : onCancel}
        className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200"
        aria-label="Tutup dialog konfirmasi"
      />

      <div className="relative z-10 w-full max-w-md overflow-hidden rounded-2xl sm:rounded-3xl border border-border bg-card shadow-2xl animate-in zoom-in-95 fade-in duration-200">
        <div className="flex items-start gap-4 p-5 sm:p-6 border-b border-border bg-card">
          <div
            className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl ${
              isDanger
                ? "bg-red-500/15 text-red-400"
                : "bg-primary/15 text-primary"
            }`}
          >
            <AlertTriangle size={22} />
          </div>

          <div className="min-w-0 flex-1">
            <h2 className="text-base sm:text-lg font-extrabold text-foreground leading-snug">
              {title}
            </h2>

            <p className="mt-1.5 text-xs sm:text-sm font-medium text-muted-foreground leading-relaxed">
              {description}
            </p>
          </div>

          <button
            type="button"
            onClick={onCancel}
            disabled={isLoading}
            className="rounded-xl p-2 text-muted-foreground transition hover:bg-muted hover:text-foreground disabled:cursor-not-allowed disabled:opacity-50"
            aria-label="Tutup"
          >
            <X size={18} />
          </button>
        </div>

        <div className="flex flex-col-reverse gap-3 p-4 sm:flex-row sm:justify-end sm:p-5 bg-muted/20">
          <button
            type="button"
            onClick={onCancel}
            disabled={isLoading}
            className="w-full sm:w-auto rounded-xl border border-border bg-card px-5 py-3 text-xs sm:text-sm font-extrabold text-foreground transition hover:bg-muted disabled:cursor-not-allowed disabled:opacity-50"
          >
            {cancelLabel}
          </button>

          <button
            type="button"
            onClick={onConfirm}
            disabled={isLoading}
            className={`w-full sm:w-auto rounded-xl px-5 py-3 text-xs sm:text-sm font-extrabold transition flex items-center justify-center gap-2 disabled:cursor-not-allowed disabled:opacity-60 ${
              isDanger
                ? "bg-red-500 text-white hover:bg-red-600"
                : "bg-primary text-primary-foreground hover:bg-primary/90"
            }`}
          >
            {isLoading && <Loader2 size={16} className="animate-spin" />}
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}