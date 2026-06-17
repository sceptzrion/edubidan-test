import React from "react";
import { Wrench } from "lucide-react";

interface ToolsProps {
  tools: string[];
}

export function Tools({ tools }: ToolsProps) {
  return (
    <div className="bg-card rounded-2xl sm:rounded-3xl border border-border p-5 sm:p-6 shadow-sm shrink-0">
      <div className="flex items-center gap-2 mb-4 sm:mb-5 pb-3 sm:pb-4 border-b border-border">
        <Wrench size={18} className="text-primary sm:w-5 sm:h-5" />
        <h3 className="text-sm sm:text-base font-extrabold text-foreground">Daftar Alat</h3>
      </div>
      
      <div className="overflow-y-auto scrollbar-thin max-h-27.5 pr-2">
        <div className="flex flex-wrap gap-1.5 sm:gap-2">
          {tools.map((tool, i) => (
            <span key={i} className="px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-lg bg-muted text-[10px] sm:text-xs font-bold text-muted-foreground border border-border/50 hover:border-primary/30 transition-colors">
              {tool}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}