"use client";

import { useRouter } from "next/navigation";

import { PlaylistItem } from "@/components/dashboard/student/modules/PlaylistItem";
import { ModuleDetailEmptyState } from "@/components/dashboard/student/modules/detail/ModuleDetailEmptyState";
import { toModulePlaylistItem } from "@/data/learning/shared/learning-modules";
import type { LearningItem } from "@/types/learning";

interface ModuleLearningTabProps {
  moduleId: number;
  items: LearningItem[];
}

function getLearningItemHref(moduleId: number, item: LearningItem) {
  if (item.kind === "kuis") {
    return `/dashboard/modules/${moduleId}/quiz/${item.id}`;
  }

  return `/dashboard/modules/${moduleId}/lesson/${item.id}`;
}

export function ModuleLearningTab({ moduleId, items }: ModuleLearningTabProps) {
  const router = useRouter();

  return (
    <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
      {items.length > 0 ? (
        items.map((item) => (
          <PlaylistItem
            key={`${item.kind}-${item.id}`}
            item={toModulePlaylistItem(item)}
            onClick={() => router.push(getLearningItemHref(moduleId, item))}
          />
        ))
      ) : (
        <ModuleDetailEmptyState message="Pencarian tidak ditemukan." />
      )}
    </div>
  );
}