import React from "react";
import { Calendar } from "lucide-react";

interface UpcomingQuizCardProps {
  title: string;
  date: string;
  onClick?: () => void;
}

export function UpcomingQuizCard({ title, date, onClick }: UpcomingQuizCardProps) {
  return (
    <div 
      onClick={onClick}
      className="p-3.5 sm:p-4 rounded-xl sm:rounded-2xl bg-muted/30 border border-border hover:border-primary/40 hover:bg-primary/5 transition-colors cursor-pointer group"
    >
      <p className="text-xs sm:text-sm font-extrabold text-foreground group-hover:text-primary transition-colors leading-snug">
        {title}
      </p>
      <div className="flex items-center gap-1.5 text-[10px] sm:text-xs font-bold text-primary bg-primary/10 w-fit px-2 sm:px-2.5 py-1 rounded-md mt-2.5 border border-primary/10">
        <Calendar size={14} className="w-3 h-3 sm:w-3.5 sm:h-3.5" /> {date}
      </div>
    </div>
  );
}