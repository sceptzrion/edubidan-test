"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";

import { ModuleCard } from "@/components/dashboard/student/modules/ModuleCard";
import { StudentModulesEmptyState } from "@/components/dashboard/student/modules/list/StudentModulesEmptyState";
import type { StudentModulesLayout } from "@/components/dashboard/student/modules/list/StudentModulesToolbar";

interface StudentModuleCardItem {
  id: number;
  title: string;
  desc: string;
  img: string;
  progress: number;
  lessons: number;
  quizzes: number;
  duration: string;
  instructor: string;
}

interface StudentModulesListProps {
  modules: StudentModuleCardItem[];
  layout: StudentModulesLayout;
  search: string;
}

export function StudentModulesList({
  modules,
  layout,
  search,
}: StudentModulesListProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [openingModuleId, setOpeningModuleId] = useState<number | null>(null);

  const handleOpenModule = (moduleId: number) => {
    setOpeningModuleId(moduleId);

    startTransition(() => {
      router.push(`/dashboard/modules/${moduleId}`);
    });
  };

  return (
    <div
      className={`w-full ${
        layout === "grid"
          ? "grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5 sm:gap-6"
          : "flex flex-col gap-4 sm:gap-5"
      }`}
    >
      {modules.length > 0 ? (
        modules.map((module) => (
          <ModuleCard
            key={module.id}
            data={module}
            layout={layout}
            isOpening={isPending && openingModuleId === module.id}
            onClick={() => handleOpenModule(module.id)}
          />
        ))
      ) : (
        <StudentModulesEmptyState search={search} />
      )}
    </div>
  );
}