"use client";

import { DashboardRouteError } from "@/components/dashboard/shared/DashboardRouteError";

interface StudentModulesErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function StudentModulesError({
  error,
  reset,
}: StudentModulesErrorProps) {
  console.error("Student modules page error:", error);

  return (
    <DashboardRouteError
      title="Modul pembelajaran gagal dimuat"
      message="Sistem belum berhasil mengambil daftar modul yang Anda ikuti. Silakan coba lagi."
      backHref="/dashboard"
      backLabel="Kembali ke dashboard"
      reset={reset}
    />
  );
}