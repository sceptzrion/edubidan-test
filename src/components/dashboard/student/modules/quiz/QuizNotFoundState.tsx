"use client";

import { useRouter } from "next/navigation";

interface QuizNotFoundStateProps {
  moduleId: number;
}

export function QuizNotFoundState({ moduleId }: QuizNotFoundStateProps) {
  const router = useRouter();

  return (
    <div className="fixed inset-0 z-100 bg-background flex items-center justify-center p-6">
      <div className="bg-card rounded-3xl border border-border p-8 text-center max-w-md w-full">
        <h1 className="text-xl font-extrabold text-foreground mb-2">
          Kuis tidak ditemukan
        </h1>

        <p className="text-sm text-muted-foreground mb-6">
          Kuis yang Anda buka tidak tersedia atau belum memiliki soal.
        </p>

        <button
          type="button"
          onClick={() => router.push(`/dashboard/modules/${moduleId}`)}
          className="px-5 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-extrabold"
        >
          Kembali ke Detail Modul
        </button>
      </div>
    </div>
  );
}