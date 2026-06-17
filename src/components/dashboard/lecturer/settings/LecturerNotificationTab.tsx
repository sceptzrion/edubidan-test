import {
  AccountNotificationTab,
  type AccountNotificationItem,
} from "@/components/dashboard/shared/settings/AccountNotificationTab";

const notificationItems: AccountNotificationItem[] = [
  {
    key: "quizActivity",
    label: "Pengumpulan Kuis",
    description:
      "Tampilkan notifikasi ketika mahasiswa menyelesaikan kuis evaluasi.",
  },
  {
    key: "moduleUpdate",
    label: "Aktivitas Modul",
    description:
      "Tampilkan notifikasi terkait perubahan konten modul dan aktivitas pembelajaran.",
  },
  {
    key: "accountActivity",
    label: "Mahasiswa Bergabung",
    description:
      "Tampilkan notifikasi ketika mahasiswa baru bergabung pada modul pembelajaran.",
  },
  {
    key: "systemAlert",
    label: "Pemberitahuan Sistem",
    description:
      "Tampilkan pemberitahuan penting terkait sistem atau akses dashboard dosen.",
  },
];

export function LecturerNotificationTab() {
  return (
    <AccountNotificationTab
      description="Atur jenis pemberitahuan yang ingin ditampilkan pada dashboard dosen."
      items={notificationItems}
    />
  );
}