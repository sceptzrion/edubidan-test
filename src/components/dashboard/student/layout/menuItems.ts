import { BookOpen, LayoutDashboard, LucideIcon, Settings } from "lucide-react";

export interface MenuItem {
  icon: LucideIcon;
  label: string;
  path: string;
}

export const studentMenuItems: MenuItem[] = [
  { icon: LayoutDashboard, label: "Beranda", path: "/dashboard" },
  { icon: BookOpen, label: "Modul", path: "/dashboard/modules" },
  { icon: Settings, label: "Pengaturan", path: "/dashboard/settings" },
];