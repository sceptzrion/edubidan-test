import { ModuleStatus, Role } from "@prisma/client";

import { prisma } from "@/lib/prisma";

export type AdminStatIconKey = "users" | "students" | "lecturers" | "modules";

export interface AdminDashboardStat {
  label: string;
  value: string;
  iconKey: AdminStatIconKey;
  color: string;
  bg: string;
}

export interface AdminRecentActivity {
  id: string;
  text: string;
  time: string;
}

export interface AdminDashboardData {
  stats: AdminDashboardStat[];
  recentActivities: AdminRecentActivity[];
}

function formatRelativeTime(date: Date) {
  const diffMs = Date.now() - date.getTime();
  const diffMinutes = Math.max(0, Math.floor(diffMs / (1000 * 60)));

  if (diffMinutes < 1) return "Baru saja";
  if (diffMinutes < 60) return `${diffMinutes} menit lalu`;

  const diffHours = Math.floor(diffMinutes / 60);
  if (diffHours < 24) return `${diffHours} jam lalu`;

  const diffDays = Math.floor(diffHours / 24);
  if (diffDays < 7) return `${diffDays} hari lalu`;

  return new Intl.DateTimeFormat("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date);
}

export async function getAdminDashboardData(): Promise<AdminDashboardData> {
  const [
    totalUsers,
    activeStudents,
    activeLecturers,
    publicModules,
    activityLogs,
  ] = await Promise.all([
    prisma.user.count(),
    prisma.user.count({
      where: {
        role: Role.MAHASISWA,
        isActive: true,
      },
    }),
    prisma.user.count({
      where: {
        role: Role.DOSEN,
        isActive: true,
      },
    }),
    prisma.module.count({
      where: {
        status: ModuleStatus.PUBLIK,
      },
    }),
    prisma.activityLog.findMany({
      orderBy: {
        createdAt: "desc",
      },
      take: 4,
      select: {
        id: true,
        description: true,
        createdAt: true,
      },
    }),
  ]);

  return {
    stats: [
      {
        label: "Total Pengguna",
        value: totalUsers.toLocaleString("id-ID"),
        iconKey: "users",
        color: "text-blue-600",
        bg: "bg-blue-500/10",
      },
      {
        label: "Mahasiswa Aktif",
        value: activeStudents.toLocaleString("id-ID"),
        iconKey: "students",
        color: "text-teal-600",
        bg: "bg-teal-500/10",
      },
      {
        label: "Dosen Aktif",
        value: activeLecturers.toLocaleString("id-ID"),
        iconKey: "lecturers",
        color: "text-indigo-600",
        bg: "bg-indigo-500/10",
      },
      {
        label: "Modul Publik",
        value: publicModules.toLocaleString("id-ID"),
        iconKey: "modules",
        color: "text-amber-600",
        bg: "bg-amber-500/10",
      },
    ],
    recentActivities: activityLogs.map((activity) => ({
      id: String(activity.id),
      text: activity.description,
      time: formatRelativeTime(activity.createdAt),
    })),
  };
}