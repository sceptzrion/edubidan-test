import React from "react";
import { LucideIcon } from "lucide-react";

interface CategoryCardProps {
  icon: LucideIcon;
  title: string;
  count: number;
  isActive: boolean;
  onClick: () => void;
}

export function CategoryCard({ icon: Icon, title, count, isActive, onClick }: CategoryCardProps) {
  return (
    <div 
      onClick={onClick}
      className={`rounded-2xl border p-4 text-center transition-all cursor-pointer ${
        isActive 
        ? "bg-primary/10 border-primary shadow-sm" 
        : "bg-card border-border hover:border-primary/40"
      }`}
    >
      <div className={`w-10 h-10 mx-auto rounded-xl flex items-center justify-center mb-3 ${isActive ? "bg-primary text-primary-foreground" : "bg-primary/10 text-primary"}`}>
        <Icon size={20} />
      </div>
      <h3 className="text-sm font-bold mb-1 text-foreground">{title}</h3>
      <p className="text-[11px] text-muted-foreground">{count} Artikel</p>
    </div>
  );
}