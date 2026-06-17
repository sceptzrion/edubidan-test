import React from "react";
import { Mail } from "lucide-react";

interface ParticipantItemProps {
  participant: {
    id: number;
    name: string;
    email: string;
  };
  isLast: boolean;
}

export function ParticipantItem({ participant, isLast }: ParticipantItemProps) {
  return (
    // REVISI MOBILE: p-5 diturunkan jadi p-3 untuk HP
    <div className={`p-3 sm:p-5 flex items-center gap-3 sm:gap-4 hover:bg-muted/40 transition-colors ${!isLast ? "border-b border-border/50" : ""}`}>
      {/* REVISI MOBILE: Avatar dikecilkan jadi w-9 h-9 di HP */}
      <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-linear-to-br from-primary/80 to-teal-400 flex items-center justify-center text-white text-xs sm:text-sm font-extrabold shrink-0 shadow-sm border-2 border-primary/20">
        {participant.name.charAt(0)}
      </div>
      <div className="flex-1 min-w-0 pl-1">
        <p className="text-sm sm:text-base font-extrabold text-foreground truncate">{participant.name}</p>
        <p className="text-[10px] sm:text-xs font-medium text-muted-foreground truncate mt-0.5">{participant.email}</p>
      </div>
      {/* REVISI MOBILE: Padding tombol email disesuaikan */}
      <a 
        href={`mailto:${participant.email}`}
        className="p-2 sm:p-2.5 hover:bg-primary/10 hover:text-primary rounded-lg text-muted-foreground transition-all shrink-0 ml-auto"
        title="Kirim Email"
      >
        <Mail size={14} className="sm:w-4 sm:h-4" />
      </a>
    </div>
  );
}