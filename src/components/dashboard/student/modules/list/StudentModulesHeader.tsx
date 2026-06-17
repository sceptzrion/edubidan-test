interface StudentModulesHeaderProps {
  totalModules: number;
}

export function StudentModulesHeader({
  totalModules,
}: StudentModulesHeaderProps) {
  return (
    <div>
      <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight mb-1.5 sm:mb-2 text-foreground">
        Modul Saya
      </h1>

      <p className="text-xs sm:text-sm text-muted-foreground font-medium leading-relaxed">
        {totalModules} modul pembelajaran terdaftar di akun Anda.
      </p>
    </div>
  );
}