import { Target, TrendingDown, TrendingUp, Users } from "lucide-react";

import type { LecturerQuizGeneralStats } from "@/data/learning/lecturer/lecturer-quiz-preview";

interface LecturerQuizStatsGridProps {
  stats: LecturerQuizGeneralStats;
}

function formatScore(value: number | null) {
  if (typeof value !== "number") {
    return "-";
  }

  return value.toFixed(1);
}

export function LecturerQuizStatsGrid({ stats }: LecturerQuizStatsGridProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 sm:gap-6">
      <div className="bg-card rounded-2xl sm:rounded-3xl border border-border p-5 sm:p-6 shadow-sm flex items-center gap-4">
        <div className="w-12 h-12 rounded-xl bg-green-500/10 text-green-500 flex items-center justify-center shrink-0">
          <Target size={24} />
        </div>

        <div>
          <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1">
            Rata-rata Skor
          </p>
          <p className="text-2xl font-extrabold text-foreground">
            {formatScore(stats.averageScore)}
          </p>
        </div>
      </div>

      <div className="bg-card rounded-2xl sm:rounded-3xl border border-border p-5 sm:p-6 shadow-sm flex items-center gap-4">
        <div className="w-12 h-12 rounded-xl bg-blue-500/10 text-blue-500 flex items-center justify-center shrink-0">
          <TrendingUp size={24} />
        </div>

        <div>
          <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1">
            Skor Tertinggi
          </p>
          <p className="text-2xl font-extrabold text-foreground">
            {formatScore(stats.highestScore)}
          </p>
        </div>
      </div>

      <div className="bg-card rounded-2xl sm:rounded-3xl border border-border p-5 sm:p-6 shadow-sm flex items-center gap-4">
        <div className="w-12 h-12 rounded-xl bg-red-500/10 text-red-500 flex items-center justify-center shrink-0">
          <TrendingDown size={24} />
        </div>

        <div>
          <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1">
            Skor Terendah
          </p>
          <p className="text-2xl font-extrabold text-foreground">
            {formatScore(stats.lowestScore)}
          </p>
        </div>
      </div>

      <div className="bg-card rounded-2xl sm:rounded-3xl border border-border p-5 sm:p-6 shadow-sm flex items-center gap-4">
        <div className="w-12 h-12 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center shrink-0">
          <Users size={24} />
        </div>

        <div>
          <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1">
            Total Mengerjakan
          </p>
          <p className="text-2xl font-extrabold text-foreground">
            {stats.totalParticipants}
          </p>
        </div>
      </div>
    </div>
  );
}