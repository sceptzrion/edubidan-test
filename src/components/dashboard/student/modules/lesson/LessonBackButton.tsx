"use client";

import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

interface LessonBackButtonProps {
  moduleId: number;
}

export function LessonBackButton({ moduleId }: LessonBackButtonProps) {
  const router = useRouter();

  return (
    <button
      type="button"
      onClick={() => router.push(`/dashboard/modules/${moduleId}`)}
      className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm font-bold text-muted-foreground hover:text-foreground mb-4 sm:mb-6 transition-colors w-fit"
    >
      <ArrowLeft size={16} className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
      Kembali ke Detail Modul
    </button>
  );
}