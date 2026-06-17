import React from "react";
import { Award } from "lucide-react";

interface QuizStartScreenProps {
  totalQuestions: number;
  timeLimit: string;
  onStart: () => void;
}

export function QuizStartScreen({ totalQuestions, timeLimit, onStart }: QuizStartScreenProps) {
  return (
    <div className="w-full max-w-lg bg-card rounded-2xl sm:rounded-3xl border border-border p-6 sm:p-10 shadow-xl text-center animate-in zoom-in-95 duration-500">
      <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-amber-500/10 text-amber-500 flex items-center justify-center mx-auto mb-4 sm:mb-6 border-4 border-amber-500/20">
        <Award size={32} className="sm:w-10 sm:h-10" />
      </div>
      <h1 className="text-xl sm:text-3xl font-extrabold text-foreground mb-3">Siap Memulai Kuis?</h1>
      <p className="text-xs sm:text-sm text-muted-foreground font-medium mb-6 sm:mb-8 leading-relaxed">
        Pastikan koneksi internet Anda stabil. Waktu akan terus berjalan setelah tombol &quot;Mulai Kuis&quot; ditekan.
      </p>
      
      <div className="flex flex-wrap justify-center gap-3 sm:gap-4 mb-8">
        <div className="bg-muted/50 px-4 py-3 sm:px-6 sm:py-4 rounded-xl sm:rounded-2xl border border-border/50">
          <p className="text-[10px] sm:text-xs text-muted-foreground font-bold uppercase tracking-wider mb-1">Jumlah Soal</p>
          <p className="text-lg sm:text-xl font-extrabold text-foreground">{totalQuestions} Soal</p>
        </div>
        <div className="bg-muted/50 px-4 py-3 sm:px-6 sm:py-4 rounded-xl sm:rounded-2xl border border-border/50">
          <p className="text-[10px] sm:text-xs text-muted-foreground font-bold uppercase tracking-wider mb-1">Batas Waktu</p>
          <p className="text-lg sm:text-xl font-extrabold text-foreground">{timeLimit}</p>
        </div>
      </div>

      <button 
        onClick={onStart} 
        className="w-full bg-amber-500 text-white px-8 py-3.5 sm:py-4 rounded-xl text-sm sm:text-base font-extrabold hover:bg-amber-600 transition-all shadow-lg shadow-amber-500/20 hover:-translate-y-1"
      >
        Mulai Kuis
      </button>
    </div>
  );
}