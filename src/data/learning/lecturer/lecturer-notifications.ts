export type LecturerNotificationType =
  | "submission"
  | "module"
  | "progress"
  | "participant";

export interface LecturerNotification {
  id: string;
  type: LecturerNotificationType;
  title: string;
  description: string;
  time: string;
  href: string;
  read: boolean;
}

export function getLecturerNotifications(): LecturerNotification[] {
  return [
    {
      id: "submission-quiz-latest",
      type: "submission",
      title: "Pengumpulan Kuis",
      description:
        "12 mahasiswa telah mengerjakan kuis evaluasi pada salah satu modul.",
      time: "Baru saja",
      href: "/dashboard/lecturer/gradebook/1",
      read: false,
    },
    {
      id: "module-progress-latest",
      type: "progress",
      title: "Progres Mahasiswa",
      description:
        "Mayoritas mahasiswa sudah menyelesaikan lebih dari 70% salah satu modul.",
      time: "Hari ini",
      href: "/dashboard/lecturer/modules/1",
      read: false,
    },
    {
      id: "participant-latest",
      type: "participant",
      title: "Mahasiswa Bergabung",
      description:
        "5 mahasiswa baru bergabung pada salah satu modul pembelajaran.",
      time: "Kemarin",
      href: "/dashboard/lecturer/modules/2",
      read: true,
    },
    {
      id: "module-published-latest",
      type: "module",
      title: "Modul Dipublikasi",
      description:
        "Salah satu modul sudah tersedia untuk diakses mahasiswa.",
      time: "1 hari lalu",
      href: "/dashboard/lecturer/modules/2",
      read: true,
    },
  ];
}