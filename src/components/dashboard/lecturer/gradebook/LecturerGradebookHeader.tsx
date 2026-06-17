interface LecturerGradebookHeaderProps {
  totalModules: number;
}

export function LecturerGradebookHeader({
  totalModules,
}: LecturerGradebookHeaderProps) {
  return (
    <div className="mb-6 sm:mb-8">
      <h1 className="text-2xl sm:text-3xl font-extrabold text-foreground mb-2">
        Rekap Nilai
      </h1>

      <p className="text-xs sm:text-sm font-medium text-muted-foreground leading-relaxed">
        Pilih salah satu dari {totalModules} modul untuk melihat hasil kuis dan
        capaian mahasiswa.
      </p>
    </div>
  );
}