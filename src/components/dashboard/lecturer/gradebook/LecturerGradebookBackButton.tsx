"use client";

import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

export function LecturerGradebookBackButton() {
  const router = useRouter();

  return (
    <button
      type="button"
      onClick={() => router.push("/dashboard/lecturer/gradebook")}
      className="flex items-center gap-2 text-xs sm:text-sm font-bold text-muted-foreground hover:text-foreground mb-6 sm:mb-8 transition-colors bg-muted/30 hover:bg-muted w-fit px-4 py-2.5 rounded-xl border border-border/50"
    >
      <ArrowLeft size={16} />
      Kembali ke Rekap Nilai
    </button>
  );
}