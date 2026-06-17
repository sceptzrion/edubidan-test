"use client";

import { useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

import { JoinModuleModal } from "@/components/dashboard/student/modules/JoinModuleModal";
import { StudentModulesHeader } from "@/components/dashboard/student/modules/list/StudentModulesHeader";
import { StudentModulesList } from "@/components/dashboard/student/modules/list/StudentModulesList";
import {
  StudentModulesToolbar,
  type StudentModulesLayout,
} from "@/components/dashboard/student/modules/list/StudentModulesToolbar";
import type { StudentModuleCardItem } from "@/data/learning/student/student-learning.server";

interface StudentModulesClientProps {
  initialModules: StudentModuleCardItem[];
}

export function StudentModulesClient({
  initialModules,
}: StudentModulesClientProps) {
  const router = useRouter();
  const [isRefreshing, startRefreshTransition] = useTransition();

  const [search, setSearch] = useState("");
  const [layout, setLayout] = useState<StudentModulesLayout>("grid");
  const [joinOpen, setJoinOpen] = useState(false);

  const filteredModules = useMemo(() => {
    const keyword = search.trim().toLowerCase();

    if (!keyword) return initialModules;

    return initialModules.filter((module) => {
      return (
        module.title.toLowerCase().includes(keyword) ||
        module.desc.toLowerCase().includes(keyword) ||
        module.instructor.toLowerCase().includes(keyword)
      );
    });
  }, [initialModules, search]);

  const handleJoined = () => {
    setJoinOpen(false);

    startRefreshTransition(() => {
      router.refresh();
    });
  };

  return (
    <div className="relative animate-in fade-in slide-in-from-bottom-4 duration-500 pb-10 sm:pb-12">
      {isRefreshing && (
        <div className="fixed inset-x-0 top-4 z-80 mx-auto flex w-fit items-center gap-2 rounded-full border border-border bg-card/95 px-4 py-2 text-xs font-extrabold text-primary shadow-lg shadow-black/5 backdrop-blur-md">
          <Loader2 size={14} className="animate-spin" />
          Memuat ulang modul...
        </div>
      )}

      <div
        className={`transition-opacity duration-200 ${
          isRefreshing ? "opacity-70" : "opacity-100"
        }`}
        aria-busy={isRefreshing}
      >
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4 sm:gap-6 mb-6 sm:mb-8">
          <StudentModulesHeader totalModules={initialModules.length} />

          <StudentModulesToolbar
            search={search}
            layout={layout}
            onSearchChange={setSearch}
            onLayoutChange={setLayout}
            onJoinModule={() => {
              if (isRefreshing) return;
              setJoinOpen(true);
            }}
          />
        </div>

        <StudentModulesList
          modules={filteredModules}
          layout={layout}
          search={search}
        />
      </div>

      <JoinModuleModal
        isOpen={joinOpen}
        onClose={() => {
          if (isRefreshing) return;
          setJoinOpen(false);
        }}
        onJoined={handleJoined}
      />
    </div>
  );
}