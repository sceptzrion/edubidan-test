import React from "react";
import { Plus, Search } from "lucide-react";

interface LecturerModuleHeaderProps {
  search: string;
  onSearchChange: (val: string) => void;
  onAddClick: () => void;
}

export function LecturerModuleHeader({ search, onSearchChange, onAddClick }: LecturerModuleHeaderProps) {
  return (
    <>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5 sm:mb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight mb-1.5 text-foreground">Modul Pembelajaran</h1>
          <p className="text-xs sm:text-sm text-muted-foreground font-medium">
            Buat modul, atur materi, dan rakit kuis pilihan ganda.
          </p>
        </div>
        
        <button 
          onClick={onAddClick} 
          className="w-full sm:w-auto bg-primary text-primary-foreground px-5 sm:px-6 py-3 rounded-xl sm:rounded-2xl text-xs sm:text-sm font-extrabold flex items-center justify-center gap-2 hover:bg-primary/90 shadow-lg shadow-primary/20 transition-all hover:-translate-y-0.5 shrink-0"
        >
          <Plus size={18} className="sm:w-5 sm:h-5" /> Tambah Modul
        </button>
      </div>

      <div className="relative w-full mb-8 sm:mb-10">
        <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
        <input 
          value={search} 
          onChange={(e) => onSearchChange(e.target.value)} 
          placeholder="Cari modul..." 
          className="w-full pl-11 pr-4 py-3 sm:py-3.5 rounded-xl sm:rounded-2xl bg-card border border-border focus:border-primary focus:ring-1 focus:ring-primary outline-none text-xs sm:text-sm font-bold text-foreground transition-all shadow-sm" 
        />
      </div>
    </>
  );
}