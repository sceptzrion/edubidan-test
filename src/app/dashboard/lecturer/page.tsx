import { Role } from "@prisma/client";

import { LecturerDashboardHeader } from "@/components/dashboard/lecturer/home/LecturerDashboardHeader";
import { LecturerQuickActions } from "@/components/dashboard/lecturer/home/LecturerQuickActions";
import { LecturerRecentActivities } from "@/components/dashboard/lecturer/home/LecturerRecentActivities";
import { LecturerStatsGrid } from "@/components/dashboard/lecturer/home/LecturerStatsGrid";
import { getLecturerDashboardData } from "@/data/learning/lecturer/lecturer-dashboard";
import { requireRole } from "@/lib/auth/guards";

export default async function LecturerDashboardHome() {
  const currentUser = await requireRole("/dashboard/lecturer", [Role.DOSEN]);
  const dashboardData = await getLecturerDashboardData(currentUser);

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 pb-10">
      <LecturerDashboardHeader lecturerName={dashboardData.lecturerName} />

      <LecturerStatsGrid stats={dashboardData.stats} />

      <div className="grid lg:grid-cols-2 gap-5 sm:gap-6 md:gap-8 items-start">
        <LecturerQuickActions actions={dashboardData.quickActions} />
        <LecturerRecentActivities activities={dashboardData.recentActivities} />
      </div>
    </div>
  );
}