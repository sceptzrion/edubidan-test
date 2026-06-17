import { learningModules } from "@/data/learning/shared/learning-modules";

export type StudentNotificationType = "quiz" | "module" | "result";

export interface StudentNotification {
  id: string;
  type: StudentNotificationType;
  title: string;
  description: string;
  time: string;
  href: string;
  read: boolean;
}

export function getStudentNotifications(): StudentNotification[] {
  const notifications: StudentNotification[] = [];

  learningModules.forEach((module) => {
    const pendingQuiz = module.items.find(
      (item) => item.kind === "kuis" && !item.isCompleted
    );

    if (pendingQuiz) {
      notifications.push({
        id: `quiz-${module.id}-${pendingQuiz.id}`,
        type: "quiz",
        title: "Kuis Belum Dikerjakan",
        description: `${pendingQuiz.title} menunggu untuk dikerjakan.`,
        time: "Hari ini",
        href: `/dashboard/modules/${module.id}/lesson/${pendingQuiz.id}`,
        read: false,
      });
    }

    const hasUnfinishedProgress = module.progress > 0 && module.progress < 100;

    if (hasUnfinishedProgress) {
      notifications.push({
        id: `module-${module.id}`,
        type: "module",
        title: "Lanjutkan Modul",
        description: `${module.title} sudah ${module.progress}% selesai.`,
        time: "Terbaru",
        href: `/dashboard/modules/${module.id}`,
        read: module.progress >= 75,
      });
    }

    const completedQuiz = module.items.find(
      (item) => item.kind === "kuis" && item.isCompleted
    );

    if (completedQuiz) {
      notifications.push({
        id: `result-${module.id}-${completedQuiz.id}`,
        type: "result",
        title: "Hasil Kuis Tersedia",
        description: `Hasil ${completedQuiz.title} sudah dapat ditinjau.`,
        time: "Terbaru",
        href: `/dashboard/modules/${module.id}/quiz/${completedQuiz.id}`,
        read: true,
      });
    }
  });

  return notifications.slice(0, 5);
}