"use client";

import { useRouter } from "next/navigation";

import { TaskItem } from "@/components/dashboard/student/modules/TaskItem";
import { ModuleDetailEmptyState } from "@/components/dashboard/student/modules/detail/ModuleDetailEmptyState";
import { toModuleTaskItem } from "@/data/learning/shared/learning-modules";
import type { LearningItem } from "@/types/learning";

interface ModuleEvaluationTabProps {
  moduleId: number;
  items: LearningItem[];
}

export function ModuleEvaluationTab({
  moduleId,
  items,
}: ModuleEvaluationTabProps) {
  const router = useRouter();

  return (
    <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
      {items.length > 0 ? (
        items.map((item) => (
          <TaskItem
            key={`kuis-${item.id}`}
            item={toModuleTaskItem(item)}
            onClick={() =>
              router.push(`/dashboard/modules/${moduleId}/quiz/${item.id}`)
            }
          />
        ))
      ) : (
        <ModuleDetailEmptyState message="Kuis tidak ditemukan." />
      )}
    </div>
  );
}