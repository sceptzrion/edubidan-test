import { Clock, Edit3, KeyRound, ListChecks, User } from "lucide-react";

import type { LecturerModuleDetailInfo } from "@/data/learning/lecturer/lecturer-module-detail";

interface LecturerModuleDetailHeaderProps {
  info: LecturerModuleDetailInfo;
  onEditClick: () => void;
}

export function LecturerModuleDetailHeader({
  info,
  onEditClick,
}: LecturerModuleDetailHeaderProps) {
  return (
    <section className="bg-card rounded-2xl sm:rounded-3xl border border-border overflow-hidden shadow-sm mb-6 sm:mb-8">
      <div className="relative h-44 sm:h-56 md:h-64 overflow-hidden">
        <img
          src={info.banner}
          alt={info.title}
          className="w-full h-full object-cover"
        />

        <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/30 to-transparent" />

        <div className="absolute top-4 right-4">
          <span
            className={`px-3 py-1.5 rounded-xl text-xs font-extrabold shadow-md backdrop-blur-md ${
              info.status === "Publik"
                ? "bg-primary text-white"
                : "bg-amber-500 text-white"
            }`}
          >
            {info.status}
          </span>
        </div>

        <div className="absolute left-4 right-4 bottom-4 sm:left-6 sm:right-6 sm:bottom-6">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white leading-tight mb-2 line-clamp-2">
            {info.title}
          </h1>

          <p className="text-xs sm:text-sm text-white/80 font-medium line-clamp-2 max-w-3xl leading-relaxed">
            {info.description}
          </p>
        </div>
      </div>

      <div className="p-5 sm:p-6 md:p-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6">
          <div className="rounded-2xl bg-muted/40 border border-border p-4">
            <div className="flex items-center gap-2 text-muted-foreground mb-1">
              <Clock size={15} />
              <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider">
                Durasi
              </span>
            </div>
            <p className="text-sm sm:text-base font-extrabold text-foreground">
              {info.estimatedTime}
            </p>
          </div>

          <div className="rounded-2xl bg-muted/40 border border-border p-4">
            <div className="flex items-center gap-2 text-muted-foreground mb-1">
              <User size={15} />
              <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider">
                Dosen
              </span>
            </div>
            <p className="text-sm sm:text-base font-extrabold text-foreground truncate">
              {info.instructor}
            </p>
          </div>

          <div className="rounded-2xl bg-muted/40 border border-border p-4">
            <div className="flex items-center gap-2 text-muted-foreground mb-1">
              <KeyRound size={15} />
              <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider">
                Kode Modul
              </span>
            </div>
            <p className="text-sm sm:text-base font-mono font-extrabold text-primary tracking-wider">
              {info.code}
            </p>
          </div>

          <button
            type="button"
            onClick={onEditClick}
            className="rounded-2xl bg-primary text-primary-foreground border border-primary p-4 flex items-center justify-center gap-2 font-extrabold text-xs sm:text-sm hover:bg-primary/90 transition-all shadow-md shadow-primary/20"
          >
            <Edit3 size={16} />
            Edit Info
          </button>
        </div>

        <div className="rounded-2xl border border-border bg-muted/20 p-4 sm:p-5">
          <div className="flex items-center gap-2 mb-3">
            <ListChecks size={18} className="text-primary" />
            <h2 className="text-sm sm:text-base font-extrabold text-foreground">
              Tujuan Pembelajaran
            </h2>
          </div>

          <ul className="space-y-2">
            {info.objectives.map((objective) => (
              <li
                key={objective}
                className="text-xs sm:text-sm text-muted-foreground font-medium leading-relaxed flex gap-2"
              >
                <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
                {objective}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}