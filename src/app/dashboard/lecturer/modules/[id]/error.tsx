"use client";

import { DashboardRouteError } from "@/components/dashboard/shared/DashboardRouteError";

interface LecturerModuleDetailErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function LecturerModuleDetailError({
  error,
  reset,
}: LecturerModuleDetailErrorProps) {
  console.error("Lecturer module detail page error:", error);

  return (
    <DashboardRouteError
      title="Detail modul gagal dimuat"
      message="Sistem belum berhasil mengambil detail modul, susunan materi, atau data kuis. Silakan coba lagi."
      backHref="/dashboard/lecturer/modules"
      backLabel="Kembali ke daftar modul"
      reset={reset}
    />
  );
}