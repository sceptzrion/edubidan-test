import {
  BookOpen,
  CheckCircle2,
  ClipboardCheck,
  CircleAlert,
} from "lucide-react";

import { StatCard } from "@/components/dashboard/shared/StatCard";

interface StudentStatsGridProps {
  stats: {
    enrolledModules: number;
    completedMaterials: number;
    completedQuizzes: number;
    pendingQuizzes: number;
  };
}

export function StudentStatsGrid({ stats }: StudentStatsGridProps) {
  const statItems = [
    {
      icon: BookOpen,
      label: "Modul Diikuti",
      value: stats.enrolledModules,
      color: "bg-primary/15 text-primary border-primary/20",
    },
    {
      icon: CheckCircle2,
      label: "Materi Selesai",
      value: stats.completedMaterials,
      color: "bg-teal-500/15 text-teal-600 border-teal-500/20",
    },
    {
      icon: ClipboardCheck,
      label: "Kuis Selesai",
      value: stats.completedQuizzes,
      color: "bg-blue-500/15 text-blue-600 border-blue-500/20",
    },
    {
      icon: CircleAlert,
      label: "Kuis Belum Dikerjakan",
      value: stats.pendingQuizzes,
      color: "bg-amber-500/15 text-amber-500 border-amber-500/20",
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6 mb-8 sm:mb-10">
      {statItems.map((stat) => (
        <StatCard
          key={stat.label}
          icon={stat.icon}
          label={stat.label}
          value={stat.value}
          color={stat.color}
        />
      ))}
    </div>
  );
}