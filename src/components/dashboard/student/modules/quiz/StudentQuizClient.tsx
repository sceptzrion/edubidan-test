"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";

import { QuizExitModal } from "@/components/dashboard/student/modules/lesson/QuizExitModal";
import { QuizFullscreenHeader } from "@/components/dashboard/student/modules/quiz/QuizFullscreenHeader";
import { QuizNavigator } from "@/components/dashboard/student/modules/quiz/QuizNavigator";
import { QuizNotFoundState } from "@/components/dashboard/student/modules/quiz/QuizNotFoundState";
import { QuizQuestionCard } from "@/components/dashboard/student/modules/quiz/QuizQuestionCard";
import { QuizResultScreen } from "@/components/dashboard/student/modules/quiz/QuizResultScreen";
import { QuizStartScreen } from "@/components/dashboard/student/modules/quiz/QuizStartScreen";
import type { StudentQuizData } from "@/data/learning/student/student-quiz.server";
import { useFullscreenLock } from "@/hooks/useFullscreenLock";
import { useQuizSession } from "@/hooks/useQuizSession";
import type { QuizQuestion } from "@/types/learning";

interface StudentQuizClientProps {
  data: StudentQuizData;
}

type SubmitQuizApiResponse = {
  success: boolean;
  message: string;
  data: unknown;
};

function getFriendlySubmitError(message: string) {
  if (message === "Answers are required") {
    return "Jawaban kuis belum lengkap.";
  }

  if (message === "Submitted answers are invalid") {
    return "Jawaban yang dikirim tidak valid. Silakan ulangi kuis.";
  }

  if (message === "User has not joined this module") {
    return "Anda belum bergabung ke modul ini.";
  }

  if (message === "User has been kicked from this module") {
    return "Anda sudah tidak memiliki akses ke modul ini.";
  }

  if (message === "Only mahasiswa can submit quiz") {
    return "Hanya akun mahasiswa yang dapat mengirim jawaban kuis.";
  }

  if (message === "Authentication required") {
    return "Sesi login sudah berakhir. Silakan login kembali.";
  }

  return "Gagal mengirim jawaban kuis. Silakan coba lagi.";
}

function formatTimer(seconds: number | null, hasTimeLimit: boolean) {
  if (!hasTimeLimit) return "Bebas";
  if (seconds === null) return "00:00";

  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;

  return `${String(minutes).padStart(2, "0")}:${String(
    remainingSeconds
  ).padStart(2, "0")}`;
}

function calculateScore(params: {
  answers: (number | null)[];
  questions: QuizQuestion[];
}) {
  return params.answers.filter(
    (answer, index) => answer === params.questions[index]?.correct
  ).length;
}

function calculatePercentage(params: {
  score: number;
  totalQuestions: number;
}) {
  if (params.totalQuestions <= 0) return 0;

  return Math.round((params.score / params.totalQuestions) * 100);
}

export function StudentQuizClient({ data }: StudentQuizClientProps) {
  const router = useRouter();

  const [isExitModalOpen, setIsExitModalOpen] = useState(false);
  const [startedAtMs, setStartedAtMs] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [submittedAnswersSnapshot, setSubmittedAnswersSnapshot] = useState<
    (number | null)[] | null
  >(null);

  const hasAutoSubmittedRef = useRef(false);

  useFullscreenLock();

  const questions: QuizQuestion[] = useMemo(() => {
    return data.quiz.questions.map((question) => ({
      id: question.id,
      question: question.question,
      mediaUrl: question.mediaUrl,
      options: question.options.map((option) => option.text),
      correct: question.correctIndex,
    }));
  }, [data.quiz.questions]);

  const latestAttemptAnswers = useMemo(() => {
    if (!data.latestAttempt) return undefined;

    return data.quiz.questions.map((question) => {
      const savedAnswer = data.latestAttempt?.answers.find(
        (answer) => answer.soalId === question.id
      );

      if (!savedAnswer || savedAnswer.optionId === null) {
        return null;
      }

      const selectedIndex = question.options.findIndex(
        (option) => option.id === savedAnswer.optionId
      );

      return selectedIndex >= 0 ? selectedIndex : null;
    });
  }, [data.latestAttempt, data.quiz.questions]);

  const quizSession = useQuizSession({
    questions,
    timeLimitMinutes: data.quiz.hasTimeLimit ? data.quiz.timeLimitMinutes : null,
    initialAnswers: latestAttemptAnswers,
    initialShowResult: Boolean(data.latestAttempt),
  });

  const reviewAnswers = submittedAnswersSnapshot ?? quizSession.answers;

  const reviewScore = calculateScore({
    answers: reviewAnswers,
    questions,
  });

  const reviewPercentage = calculatePercentage({
    score: reviewScore,
    totalQuestions: questions.length,
  });

  const submitQuiz = useCallback(async () => {
    if (isSubmitting) return;

    const currentAnswers = [...quizSession.answers];

    setIsSubmitting(true);
    setSubmitError("");

    const durationSeconds = startedAtMs
      ? Math.max(0, Math.floor((Date.now() - startedAtMs) / 1000))
      : 0;

    const answers = data.quiz.questions.map((question, questionIndex) => {
      const selectedIndex = currentAnswers[questionIndex];
      const selectedOption =
        selectedIndex === null ? null : question.options[selectedIndex] ?? null;

      return {
        soalId: question.id,
        optionId: selectedOption?.id ?? null,
      };
    });

    try {
      const response = await fetch(`/api/quizzes/${data.quiz.id}/submit`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "same-origin",
        body: JSON.stringify({
          answers,
          durationSeconds,
        }),
      });

      const result = (await response.json()) as SubmitQuizApiResponse;

      if (!response.ok || !result.success) {
        setSubmitError(getFriendlySubmitError(result.message));
        return;
      }

      setSubmittedAnswersSnapshot(currentAnswers);
      quizSession.submitQuiz();
      router.refresh();
    } catch (error) {
      console.error("Submit quiz error:", error);
      setSubmitError("Terjadi kesalahan koneksi. Silakan coba lagi.");
    } finally {
      setIsSubmitting(false);
    }
  }, [
    data.quiz.id,
    data.quiz.questions,
    isSubmitting,
    quizSession,
    router,
    startedAtMs,
  ]);

  useEffect(() => {
    if (
      !quizSession.isStarted ||
      quizSession.showResult ||
      quizSession.isReviewMode ||
      quizSession.remainingSeconds !== 0 ||
      hasAutoSubmittedRef.current
    ) {
      return;
    }

    hasAutoSubmittedRef.current = true;

    const timeoutId = window.setTimeout(() => {
      void submitQuiz();
    }, 0);

    return () => window.clearTimeout(timeoutId);
  }, [
    quizSession.isReviewMode,
    quizSession.isStarted,
    quizSession.remainingSeconds,
    quizSession.showResult,
    submitQuiz,
  ]);

  if (questions.length === 0) {
    return <QuizNotFoundState moduleId={data.module.id} />;
  }

  const timeLimit = data.quiz.hasTimeLimit
    ? `${data.quiz.timeLimitMinutes ?? 0} Menit`
    : "Tanpa Batas Waktu";

  const timerLabel = quizSession.isStarted
    ? formatTimer(quizSession.remainingSeconds, data.quiz.hasTimeLimit)
    : data.quiz.hasTimeLimit
      ? `${data.quiz.timeLimitMinutes ?? 0}:00`
      : "Bebas";

  const startQuiz = () => {
    hasAutoSubmittedRef.current = false;
    setStartedAtMs(Date.now());
    setSubmitError("");
    setSubmittedAnswersSnapshot(null);
    quizSession.startQuiz();
  };

  const handleTopLeftClick = () => {
    if (quizSession.isReviewMode) {
      quizSession.exitReviewMode();
      return;
    }

    if (!quizSession.isStarted || quizSession.showResult) {
      router.back();
      return;
    }

    setIsExitModalOpen(true);
  };

  return (
    <div className="fixed inset-0 z-100 bg-background flex flex-col animate-in fade-in zoom-in-95 duration-300">
      <QuizExitModal
        isOpen={isExitModalOpen}
        onClose={() => setIsExitModalOpen(false)}
        onConfirm={() => {
          setIsExitModalOpen(false);
          void submitQuiz();
        }}
      />

      <QuizFullscreenHeader
        title={data.quiz.title}
        timerLabel={timerLabel}
        isStarted={quizSession.isStarted}
        showResult={quizSession.showResult}
        isReviewMode={quizSession.isReviewMode}
        onTopLeftClick={handleTopLeftClick}
        onOpenMobileNavigator={() => quizSession.setShowGridMobile(true)}
      />

      <main className="flex-1 flex flex-col lg:flex-row overflow-hidden relative">
        <div className="flex-1 overflow-y-auto scrollbar-thin p-4 sm:p-8 flex flex-col items-center justify-center relative z-10">
          {submitError && !quizSession.showResult && (
            <div className="w-full max-w-xl mb-4 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-xs sm:text-sm font-bold text-red-500">
              {submitError}
            </div>
          )}

          {!quizSession.isStarted ? (
            <QuizStartScreen
              totalQuestions={questions.length}
              timeLimit={timeLimit}
              onStart={startQuiz}
            />
          ) : quizSession.showResult ? (
            <QuizResultScreen
              passed={quizSession.passed}
              percentage={reviewPercentage}
              score={reviewScore}
              totalQuestions={questions.length}
              onReview={quizSession.enterReviewMode}
              onExit={() => router.push(`/dashboard/modules/${data.module.id}`)}
            />
          ) : (
            <QuizQuestionCard
              currentQ={quizSession.currentQ}
              totalQuestions={questions.length}
              question={quizSession.currentQuestion.question}
              mediaUrl={quizSession.currentQuestion.mediaUrl ?? null}
              options={quizSession.currentQuestion.options}
              selectedAnswer={reviewAnswers[quizSession.currentQ]}
              isFlagged={quizSession.flagged[quizSession.currentQ]}
              isSubmitDisabled={quizSession.isSubmitDisabled || isSubmitting}
              isReviewMode={quizSession.isReviewMode}
              correctAnswer={quizSession.currentQuestion.correct}
              onSelectOption={quizSession.selectOption}
              onFlag={quizSession.toggleFlag}
              onPrev={quizSession.goPrev}
              onNext={quizSession.goNext}
              onSubmit={() => void submitQuiz()}
              onExitReview={quizSession.exitReviewMode}
            />
          )}
        </div>

        {((quizSession.isStarted && !quizSession.showResult) ||
          quizSession.isReviewMode) && (
          <QuizNavigator
            totalQuestions={questions.length}
            answers={reviewAnswers}
            flagged={quizSession.flagged}
            currentQ={quizSession.currentQ}
            showMobile={quizSession.showGridMobile}
            isReviewMode={quizSession.isReviewMode}
            correctAnswers={quizSession.correctAnswers}
            onCloseMobile={() => quizSession.setShowGridMobile(false)}
            onNavigate={quizSession.goToQuestion}
            onPrev={quizSession.goPrev}
            onNext={quizSession.goNext}
            onSubmit={() => void submitQuiz()}
            onExitReview={quizSession.exitReviewMode}
          />
        )}
      </main>
    </div>
  );
}