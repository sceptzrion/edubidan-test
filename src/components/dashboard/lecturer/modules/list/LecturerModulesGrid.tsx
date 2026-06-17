"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";

import { LecturerModuleCard } from "@/components/dashboard/lecturer/modules/LecturerModuleCard";
import { LecturerModulesEmptyState } from "@/components/dashboard/lecturer/modules/list/LecturerModulesEmptyState";
import type { LecturerModule } from "@/data/learning/lecturer/lecturer-modules";

interface LecturerModulesGridProps {
  modules: LecturerModule[];
  search: string;
  onEdit: (module: LecturerModule) => void;
  onRemove: (id: number) => void;
}

export function LecturerModulesGrid({
  modules,
  search,
  onEdit,
  onRemove,
}: LecturerModulesGridProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [openingModuleId, setOpeningModuleId] = useState<number | null>(null);

  const handleManage = (id: number) => {
    setOpeningModuleId(id);

    startTransition(() => {
      router.push(`/dashboard/lecturer/modules/${id}`);
    });
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5 sm:gap-6">
      {modules.length > 0 ? (
        modules.map((module) => (
          <LecturerModuleCard
            key={module.id}
            module={module}
            isOpening={isPending && openingModuleId === module.id}
            onManage={handleManage}
            onEdit={onEdit}
            onRemove={onRemove}
          />
        ))
      ) : (
        <LecturerModulesEmptyState search={search} />
      )}
    </div>
  );
}