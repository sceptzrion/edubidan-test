import { BarChart3, BookOpen, FileQuestion, Users } from "lucide-react";

import { StatCard } from "@/components/dashboard/shared/StatCard";
import type {
  LecturerDashboardStat,
  LecturerStatIconKey,
} from "@/data/learning/lecturer/lecturer-dashboard";

interface LecturerStatsGridProps {
  stats: LecturerDashboardStat[];
}

const statIcons: Record<LecturerStatIconKey, typeof BookOpen> = {
  module: BookOpen,
  quiz: FileQuestion,
  students: Users,
  score: BarChart3,
};

export function LecturerStatsGrid({ stats }: LecturerStatsGridProps) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6 mb-8 sm:mb-10">
      {stats.map((stat) => (
        <StatCard
          key={stat.label}
          icon={statIcons[stat.iconKey]}
          label={stat.label}
          value={stat.value}
          color={stat.color}
        />
      ))}
    </div>
  );
}