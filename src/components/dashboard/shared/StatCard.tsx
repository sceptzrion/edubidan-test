import React from "react";
import { LucideIcon } from "lucide-react";

interface StatCardProps {
  icon: LucideIcon;
  label: string;
  value: string | number;
  color: string;
}

export function StatCard({ icon: Icon, label, value, color }: StatCardProps) {
  return (
    <div className="bg-card rounded-2xl sm:rounded-3xl border border-border p-4 sm:p-5 md:p-6 shadow-sm hover:shadow-md transition-all hover:-translate-y-0.5 group">
      <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl ${color} border flex items-center justify-center mb-3 sm:mb-4 group-hover:scale-110 transition-transform`}>
        <Icon className="w-5 h-5 sm:w-6 sm:h-6" />
      </div>
      <p className="text-2xl sm:text-3xl font-black mb-1 tracking-tight text-foreground">{value}</p>
      <p className="text-[10px] sm:text-xs font-bold text-muted-foreground leading-snug uppercase tracking-wider">{label}</p>
    </div>
  );
}