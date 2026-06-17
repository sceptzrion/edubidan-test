import React from "react";
import { Check, ChevronRight, Clock, HelpCircle, Target, Video, Wrench } from "lucide-react";

interface PlaylistItemProps {
  item: {
    id: number;
    kind: "materi" | "kuis";
    title: string;
    duration: string;
    objectivesCount?: number;
    toolsCount?: number;
    isCompleted: boolean;
  };
  onClick: () => void;
}

export function PlaylistItem({ item, onClick }: PlaylistItemProps) {
  const isMateri = item.kind === "materi";

  return (
    <div 
      onClick={onClick}
      className={`bg-card rounded-2xl border p-3 sm:p-5 flex items-center gap-3 sm:gap-4 transition-all hover:shadow-md hover:border-primary/40 cursor-pointer group ${item.isCompleted ? "border-primary/10" : "border-border"}`}
    >
      <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center shrink-0 shadow-inner border border-border/50 ${isMateri ? "bg-primary/10 text-primary" : "bg-amber-500/10 text-amber-600"}`}>
        {isMateri ? <Video size={16} className="sm:w-5 sm:h-5" /> : <HelpCircle size={16} className="sm:w-5 sm:h-5" />}
      </div>
      
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <span className={`text-[8px] sm:text-[10px] px-2 py-0.5 rounded-md font-extrabold uppercase tracking-wider ${isMateri ? "bg-primary/10 text-primary" : "bg-amber-500/10 text-amber-600"}`}>
            {isMateri ? "Materi" : "Kuis"}
          </span>
          {item.isCompleted && (
            <span className="flex items-center gap-1 text-[8px] sm:text-[10px] text-primary font-bold">
              <Check size={10} className="sm:w-3 sm:h-3" /> Selesai
            </span>
          )}
        </div>
        <p className="text-sm sm:text-base font-extrabold text-foreground truncate group-hover:text-primary transition-colors">{item.title}</p>
        
        <div className="text-[10px] sm:text-xs font-bold text-muted-foreground mt-1 sm:mt-1.5 flex flex-wrap items-center gap-x-3 sm:gap-x-4 gap-y-1">
          <span className="flex items-center gap-1 sm:gap-1.5"><Clock size={10} className="sm:w-3.25 sm:h-3.25 text-primary/70" /> {item.duration}</span>
          {isMateri && (
            <>
              <span className="flex items-center gap-1 sm:gap-1.5"><Target size={10} className="sm:w-3.25 sm:h-3.25 text-primary/70" /> {item.objectivesCount} Tujuan</span>
              <span className="flex items-center gap-1 sm:gap-1.5"><Wrench size={10} className="sm:w-3.25 sm:h-3.25 text-primary/70" /> {item.toolsCount} Alat</span>
            </>
          )}
        </div>
      </div>

      <div className="ml-auto text-muted-foreground shrink-0 pl-1 sm:pl-2">
        <ChevronRight size={16} className="sm:w-5 sm:h-5 group-hover:text-primary transition-colors" />
      </div>
    </div>
  );
}