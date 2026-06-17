"use client";

import { DashboardRouteError } from "@/components/dashboard/shared/DashboardRouteError";

interface StudentDashboardErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function StudentDashboardError({
  error,
  reset,
}: StudentDashboardErrorProps) {
  console.error("Student dashboard error:", error);

  return (
    <DashboardRouteError
      title="Dashboard mahasiswa gagal dimuat"
      message="Sistem belum berhasil mengambil progres belajar, kuis tertunda, dan modul terakhir. Silakan coba lagi."
      backHref="/"
      backLabel="Kembali ke beranda"
      reset={reset}
    />
  );
}