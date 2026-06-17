"use client";

import { Download, Plus } from "lucide-react";

interface AdminUsersHeaderProps {
  onAddUser: () => void;
}

export function AdminUsersHeader({ onAddUser }: AdminUsersHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6 sm:mb-8">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground mb-1.5 sm:mb-2">
          Kelola Pengguna
        </h1>

        <p className="text-xs sm:text-sm font-medium text-muted-foreground max-w-2xl leading-relaxed">
          Kelola data akun mahasiswa dan dosen, termasuk status akses serta
          identitas pengguna.
        </p>
      </div>

      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
        <button
          type="button"
          className="px-5 py-3 rounded-xl sm:rounded-2xl border border-border text-xs sm:text-sm font-bold text-foreground hover:bg-muted transition-colors flex items-center justify-center gap-2 shadow-sm"
        >
          <Download size={16} />
          Ekspor
        </button>

        <button
          type="button"
          onClick={onAddUser}
          className="bg-primary text-primary-foreground px-5 py-3 rounded-xl sm:rounded-2xl text-xs sm:text-sm font-extrabold hover:bg-primary/90 transition-all hover:-translate-y-0.5 shadow-lg shadow-primary/20 flex items-center justify-center gap-2"
        >
          <Plus size={18} />
          Tambah Pengguna
        </button>
      </div>
    </div>
  );
}