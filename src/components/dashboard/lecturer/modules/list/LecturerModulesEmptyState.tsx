import { BookOpen } from "lucide-react";

interface LecturerModulesEmptyStateProps {
  search: string;
}

export function LecturerModulesEmptyState({
  search,
}: LecturerModulesEmptyStateProps) {
  return (
    <div className="col-span-full py-12 sm:py-16 text-center bg-card rounded-2xl sm:rounded-3xl border border-border border-dashed p-6">
      <BookOpen
        size={40}
        className="mx-auto text-muted-foreground/30 mb-3 sm:mb-4 sm:w-12 sm:h-12"
      />

      <p className="text-foreground font-extrabold text-base sm:text-lg mb-1">
        Modul tidak ditemukan.
      </p>

      <p className="text-xs sm:text-sm font-medium text-muted-foreground leading-relaxed">
        {search.trim()
          ? "Coba gunakan judul atau kode modul yang lain."
          : "Belum ada modul pembelajaran yang dibuat."}
      </p>
    </div>
  );
}