import { BarChart3, CheckCircle2 } from "lucide-react";

import type { LecturerQuizQuestionStat } from "@/data/learning/lecturer/lecturer-quiz-preview";

interface LecturerQuestionAnalysisCardProps {
  question: LecturerQuizQuestionStat;
  questionIndex: number;
  totalQuestions: number;
}

function getOptionLabel(index: number) {
  return String.fromCharCode(65 + index);
}

export function LecturerQuestionAnalysisCard({
  question,
  questionIndex,
  totalQuestions,
}: LecturerQuestionAnalysisCardProps) {
  return (
    <section className="bg-card rounded-2xl sm:rounded-3xl border border-border p-5 sm:p-8 shadow-sm relative overflow-hidden">
      <div className="flex items-center justify-between mb-6 border-b border-border/50 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500 text-white flex items-center justify-center font-extrabold shadow-sm">
            {questionIndex + 1}
          </div>

          <h2 className="text-sm font-extrabold text-muted-foreground uppercase tracking-widest">
            Pertanyaan {questionIndex + 1} dari {totalQuestions}
          </h2>
        </div>
      </div>

      <div className="mb-8 space-y-4">
        <p className="text-lg sm:text-xl font-extrabold text-foreground leading-relaxed">
          {question.questionText}
        </p>

        {question.mediaUrl && (
          <div className="overflow-hidden rounded-2xl border border-border bg-muted/20">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={question.mediaUrl}
              alt={`Gambar pendukung pertanyaan ${questionIndex + 1}`}
              className="w-full max-h-80 object-contain bg-muted/10"
            />
          </div>
        )}
      </div>

      <div className="space-y-4">
        <p className="text-xs font-bold text-muted-foreground mb-2 flex items-center gap-1.5">
          <BarChart3 size={14} />
          Distribusi Jawaban Mahasiswa
        </p>

        {question.options.map((option, optionIndex) => {
          const isCorrect = option.id === question.correctOptionId;
          const optionLabel = getOptionLabel(optionIndex);

          return (
            <div
              key={option.id}
              className={`relative overflow-hidden rounded-xl border p-4 transition-all ${
                isCorrect
                  ? "border-green-500 bg-green-500/5"
                  : "border-border bg-card"
              }`}
            >
              <div
                className={`absolute inset-y-0 left-0 opacity-20 transition-all duration-700 ease-out ${
                  isCorrect ? "bg-green-500" : "bg-muted-foreground"
                }`}
                style={{ width: `${option.percentage}%` }}
              />

              <div className="relative z-10 flex items-start gap-3">
                <div
                  className={`w-6 h-6 rounded-md flex items-center justify-center text-xs font-extrabold shrink-0 mt-0.5 ${
                    isCorrect
                      ? "bg-green-500 text-white"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  {optionLabel}
                </div>

                <div className="flex-1 min-w-0 pr-4">
                  <p
                    className={`text-sm sm:text-base font-bold leading-relaxed ${
                      isCorrect ? "text-foreground" : "text-muted-foreground"
                    }`}
                  >
                    {option.text}
                  </p>

                  {isCorrect && (
                    <p className="text-xs font-bold text-green-500 flex items-center gap-1 mt-1">
                      <CheckCircle2 size={12} />
                      Kunci Jawaban
                    </p>
                  )}
                </div>

                <div className="shrink-0 text-right">
                  <p className="text-lg font-extrabold text-foreground">
                    {option.percentage}%
                  </p>
                  <p className="text-[10px] sm:text-xs font-bold text-muted-foreground">
                    {option.pickedCount} orang
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}