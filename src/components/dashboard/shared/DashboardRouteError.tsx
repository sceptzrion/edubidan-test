"use client";

import Link from "next/link";
import { AlertTriangle, RefreshCcw } from "lucide-react";

interface DashboardRouteErrorProps {
  title?: string;
  message?: string;
  backHref?: string;
  backLabel?: string;
  reset: () => void;
}

export function DashboardRouteError({
  title = "Halaman gagal dimuat",
  message = "Terjadi kesalahan saat mengambil data. Silakan coba lagi.",
  backHref = "/dashboard",
  backLabel = "Kembali ke dashboard",
  reset,
}: DashboardRouteErrorProps) {
  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-lg rounded-2xl sm:rounded-3xl border border-border bg-card p-6 sm:p-8 text-center shadow-sm">
        <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-destructive/10 text-destructive">
          <AlertTriangle size={28} />
        </div>

        <h1 className="text-xl sm:text-2xl font-extrabold text-foreground">
          {title}
        </h1>

        <p className="mt-3 text-sm sm:text-base font-medium leading-relaxed text-muted-foreground">
          {message}
        </p>

        <div className="mt-6 flex flex-col sm:flex-row gap-3">
          <button
            type="button"
            onClick={reset}
            className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-4 py-3 text-sm font-extrabold text-primary-foreground transition hover:bg-primary/90"
          >
            <RefreshCcw size={16} />
            Coba Lagi
          </button>

          <Link
            href={backHref}
            className="flex-1 inline-flex items-center justify-center rounded-xl border border-border bg-card px-4 py-3 text-sm font-extrabold text-foreground transition hover:bg-muted"
          >
            {backLabel}
          </Link>
        </div>
      </div>
    </div>
  );
}