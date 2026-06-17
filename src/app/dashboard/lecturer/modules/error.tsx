"use client";

import { DashboardRouteError } from "@/components/dashboard/shared/DashboardRouteError";

interface LecturerModulesErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function LecturerModulesError({
  error,
  reset,
}: LecturerModulesErrorProps) {
  console.error("Lecturer modules page error:", error);

  return (
    <DashboardRouteError
      title="Daftar modul gagal dimuat"
      message="Sistem belum berhasil mengambil daftar modul dosen. Periksa koneksi atau coba muat ulang halaman."
      backHref="/dashboard/lecturer"
      backLabel="Kembali ke dashboard"
      reset={reset}
    />
  );
}