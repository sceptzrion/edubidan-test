interface LecturerDashboardHeaderProps {
  lecturerName: string;
}

export function LecturerDashboardHeader({
  lecturerName,
}: LecturerDashboardHeaderProps) {
  return (
    <div className="mb-6 sm:mb-8 md:mb-10 flex flex-col md:flex-row md:items-end justify-between gap-3 sm:gap-4">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight mb-1.5 sm:mb-2 text-foreground">
          Selamat datang, {lecturerName}!
        </h1>

        <p className="text-muted-foreground text-xs sm:text-sm font-medium leading-relaxed max-w-2xl">
          Kelola modul pembelajaran, pantau pengerjaan kuis, dan tinjau capaian
          mahasiswa pada modul yang Anda ampu.
        </p>
      </div>
    </div>
  );
}