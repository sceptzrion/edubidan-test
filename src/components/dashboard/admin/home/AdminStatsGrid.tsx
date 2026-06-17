import {
  BookOpen,
  GraduationCap,
  ShieldCheck,
  Users,
  type LucideIcon,
} from "lucide-react";

import type {
  AdminDashboardStat,
  AdminStatIconKey,
} from "@/data/learning/admin/admin-dashboard";

interface AdminStatsGridProps {
  stats: AdminDashboardStat[];
}

const statIcons: Record<AdminStatIconKey, LucideIcon> = {
  users: Users,
  students: GraduationCap,
  lecturers: ShieldCheck,
  modules: BookOpen,
};

export function AdminStatsGrid({ stats }: AdminStatsGridProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5 sm:gap-6 mb-8 sm:mb-10">
      {stats.map((stat) => {
        const Icon = statIcons[stat.iconKey];

        return (
          <article
            key={stat.label}
            className="bg-card rounded-2xl sm:rounded-3xl border border-border p-5 sm:p-6 shadow-sm hover:shadow-md transition-all group"
          >
            <div className="flex items-center justify-between mb-4">
              <div
                className={`w-11 h-11 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl ${stat.bg} ${stat.color} flex items-center justify-center shrink-0 shadow-inner group-hover:scale-110 transition-transform`}
              >
                <Icon size={22} className="sm:w-6 sm:h-6" />
              </div>
            </div>

            <p className="text-2xl sm:text-3xl font-extrabold text-foreground mb-1 tracking-tight">
              {stat.value}
            </p>

            <p className="text-[10px] sm:text-xs font-bold text-muted-foreground uppercase tracking-widest">
              {stat.label}
            </p>
          </article>
        );
      })}
    </div>
  );
}