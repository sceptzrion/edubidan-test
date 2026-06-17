import React from "react";
import { Target, CheckCircle2 } from "lucide-react";

interface ObjectivesProps {
  objectives: string[];
}

export function Objectives({ objectives }: ObjectivesProps) {
  return (
    <div className="bg-card rounded-2xl sm:rounded-3xl border border-border p-5 sm:p-6 shadow-sm shrink-0">
      <div className="flex items-center gap-2 mb-4 sm:mb-5 pb-3 sm:pb-4 border-b border-border">
        <Target size={18} className="text-primary sm:w-5 sm:h-5" />
        <h3 className="text-sm sm:text-base font-extrabold text-foreground">Tujuan Pembelajaran</h3>
      </div>
      
      <div className="overflow-y-auto scrollbar-thin max-h-35 pr-2">
        <ul className="space-y-2.5 sm:space-y-3 text-xs sm:text-sm font-medium text-muted-foreground">
          {objectives.map((obj, i) => (
            <li key={i} className="flex items-start gap-2.5 sm:gap-3">
              <CheckCircle2 size={14} className="text-primary mt-0.5 shrink-0 sm:w-4 sm:h-4" />
              <span className="leading-relaxed">{obj}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}