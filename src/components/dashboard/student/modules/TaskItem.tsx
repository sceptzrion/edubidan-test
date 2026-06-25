import React from "react";
import { Check, Clock, HelpCircle, Lock } from "lucide-react";

interface TaskItemProps {
  item: {
    id: number;
    title: string;
    duration: string;
    isCompleted: boolean;
    score?: number | null;
    isLocked?: boolean;
    lockedReason?: string;
  };
  onClick: () => void;
}

function formatScore(score?: number | null) {
  if (typeof score !== "number") {
    return "Nilai tersimpan";
  }

  return `Nilai ${score.toFixed(1)}`;
}

export function TaskItem({ item, onClick }: TaskItemProps) {
  const isLocked = item.isLocked ?? false;

  return (
    <div
      onClick={isLocked ? undefined : onClick}
      title={isLocked ? item.lockedReason : undefined}
      className={`bg-card rounded-2xl border border-border p-3 sm:p-5 flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 transition-all group ${
        isLocked
          ? "opacity-60 cursor-not-allowed"
          : "hover:shadow-md hover:border-amber-500/30 cursor-pointer"
      }`}
    >
      <div className="flex items-center gap-3 sm:gap-4 flex-1 min-w-0">
        <div
          className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center shrink-0 shadow-inner border ${
            isLocked
              ? "bg-muted text-muted-foreground border-border"
              : "bg-amber-500/10 text-amber-600 border-amber-500/20"
          }`}
        >
          {isLocked ? (
            <Lock size={16} className="sm:w-5 sm:h-5" />
          ) : (
            <HelpCircle size={16} className="sm:w-5 sm:h-5" />
          )}
        </div>

        <div className="flex-1 min-w-0">
          <p
            className={`text-sm sm:text-base font-extrabold truncate transition-colors ${
              isLocked
                ? "text-muted-foreground"
                : "text-foreground group-hover:text-amber-600"
            }`}
          >
            {item.title}
          </p>

          <p className="text-[10px] sm:text-xs font-semibold text-muted-foreground mt-1 sm:mt-1.5 flex items-center gap-1 sm:gap-1.5">
            <Clock size={10} className="sm:w-3.25 sm:h-3.25" />
            {item.duration}
          </p>

          {isLocked && item.lockedReason && (
            <p className="mt-1.5 text-[10px] sm:text-xs font-semibold text-muted-foreground">
              {item.lockedReason}
            </p>
          )}
        </div>
      </div>

      <div className="sm:ml-auto pt-2 sm:pt-0 border-t sm:border-0 border-border/50 shrink-0">
        {item.isCompleted ? (
          <div className="flex items-center justify-center sm:justify-start gap-1 sm:gap-1.5 text-[10px] sm:text-xs font-bold text-amber-600 px-3 py-2 sm:px-4 sm:py-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20">
            <Check size={12} className="sm:w-3.5 sm:h-3.5" />
            {formatScore(item.score)}
          </div>
        ) : isLocked ? (
          <button
            type="button"
            disabled
            className="w-full sm:w-auto px-4 py-2 sm:px-6 sm:py-2.5 rounded-xl bg-muted text-muted-foreground text-xs sm:text-sm font-bold cursor-not-allowed flex items-center justify-center gap-1.5"
          >
            <Lock size={12} className="sm:w-3.5 sm:h-3.5" />
            Terkunci
          </button>
        ) : (
          <button
            type="button"
            className="w-full sm:w-auto px-4 py-2 sm:px-6 sm:py-2.5 rounded-xl bg-amber-500 text-white text-xs sm:text-sm font-bold hover:bg-amber-600 transition-colors shadow-md shadow-amber-500/20"
          >
            Mulai
          </button>
        )}
      </div>
    </div>
  );
}