"use client";

import { DashboardRouteError } from "@/components/dashboard/shared/DashboardRouteError";

interface AdminDashboardErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function AdminDashboardError({
  error,
  reset,
}: AdminDashboardErrorProps) {
  console.error("Admin dashboard error:", error);

  return (
    <DashboardRouteError
      title="Dashboard admin gagal dimuat"
      message="Sistem belum berhasil mengambil ringkasan data admin. Silakan coba muat ulang halaman."
      backHref="/"
      backLabel="Kembali ke beranda"
      reset={reset}
    />
  );
}