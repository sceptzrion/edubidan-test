import React from "react";
import { Mail } from "lucide-react";

interface InstructorCardProps {
  instructor: {
    name: string;
    email: string;
  };
}

export function InstructorCard({ instructor }: InstructorCardProps) {
  return (
    <div className="bg-card rounded-2xl sm:rounded-3xl border border-border p-4 sm:p-5 flex items-center gap-3 sm:gap-4 mb-6 sm:mb-8 shadow-sm">
      {/* REVISI MOBILE: Ukuran avatar dikecilkan untuk HP */}
      <div className="w-10 h-10 sm:w-14 sm:h-14 rounded-full bg-blue-500/10 text-blue-600 flex items-center justify-center text-lg sm:text-xl font-extrabold shrink-0 border-2 border-blue-500/20 shadow-inner">
        {instructor.name.charAt(0)}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-0.5">
          {/* REVISI MOBILE: Teks nama dikecilkan jadi text-sm di HP */}
          <p className="text-sm sm:text-lg font-extrabold text-foreground truncate">{instructor.name}</p>
        </div>
        {/* REVISI MOBILE: Teks email dikecilkan jadi text-[10px] di HP */}
        <p className="text-[10px] sm:text-xs font-medium text-muted-foreground truncate">{instructor.email}</p>
      </div>
      {/* REVISI MOBILE: Padding dan icon tombol email dikecilkan di HP */}
      <a 
        href={`mailto:${instructor.email}`}
        className="p-2.5 sm:p-3.5 bg-muted hover:bg-primary/10 hover:text-primary rounded-xl text-muted-foreground transition-all shrink-0"
        title="Kirim Email"
      >
        <Mail size={16} className="sm:w-4.75 sm:h-4.75" />
      </a>
    </div>
  );
}