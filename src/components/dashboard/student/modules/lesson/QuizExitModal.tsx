import React from "react";
import { AlertTriangle, X } from "lucide-react";

interface QuizExitModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export function QuizExitModal({ isOpen, onClose, onConfirm }: QuizExitModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-200 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200" onClick={onClose} />
      
      <div className="bg-card border border-border w-full max-w-sm rounded-3xl p-6 shadow-2xl relative z-10 animate-in zoom-in-95 duration-200">
        <button onClick={onClose} className="absolute right-4 top-4 text-muted-foreground hover:text-foreground transition-colors">
          <X size={20} />
        </button>
        
        <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-500 flex items-center justify-center mb-4">
          <AlertTriangle size={24} />
        </div>
        
        <h3 className="text-lg font-extrabold text-foreground mb-2">Submit & Akhiri Kuis?</h3>
        <p className="text-sm text-muted-foreground leading-relaxed mb-6 font-medium">
          Kuis akan diakhiri dan jawaban Anda akan langsung dikumpulkan. Apakah Anda yakin ingin keluar?
        </p>
        
        <div className="grid grid-cols-2 gap-3">
          {/* REVISI: Tambahkan text-foreground di sini */}
          <button onClick={onClose} className="px-4 py-2.5 rounded-xl border border-border font-bold text-xs sm:text-sm text-foreground hover:bg-muted transition-colors">
            Kembali
          </button>
          <button onClick={onConfirm} className="px-4 py-2.5 rounded-xl bg-amber-500 text-white font-bold text-xs sm:text-sm hover:bg-amber-600 transition-colors shadow-lg shadow-amber-500/20">
            Ya, Submit
          </button>
        </div>
      </div>
    </div>
  );
}