import { LecturerQuestionAnalysisCard } from "@/components/dashboard/lecturer/modules/quiz-preview/LecturerQuestionAnalysisCard";
import { LecturerQuestionNavigator } from "@/components/dashboard/lecturer/modules/quiz-preview/LecturerQuestionNavigator";
import type { LecturerQuizQuestionStat } from "@/data/learning/lecturer/lecturer-quiz-preview";

interface LecturerQuizAnalysisTabProps {
  questions: LecturerQuizQuestionStat[];
  activeQuestionIndex: number;
  onQuestionChange: (index: number) => void;
}

export function LecturerQuizAnalysisTab({
  questions,
  activeQuestionIndex,
  onQuestionChange,
}: LecturerQuizAnalysisTabProps) {
  const activeQuestion = questions[activeQuestionIndex];

  if (!activeQuestion) {
    return (
      <div className="rounded-2xl border border-dashed border-border bg-muted/20 p-8 text-center">
        <p className="text-sm font-bold text-foreground">
          Data soal tidak tersedia.
        </p>
      </div>
    );
  }

  return (
    <div className="grid lg:grid-cols-3 gap-6 lg:gap-8 items-start animate-in fade-in duration-300">
      <div className="lg:col-span-2">
        <LecturerQuestionAnalysisCard
          question={activeQuestion}
          questionIndex={activeQuestionIndex}
          totalQuestions={questions.length}
        />
      </div>

      <LecturerQuestionNavigator
        questions={questions}
        activeQuestionIndex={activeQuestionIndex}
        onQuestionChange={onQuestionChange}
      />
    </div>
  );
}