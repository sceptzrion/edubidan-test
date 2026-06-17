"use client";

import { DashboardRouteError } from "@/components/dashboard/shared/DashboardRouteError";

interface LecturerDashboardErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function LecturerDashboardError({
  error,
  reset,
}: LecturerDashboardErrorProps) {
  console.error("Lecturer dashboard error:", error);

  return (
    <DashboardRouteError
      title="Dashboard dosen gagal dimuat"
      message="Sistem belum berhasil mengambil ringkasan modul, aktivitas, dan progres pembelajaran. Silakan coba lagi."
      backHref="/"
      backLabel="Kembali ke beranda"
      reset={reset}
    />
  );
}