interface StudentDashboardHeaderProps {
  studentName: string;
}

export function StudentDashboardHeader({
  studentName,
}: StudentDashboardHeaderProps) {
  return (
    <div className="mb-6 sm:mb-8 md:mb-10 flex flex-col md:flex-row md:items-end justify-between gap-3 sm:gap-4">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight mb-1.5 sm:mb-2 text-foreground">
          Halo, {studentName}!
        </h1>

        <p className="text-muted-foreground text-xs sm:text-sm font-medium leading-relaxed max-w-xl">
          Lanjutkan pembelajaran kebidanan Anda melalui materi video dan kuis
          evaluasi yang tersedia.
        </p>
      </div>
    </div>
  );
}