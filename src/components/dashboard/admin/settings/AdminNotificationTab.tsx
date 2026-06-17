import {
  AccountNotificationTab,
  type AccountNotificationItem,
} from "@/components/dashboard/shared/settings/AccountNotificationTab";

const notificationItems: AccountNotificationItem[] = [
  {
    key: "accountActivity",
    label: "Aktivitas Akun",
    description:
      "Tampilkan pemberitahuan terkait pembuatan, aktivasi, penonaktifan, atau perubahan data akun.",
  },
  {
    key: "moduleUpdate",
    label: "Aktivitas Modul",
    description:
      "Tampilkan notifikasi ketika modul pembelajaran dipublikasikan atau diperbarui.",
  },
  {
    key: "quizActivity",
    label: "Aktivitas Kuis",
    description:
      "Tampilkan pemberitahuan terkait aktivitas kuis dan evaluasi pembelajaran.",
  },
  {
    key: "systemAlert",
    label: "Pemberitahuan Sistem",
    description:
      "Tampilkan pemberitahuan penting terkait kondisi atau pembaruan sistem.",
  },
];

export function AdminNotificationTab() {
  return (
    <AccountNotificationTab
      description="Atur jenis pemberitahuan yang ingin ditampilkan pada dashboard admin."
      items={notificationItems}
    />
  );
}