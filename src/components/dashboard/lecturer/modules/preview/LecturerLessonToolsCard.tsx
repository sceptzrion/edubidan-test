import { Wrench } from "lucide-react";

interface LecturerLessonToolsCardProps {
  tools: string[];
}

export function LecturerLessonToolsCard({ tools }: LecturerLessonToolsCardProps) {
  const filteredTools = tools.filter((tool) => tool.trim());

  return (
    <section className="bg-card rounded-2xl sm:rounded-3xl border border-border p-5 sm:p-6 shadow-sm">
      <div className="flex items-center gap-2.5 mb-4 border-b border-border/50 pb-3">
        <Wrench size={18} className="text-primary" />
        <h3 className="text-base font-extrabold text-foreground">
          Daftar Alat Pendukung
        </h3>
      </div>

      {filteredTools.length > 0 ? (
        <div className="flex flex-wrap gap-2">
          {filteredTools.map((tool) => (
            <span
              key={tool}
              className="px-3 py-1.5 bg-muted/50 border border-border rounded-lg text-xs font-bold text-foreground"
            >
              {tool}
            </span>
          ))}
        </div>
      ) : (
        <p className="text-sm text-muted-foreground italic">
          Tidak ada alat khusus.
        </p>
      )}
    </section>
  );
}