"use client";

import { useRouter } from "next/navigation";
import { ChevronRight } from "lucide-react";

import { ModuleProgress } from "@/components/dashboard/student/ModuleProgress";

interface LearningProgressItem {
  id: number;
  title: string;
  progress: number;
  totalItems: number;
  completedItems: number;
}

interface ContinueLearningSectionProps {
  modules: LearningProgressItem[];
}

export function ContinueLearningSection({
  modules,
}: ContinueLearningSectionProps) {
  const router = useRouter();

  return (
    <section className="lg:col-span-2 bg-card rounded-2xl sm:rounded-3xl border border-border p-5 sm:p-6 md:p-8 shadow-sm">
      <div className="flex items-center justify-between mb-6 sm:mb-8 border-b border-border/50 pb-4">
        <h2 className="text-lg sm:text-xl font-extrabold text-foreground">
          Sedang Dipelajari
        </h2>

        <button
          type="button"
          onClick={() => router.push("/dashboard/modules")}
          className="text-xs sm:text-sm font-bold text-primary hover:text-teal-600 transition-colors flex items-center gap-1 group bg-primary/5 hover:bg-primary/10 px-3 py-1.5 rounded-lg"
        >
          Lihat Modul
          <ChevronRight
            size={16}
            className="group-hover:translate-x-1 transition-transform"
          />
        </button>
      </div>

      <div className="space-y-6 sm:space-y-8">
        {modules.map((module) => (
          <ModuleProgress
            key={module.id}
            title={module.title}
            progress={module.progress}
            lessons={module.totalItems}
            completed={module.completedItems}
            onClick={() => router.push(`/dashboard/modules/${module.id}`)}
          />
        ))}
      </div>
    </section>
  );
}