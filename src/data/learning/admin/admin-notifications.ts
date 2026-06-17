export type AdminNotificationType =
  | "new-user"
  | "module"
  | "system"
  | "account";

export interface AdminNotification {
  id: string;
  type: AdminNotificationType;
  title: string;
  description: string;
  time: string;
  href: string;
  read: boolean;
}

export function getAdminNotifications(): AdminNotification[] {
  return [
    {
      id: "new-user-latest",
      type: "new-user",
      title: "Mahasiswa Baru Mendaftar",
      description: "Maya Sari telah membuat akun mahasiswa.",
      time: "10 menit lalu",
      href: "/dashboard/admin/users",
      read: false,
    },
    {
      id: "lecturer-account-active",
      type: "account",
      title: "Akun Dosen Diaktifkan",
      description: "Akun Dr. Rina Hartati berhasil diaktifkan.",
      time: "1 jam lalu",
      href: "/dashboard/admin/users",
      read: false,
    },
    {
      id: "module-published",
      type: "module",
      title: "Modul Dipublikasi",
      description: "Salah satu modul pembelajaran telah dipublikasikan.",
      time: "1 hari lalu",
      href: "/dashboard/admin",
      read: true,
    },
  ];
}