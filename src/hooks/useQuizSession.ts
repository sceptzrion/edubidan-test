import { useEffect, useMemo, useState } from "react";

import type { QuizQuestion } from "@/types/learning";

interface UseQuizSessionParams {
  questions: QuizQuestion[];
  passingGrade?: number;
  timeLimitMinutes?: number | null;
  initialAnswers?: (number | null)[];
  initialShowResult?: boolean;
}

function createEmptyAnswers(length: number) {
  return Array<number | null>(length).fill(null);
}

function createEmptyFlags(length: number) {
  return Array<boolean>(length).fill(false);
}

export function useQuizSession({
  questions,
  passingGrade = 70,
  timeLimitMinutes = null,
  initialAnswers,
  initialShowResult = false,
}: UseQuizSessionParams) {
  const [isStarted, setIsStarted] = useState(initialShowResult);
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState<(number | null)[]>(
    () => initialAnswers ?? createEmptyAnswers(questions.length)
  );
  const [flagged, setFlagged] = useState<boolean[]>(() =>
    createEmptyFlags(questions.length)
  );
  const [showResult, setShowResult] = useState(initialShowResult);
  const [isReviewMode, setIsReviewMode] = useState(false);
  const [showGridMobile, setShowGridMobile] = useState(false);
  const [remainingSeconds, setRemainingSeconds] = useState(
    timeLimitMinutes && timeLimitMinutes > 0 ? timeLimitMinutes * 60 : null
  );

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      setAnswers(initialAnswers ?? createEmptyAnswers(questions.length));
      setFlagged(createEmptyFlags(questions.length));
      setCurrentQ(0);
      setIsStarted(initialShowResult);
      setShowResult(initialShowResult);
      setIsReviewMode(false);
      setShowGridMobile(false);
      setRemainingSeconds(
        timeLimitMinutes && timeLimitMinutes > 0 ? timeLimitMinutes * 60 : null
      );
    }, 0);

    return () => window.clearTimeout(timeoutId);
  }, [questions.length, initialAnswers, initialShowResult, timeLimitMinutes]);

  useEffect(() => {
    if (!isStarted || showResult || isReviewMode || remainingSeconds === null) {
      return;
    }

    const intervalId = window.setInterval(() => {
      setRemainingSeconds((current) => {
        if (current === null) return null;

        return Math.max(current - 1, 0);
      });
    }, 1000);

    return () => window.clearInterval(intervalId);
  }, [isStarted, showResult, isReviewMode, remainingSeconds]);

  const currentQuestion = questions[currentQ];

  const correctAnswers = useMemo(
    () => questions.map((question) => question.correct),
    [questions]
  );

  const score = useMemo(() => {
    return answers.filter(
      (answer, index) => answer === questions[index]?.correct
    ).length;
  }, [answers, questions]);

  const percentage = questions.length
    ? Math.round((score / questions.length) * 100)
    : 0;

  const passed = percentage >= passingGrade;
  const isSubmitDisabled = answers.includes(null);

  const startQuiz = () => {
    setAnswers(createEmptyAnswers(questions.length));
    setFlagged(createEmptyFlags(questions.length));
    setCurrentQ(0);
    setShowResult(false);
    setIsReviewMode(false);
    setShowGridMobile(false);
    setRemainingSeconds(
      timeLimitMinutes && timeLimitMinutes > 0 ? timeLimitMinutes * 60 : null
    );
    setIsStarted(true);
  };

  const selectOption = (optionIndex: number) => {
    setAnswers((currentAnswers) => {
      const newAnswers = [...currentAnswers];
      newAnswers[currentQ] = optionIndex;
      return newAnswers;
    });
  };

  const toggleFlag = () => {
    setFlagged((currentFlagged) => {
      const newFlagged = [...currentFlagged];
      newFlagged[currentQ] = !newFlagged[currentQ];
      return newFlagged;
    });
  };

  const goToQuestion = (index: number) => {
    setCurrentQ(Math.min(Math.max(index, 0), questions.length - 1));
  };

  const goNext = () => {
    setCurrentQ((current) => Math.min(questions.length - 1, current + 1));
  };

  const goPrev = () => {
    setCurrentQ((current) => Math.max(0, current - 1));
  };

  const submitQuiz = () => {
    setShowResult(true);
    setIsReviewMode(false);
    setShowGridMobile(false);
  };

  const enterReviewMode = () => {
    setIsReviewMode(true);
    setShowResult(false);
    setCurrentQ(0);
  };

  const exitReviewMode = () => {
    setIsReviewMode(false);
    setShowResult(true);
    setShowGridMobile(false);
  };

  return {
    isStarted,
    currentQ,
    answers,
    flagged,
    showResult,
    isReviewMode,
    showGridMobile,
    currentQuestion,
    correctAnswers,
    score,
    percentage,
    passed,
    isSubmitDisabled,
    remainingSeconds,

    startQuiz,
    selectOption,
    toggleFlag,
    goToQuestion,
    goNext,
    goPrev,
    submitQuiz,
    enterReviewMode,
    exitReviewMode,
    setShowGridMobile,
  };
}