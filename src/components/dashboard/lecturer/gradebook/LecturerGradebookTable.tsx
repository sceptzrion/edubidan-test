import { Search } from "lucide-react";

import type { LecturerGradebookRow } from "@/data/learning/lecturer/lecturer-gradebook";

interface LecturerGradebookTableProps {
  quizzes: string[];
  rows: LecturerGradebookRow[];
  search: string;
}

export function LecturerGradebookTable({
  quizzes,
  rows,
  search,
}: LecturerGradebookTableProps) {
  if (quizzes.length === 0) {
    return (
      <div className="p-12 text-center">
        <Search size={32} className="mx-auto text-muted-foreground/30 mb-3" />
        <p className="text-sm font-bold text-foreground">
          Belum ada kuis evaluasi
        </p>
        <p className="text-xs text-muted-foreground mt-1">
          Nilai mahasiswa akan tampil setelah dosen menambahkan kuis pada modul
          ini.
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="overflow-x-auto scrollbar-thin">
        <table className="w-full text-sm whitespace-nowrap">
          <thead>
            <tr className="border-b border-border bg-muted/30">
              <th className="text-left p-4 sm:px-6 text-muted-foreground sticky left-0 bg-muted/95 backdrop-blur-sm z-10 font-bold uppercase tracking-wider text-xs border-r border-border/50 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.05)]">
                Mahasiswa
              </th>

              <th className="text-left p-4 sm:px-6 text-muted-foreground font-bold uppercase tracking-wider text-xs">
                NIM
              </th>

              {quizzes.map((quiz, index) => (
                <th
                  key={`${quiz}-${index}`}
                  className="text-center p-4 sm:px-6 text-muted-foreground font-medium"
                >
                  <div className="text-[10px] font-extrabold uppercase tracking-wider text-primary mb-1">
                    Kuis {index + 1}
                  </div>
                  <div className="text-xs truncate max-w-30 mx-auto" title={quiz}>
                    {quiz}
                  </div>
                </th>
              ))}

              <th className="text-center p-4 sm:px-6 text-muted-foreground bg-primary/5 font-bold uppercase tracking-wider text-xs border-l border-border/50">
                Rata-rata
              </th>
            </tr>
          </thead>

          <tbody>
            {rows.map((row) => (
              <tr
                key={row.nim}
                className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors group"
              >
                <td className="p-4 sm:px-6 sticky left-0 bg-card group-hover:bg-muted/30 transition-colors z-10 border-r border-border/50 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.05)]">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-linear-to-br from-primary to-teal-500 flex items-center justify-center text-white text-xs sm:text-sm font-extrabold shadow-sm shrink-0">
                      {row.name.charAt(0)}
                    </div>

                    <span className="font-extrabold text-foreground text-xs sm:text-sm">
                      {row.name}
                    </span>
                  </div>
                </td>

                <td className="p-4 sm:px-6 text-muted-foreground font-mono font-medium text-xs sm:text-sm">
                  {row.nim}
                </td>

                {row.scores.map((score, index) => (
                  <td
                    key={`${row.nim}-${index}`}
                    className="p-4 sm:px-6 text-center"
                  >
                    {score === null ? (
                      <span className="text-xs font-bold text-muted-foreground/50 italic bg-muted/50 px-2 py-1 rounded-md">
                        Belum
                      </span>
                    ) : (
                      <span className="text-sm font-extrabold text-foreground">
                        {score.toFixed(1)}
                      </span>
                    )}
                  </td>
                ))}

                <td className="p-4 sm:px-6 text-center bg-primary/5 border-l border-border/50">
                  <span className="text-base sm:text-lg font-extrabold text-primary">
                    {row.average.toFixed(1)}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {rows.length === 0 && (
        <div className="p-12 text-center">
          <Search size={32} className="mx-auto text-muted-foreground/30 mb-3" />
          <p className="text-sm font-bold text-foreground">
            Pencarian tidak ditemukan
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            Tidak ada mahasiswa dengan nama atau NIM &quot;{search}&quot;.
          </p>
        </div>
      )}
    </>
  );
}