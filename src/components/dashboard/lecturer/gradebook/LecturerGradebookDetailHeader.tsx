import Link from "next/link";
import { BarChart3, GraduationCap } from "lucide-react";

import type { LecturerGradebookDetail } from "@/data/learning/lecturer/lecturer-gradebook";

interface LecturerGradebookDetailHeaderProps {
  data: LecturerGradebookDetail;
}

export function LecturerGradebookDetailHeader({
  data,
}: LecturerGradebookDetailHeaderProps) {
  return (
    <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4 mb-6 sm:mb-8">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-foreground leading-tight">
          Buku Nilai: {data.title}
        </h1>

        <p className="text-xs sm:text-sm font-medium text-muted-foreground mt-2 flex items-center gap-2">
          <GraduationCap size={16} className="text-primary shrink-0" />
          {data.students.length} mahasiswa terdaftar • {data.quizzes.length}{" "}
          kuis evaluasi
        </p>
      </div>

      <Link
        href={`/dashboard/lecturer/gradebook/${data.id}/quiz-analysis`}
        className="w-full sm:w-auto px-5 py-3 rounded-xl bg-primary text-primary-foreground text-sm font-extrabold flex items-center justify-center gap-2 hover:bg-primary/90 shadow-md shadow-primary/20 transition-all hover:-translate-y-0.5"
      >
        <BarChart3 size={17} />
        Analisis Kuis
      </Link>
    </div>
  );
}