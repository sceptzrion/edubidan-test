"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { LessonBackButton } from "@/components/dashboard/student/modules/lesson/LessonBackButton";
import { LessonMaterialContent } from "@/components/dashboard/student/modules/lesson/LessonMaterialContent";
import { LessonQuizContent } from "@/components/dashboard/student/modules/lesson/LessonQuizContent";
import { LessonSidebar } from "@/components/dashboard/student/modules/lesson/LessonSidebar";
import { QuizWarning } from "@/components/dashboard/student/modules/lesson/QuizWarning";
import { toLessonPlaylistItem } from "@/data/learning/shared/learning-modules";
import type { StudentLessonData } from "@/data/learning/student/student-learning.server";
import type { LearningItem } from "@/types/learning";

interface StudentLessonClientProps {
  data: StudentLessonData;
}

type ProgressApiResponse = {
  success: boolean;
  message: string;
  data: unknown;
};

type NavigableLearningItem = Pick<LearningItem, "id" | "kind">;

function getLearningItemHref(moduleId: number, item: NavigableLearningItem) {
  if (item.kind === "kuis") {
    return `/dashboard/modules/${moduleId}/quiz/${item.id}`;
  }

  return `/dashboard/modules/${moduleId}/lesson/${item.id}`;
}

export function StudentLessonClient({ data }: StudentLessonClientProps) {
  const router = useRouter();

  const { module, item, itemIndex, previousItem, nextItem } = data;
  const [isSavingProgress, setIsSavingProgress] = useState(false);

  const playlistItems = module.items.map(toLessonPlaylistItem);

  const markMaterialCompleted = async () => {
    if (item.kind !== "materi" || item.isCompleted) return true;

    setIsSavingProgress(true);

    try {
      const response = await fetch(`/api/materials/${item.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "same-origin",
        body: JSON.stringify({
          isCompleted: true,
        }),
      });

      const result = (await response.json()) as ProgressApiResponse;

      return response.ok && result.success;
    } catch (error) {
      console.error("Mark material completed error:", error);

      return false;
    } finally {
      setIsSavingProgress(false);
    }
  };

  const navigateToItem = (targetItem: NavigableLearningItem) => {
    router.push(getLearningItemHref(module.id, targetItem));
  };

  const handleNext = async () => {
    const success = await markMaterialCompleted();

    if (!success) return;

    if (nextItem) {
      navigateToItem(nextItem);
      router.refresh();
      return;
    }

    router.push(`/dashboard/modules/${module.id}`);
    router.refresh();
  };

  const handlePrev = () => {
    if (!previousItem) return;

    navigateToItem(previousItem);
  };

  const handleNavigate = (targetItem: NavigableLearningItem) => {
    navigateToItem(targetItem);
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 pb-6 sm:pb-8">
      <LessonBackButton moduleId={module.id} />

      {item.kind === "kuis" && (
        <div className="mb-4 sm:mb-6">
          <QuizWarning />
        </div>
      )}

      <div className="grid lg:grid-cols-3 gap-4 sm:gap-6 items-start">
        <div className="lg:col-span-2 flex flex-col gap-4 sm:gap-6">
          {item.kind === "materi" ? (
            <LessonMaterialContent
              item={item}
              moduleTitle={module.title}
              moduleThumbnail={module.thumbnail}
              instructorName={module.instructor.name}
              previousItem={previousItem}
              nextItem={nextItem}
              isSavingProgress={isSavingProgress}
              onPrev={handlePrev}
              onNext={handleNext}
            />
          ) : (
            <LessonQuizContent
              item={item}
              previousItem={previousItem}
              nextItem={nextItem}
              onStartQuiz={() =>
                router.push(`/dashboard/modules/${module.id}/quiz/${item.id}`)
              }
              onPrev={handlePrev}
              onNext={handleNext}
            />
          )}
        </div>

        <LessonSidebar
          item={item}
          playlistItems={playlistItems}
          activeIndex={itemIndex}
          onNavigate={handleNavigate}
        />
      </div>
    </div>
  );
}