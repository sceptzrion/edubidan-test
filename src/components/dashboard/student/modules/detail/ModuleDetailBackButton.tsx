"use client";

import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

export function ModuleDetailBackButton() {
  const router = useRouter();

  return (
    <button
      type="button"
      onClick={() => router.push("/dashboard/modules")}
      className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm font-bold text-muted-foreground hover:text-foreground mb-4 sm:mb-6 transition-colors w-fit"
    >
      <ArrowLeft size={16} />
      Kembali ke Daftar Modul
    </button>
  );
}