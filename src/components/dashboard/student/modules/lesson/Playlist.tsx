import React from "react";
import {
  CheckCircle2,
  Play,
  Video,
  HelpCircle,
  Clock,
  Lock,
} from "lucide-react";

interface PlaylistItem {
  id: number;
  kind: "materi" | "kuis";
  title: string;
  duration: string;
  completed: boolean;
  isLocked?: boolean;
  lockedReason?: string;
}

interface PlaylistProps {
  items: PlaylistItem[];
  activeIndex: number;
  onNavigate: (item: PlaylistItem) => void;
}

export function Playlist({ items, activeIndex, onNavigate }: PlaylistProps) {
  const completedCount = items.filter((item) => item.completed).length;

  return (
    <div className="bg-card rounded-2xl sm:rounded-3xl border border-border overflow-hidden shadow-sm flex flex-col">
      <div className="p-4 sm:p-5 flex items-center justify-between border-b border-border bg-muted/20 shrink-0">
        <h3 className="text-sm sm:text-base font-extrabold text-foreground">
          Playlist Modul
        </h3>
        <span className="text-[10px] sm:text-xs font-bold text-muted-foreground bg-background px-2 sm:px-2.5 py-1 rounded-md border border-border/50">
          {completedCount}/{items.length} Selesai
        </span>
      </div>

      <div className="p-2 sm:p-3 overflow-y-auto scrollbar-thin max-h-95">
        <div className="space-y-1">
          {items.map((l, i) => {
            const isMateri = l.kind === "materi";
            const isActive = i === activeIndex;
            const isLocked = l.isLocked ?? false;

            return (
              <button
                key={`${l.kind}-${l.id}`}
                onClick={() => {
                  if (isLocked) return;

                  onNavigate(l);
                }}
                disabled={isLocked}
                title={isLocked ? l.lockedReason : undefined}
                className={`w-full flex items-center gap-2.5 sm:gap-3 p-2.5 sm:p-3 rounded-xl sm:rounded-2xl text-left transition-all group ${
                  isActive
                    ? "bg-primary/5 border border-primary/20 shadow-sm"
                    : isLocked
                    ? "border border-transparent opacity-60 cursor-not-allowed"
                    : "border border-transparent hover:bg-muted"
                }`}
              >
                {isLocked ? (
                  <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center shrink-0 border border-muted-foreground/30 text-muted-foreground/50">
                    <Lock size={12} className="sm:w-3.5 sm:h-3.5" />
                  </div>
                ) : l.completed ? (
                  <CheckCircle2
                    size={22}
                    className={`shrink-0 mx-0.5 sm:mx-1 ${
                      isMateri ? "text-primary" : "text-amber-500"
                    }`}
                  />
                ) : isActive ? (
                  <div
                    className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center shrink-0 shadow-md ${
                      isMateri
                        ? "bg-primary text-primary-foreground shadow-primary/20"
                        : "bg-amber-500 text-white shadow-amber-500/20"
                    }`}
                  >
                    {isMateri ? (
                      <Play
                        size={12}
                        className="ml-0.5 fill-current sm:w-3.5 sm:h-3.5"
                      />
                    ) : (
                      <HelpCircle size={14} className="sm:w-4 sm:h-4" />
                    )}
                  </div>
                ) : (
                  <div
                    className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center shrink-0 border ${
                      isMateri
                        ? "border-muted-foreground/30 text-muted-foreground/50"
                        : "border-amber-500/30 text-amber-500/50"
                    }`}
                  >
                    {isMateri ? (
                      <Video size={12} className="sm:w-3.5 sm:h-3.5" />
                    ) : (
                      <HelpCircle size={12} className="sm:w-3.5 sm:h-3.5" />
                    )}
                  </div>
                )}

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5 sm:mb-1">
                    <span
                      className={`text-[8px] sm:text-[9px] px-1.5 sm:px-2 py-0.5 rounded uppercase tracking-wider font-bold ${
                        isLocked
                          ? "bg-muted text-muted-foreground"
                          : isMateri
                          ? "bg-primary/10 text-primary"
                          : "bg-amber-500/10 text-amber-600"
                      }`}
                    >
                      {isMateri ? "Materi" : "Kuis"}
                    </span>

                    {isLocked && (
                      <span className="text-[8px] sm:text-[9px] px-1.5 sm:px-2 py-0.5 rounded uppercase tracking-wider font-bold bg-muted text-muted-foreground">
                        Terkunci
                      </span>
                    )}
                  </div>

                  <p
                    className={`text-xs sm:text-sm truncate ${
                      isLocked
                        ? "text-muted-foreground font-semibold"
                        : isActive
                        ? isMateri
                          ? "text-primary font-extrabold"
                          : "text-amber-600 font-extrabold"
                        : "text-foreground font-semibold"
                    }`}
                  >
                    {l.title}
                  </p>

                  {isLocked && l.lockedReason && (
                    <p className="text-[9px] sm:text-[10px] text-muted-foreground font-semibold truncate mt-0.5">
                      {l.lockedReason}
                    </p>
                  )}
                </div>

                <span className="text-[9px] sm:text-[10px] font-bold text-muted-foreground shrink-0 flex items-center gap-1 sm:gap-1.5 bg-muted px-1.5 sm:px-2 py-1 rounded-md">
                  <Clock size={10} className="sm:w-2.5 sm:h-2.5" />
                  {l.duration}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}