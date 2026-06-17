import React from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

interface HelpFaqItemProps {
  question: string;
  answer: string;
  isOpen: boolean;
  onClick: () => void;
}

export function HelpFaqItem({ question, answer, isOpen, onClick }: HelpFaqItemProps) {
  return (
    <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm hover:border-primary/30 transition-colors shrink-0">
      <button 
        onClick={onClick} 
        className="w-full flex items-center justify-between p-5 md:p-6 text-left focus:outline-none"
      >
        <span className="text-base font-semibold text-foreground pr-4 leading-snug">{question}</span>
        <div className="shrink-0 w-8 h-8 rounded-full bg-muted flex items-center justify-center text-muted-foreground transition-transform">
          {isOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
        </div>
      </button>
      {isOpen && (
        <div className="px-5 md:px-6 pb-6 pt-1 text-sm md:text-base text-muted-foreground leading-relaxed border-t border-border/50 mt-1">
          {answer}
        </div>
      )}
    </div>
  );
}