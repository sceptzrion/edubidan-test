import Link from "next/link";
import { UserCog } from "lucide-react";

interface AdminDashboardHeaderProps {
  adminName: string;
}

export function AdminDashboardHeader({ adminName }: AdminDashboardHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6 sm:mb-8">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground mb-1.5 sm:mb-2">
          Selamat datang, {adminName}!
        </h1>

        <p className="text-xs sm:text-sm font-medium text-muted-foreground max-w-2xl leading-relaxed">
          Pantau ringkasan pengguna, modul pembelajaran, dan aktivitas sistem
          pada platform EduBidan.
        </p>
      </div>

      <Link
        href="/dashboard/admin/users"
        className="w-full sm:w-auto bg-primary text-primary-foreground px-5 sm:px-6 py-3 rounded-xl sm:rounded-2xl font-extrabold text-xs sm:text-sm hover:bg-primary/90 transition-all hover:-translate-y-0.5 active:scale-95 shadow-lg shadow-primary/20 flex items-center justify-center gap-2"
      >
        <UserCog size={18} />
        Kelola Pengguna
      </Link>
    </div>
  );
}