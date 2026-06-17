import { LecturerGradebookTable } from "@/components/dashboard/lecturer/gradebook/LecturerGradebookTable";
import { LecturerGradebookToolbar } from "@/components/dashboard/lecturer/gradebook/LecturerGradebookToolbar";
import type { LecturerGradebookRow } from "@/data/learning/lecturer/lecturer-gradebook";

interface LecturerGradebookTableCardProps {
  search: string;
  quizzes: string[];
  rows: LecturerGradebookRow[];
  onSearchChange: (value: string) => void;
}

export function LecturerGradebookTableCard({
  search,
  quizzes,
  rows,
  onSearchChange,
}: LecturerGradebookTableCardProps) {
  return (
    <div className="bg-card rounded-2xl sm:rounded-3xl border border-border shadow-sm overflow-hidden flex flex-col">
      <LecturerGradebookToolbar
        search={search}
        quizzes={quizzes}
        rows={rows}
        onSearchChange={onSearchChange}
      />

      <LecturerGradebookTable quizzes={quizzes} rows={rows} search={search} />
    </div>
  );
}