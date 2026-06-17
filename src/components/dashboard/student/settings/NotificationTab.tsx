import {
  AccountNotificationTab,
  type AccountNotificationItem,
} from "@/components/dashboard/shared/settings/AccountNotificationTab";

const notificationItems: AccountNotificationItem[] = [
  {
    key: "newQuiz",
    label: "Kuis Baru",
    description:
      "Tampilkan notifikasi ketika dosen menambahkan kuis evaluasi baru pada modul yang Anda ikuti.",
  },
  {
    key: "newMaterial",
    label: "Materi Baru",
    description:
      "Tampilkan notifikasi ketika dosen menambahkan materi pembelajaran baru.",
  },
  {
    key: "quizResult",
    label: "Hasil Kuis",
    description:
      "Tampilkan pemberitahuan ketika hasil kuis tersedia untuk ditinjau kembali.",
  },
  {
    key: "moduleUpdate",
    label: "Pembaruan Modul",
    description:
      "Tampilkan notifikasi jika ada pembaruan konten atau informasi modul.",
  },
];

export function NotificationTab() {
  return (
    <AccountNotificationTab
      description="Atur jenis pemberitahuan pembelajaran yang ingin ditampilkan di akun mahasiswa Anda."
      items={notificationItems}
    />
  );
}