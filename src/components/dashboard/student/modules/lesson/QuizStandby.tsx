import React from "react";
import {
  Award,
  BarChart3,
  ChevronLeft,
  ChevronRight,
  Eye,
} from "lucide-react";

interface QuizStandbyProps {
  title: string;
  questionCount: string;
  timeLimit: string;
  isCompleted?: boolean;
  latestScore?: number | null;
  latestCorrectCount?: number | null;
  latestTotalQuestions?: number | null;
  onStartQuiz: () => void;
  onPrev?: () => void;
  onNext?: () => void;
  prevLabel?: string;
  nextLabel?: string;
}

function formatScore(value?: number | null) {
  if (typeof value !== "number") {
    return "-";
  }

  return value.toFixed(1);
}

export function QuizStandby({
  title,
  questionCount,
  timeLimit,
  isCompleted = false,
  latestScore,
  latestCorrectCount,
  latestTotalQuestions,
  onStartQuiz,
  onPrev,
  onNext,
  prevLabel,
  nextLabel,
}: QuizStandbyProps) {
  return (
    <div className="bg-card rounded-2xl sm:rounded-3xl border border-border p-6 sm:p-10 shadow-sm flex flex-col items-center justify-center text-center">
      <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-amber-500/10 text-amber-500 flex items-center justify-center mb-5 sm:mb-6 border-4 border-amber-500/20">
        <Award size={32} className="sm:w-10 sm:h-10" />
      </div>

      <h2 className="text-xl sm:text-3xl font-extrabold text-foreground mb-3">
        {title}
      </h2>

      <p className="text-xs sm:text-base text-muted-foreground font-medium mb-8 max-w-md mx-auto leading-relaxed">
        {isCompleted
          ? "Anda sudah pernah mengerjakan kuis ini. Anda dapat melihat hasil terakhir atau mengerjakan ulang jika diperlukan."
          : "Ini adalah evaluasi untuk mengukur pemahaman Anda sejauh ini. Jawab semua pertanyaan dengan memilih satu jawaban yang paling tepat."}
      </p>

      <div className="flex flex-wrap justify-center gap-3 sm:gap-4 mb-8 w-full">
        <div className="flex-1 sm:flex-none bg-muted/50 px-4 py-3 sm:px-6 sm:py-4 rounded-xl sm:rounded-2xl border border-border/50">
          <p className="text-[10px] sm:text-xs text-muted-foreground font-bold uppercase tracking-wider mb-0.5 sm:mb-1">
            Jumlah Soal
          </p>
          <p className="text-lg sm:text-xl font-extrabold text-foreground">
            {questionCount}
          </p>
        </div>

        <div className="flex-1 sm:flex-none bg-muted/50 px-4 py-3 sm:px-6 sm:py-4 rounded-xl sm:rounded-2xl border border-border/50">
          <p className="text-[10px] sm:text-xs text-muted-foreground font-bold uppercase tracking-wider mb-0.5 sm:mb-1">
            Batas Waktu
          </p>
          <p className="text-lg sm:text-xl font-extrabold text-foreground">
            {timeLimit}
          </p>
        </div>

        {isCompleted && (
          <div className="flex-1 sm:flex-none bg-primary/10 px-4 py-3 sm:px-6 sm:py-4 rounded-xl sm:rounded-2xl border border-primary/20">
            <p className="text-[10px] sm:text-xs text-muted-foreground font-bold uppercase tracking-wider mb-0.5 sm:mb-1">
              Nilai Terakhir
            </p>
            <p className="text-lg sm:text-xl font-extrabold text-primary">
              {formatScore(latestScore)}
            </p>
          </div>
        )}
      </div>

      {isCompleted && (
        <div className="rounded-2xl border border-primary/15 bg-primary/5 px-5 py-4 mb-8 w-full max-w-md">
          <div className="flex items-center justify-center gap-2 text-primary mb-1">
            <BarChart3 size={16} />
            <p className="text-xs font-extrabold uppercase tracking-wider">
              Hasil Kuis Terakhir
            </p>
          </div>
          <p className="text-sm font-bold text-foreground">
            {latestCorrectCount ?? 0} dari {latestTotalQuestions ?? questionCount}{" "}
            jawaban benar
          </p>
        </div>
      )}

      <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-8 w-full mt-2">
        <button
          type="button"
          onClick={onPrev}
          disabled={!onPrev}
          className={`hidden sm:flex items-center gap-2 text-sm font-bold text-muted-foreground hover:text-foreground transition-colors ${
            !onPrev ? "invisible" : ""
          }`}
        >
          <ChevronLeft size={18} /> {prevLabel || "Sebelumnya"}
        </button>

        <button
          type="button"
          onClick={onStartQuiz}
          className="w-full sm:w-auto bg-amber-500 text-white px-8 sm:px-10 py-3.5 sm:py-4 rounded-xl text-sm sm:text-base font-extrabold hover:bg-amber-600 transition-all shadow-lg shadow-amber-500/20 hover:-translate-y-1 shrink-0 flex items-center justify-center gap-2"
        >
          {isCompleted ? (
            <>
              <Eye size={17} />
              Lihat Hasil
            </>
          ) : (
            "Buka Halaman Kuis"
          )}
        </button>

        <button
          type="button"
          onClick={onNext}
          disabled={!onNext}
          className={`hidden sm:flex items-center gap-2 text-sm font-bold text-muted-foreground hover:text-foreground transition-colors ${
            !onNext ? "invisible" : ""
          }`}
        >
          {nextLabel || "Selanjutnya"} <ChevronRight size={18} />
        </button>
      </div>

      <div className="flex sm:hidden items-center justify-between w-full mt-4 pt-4 border-t border-border/50">
        <button
          type="button"
          onClick={onPrev}
          disabled={!onPrev}
          className={`flex items-center gap-1.5 text-xs font-bold text-muted-foreground hover:text-foreground transition-colors ${
            !onPrev ? "invisible" : ""
          }`}
        >
          <ChevronLeft size={16} /> Prev
        </button>
        <button
          type="button"
          onClick={onNext}
          disabled={!onNext}
          className={`flex items-center gap-1.5 text-xs font-bold text-muted-foreground hover:text-foreground transition-colors ${
            !onNext ? "invisible" : ""
          }`}
        >
          Next <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
}