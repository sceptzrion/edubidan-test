"use client";

import { DashboardRouteError } from "@/components/dashboard/shared/DashboardRouteError";

interface StudentModuleDetailErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function StudentModuleDetailError({
  error,
  reset,
}: StudentModuleDetailErrorProps) {
  console.error("Student module detail page error:", error);

  return (
    <DashboardRouteError
      title="Detail pembelajaran gagal dimuat"
      message="Sistem belum berhasil mengambil detail modul, progres belajar, atau susunan pembelajaran. Silakan coba lagi."
      backHref="/dashboard/modules"
      backLabel="Kembali ke modul saya"
      reset={reset}
    />
  );
}