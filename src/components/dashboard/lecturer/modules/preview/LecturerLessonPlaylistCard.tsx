import { HelpCircle, ListOrdered, Video } from "lucide-react";

import type { LecturerPreviewPlaylistItem } from "@/data/learning/lecturer/lecturer-content-preview";

interface LecturerLessonPlaylistCardProps {
  playlist: LecturerPreviewPlaylistItem[];
  currentLessonId: number;
}

export function LecturerLessonPlaylistCard({
  playlist,
  currentLessonId,
}: LecturerLessonPlaylistCardProps) {
  return (
    <section className="bg-card rounded-2xl sm:rounded-3xl border border-border p-5 sm:p-6 shadow-sm">
      <div className="flex items-center justify-between mb-4 border-b border-border/50 pb-3">
        <div className="flex items-center gap-2.5">
          <ListOrdered size={18} className="text-primary" />
          <h3 className="text-base font-extrabold text-foreground">
            Susunan Modul
          </h3>
        </div>
      </div>

      <div className="space-y-1 relative before:absolute before:inset-y-0 before:left-5 before:w-0.5 before:bg-border">
        {playlist.map((item) => {
          const isCurrent = item.id === currentLessonId;
          const isMateri = item.kind === "materi";

          return (
            <div
              key={`${item.kind}-${item.id}`}
              className={`relative flex items-center gap-3 p-3 rounded-xl transition-colors ${
                isCurrent
                  ? "bg-primary/5 border border-primary/20"
                  : "opacity-70 grayscale"
              }`}
            >
              <div
                className={`relative z-10 w-10 h-10 rounded-full flex items-center justify-center shrink-0 border-4 border-card ${
                  isCurrent
                    ? "bg-primary text-white shadow-md"
                    : "bg-muted text-muted-foreground"
                }`}
              >
                {isMateri ? <Video size={14} /> : <HelpCircle size={14} />}
              </div>

              <div className="flex-1 min-w-0">
                <p
                  className={`text-xs font-extrabold truncate ${
                    isCurrent ? "text-primary" : "text-foreground"
                  }`}
                >
                  {item.title}
                </p>

                <p className="text-[10px] font-medium text-muted-foreground mt-0.5">
                  {isMateri ? `Durasi: ${item.duration}` : "Kuis Evaluasi"}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}