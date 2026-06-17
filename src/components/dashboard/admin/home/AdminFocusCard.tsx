import Link from "next/link";
import { Activity } from "lucide-react";

export function AdminFocusCard() {
  return (
    <aside className="bg-card rounded-2xl sm:rounded-3xl border border-border p-5 sm:p-8 shadow-sm h-fit">
      <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-primary/10 text-primary flex items-center justify-center mb-5">
        <Activity size={22} className="sm:w-6 sm:h-6" />
      </div>

      <h2 className="text-base sm:text-lg font-extrabold text-foreground mb-2">
        Fokus Admin
      </h2>

      <p className="text-xs sm:text-sm text-muted-foreground font-medium leading-relaxed mb-5">
        Admin berperan menjaga data pengguna, memastikan peran akun sesuai, dan
        memantau aktivitas utama pada sistem pembelajaran.
      </p>

      <Link
        href="/dashboard/admin/users"
        className="w-full py-3 rounded-xl sm:rounded-2xl bg-muted hover:bg-muted/80 text-xs sm:text-sm font-extrabold text-foreground transition-colors flex items-center justify-center"
      >
        Buka Kelola Pengguna
      </Link>
    </aside>
  );
}