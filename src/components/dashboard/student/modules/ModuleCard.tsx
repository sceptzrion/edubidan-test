import { BookOpen, Clock, Loader2, User } from "lucide-react";

interface ModuleCardData {
  id: number;
  title: string;
  desc: string;
  img: string;
  progress: number;
  lessons: number;
  quizzes: number;
  duration: string;
  instructor: string;
}

interface ModuleCardProps {
  data: ModuleCardData;
  layout: "grid" | "list";
  isOpening?: boolean;
  onClick: () => void;
}

export function ModuleCard({
  data,
  layout,
  isOpening = false,
  onClick,
}: ModuleCardProps) {
  const contentLabel = `${data.lessons} Materi • ${data.quizzes} Kuis`;

  if (layout === "list") {
    return (
      <div
        onClick={isOpening ? undefined : onClick}
        aria-busy={isOpening}
        className={`w-full bg-card rounded-2xl border border-border p-3 sm:p-0 flex flex-row items-center sm:items-stretch hover:shadow-md hover:border-primary/40 transition-all group overflow-hidden sm:h-44 ${
          isOpening ? "cursor-wait opacity-80" : "cursor-pointer"
        }`}
      >
        <div className="relative shrink-0 w-24 h-24 sm:w-64 sm:h-full rounded-xl sm:rounded-none sm:rounded-l-2xl overflow-hidden sm:border-r border-border/50">
          <img
            src={data.img}
            alt={data.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div className="sm:hidden absolute bottom-0 left-0 right-0 h-1 bg-muted-foreground/30">
            <div
              className="h-full bg-primary transition-all duration-1000"
              style={{ width: `${data.progress}%` }}
            />
          </div>
        </div>

        <div className="flex-1 flex flex-col justify-center pl-4 sm:p-6 min-w-0">
          <div className="min-w-0 mb-1 sm:mb-2">
            <h3 className="text-sm sm:text-lg font-extrabold text-foreground group-hover:text-primary transition-colors line-clamp-1 sm:line-clamp-2 leading-tight">
              {data.title}
            </h3>
            <p className="hidden sm:block text-sm font-medium text-muted-foreground line-clamp-1 mt-1">
              {data.desc}
            </p>
          </div>

          <div className="flex items-center gap-1.5 sm:gap-2 mt-1 mb-auto">
            <div className="w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0">
              <User size={10} className="sm:w-3 sm:h-3" />
            </div>
            <span className="text-[10px] sm:text-xs font-semibold text-muted-foreground truncate">
              {data.instructor}
            </span>
          </div>

          <div className="flex items-center gap-3 sm:gap-6 mt-3 sm:mt-4 text-[10px] sm:text-xs font-bold text-muted-foreground">
            <span className="flex items-center gap-1 sm:gap-1.5">
              <BookOpen
                size={12}
                className="sm:w-4 sm:h-4 text-primary/70 shrink-0"
              />
              <span className="truncate">{contentLabel}</span>
            </span>
            <span className="flex items-center gap-1 sm:gap-1.5">
              <Clock
                size={12}
                className="sm:w-4 sm:h-4 text-primary/70 shrink-0"
              />
              {data.duration}
            </span>
            {data.progress > 0 && (
              <span className="text-primary ml-auto whitespace-nowrap">
                {data.progress}%
              </span>
            )}
          </div>

          {data.progress > 0 && (
            <div className="hidden sm:block w-full h-1.5 bg-muted-foreground/20 rounded-full mt-3.5 overflow-hidden shrink-0">
              <div
                className="h-full bg-linear-to-r from-primary to-teal-400 rounded-full transition-all duration-1000"
                style={{ width: `${data.progress}%` }}
              />
            </div>
          )}

          {isOpening && (
            <div className="mt-3 inline-flex items-center gap-2 text-[10px] sm:text-xs font-extrabold text-primary">
              <Loader2 size={13} className="animate-spin" />
              Membuka modul...
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div
      onClick={isOpening ? undefined : onClick}
      aria-busy={isOpening}
      className={`bg-card rounded-2xl border border-border overflow-hidden hover:shadow-lg hover:border-primary/40 transition-all group flex flex-col ${
        isOpening ? "cursor-wait opacity-80" : "cursor-pointer"
      }`}
    >
      <div className="relative aspect-4/3 sm:aspect-video overflow-hidden">
        <img
          src={data.img}
          alt={data.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-linear-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

        {isOpening && (
          <div className="absolute inset-0 z-10 flex items-center justify-center bg-black/45 text-white backdrop-blur-[1px]">
            <div className="inline-flex items-center gap-2 rounded-xl bg-black/45 px-4 py-2 text-xs font-extrabold">
              <Loader2 size={15} className="animate-spin" />
              Membuka...
            </div>
          </div>
        )}

        {data.progress >= 0 && (
          <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-muted-foreground/30">
            <div
              className="h-full bg-primary transition-all duration-1000 ease-out"
              style={{ width: `${data.progress}%` }}
            />
          </div>
        )}
      </div>

      <div className="p-5 flex-1 flex flex-col">
        <h3 className="text-lg font-extrabold text-foreground mb-1.5 group-hover:text-primary transition-colors line-clamp-2 leading-snug">
          {data.title}
        </h3>

        <p className="text-sm font-medium text-muted-foreground mb-3 line-clamp-2">
          {data.desc}
        </p>

        <div className="flex items-center gap-2 mb-4 mt-auto">
          <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0">
            <User size={14} />
          </div>
          <span className="text-xs font-semibold text-muted-foreground line-clamp-1">
            {data.instructor}
          </span>
        </div>

        <div>
          <div className="flex flex-wrap items-center gap-4 text-xs font-bold text-muted-foreground mb-4">
            <span className="flex items-center gap-1.5">
              <BookOpen size={14} className="text-primary/70" />
              {contentLabel}
            </span>
            <span className="flex items-center gap-1.5">
              <Clock size={14} className="text-primary/70" />
              {data.duration}
            </span>
          </div>

          {isOpening ? (
            <p className="inline-flex items-center gap-2 text-xs font-extrabold text-primary pt-3 border-t border-border/50 w-full">
              <Loader2 size={14} className="animate-spin" />
              Membuka modul...
            </p>
          ) : data.progress > 0 ? (
            <p className="text-xs font-extrabold text-primary pt-3 border-t border-border/50">
              {data.progress}% Selesai
            </p>
          ) : null}
        </div>
      </div>
    </div>
  );
}