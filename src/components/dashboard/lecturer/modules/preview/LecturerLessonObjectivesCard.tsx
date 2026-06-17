import { CheckCircle2, Target } from "lucide-react";

interface LecturerLessonObjectivesCardProps {
  objectives: string[];
}

export function LecturerLessonObjectivesCard({
  objectives,
}: LecturerLessonObjectivesCardProps) {
  const filteredObjectives = objectives.filter((objective) => objective.trim());

  return (
    <section className="bg-card rounded-2xl sm:rounded-3xl border border-border p-5 sm:p-6 shadow-sm">
      <div className="flex items-center gap-2.5 mb-4 border-b border-border/50 pb-3">
        <Target size={18} className="text-primary" />
        <h3 className="text-base font-extrabold text-foreground">
          Tujuan Pembelajaran
        </h3>
      </div>

      {filteredObjectives.length > 0 ? (
        <ul className="space-y-3">
          {filteredObjectives.map((objective) => (
            <li
              key={objective}
              className="flex items-start gap-3 text-sm text-muted-foreground font-medium"
            >
              <CheckCircle2 size={16} className="text-primary mt-0.5 shrink-0" />
              <span className="leading-relaxed">{objective}</span>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-sm text-muted-foreground italic">
          Belum ada tujuan khusus.
        </p>
      )}
    </section>
  );
}