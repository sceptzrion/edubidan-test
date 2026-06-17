export type LecturerQuizPreviewTab = "overview" | "analysis";

export interface LecturerQuizInfo {
  title: string;
  duration: string;
  totalQuestions: number;
}

export interface LecturerQuizGeneralStats {
  averageScore: number | null;
  highestScore: number | null;
  lowestScore: number | null;
  totalParticipants: number;
}

export interface LecturerQuizLeaderboardItem {
  rank: number;
  name: string;
  nim: string;
  score: number;
  time: string;
}

export interface LecturerQuizQuestionOption {
  id: string;
  text: string;
  pickedCount: number;
  percentage: number;
}

export interface LecturerQuizQuestionStat {
  id: number;
  questionText: string;
  mediaUrl: string | null;
  correctOptionId: string;
  options: LecturerQuizQuestionOption[];
}

export interface LecturerQuizPreviewData {
  quizInfo: LecturerQuizInfo;
  generalStats: LecturerQuizGeneralStats;
  leaderboard: LecturerQuizLeaderboardItem[];
  questionStats: LecturerQuizQuestionStat[];
}

export function isCriticalQuestion(question: LecturerQuizQuestionStat) {
  const correctOption = question.options.find(
    (option) => option.id === question.correctOptionId
  );

  return Boolean(correctOption && correctOption.percentage < 50);
}