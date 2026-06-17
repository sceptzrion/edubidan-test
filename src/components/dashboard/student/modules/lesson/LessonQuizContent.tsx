import { QuizStandby } from "@/components/dashboard/student/modules/lesson/QuizStandby";
import type { LearningItem } from "@/types/learning";

interface LessonQuizContentProps {
  item: LearningItem;
  previousItem: LearningItem | null;
  nextItem: LearningItem | null;
  onStartQuiz: () => void;
  onPrev?: () => void;
  onNext: () => void;
}

function getPrevLabel(previousItem: LearningItem | null) {
  if (!previousItem) return "Sebelumnya";
  return previousItem.kind === "materi" ? "Materi Sebelumnya" : "Kuis Sebelumnya";
}

function getNextLabel(nextItem: LearningItem | null) {
  if (!nextItem) return "Selesaikan Modul";
  return nextItem.kind === "materi" ? "Materi Selanjutnya" : "Kuis Selanjutnya";
}

export function LessonQuizContent({
  item,
  previousItem,
  nextItem,
  onStartQuiz,
  onPrev,
  onNext,
}: LessonQuizContentProps) {
  return (
    <QuizStandby
      title={item.title}
      questionCount={String(item.questions?.length ?? item.latestTotalQuestions ?? 0)}
      timeLimit={`${item.timeLimitMinutes ?? item.estimatedMinutes} Menit`}
      isCompleted={item.isCompleted}
      latestScore={item.latestScore}
      latestCorrectCount={item.latestCorrectCount}
      latestTotalQuestions={item.latestTotalQuestions}
      onStartQuiz={onStartQuiz}
      onPrev={previousItem ? onPrev : undefined}
      onNext={onNext}
      prevLabel={getPrevLabel(previousItem)}
      nextLabel={getNextLabel(nextItem)}
    />
  );
}