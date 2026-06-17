"use client";

import { useEffect } from "react";
import { useIsClient } from "@/hooks/useIsClient";
import { createPortal } from "react-dom";
import { AlertTriangle, X } from "lucide-react";

import type { AdminUser } from "@/data/learning/admin/admin-users";

interface DeleteUserConfirmModalProps {
  user: AdminUser;
  onClose: () => void;
  onConfirm: (id: number) => void;
}

export function DeleteUserConfirmModal({
  user,
  onClose,
  onConfirm,
}: DeleteUserConfirmModalProps) {
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
        onClick={onClose}
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        aria-label="Tutup konfirmasi hapus permanen pengguna"
      />

      <div className="relative z-10 w-full max-w-md overflow-hidden rounded-3xl border border-border bg-card shadow-2xl animate-in zoom-in-95 duration-200">
        <div className="flex items-start justify-between gap-4 border-b border-border p-5 sm:p-6">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-red-500/10 text-red-500">
              <AlertTriangle size={24} />
            </div>

            <div>
              <h2 className="text-lg font-extrabold text-foreground">
                Hapus Permanen Pengguna?
              </h2>

              <p className="mt-1 text-xs font-medium leading-relaxed text-muted-foreground sm:text-sm">
                Aksi hapus permanen hanya tersedia untuk akun yang sudah
                dinonaktifkan.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-xl p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            aria-label="Tutup modal"
          >
            <X size={18} />
          </button>
        </div>

        <div className="p-5 sm:p-6">
          <div className="mb-5 rounded-2xl border border-border bg-muted/20 p-4">
            <p className="text-sm font-extrabold text-foreground">
              {user.name}
            </p>

            <p className="mt-1 wrap-break-words text-xs font-medium text-muted-foreground">
              {user.email}
            </p>

            <div className="mt-3 flex flex-wrap gap-2">
              <span className="rounded-lg border border-border bg-card px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-wider text-muted-foreground">
                {user.role}
              </span>

              <span className="rounded-lg border border-border bg-card px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-wider text-muted-foreground">
                {user.identityNo}
              </span>

              <span className="rounded-lg border border-red-500/20 bg-red-500/10 px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-wider text-red-500">
                {user.status}
              </span>
            </div>
          </div>

          <p className="text-xs font-medium leading-relaxed text-muted-foreground sm:text-sm">
            Data pengguna akan dihapus permanen dari sistem. Pastikan akun sudah
            dinonaktifkan dan tidak lagi diperlukan sebelum melanjutkan aksi ini.
          </p>
        </div>

        <div className="flex flex-col-reverse gap-3 border-t border-border bg-muted/10 p-5 sm:flex-row sm:justify-end sm:p-6">
          <button
            type="button"
            onClick={onClose}
            className="w-full rounded-xl border border-border px-5 py-3 text-sm font-bold text-foreground transition-colors hover:bg-muted sm:w-auto"
          >
            Batal
          </button>

          <button
            type="button"
            onClick={() => onConfirm(user.id)}
            className="w-full rounded-xl bg-red-500 px-5 py-3 text-sm font-extrabold text-white shadow-lg shadow-red-500/20 transition-colors hover:bg-red-600 sm:w-auto"
          >
            Hapus Permanen
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}