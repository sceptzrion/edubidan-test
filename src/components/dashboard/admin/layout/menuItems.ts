import {
  LayoutDashboard,
  Settings,
  Users,
  type LucideIcon,
} from "lucide-react";

export interface AdminMenuItem {
  icon: LucideIcon;
  label: string;
  path: string;
}

export const adminMenuItems: AdminMenuItem[] = [
  {
    icon: LayoutDashboard,
    label: "Beranda",
    path: "/dashboard/admin",
  },
  {
    icon: Users,
    label: "Kelola Pengguna",
    path: "/dashboard/admin/users",
  },
  {
    icon: Settings,
    label: "Pengaturan",
    path: "/dashboard/admin/settings",
  },
];