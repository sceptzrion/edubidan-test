"use client";

import { BookOpen, ClipboardList, GraduationCap } from "lucide-react";

import type { LecturerGradebookModule } from "@/data/learning/lecturer/lecturer-gradebook";

interface LecturerGradebookModuleCardProps {
  module: LecturerGradebookModule;
  onOpen: (id: number) => void;
}

export function LecturerGradebookModuleCard({
  module,
  onOpen,
}: LecturerGradebookModuleCardProps) {
  return (
    <article className="bg-card rounded-2xl sm:rounded-3xl border border-border p-5 sm:p-6 hover:shadow-lg hover:border-primary/30 transition-all flex flex-col group">
      <div className="flex items-start justify-between gap-4 mb-4 sm:mb-5">
        <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0 shadow-inner group-hover:scale-110 transition-transform">
          <BookOpen size={20} className="sm:w-6 sm:h-6" />
        </div>

        <span className="text-xs font-bold text-muted-foreground bg-muted/50 px-3 py-1.5 rounded-lg border border-border/50">
          {module.quizCount} Kuis
        </span>
      </div>

      <h3 className="text-lg sm:text-xl font-extrabold text-foreground mb-4 leading-snug line-clamp-2">
        {module.title}
      </h3>

      <div className="flex items-center gap-3 mb-5 sm:mb-6 px-4 py-3 rounded-xl bg-muted/40 border border-border/50">
        <div className="w-8 h-8 rounded-lg bg-background flex items-center justify-center shrink-0 shadow-sm">
          <GraduationCap size={16} className="text-primary" />
        </div>

        <span className="text-sm font-extrabold text-foreground">
          {module.studentCount} Mahasiswa
        </span>
      </div>

      <button
        type="button"
        onClick={() => onOpen(module.id)}
        className="mt-auto w-full py-3 rounded-xl border-2 border-primary text-primary text-xs sm:text-sm font-extrabold hover:bg-primary hover:text-primary-foreground transition-all flex items-center justify-center gap-2 shadow-sm"
      >
        <ClipboardList size={16} />
        Lihat Buku Nilai
      </button>
    </article>
  );
}