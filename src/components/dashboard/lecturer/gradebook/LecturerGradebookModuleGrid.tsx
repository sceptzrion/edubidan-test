"use client";

import { useRouter } from "next/navigation";
import { BookOpen } from "lucide-react";

import { LecturerGradebookModuleCard } from "@/components/dashboard/lecturer/gradebook/LecturerGradebookModuleCard";
import type { LecturerGradebookModule } from "@/data/learning/lecturer/lecturer-gradebook";

interface LecturerGradebookModuleGridProps {
  modules: LecturerGradebookModule[];
}

export function LecturerGradebookModuleGrid({
  modules,
}: LecturerGradebookModuleGridProps) {
  const router = useRouter();

  if (modules.length === 0) {
    return (
      <div className="py-16 text-center border-2 border-dashed border-border rounded-3xl bg-muted/20">
        <BookOpen
          size={48}
          className="mx-auto text-muted-foreground/30 mb-4"
        />
        <p className="text-foreground font-extrabold text-lg mb-1">
          Belum ada modul aktif
        </p>
        <p className="text-sm font-medium text-muted-foreground">
          Silakan buat modul pembelajaran terlebih dahulu.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5 sm:gap-6">
      {modules.map((module) => (
        <LecturerGradebookModuleCard
          key={module.id}
          module={module}
          onOpen={(id) => router.push(`/dashboard/lecturer/gradebook/${id}`)}
        />
      ))}
    </div>
  );
}