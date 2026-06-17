import { learningModules } from "@/data/learning/shared/learning-modules";
import { getDisplayNameParts } from "@/lib/text/name";

export function getStudentDashboardData(studentFullName = "Mahasiswa") {
  const modules = learningModules;

  const allItems = modules.flatMap((module) =>
    module.items.map((item) => ({
      ...item,
      moduleId: module.id,
      moduleTitle: module.title,
    }))
  );

  const materialItems = allItems.filter((item) => item.kind === "materi");
  const quizItems = allItems.filter((item) => item.kind === "kuis");

  const completedMaterials = materialItems.filter(
    (item) => item.isCompleted
  ).length;

  const completedQuizzes = quizItems.filter((item) => item.isCompleted).length;

  const pendingQuizzes = quizItems
    .filter((item) => !item.isCompleted)
    .map((item) => ({
      id: item.id,
      moduleId: item.moduleId,
      title: item.title,
      status: "Belum Dikerjakan",
    }));

  const learningProgress = modules.map((module) => {
    const completedItems = module.items.filter((item) => item.isCompleted).length;

    return {
      id: module.id,
      title: module.title,
      progress: module.progress,
      totalItems: module.items.length,
      completedItems,
    };
  });

  return {
    studentName: getDisplayNameParts(studentFullName),
    stats: {
      enrolledModules: modules.length,
      completedMaterials,
      completedQuizzes,
      pendingQuizzes: pendingQuizzes.length,
    },
    learningProgress,
    pendingQuizzes,
  };
}