"use client";

import { useEffect } from "react";
import { createPortal } from "react-dom";
import { AlertTriangle, Loader2, LogOut, X } from "lucide-react";

import { useIsClient } from "@/hooks/useIsClient";
import type { StudentModuleCardItem } from "@/data/learning/student/student-learning.server";

interface LeaveModuleConfirmModalProps {
  module: StudentModuleCardItem;
  isLeaving: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export function LeaveModuleConfirmModal({
  module,
  isLeaving,
  onClose,
  onConfirm,
}: LeaveModuleConfirmModalProps) {
  const mounted = useIsClient();

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, []);

  if (!mounted) return null;

  return createPortal(
    <div className="fixed inset-0 z-9999 flex items-center justify-center p-4">
      <button
        type="button"
        onClick={isLeaving ? undefined : onClose}
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        aria-label="Tutup konfirmasi keluar modul"
      />

      <div className="relative z-10 w-full max-w-md overflow-hidden rounded-3xl border border-border bg-card shadow-2xl animate-in zoom-in-95 duration-200">
        <div className="flex items-start justify-between gap-4 border-b border-border p-5 sm:p-6">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-red-500/10 text-red-500">
              <AlertTriangle size={24} />
            </div>

            <div>
              <h2 className="text-lg font-extrabold text-foreground">
                Keluar dari Modul?
              </h2>

              <p className="mt-1 text-xs font-medium leading-relaxed text-muted-foreground sm:text-sm">
                Modul ini akan dihapus dari daftar Modul Saya.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={isLeaving}
            className="rounded-xl p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground disabled:cursor-not-allowed disabled:opacity-60"
            aria-label="Tutup modal"
          >
            <X size={18} />
          </button>
        </div>

        <div className="p-5 sm:p-6">
          <div className="mb-5 rounded-2xl border border-border bg-muted/20 p-4">
            <p className="text-sm font-extrabold text-foreground">
              {module.title}
            </p>

            <p className="mt-1 line-clamp-2 text-xs font-medium text-muted-foreground">
              {module.desc}
            </p>

            <div className="mt-3 flex flex-wrap gap-2">
              <span className="rounded-lg border border-border bg-card px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-wider text-muted-foreground">
                {module.lessons} Materi
              </span>

              <span className="rounded-lg border border-border bg-card px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-wider text-muted-foreground">
                {module.quizzes} Kuis
              </span>

              <span className="rounded-lg border border-primary/20 bg-primary/10 px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-wider text-primary">
                {module.progress}% Selesai
              </span>
            </div>
          </div>

          <p className="text-xs font-medium leading-relaxed text-muted-foreground sm:text-sm">
            Progress belajar dan riwayat kuis tidak dihapus dari sistem. Anda
            dapat bergabung kembali menggunakan kode modul apabila diperlukan.
          </p>
        </div>

        <div className="flex flex-col-reverse gap-3 border-t border-border bg-muted/10 p-5 sm:flex-row sm:justify-end sm:p-6">
          <button
            type="button"
            onClick={onClose}
            disabled={isLeaving}
            className="w-full rounded-xl border border-border px-5 py-3 text-sm font-bold text-foreground transition-colors hover:bg-muted disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
          >
            Batal
          </button>

          <button
            type="button"
            onClick={onConfirm}
            disabled={isLeaving}
            className="w-full rounded-xl bg-red-500 px-5 py-3 text-sm font-extrabold text-white shadow-lg shadow-red-500/20 transition-colors hover:bg-red-600 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
          >
            <span className="flex items-center justify-center gap-2">
              {isLeaving ? (
                <Loader2 size={16} className="animate-spin" />
              ) : (
                <LogOut size={16} />
              )}
              {isLeaving ? "Memproses..." : "Keluar dari Modul"}
            </span>
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}