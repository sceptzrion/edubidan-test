import { Trophy } from "lucide-react";

import type { LecturerQuizLeaderboardItem } from "@/data/learning/lecturer/lecturer-quiz-preview";

interface LecturerQuizLeaderboardProps {
  leaderboard: LecturerQuizLeaderboardItem[];
}

function getRankClass(rank: number) {
  if (rank === 1) {
    return "bg-yellow-500/20 text-yellow-600 border border-yellow-500/30";
  }

  if (rank === 2) {
    return "bg-slate-300/20 text-slate-400 border border-slate-300/30";
  }

  if (rank === 3) {
    return "bg-orange-500/20 text-orange-600 border border-orange-500/30";
  }

  return "text-muted-foreground";
}

export function LecturerQuizLeaderboard({
  leaderboard,
}: LecturerQuizLeaderboardProps) {
  return (
    <section className="bg-card rounded-2xl sm:rounded-3xl border border-border overflow-hidden shadow-sm">
      <div className="p-5 sm:p-6 border-b border-border/50 flex items-center gap-3">
        <Trophy size={20} className="text-amber-500" />
        <h2 className="text-lg font-extrabold text-foreground">
          Peringkat Mahasiswa
        </h2>
      </div>

      {leaderboard.length === 0 ? (
        <div className="p-8 text-center text-sm font-medium text-muted-foreground">
          Belum ada mahasiswa yang menyelesaikan kuis ini.
        </div>
      ) : (
        <div className="overflow-x-auto scrollbar-thin">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead>
              <tr className="border-b border-border bg-muted/30">
                <th className="p-4 sm:px-6 font-extrabold text-muted-foreground text-xs uppercase tracking-wider w-16 text-center">
                  Rank
                </th>
                <th className="p-4 sm:px-6 font-extrabold text-muted-foreground text-xs uppercase tracking-wider">
                  Nama Peserta
                </th>
                <th className="p-4 sm:px-6 font-extrabold text-muted-foreground text-xs uppercase tracking-wider">
                  NPM / NIM
                </th>
                <th className="p-4 sm:px-6 font-extrabold text-muted-foreground text-xs uppercase tracking-wider">
                  Skor
                </th>
                <th className="p-4 sm:px-6 font-extrabold text-muted-foreground text-xs uppercase tracking-wider text-right">
                  Waktu Pengerjaan
                </th>
              </tr>
            </thead>

            <tbody>
              {leaderboard.map((student) => (
                <tr
                  key={`${student.rank}-${student.nim}`}
                  className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors"
                >
                  <td className="p-4 sm:px-6 text-center">
                    <span
                      className={`inline-flex items-center justify-center w-8 h-8 rounded-lg font-extrabold text-xs ${getRankClass(
                        student.rank
                      )}`}
                    >
                      #{student.rank}
                    </span>
                  </td>

                  <td className="p-4 sm:px-6 font-extrabold text-foreground">
                    {student.name}
                  </td>

                  <td className="p-4 sm:px-6 text-muted-foreground font-mono font-medium text-xs sm:text-sm">
                    {student.nim}
                  </td>

                  <td className="p-4 sm:px-6">
                    <span className="font-extrabold px-3 py-1 rounded-lg text-xs bg-primary/10 text-primary">
                      {student.score.toFixed(1)}
                    </span>
                  </td>

                  <td className="p-4 sm:px-6 text-right font-medium text-muted-foreground">
                    {student.time}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}