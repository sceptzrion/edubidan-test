import { LayoutGrid } from "lucide-react";

import {
  isCriticalQuestion,
  type LecturerQuizQuestionStat,
} from "@/data/learning/lecturer/lecturer-quiz-preview";

interface LecturerQuestionNavigatorProps {
  questions: LecturerQuizQuestionStat[];
  activeQuestionIndex: number;
  onQuestionChange: (index: number) => void;
}

export function LecturerQuestionNavigator({
  questions,
  activeQuestionIndex,
  onQuestionChange,
}: LecturerQuestionNavigatorProps) {
  return (
    <aside className="bg-card rounded-2xl sm:rounded-3xl border border-border p-5 sm:p-6 shadow-sm lg:sticky lg:top-6">
      <div className="flex items-center gap-2.5 mb-5 border-b border-border/50 pb-3">
        <LayoutGrid size={18} className="text-amber-500" />
        <h3 className="text-base font-extrabold text-foreground">
          Navigasi Soal
        </h3>
      </div>

      <div className="grid grid-cols-5 gap-2 sm:gap-3">
        {questions.map((question, index) => {
          const isActive = activeQuestionIndex === index;
          const isWarning = isCriticalQuestion(question);

          return (
            <button
              key={question.id}
              type="button"
              onClick={() => onQuestionChange(index)}
              className={`relative w-full aspect-square rounded-xl flex items-center justify-center text-sm font-extrabold transition-all ${
                isActive
                  ? "bg-amber-500 text-white shadow-md scale-105"
                  : "bg-muted text-muted-foreground hover:bg-muted/80 hover:text-foreground border border-border"
              }`}
            >
              {index + 1}

              {isWarning && !isActive && (
                <span
                  className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-card"
                  title="Banyak mahasiswa salah di soal ini"
                />
              )}
            </button>
          );
        })}
      </div>

      <div className="mt-6 pt-4 border-t border-border/50 flex flex-col gap-2">
        <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
          <div className="w-3 h-3 rounded-full bg-amber-500" />
          Sedang dilihat
        </div>

        <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
          <div className="w-3 h-3 rounded-full bg-red-500" />
          Indikator evaluasi kritis
        </div>
      </div>
    </aside>
  );
}