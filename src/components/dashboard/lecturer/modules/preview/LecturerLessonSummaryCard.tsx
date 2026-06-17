import { Clock, User } from "lucide-react";

import type { LecturerLessonPreviewDetail } from "@/data/learning/lecturer/lecturer-content-preview";

interface LecturerLessonSummaryCardProps {
  lesson: LecturerLessonPreviewDetail;
}

export function LecturerLessonSummaryCard({
  lesson,
}: LecturerLessonSummaryCardProps) {
  return (
    <section className="bg-card rounded-2xl sm:rounded-3xl border border-border p-5 sm:p-8 shadow-sm">
      <h1 className="text-2xl sm:text-3xl font-extrabold text-foreground mb-4 leading-tight">
        {lesson.title}
      </h1>

      <div className="flex flex-wrap items-center gap-4 sm:gap-6 text-xs sm:text-sm font-bold text-muted-foreground mb-6 pb-6 border-b border-border/50">
        <span className="flex items-center gap-2">
          <User size={16} className="text-primary" />
          Instruktur Modul
        </span>

        <span className="flex items-center gap-2">
          <Clock size={16} className="text-teal-500" />
          Durasi Video: {lesson.duration}
        </span>
      </div>

      <div>
        <h2 className="text-foreground font-extrabold text-base sm:text-lg mb-3">
          Ringkasan Materi
        </h2>

        {lesson.summary ? (
          <p className="text-xs sm:text-sm text-muted-foreground font-medium leading-relaxed whitespace-pre-line">
            {lesson.summary}
          </p>
        ) : (
          <p className="text-xs sm:text-sm text-muted-foreground italic">
            Belum ada ringkasan materi yang ditulis.
          </p>
        )}
      </div>
    </section>
  );
}