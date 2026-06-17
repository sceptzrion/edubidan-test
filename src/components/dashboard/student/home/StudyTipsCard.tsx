import { Clock3 } from "lucide-react";

export function StudyTipsCard() {
  return (
    <section className="bg-card rounded-2xl sm:rounded-3xl border border-border p-5 sm:p-6 shadow-sm">
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
          <Clock3 size={20} />
        </div>

        <div>
          <h3 className="text-sm font-extrabold text-foreground mb-1">
            Tips Belajar
          </h3>

          <p className="text-xs leading-relaxed text-muted-foreground font-medium">
            Selesaikan materi video terlebih dahulu sebelum mengerjakan kuis agar
            hasil evaluasi lebih maksimal.
          </p>
        </div>
      </div>
    </section>
  );
}