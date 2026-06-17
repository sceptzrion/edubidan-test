import React from "react";
import { LayoutGrid, X, ChevronLeft, ChevronRight, Send, Check } from "lucide-react";

interface QuizNavigatorProps {
  totalQuestions: number;
  answers: (number | null)[];
  flagged: boolean[];
  currentQ: number;
  showMobile: boolean;
  isReviewMode?: boolean;
  correctAnswers?: number[];
  onCloseMobile: () => void;
  onNavigate: (index: number) => void;
  onPrev: () => void;
  onNext: () => void;
  onSubmit: () => void;
  onExitReview?: () => void;
}

export function QuizNavigator({
  totalQuestions, answers, flagged, currentQ, showMobile, isReviewMode, correctAnswers,
  onCloseMobile, onNavigate, onPrev, onNext, onSubmit, onExitReview
}: QuizNavigatorProps) {
  const isFirst = currentQ === 0;
  const isLast = currentQ === totalQuestions - 1;
  const isSubmitDisabled = answers.includes(null);

  const renderGrid = (isMobile: boolean) => (
    <div className={`grid gap-2.5 sm:gap-3 ${isMobile ? "grid-cols-6 sm:grid-cols-8" : "grid-cols-5"}`}>
      {Array.from({ length: totalQuestions }).map((_, i) => {
        const isActive = currentQ === i;
        let btnClass = "bg-card text-muted-foreground hover:bg-muted border-transparent";
        let showFlag = false;

        // LOGIKA WARNA GRID REVIEW vs NORMAL
        if (isReviewMode && correctAnswers) {
           const isAnswerCorrect = answers[i] === correctAnswers[i];
           if (isAnswerCorrect) {
             btnClass = "bg-green-500/10 text-green-600 border-green-500/30";
           } else {
             btnClass = "bg-red-500/10 text-red-600 border-red-500/30";
           }
        } else {
           const isFilled = answers[i] !== null;
           showFlag = flagged[i];
           if (showFlag) {
              btnClass = "bg-amber-500/15 text-amber-600 border-amber-500/30";
           } else if (isFilled) {
              btnClass = "bg-primary text-primary-foreground border-primary";
           }
        }

        return (
          <button 
            key={i} 
            onClick={() => { onNavigate(i); if(isMobile) onCloseMobile(); }}
            className={`aspect-square rounded-xl text-xs font-bold flex items-center justify-center border-2 transition-all relative
              ${isActive ? "ring-2 ring-foreground ring-offset-1 ring-offset-background scale-110 shadow-md z-10" : ""}
              ${btnClass}
            `}
          >
            {i + 1}
            {showFlag && !isReviewMode && <div className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-amber-500 border-2 border-card" />}
          </button>
        );
      })}
    </div>
  );

  const renderLegendAndNav = () => (
    <div className="p-5 sm:p-6 border-t border-border bg-muted/20 flex flex-col gap-5 sm:gap-6 mt-auto shrink-0">
      
      <div className="flex items-center justify-end gap-2 w-full">
        <button 
          onClick={() => { onPrev(); onCloseMobile(); }} 
          disabled={isFirst}
          className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-card border border-border flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted disabled:opacity-40 transition-colors shadow-sm"
        >
          <ChevronLeft size={20} className="sm:w-5 sm:h-5 w-4 h-4" />
        </button>
        
        {isLast ? (
          isReviewMode ? (
            <button 
              onClick={() => { onExitReview && onExitReview(); onCloseMobile(); }} 
              className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-card border border-border flex items-center justify-center text-foreground hover:bg-muted transition-all shadow-sm"
            >
              <X size={18} className="sm:w-4.5 sm:h-4.5 w-4 h-4" />
            </button>
          ) : (
            <button 
              onClick={() => { onSubmit(); onCloseMobile(); }} 
              disabled={isSubmitDisabled}
              className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-primary flex items-center justify-center text-white hover:bg-primary/90 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-md shadow-primary/20"
            >
              <Send size={18} className="-ml-0.5 sm:w-4.5 sm:h-4.5 w-4 h-4" />
            </button>
          )
        ) : (
          <button 
            onClick={() => { onNext(); onCloseMobile(); }} 
            className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-card border border-border flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-colors shadow-sm"
          >
            <ChevronRight size={20} className="sm:w-5 sm:h-5 w-4 h-4" />
          </button>
        )}
      </div>

      {/* LEGENDA DINAMIS */}
      <div className="space-y-2.5 sm:space-y-3">
        {isReviewMode ? (
          <>
            <div className="flex items-center gap-3 text-[10px] sm:text-xs font-bold text-muted-foreground">
              <div className="w-3.5 h-3.5 rounded-sm bg-green-500/20 border border-green-500/50" /> Benar
            </div>
            <div className="flex items-center gap-3 text-[10px] sm:text-xs font-bold text-muted-foreground">
              <div className="w-3.5 h-3.5 rounded-sm bg-red-500/20 border border-red-500/50" /> Salah
            </div>
          </>
        ) : (
          <>
            <div className="flex items-center gap-3 text-[10px] sm:text-xs font-bold text-muted-foreground">
              <div className="w-3.5 h-3.5 rounded-sm bg-primary shadow-sm" /> Sudah Diisi
            </div>
            <div className="flex items-center gap-3 text-[10px] sm:text-xs font-bold text-muted-foreground">
              <div className="w-3.5 h-3.5 rounded-sm bg-card border border-border" /> Belum Diisi
            </div>
            <div className="flex items-center gap-3 text-[10px] sm:text-xs font-bold text-muted-foreground">
              <div className="w-3.5 h-3.5 rounded-sm bg-amber-500/20 border border-amber-500/30 relative">
                 <div className="absolute -top-1 -right-1 w-1.5 h-1.5 rounded-full bg-amber-500" />
              </div> Ragu-ragu
            </div>
          </>
        )}
      </div>
    </div>
  );

  return (
    <>
      <div className="hidden lg:flex w-80 bg-card border-l border-border shrink-0 flex-col z-20">
        <div className="p-6 pb-4 border-b border-border/50">
          <h3 className="font-extrabold text-base flex items-center gap-2 text-foreground">
            <LayoutGrid size={18} /> Navigasi Soal
          </h3>
        </div>
        <div className="flex-1 overflow-y-auto p-6 pt-4 scrollbar-thin">
          {renderGrid(false)}
        </div>
        {renderLegendAndNav()}
      </div>

      {showMobile && (
        <>
          <div className="lg:hidden fixed inset-0 z-150 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200" onClick={onCloseMobile} />
          <div className="lg:hidden fixed bottom-0 left-0 right-0 z-200 bg-card rounded-t-3xl border-t border-border shadow-[0_-10px_40px_rgba(0,0,0,0.1)] animate-in slide-in-from-bottom duration-300 flex flex-col max-h-[85vh]">
            <div className="flex justify-center p-3 shrink-0">
              <div className="w-12 h-1.5 bg-muted-foreground/20 rounded-full" />
            </div>
            <div className="px-6 pb-4 flex items-center justify-between shrink-0 border-b border-border/50">
              <h3 className="font-extrabold text-sm flex items-center gap-2 text-foreground">
                <LayoutGrid size={18} /> Navigasi Soal
              </h3>
              <button onClick={onCloseMobile} className="p-1.5 bg-muted rounded-full text-muted-foreground hover:text-foreground">
                <X size={16} />
              </button>
            </div>
            <div className="overflow-y-auto p-6 scrollbar-thin">
              {renderGrid(true)}
            </div>
            {renderLegendAndNav()}
          </div>
        </>
      )}
    </>
  );
}