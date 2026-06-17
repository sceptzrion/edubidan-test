import { Clock, LayoutGrid } from "lucide-react";

import type { LecturerQuizInfo } from "@/data/learning/lecturer/lecturer-quiz-preview";

interface LecturerQuizPreviewHeaderProps {
  quizInfo: LecturerQuizInfo;
}

export function LecturerQuizPreviewHeader({
  quizInfo,
}: LecturerQuizPreviewHeaderProps) {
  return (
    <div className="mb-6 sm:mb-8">
      <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-foreground mb-2 leading-tight">
        {quizInfo.title}
      </h1>

      <div className="flex flex-wrap items-center gap-4 text-xs sm:text-sm font-bold text-muted-foreground">
        <span className="flex items-center gap-1.5">
          <Clock size={16} className="text-amber-500" />
          Durasi: {quizInfo.duration}
        </span>

        <span className="flex items-center gap-1.5">
          <LayoutGrid size={16} className="text-amber-500" />
          {quizInfo.totalQuestions} Pertanyaan
        </span>
      </div>
    </div>
  );
}