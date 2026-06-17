import { LecturerQuizLeaderboard } from "@/components/dashboard/lecturer/modules/quiz-preview/LecturerQuizLeaderboard";
import { LecturerQuizStatsGrid } from "@/components/dashboard/lecturer/modules/quiz-preview/LecturerQuizStatsGrid";
import type {
  LecturerQuizGeneralStats,
  LecturerQuizLeaderboardItem,
} from "@/data/learning/lecturer/lecturer-quiz-preview";

interface LecturerQuizOverviewTabProps {
  stats: LecturerQuizGeneralStats;
  leaderboard: LecturerQuizLeaderboardItem[];
}

export function LecturerQuizOverviewTab({
  stats,
  leaderboard,
}: LecturerQuizOverviewTabProps) {
  return (
    <div className="space-y-6 sm:space-y-8 animate-in fade-in duration-300">
      <LecturerQuizStatsGrid stats={stats} />
      <LecturerQuizLeaderboard leaderboard={leaderboard} />
    </div>
  );
}