import React from "react";
import { LucideIcon } from "lucide-react";

interface PilarCardProps {
  icon: LucideIcon;
  title: string;
  desc: string;
}

export function PilarCard({ icon: Icon, title, desc }: PilarCardProps) {
  return (
    <div className="flex flex-col items-center text-center">
      <div className="w-16 h-16 rounded-2xl bg-background border border-border text-primary flex items-center justify-center mb-6 shadow-sm">
        <Icon size={28} />
      </div>
      <h4 className="text-lg font-bold mb-3 text-foreground">{title}</h4>
      <p className="text-sm text-muted-foreground leading-relaxed">{desc}</p>
    </div>
  );
}