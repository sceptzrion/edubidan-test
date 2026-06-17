import { Check, Clock, FileText, Target, UserRound } from "lucide-react";

interface ModuleDetailHeaderProps {
  info: {
    banner: string;
    title: string;
    progress: number;
    description: string;
    estimatedTime: string;
    contentSummary: string;
    objectives: string[];
    instructor: { name: string; email: string };
  };
}

export function ModuleDetailHeader({ info }: ModuleDetailHeaderProps) {
  return (
    <div className="bg-card rounded-3xl border border-border overflow-hidden mb-8 shadow-sm">
      <div className="relative aspect-21/9 sm:aspect-16/5 bg-linear-to-br from-primary/30 to-teal-300 overflow-hidden">
        <img src={info.banner} alt={info.title} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-linear-to-t from-black/90 via-black/40 to-transparent" />

        <div className="absolute bottom-5 left-4 sm:bottom-10 sm:left-8 right-4 sm:right-8">
          <p className="text-[10px] sm:text-sm font-extrabold text-primary mb-1 sm:mb-1.5 drop-shadow-sm">
            {info.progress}% Selesai
          </p>
          <h1 className="text-xl sm:text-4xl text-white font-extrabold drop-shadow-md leading-tight max-w-3xl">
            {info.title}
          </h1>
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-1 sm:h-1.5 bg-white/20">
          <div
            className="h-full bg-primary transition-all duration-1000 ease-out"
            style={{ width: `${info.progress}%` }}
          />
        </div>
      </div>

      <div className="p-5 sm:p-8">
        <p className="text-xs sm:text-base text-muted-foreground font-medium leading-relaxed mb-6 sm:mb-8 max-w-4xl">
          {info.description}
        </p>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4 mb-6 sm:mb-8">
          <div className="flex items-center gap-2.5 sm:gap-3 p-3 sm:p-4 rounded-2xl bg-muted/50 border border-border/50">
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
              <Clock size={16} className="sm:w-4.5 sm:h-4.5" />
            </div>
            <div className="min-w-0">
              <p className="text-[10px] sm:text-xs font-semibold text-muted-foreground mb-0.5 truncate">
                Estimasi Waktu
              </p>
              <p className="text-xs sm:text-sm font-extrabold text-foreground truncate">
                {info.estimatedTime}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 sm:gap-3 p-3 sm:p-4 rounded-2xl bg-muted/50 border border-border/50">
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-teal-500/10 text-teal-600 flex items-center justify-center shrink-0">
              <FileText size={16} className="sm:w-4.5 sm:h-4.5" />
            </div>
            <div className="min-w-0">
              <p className="text-[10px] sm:text-xs font-semibold text-muted-foreground mb-0.5 truncate">
                Jumlah Konten
              </p>
              <p className="text-xs sm:text-sm font-extrabold text-foreground truncate">
                {info.contentSummary}
              </p>
            </div>
          </div>

          <div className="col-span-2 md:col-span-1 flex items-center gap-2.5 sm:gap-3 p-3 sm:p-4 rounded-2xl bg-muted/50 border border-border/50">
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-blue-500/10 text-blue-600 flex items-center justify-center shrink-0">
              <UserRound size={16} className="sm:w-4.5 sm:h-4.5" />
            </div>
            <div className="min-w-0">
              <p className="text-[10px] sm:text-xs font-semibold text-muted-foreground mb-0.5 truncate">
                Instruktur
              </p>
              <p className="text-xs sm:text-sm font-extrabold text-foreground truncate">
                {info.instructor.name}
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-border p-4 sm:p-6 bg-card">
          <div className="flex items-center gap-2 mb-3 sm:mb-4">
            <Target size={16} className="sm:w-4.5 sm:h-4.5 text-primary" />
            <p className="text-sm sm:text-base font-extrabold text-foreground">
              Tujuan Pembelajaran Modul
            </p>
          </div>

          <ul className="space-y-2.5 sm:space-y-3">
            {info.objectives.map((objective) => (
              <li
                key={objective}
                className="flex items-start gap-2.5 sm:gap-3 text-xs sm:text-sm font-medium text-muted-foreground"
              >
                <div className="mt-0.5 w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                  <Check size={8} className="sm:w-2.5 sm:h-2.5 text-primary" />
                </div>
                <span className="leading-relaxed">{objective}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}