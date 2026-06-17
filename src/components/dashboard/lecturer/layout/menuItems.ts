import {
  BookOpen,
  ClipboardList,
  LayoutDashboard,
  Settings,
  type LucideIcon,
} from "lucide-react";

export interface LecturerMenuItem {
  icon: LucideIcon;
  label: string;
  path: string;
}

export const lecturerMenuItems: LecturerMenuItem[] = [
  { icon: LayoutDashboard, label: "Beranda", path: "/dashboard/lecturer" },
  { icon: BookOpen, label: "Modul", path: "/dashboard/lecturer/modules" },
  {
    icon: ClipboardList,
    label: "Rekap Nilai",
    path: "/dashboard/lecturer/gradebook",
  },
  {
    icon: Settings,
    label: "Pengaturan",
    path: "/dashboard/lecturer/settings",
  },
];