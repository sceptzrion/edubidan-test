import React from "react";
import { ChevronDown } from "lucide-react";

interface FaqItemProps {
  question: string;
  answer: string;
  isOpen: boolean;
  onClick: () => void;
}

export function FaqItem({ question, answer, isOpen, onClick }: FaqItemProps) {
  return (
    <div className={`border border-border rounded-2xl overflow-hidden transition-all duration-300 ${isOpen ? "bg-primary/5 border-primary/20 shadow-sm" : "bg-card hover:border-primary/30"}`}>
      <button 
        onClick={onClick} 
        className="w-full flex items-center justify-between p-5 text-left focus:outline-none" // P-5 sesuai Figma
      >
        <span className="text-base font-semibold text-foreground pr-4">
          {question}
        </span>
        
        <div className={`shrink-0 w-8 h-8 flex items-center justify-center rounded-full transition-colors duration-300 ${isOpen ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}>
          <ChevronDown size={18} className={`transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`} />
        </div>
      </button>
      
      <div className={`grid transition-all duration-300 ease-in-out ${isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}`}>
        <div className="overflow-hidden">
          <p className="px-5 pb-5 text-sm text-muted-foreground leading-relaxed">
            {answer}
          </p>
        </div>
      </div>
    </div>
  );
}