import {
  BookOpen,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Clock,
  Loader2,
  User,
} from "lucide-react";

interface SummaryProps {
  moduleTitle: string;
  instructorName: string;
  title: string;
  description: string;
  duration: string;
  isCompleted: boolean;
  isSavingProgress?: boolean;
  onPrev?: () => void;
  onNext: () => void;
  nextLabel: string;
}

export function Summary({
  moduleTitle,
  instructorName,
  title,
  description,
  duration,
  isCompleted,
  isSavingProgress = false,
  onPrev,
  onNext,
  nextLabel,
}: SummaryProps) {
  return (
    <div className="bg-card rounded-2xl sm:rounded-3xl border border-border p-5 sm:p-8 shadow-sm flex flex-col h-full">
      <div className="shrink-0">
        <div className="flex flex-wrap items-center gap-2 text-[10px] sm:text-xs font-bold text-primary mb-2 sm:mb-3">
          <span className="inline-flex items-center gap-1.5">
            <BookOpen size={14} className="sm:w-4 sm:h-4" />
            Modul: {moduleTitle}
          </span>

          {isCompleted && (
            <span className="inline-flex items-center gap-1 rounded-full bg-green-500/10 text-green-500 px-2 py-1">
              <CheckCircle2 size={12} />
              Selesai
            </span>
          )}
        </div>

        <h2 className="text-xl sm:text-3xl font-extrabold text-foreground mb-4 sm:mb-6 leading-tight">
          {title}
        </h2>

        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6 text-xs sm:text-sm text-muted-foreground mb-6 sm:mb-8">
          <span className="flex items-center gap-2">
            <User size={14} className="text-primary sm:w-4 sm:h-4" />
            Instruktur:{" "}
            <strong className="text-foreground font-bold">
              {instructorName}
            </strong>
          </span>
          <span className="flex items-center gap-2">
            <Clock size={14} className="text-primary sm:w-4 sm:h-4" />
            Estimasi Waktu:{" "}
            <strong className="text-foreground font-bold">{duration}</strong>
          </span>
        </div>

        <h3 className="text-base sm:text-lg font-extrabold text-foreground mb-3 sm:mb-4">
          Ringkasan Materi
        </h3>
      </div>

      <div className="flex-1 min-h-0 overflow-y-auto scrollbar-thin pr-2 sm:pr-3 mb-6">
        {description ? (
          <p className="text-xs sm:text-base text-muted-foreground font-medium leading-relaxed whitespace-pre-line pb-2">
            {description}
          </p>
        ) : (
          <p className="text-xs sm:text-base text-muted-foreground font-medium leading-relaxed italic">
            Belum ada ringkasan materi.
          </p>
        )}
      </div>

      <div className="shrink-0 mt-auto flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4 pt-5 sm:pt-6 border-t border-border">
        <button
          type="button"
          onClick={onPrev}
          disabled={!onPrev || isSavingProgress}
          className="disabled:text-transparent disabled:hidden disabled:sm:block w-full sm:w-auto flex items-center justify-center gap-2 text-xs sm:text-sm font-bold text-muted-foreground hover:text-foreground disabled:opacity-30 transition-colors py-2 sm:py-0"
        >
          <ChevronLeft size={16} className="sm:w-4.5 sm:h-4.5" /> Pelajaran
          Sebelumnya
        </button>

        <button
          type="button"
          onClick={onNext}
          disabled={isSavingProgress}
          className="w-full sm:w-auto flex items-center justify-center gap-2 text-xs sm:text-sm bg-primary text-primary-foreground px-5 sm:px-6 py-3 rounded-xl font-bold shadow-md shadow-primary/20 hover:opacity-90 transition-all hover:scale-[1.02] disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100"
        >
          {isSavingProgress && <Loader2 size={16} className="animate-spin" />}
          {isSavingProgress ? "Menyimpan Progres..." : nextLabel}
          {!isSavingProgress && (
            <ChevronRight size={16} className="sm:w-4.5 sm:h-4.5" />
          )}
        </button>
      </div>
    </div>
  );
}