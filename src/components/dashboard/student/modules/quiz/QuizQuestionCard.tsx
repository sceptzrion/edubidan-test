import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Flag,
  XCircle,
} from "lucide-react";

interface QuizQuestionCardProps {
  currentQ: number;
  totalQuestions: number;
  question: string;
  mediaUrl?: string | null;
  options: string[];
  selectedAnswer: number | null;
  isFlagged: boolean;
  isSubmitDisabled: boolean;
  isReviewMode?: boolean;
  correctAnswer?: number;
  onSelectOption: (index: number) => void;
  onFlag: () => void;
  onPrev: () => void;
  onNext: () => void;
  onSubmit: () => void;
  onExitReview?: () => void;
}

export function QuizQuestionCard({
  currentQ,
  totalQuestions,
  question,
  mediaUrl,
  options,
  selectedAnswer,
  isFlagged,
  isSubmitDisabled,
  isReviewMode,
  correctAnswer,
  onSelectOption,
  onFlag,
  onPrev,
  onNext,
  onSubmit,
  onExitReview,
}: QuizQuestionCardProps) {
  return (
    <div className="w-full max-w-xl mb-auto mt-2 sm:mt-10 animate-in slide-in-from-right-8 duration-300">
      <div className="flex items-center justify-between mb-4 sm:mb-6">
        <span className="text-[10px] sm:text-xs font-bold text-muted-foreground uppercase tracking-widest">
          Soal {currentQ + 1}{" "}
          <span className="opacity-50">dari {totalQuestions}</span>
        </span>

        {!isReviewMode && (
          <button
            type="button"
            onClick={onFlag}
            className={`flex items-center gap-1.5 sm:gap-2 text-[10px] sm:text-xs font-bold px-2.5 py-1.5 sm:px-3 sm:py-1.5 rounded-lg transition-all border ${
              isFlagged
                ? "bg-amber-500/10 text-amber-500 border-amber-500/30"
                : "bg-muted text-muted-foreground border-transparent hover:text-foreground"
            }`}
          >
            <Flag size={14} className={isFlagged ? "fill-amber-500" : ""} />
            {isFlagged ? "Ditandai" : "Tandai Ragu"}
          </button>
        )}

        {isReviewMode && (
          <span className="text-[10px] sm:text-xs font-bold text-primary bg-primary/10 px-3 py-1.5 rounded-lg">
            Mode Ulasan
          </span>
        )}
      </div>

      <div className="w-full h-1.5 sm:h-2 bg-muted rounded-full overflow-hidden mb-6 sm:mb-8 shrink-0">
        <div
          className="h-full bg-amber-500 rounded-full transition-all duration-500 ease-out"
          style={{ width: `${((currentQ + 1) / totalQuestions) * 100}%` }}
        />
      </div>

      <div className="bg-card rounded-2xl sm:rounded-3xl border border-border p-5 sm:p-8 shadow-sm mb-6 sm:mb-8">
        <h2 className="text-sm sm:text-lg font-extrabold text-foreground mb-4 sm:mb-5 leading-relaxed">
          {question}
        </h2>

        {mediaUrl && (
          <div className="mb-6 sm:mb-8 overflow-hidden rounded-2xl border border-border bg-muted/20">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={mediaUrl}
              alt={`Gambar pendukung soal ${currentQ + 1}`}
              className="w-full max-h-72 object-contain bg-muted/10"
            />
          </div>
        )}

        <div className="space-y-3 sm:space-y-4">
          {options.map((opt, i) => {
            const isSelected = selectedAnswer === i;
            const isCorrectOption = isReviewMode && correctAnswer === i;
            const isWrongSelection =
              isReviewMode && isSelected && correctAnswer !== i;

            let btnClass =
              "border-border hover:border-amber-500/40 hover:bg-muted/50 text-muted-foreground hover:text-foreground";
            let letterClass = "bg-muted text-muted-foreground border border-border";

            if (isReviewMode) {
              if (isCorrectOption) {
                btnClass =
                  "border-green-500 bg-green-500/10 text-foreground shadow-md shadow-green-500/10";
                letterClass = "bg-green-500 text-white border-green-500";
              } else if (isWrongSelection) {
                btnClass =
                  "border-red-500 bg-red-500/10 text-foreground shadow-md shadow-red-500/10";
                letterClass = "bg-red-500 text-white border-red-500";
              } else {
                btnClass =
                  "border-border bg-transparent text-muted-foreground opacity-60 cursor-default";
                letterClass = "bg-muted text-muted-foreground border border-border";
              }
            } else if (isSelected) {
              btnClass =
                "border-amber-500 bg-amber-500/5 text-foreground shadow-md shadow-amber-500/10";
              letterClass = "bg-amber-500 text-white border-amber-500";
            }

            return (
              <button
                key={i}
                type="button"
                onClick={() => !isReviewMode && onSelectOption(i)}
                disabled={isReviewMode}
                className={`w-full p-3.5 sm:p-4 rounded-xl sm:rounded-2xl border-2 text-left transition-all flex items-center gap-3 sm:gap-4 outline-none ${btnClass}`}
              >
                <div
                  className={`w-6 h-6 sm:w-8 sm:h-8 rounded-full flex items-center justify-center shrink-0 text-[10px] sm:text-xs font-extrabold transition-colors ${letterClass}`}
                >
                  {String.fromCharCode(65 + i)}
                </div>

                <span className="text-xs sm:text-sm font-semibold leading-relaxed flex-1">
                  {opt}
                </span>

                {isCorrectOption && (
                  <CheckCircle2 size={20} className="text-green-500 shrink-0" />
                )}
                {isWrongSelection && (
                  <XCircle size={20} className="text-red-500 shrink-0" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={onPrev}
          disabled={currentQ === 0}
          className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm font-bold text-muted-foreground hover:text-foreground disabled:opacity-30 transition-colors px-2 py-2"
        >
          <ArrowLeft size={16} className="sm:w-4.5 sm:h-4.5" />
          <span className="hidden sm:inline">Sebelumnya</span>
          <span className="sm:hidden">Prev</span>
        </button>

        {currentQ === totalQuestions - 1 ? (
          isReviewMode ? (
            <button
              type="button"
              onClick={onExitReview}
              className="bg-card border border-border text-foreground px-6 sm:px-8 py-3 sm:py-3.5 rounded-xl font-bold shadow-sm text-xs sm:text-sm hover:bg-muted transition-all hover:-translate-y-0.5"
            >
              Tutup Ulasan
            </button>
          ) : (
            <button
              type="button"
              onClick={onSubmit}
              disabled={isSubmitDisabled}
              className="bg-primary text-white px-6 sm:px-8 py-3 sm:py-3.5 rounded-xl font-bold shadow-lg shadow-primary/20 text-xs sm:text-sm hover:bg-primary/90 transition-all hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:shadow-none"
            >
              Submit
            </button>
          )
        ) : (
          <button
            type="button"
            onClick={onNext}
            className="bg-amber-500 text-white px-6 sm:px-8 py-3 sm:py-3.5 rounded-xl font-bold shadow-lg shadow-amber-500/20 flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm hover:bg-amber-600 transition-all hover:-translate-y-0.5"
          >
            <span className="hidden sm:inline">Selanjutnya</span>
            <span className="sm:hidden">Next</span>
            <ArrowRight size={16} className="sm:w-4.5 sm:h-4.5" />
          </button>
        )}
      </div>
    </div>
  );
}