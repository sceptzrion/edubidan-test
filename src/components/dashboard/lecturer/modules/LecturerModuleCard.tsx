"use client";

import { useState, type MouseEvent } from "react";
import { BookOpen, Check, Copy, Edit3, Eye, Loader2, Trash2 } from "lucide-react";

import type { LecturerModule } from "@/data/learning/lecturer/lecturer-modules";

interface LecturerModuleCardProps {
  module: LecturerModule;
  isOpening?: boolean;
  onManage: (id: number) => void;
  onEdit: (module: LecturerModule) => void;
  onRemove: (id: number) => void;
}

const fallbackCoverImage =
  "https://images.unsplash.com/photo-1559757175-5700dde675bc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=640";

export function LecturerModuleCard({
  module,
  isOpening = false,
  onManage,
  onEdit,
  onRemove,
}: LecturerModuleCardProps) {
  const [copied, setCopied] = useState(false);

  const coverImage = module.image ?? fallbackCoverImage;

  const handleCopy = async (event: MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();

    await navigator.clipboard?.writeText(module.code);

    setCopied(true);

    window.setTimeout(() => {
      setCopied(false);
    }, 2000);
  };

  return (
    <article
      aria-busy={isOpening}
      className="bg-card rounded-2xl sm:rounded-3xl border border-border overflow-hidden hover:shadow-lg hover:border-primary/30 transition-all group flex flex-col h-full"
    >
      <div className="relative aspect-4/3 sm:aspect-video overflow-hidden shrink-0 border-b border-border/50">
        <img
          src={coverImage}
          alt={module.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />

        <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        <div className="absolute top-3 right-3 z-10">
          <span
            className={`px-3 py-1.5 rounded-lg text-[10px] sm:text-xs font-extrabold shadow-md backdrop-blur-md ${
              module.status === "Publik"
                ? "bg-primary text-white"
                : "bg-amber-500 text-white"
            }`}
          >
            {module.status}
          </span>
        </div>
      </div>

      <div className="p-4 sm:p-5 flex flex-col flex-1">
        <h3 className="text-lg sm:text-xl font-extrabold text-foreground mb-2 group-hover:text-primary transition-colors line-clamp-2 leading-snug">
          {module.title}
        </h3>

        <div className="flex flex-wrap items-center gap-2 text-[10px] sm:text-xs font-medium text-muted-foreground mb-4">
          <span className="flex items-center gap-1">
            <BookOpen size={14} className="text-primary/70" />
            {module.materialCount} Materi
          </span>

          <span className="w-1 h-1 rounded-full bg-border" />

          <span>Diperbarui {module.updated}</span>
        </div>

        <div className="flex items-center justify-between gap-2 px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl border border-border bg-muted/30 mb-5 mt-auto">
          <div className="min-w-0">
            <span className="block text-[10px] sm:text-xs text-muted-foreground font-medium">
              Kode Modul
            </span>

            <span className="block text-xs sm:text-sm font-mono font-extrabold text-primary tracking-widest truncate">
              {module.code}
            </span>
          </div>

          <button
            type="button"
            onClick={handleCopy}
            className="p-1.5 rounded-lg hover:bg-primary/10 text-primary transition-colors shrink-0"
            title="Salin kode modul"
            aria-label="Salin kode modul"
          >
            {copied ? <Check size={16} /> : <Copy size={16} />}
          </button>
        </div>

        <div className="flex gap-2.5 shrink-0 pt-4 border-t border-border/50">
          <button
            type="button"
            onClick={() => onManage(module.id)}
            disabled={isOpening}
            className="flex-1 py-2.5 sm:py-3 rounded-xl border border-primary bg-primary/5 text-primary text-xs sm:text-sm font-extrabold hover:bg-primary hover:text-white transition-colors flex items-center justify-center gap-2 shadow-sm hover:shadow-md disabled:cursor-wait disabled:opacity-70 disabled:hover:bg-primary/5 disabled:hover:text-primary"
          >
            {isOpening ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              <Eye size={16} />
            )}
            {isOpening ? "Membuka..." : "Kelola Isi"}
          </button>

          <button
            type="button"
            onClick={() => onEdit(module)}
            disabled={isOpening}
            className="p-2.5 sm:p-3 rounded-xl border border-border text-muted-foreground hover:text-foreground hover:bg-muted transition-colors flex items-center justify-center shadow-sm disabled:cursor-not-allowed disabled:opacity-60"
            title="Edit modul"
            aria-label="Edit modul"
          >
            <Edit3 size={18} />
          </button>

          <button
            type="button"
            onClick={() => onRemove(module.id)}
            disabled={isOpening}
            className="p-2.5 sm:p-3 rounded-xl border border-red-500/20 text-red-500 hover:bg-red-500/10 transition-colors flex items-center justify-center shadow-sm disabled:cursor-not-allowed disabled:opacity-60"
            title="Hapus modul"
            aria-label="Hapus modul"
          >
            <Trash2 size={18} />
          </button>
        </div>
      </div>
    </article>
  );
}