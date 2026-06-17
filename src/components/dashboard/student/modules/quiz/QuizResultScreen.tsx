import React from "react";
import { CheckCircle, Eye, ArrowRight } from "lucide-react";

interface QuizResultScreenProps {
  passed: boolean; // Props ini kita pertahankan agar tidak error di page.tsx, meski tidak kita pakai lagi untuk warna
  percentage: number;
  score: number;
  totalQuestions: number;
  onReview: () => void;
  onExit: () => void;
}

export function QuizResultScreen({ percentage, score, totalQuestions, onReview, onExit }: QuizResultScreenProps) {
  return (
    <div className="w-full max-w-lg bg-card rounded-2xl sm:rounded-3xl border border-border p-6 sm:p-12 text-center shadow-xl animate-in zoom-in-95 duration-500">
      
      {/* REVISI: Ikon centang primary (hijau tosca) tanda kuis berhasil disubmit */}
      <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4 sm:mb-6 border-4 border-primary/20">
        <CheckCircle size={32} className="text-primary sm:w-10 sm:h-10" />
      </div>
      
      {/* REVISI: Teks netral tanpa judge lulus/gagal */}
      <h1 className="text-xl sm:text-3xl font-extrabold text-foreground mb-2">Kuis Selesai</h1>
      <p className="text-xs sm:text-sm text-muted-foreground font-medium mb-6 sm:mb-8 leading-relaxed">
        Jawaban Anda telah berhasil dikumpulkan. Silakan ulas kembali hasil pengerjaan kuis Anda.
      </p>
      
      {/* REVISI: Angka nilai menggunakan warna netral (text-foreground) */}
      <div className="text-5xl sm:text-7xl font-extrabold mb-2 sm:mb-3 tracking-tighter text-foreground">
        {percentage}
      </div>
      <p className="text-xs sm:text-sm font-bold text-muted-foreground mb-8 sm:mb-10">
        {score} dari {totalQuestions} jawaban benar
      </p>
      
      <div className="flex flex-col gap-3">
        <button onClick={onReview} className="w-full px-6 py-3.5 rounded-xl border border-border hover:bg-muted font-bold text-foreground transition-colors flex items-center justify-center gap-2 text-xs sm:text-sm">
          <Eye size={16} /> Lihat Jawaban
        </button>
        <button onClick={onExit} className="w-full px-6 py-3.5 rounded-xl bg-primary text-primary-foreground font-bold hover:opacity-90 shadow-lg shadow-primary/20 transition-all text-xs sm:text-sm flex items-center justify-center gap-2">
          Kembali ke Modul <ArrowRight size={16} />
        </button>
      </div>

    </div>
  );
}