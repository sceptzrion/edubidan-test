import React from "react";
import { AlertTriangle } from "lucide-react";

export function QuizWarning() {
  return (
    <div className="bg-red-500/5 border border-red-500/20 rounded-2xl sm:rounded-3xl p-5 sm:p-6 shadow-sm shrink-0">
      <div className="flex items-center gap-2 mb-3">
        <AlertTriangle size={18} className="text-red-500 sm:w-5 sm:h-5" />
        <h3 className="text-sm sm:text-base font-extrabold text-red-600">Perhatian Sebelum Kuis</h3>
      </div>
      
      {/* REVISI: space-y dikurangi agar jarak antar poin lebih rapat */}
      <ul className="space-y-1.5 sm:space-y-2 text-xs sm:text-sm font-bold text-red-600/80 leading-normal">
        <li className="flex items-start gap-2">
          <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-red-400 shrink-0" />
          Pastikan koneksi internet Anda stabil.
        </li>
        <li className="flex items-start gap-2">
          <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-red-400 shrink-0" />
          Waktu akan terus berjalan setelah tombol &quot;Mulai Kuis&quot; ditekan.
        </li>
        <li className="flex items-start gap-2">
          <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-red-400 shrink-0" />
          Progres kuis tidak bisa dibatalkan atau diulang setengah jalan.
        </li>
      </ul>
    </div>
  );
}