"use client";

import { useEffect, useState, useTransition } from "react";
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
  onLeaveModule: (module: StudentModuleCardItem) => void;
}

export function StudentModulesList({
  modules,
  layout,
  search,
  onLeaveModule,
}: StudentModulesListProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [openingModuleId, setOpeningModuleId] = useState<number | null>(null);
  const [openActionModuleId, setOpenActionModuleId] = useState<number | null>(
    null
  );

  useEffect(() => {
    if (openActionModuleId === null) return;

    const closeActionMenu = () => {
      setOpenActionModuleId(null);
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        closeActionMenu();
      }
    };

    window.addEventListener("click", closeActionMenu);
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("click", closeActionMenu);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [openActionModuleId]);

  const handleOpenModule = (moduleId: number) => {
    setOpenActionModuleId(null);
    setOpeningModuleId(moduleId);

    startTransition(() => {
      router.push(`/dashboard/modules/${moduleId}`);
    });
  };

  const handleLeaveModule = (module: StudentModuleCardItem) => {
    setOpenActionModuleId(null);
    onLeaveModule(module);
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
            isActionMenuOpen={openActionModuleId === module.id}
            onClick={() => handleOpenModule(module.id)}
            onToggleActionMenu={() => {
              setOpenActionModuleId((currentModuleId) =>
                currentModuleId === module.id ? null : module.id
              );
            }}
            onLeaveClick={() => handleLeaveModule(module)}
          />
        ))
      ) : (
        <StudentModulesEmptyState search={search} />
      )}
    </div>
  );
}