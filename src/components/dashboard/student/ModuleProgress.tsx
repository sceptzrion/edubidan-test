interface ModuleProgressProps {
  title: string;
  progress: number;
  lessons: number;
  completed: number;
  onClick: () => void;
}

export function ModuleProgress({
  title,
  progress,
  lessons,
  completed,
  onClick,
}: ModuleProgressProps) {
  return (
    <div className="group">
      <div className="flex sm:items-center justify-between mb-2.5 sm:mb-3 flex-col sm:flex-row gap-2 sm:gap-4">
        <button
          type="button"
          onClick={onClick}
          className="text-sm sm:text-base font-extrabold group-hover:text-primary transition-colors text-left line-clamp-2 sm:line-clamp-1 text-foreground leading-snug"
        >
          {title}
        </button>

        <span className="text-[10px] sm:text-xs font-bold text-muted-foreground shrink-0 bg-muted border border-border/50 px-2.5 py-1 sm:px-3 sm:py-1 rounded-full whitespace-nowrap w-fit">
          {completed}/{lessons} Konten
        </span>
      </div>

      <div className="w-full h-2 sm:h-2.5 bg-muted rounded-full overflow-hidden relative shadow-inner">
        <div
          className="absolute top-0 left-0 h-full bg-linear-to-r from-primary to-teal-400 rounded-full transition-all duration-1000 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}