import { LessonVideoPlayer } from "@/components/dashboard/student/modules/lesson/LessonVideoPlayer";
import { Summary } from "@/components/dashboard/student/modules/lesson/Summary";
import type { LearningItem } from "@/types/learning";

interface LessonMaterialContentProps {
  item: LearningItem;
  moduleTitle: string;
  moduleThumbnail: string;
  instructorName: string;
  previousItem: LearningItem | null;
  nextItem: LearningItem | null;
  isSavingProgress?: boolean;
  onPrev?: () => void;
  onNext: () => void;
}

function getNextLabel(nextItem: LearningItem | null) {
  if (!nextItem) return "Selesaikan Modul";

  return nextItem.kind === "materi" ? "Materi Selanjutnya" : "Kuis Selanjutnya";
}

export function LessonMaterialContent({
  item,
  moduleTitle,
  moduleThumbnail,
  instructorName,
  previousItem,
  nextItem,
  isSavingProgress = false,
  onPrev,
  onNext,
}: LessonMaterialContentProps) {
  return (
    <>
      <LessonVideoPlayer
        title={item.title}
        thumbnailUrl={item.thumbnailUrl ?? moduleThumbnail}
        duration={item.duration}
        videoSource={item.videoSource}
        videoUrl={item.videoUrl}
      />

      <Summary
        moduleTitle={moduleTitle}
        instructorName={instructorName}
        title={item.title}
        description={item.description}
        duration={item.duration}
        isCompleted={item.isCompleted}
        isSavingProgress={isSavingProgress}
        onPrev={previousItem ? onPrev : undefined}
        onNext={onNext}
        nextLabel={getNextLabel(nextItem)}
      />
    </>
  );
}