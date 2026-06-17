import React from "react";
import { LucideIcon } from "lucide-react";

interface VisiMisiCardProps {
  icon: LucideIcon;
  title: string;
  desc: string;
  colorClass: string;
  textClass: string;
}

export function VisiMisiCard({ icon: Icon, title, desc, colorClass, textClass }: VisiMisiCardProps) {
  return (
    <div className="bg-card rounded-3xl border border-border p-10 shadow-sm hover:shadow-md transition-shadow flex flex-col items-center text-center">
      <div className={`w-16 h-16 rounded-2xl ${colorClass} ${textClass} flex items-center justify-center mb-6`}>
        <Icon size={32} />
      </div>
      <h3 className="text-xl font-bold mb-4 text-foreground">{title}</h3>
      <p className="text-base text-muted-foreground leading-relaxed">
        {desc}
      </p>
    </div>
  );
}