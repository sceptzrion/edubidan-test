import { Role } from "@prisma/client";

import { AdminDashboardHeader } from "@/components/dashboard/admin/home/AdminDashboardHeader";
import { AdminFocusCard } from "@/components/dashboard/admin/home/AdminFocusCard";
import { AdminRecentActivities } from "@/components/dashboard/admin/home/AdminRecentActivities";
import { AdminStatsGrid } from "@/components/dashboard/admin/home/AdminStatsGrid";
import { getAdminDashboardData } from "@/data/learning/admin/admin-dashboard";
import { requireRole } from "@/lib/auth/guards";
import { getDisplayNameParts } from "@/lib/text/name";

export default async function AdminHomePage() {
  const currentUser = await requireRole("/dashboard/admin", [Role.ADMIN]);
  const dashboardData = await getAdminDashboardData();

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 pb-10">
      <AdminDashboardHeader
        adminName={getDisplayNameParts(currentUser.name)}
      />

      <AdminStatsGrid stats={dashboardData.stats} />

      <div className="grid lg:grid-cols-[1fr_320px] gap-5 sm:gap-6">
        <AdminRecentActivities activities={dashboardData.recentActivities} />
        <AdminFocusCard />
      </div>
    </div>
  );
}