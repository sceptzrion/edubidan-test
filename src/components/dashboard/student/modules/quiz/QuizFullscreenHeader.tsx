"use client";

import { ArrowLeft, Clock, LayoutGrid } from "lucide-react";

import { EduBidanLogo } from "@/components/ui/EduBidanLogo";
import { ThemeToggle } from "@/components/ui/ThemeToggle";

interface QuizFullscreenHeaderProps {
  title: string;
  timerLabel: string;
  isStarted: boolean;
  showResult: boolean;
  isReviewMode: boolean;
  onTopLeftClick: () => void;
  onOpenMobileNavigator: () => void;
}

export function QuizFullscreenHeader({
  title,
  timerLabel,
  isStarted,
  showResult,
  isReviewMode,
  onTopLeftClick,
  onOpenMobileNavigator,
}: QuizFullscreenHeaderProps) {
  const shouldShowNavigatorButton = (isStarted && !showResult) || isReviewMode;

  const backLabel = isReviewMode
    ? "Kembali ke Hasil"
    : isStarted && !showResult
      ? "Submit & Keluar"
      : "Keluar";

  return (
    <header className="h-14 sm:h-16 border-b border-border px-3 sm:px-6 flex items-center justify-between shrink-0 bg-card/90 backdrop-blur-md relative z-20">
      <div className="flex items-center gap-2 sm:gap-4">
        <button
          type="button"
          onClick={onTopLeftClick}
          className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm font-bold text-muted-foreground hover:text-foreground transition-colors bg-muted/50 hover:bg-muted px-2.5 py-1.5 sm:px-3 sm:py-2 rounded-lg"
        >
          <ArrowLeft size={16} className="w-4 h-4 sm:w-5 sm:h-5" />
          <span className="hidden sm:inline">{backLabel}</span>
        </button>

        <ThemeToggle />

        <div className="w-px h-5 sm:h-6 bg-border hidden sm:block" />

        <div className="hidden sm:flex items-center">
          <EduBidanLogo size="sm" showText={true} />
        </div>
      </div>

      <div className="hidden md:block text-sm font-extrabold text-foreground absolute left-1/2 -translate-x-1/2 truncate max-w-md text-center">
        {isReviewMode ? `Ulasan ${title}` : title}
      </div>

      <div className="flex items-center gap-2 sm:gap-4">
        {shouldShowNavigatorButton && (
          <button
            type="button"
            onClick={onOpenMobileNavigator}
            className="lg:hidden p-1.5 sm:p-2 rounded-lg border border-border bg-card text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
            aria-label="Buka navigasi soal"
          >
            <LayoutGrid size={16} className="sm:w-5 sm:h-5" />
          </button>
        )}

        <div className="flex items-center gap-1.5 sm:gap-2 bg-amber-500/10 text-amber-600 px-2.5 py-1.5 sm:px-3 sm:py-1.5 rounded-lg border border-amber-500/20 shadow-sm shadow-amber-500/5">
          <Clock size={14} className="sm:w-4 sm:h-4" />
          <span className="text-xs sm:text-sm font-extrabold font-mono tracking-wider">
            {timerLabel}
          </span>
        </div>
      </div>
    </header>
  );
}