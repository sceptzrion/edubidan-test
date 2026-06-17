"use client";

import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

interface LecturerPreviewBackButtonProps {
  moduleId: string;
}

export function LecturerPreviewBackButton({
  moduleId,
}: LecturerPreviewBackButtonProps) {
  const router = useRouter();

  return (
    <button
      type="button"
      onClick={() => router.push(`/dashboard/lecturer/modules/${moduleId}`)}
      className="flex items-center gap-2 text-xs sm:text-sm font-bold text-muted-foreground hover:text-foreground transition-colors bg-card border border-border px-4 py-2.5 rounded-xl hover:bg-muted shadow-sm w-fit"
    >
      <ArrowLeft size={16} />
      Kembali ke Editor Modul
    </button>
  );
}