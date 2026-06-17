"use client";

import { useState } from "react";

import { LecturerPreviewBackButton } from "@/components/dashboard/lecturer/modules/preview/LecturerPreviewBackButton";
import { LecturerPreviewModeBadge } from "@/components/dashboard/lecturer/modules/preview/LecturerPreviewModeBadge";
import { LecturerQuizAnalysisTab } from "@/components/dashboard/lecturer/modules/quiz-preview/LecturerQuizAnalysisTab";
import { LecturerQuizOverviewTab } from "@/components/dashboard/lecturer/modules/quiz-preview/LecturerQuizOverviewTab";
import { LecturerQuizPreviewHeader } from "@/components/dashboard/lecturer/modules/quiz-preview/LecturerQuizPreviewHeader";
import { LecturerQuizPreviewTabs } from "@/components/dashboard/lecturer/modules/quiz-preview/LecturerQuizPreviewTabs";
import type {
  LecturerQuizPreviewData,
  LecturerQuizPreviewTab,
} from "@/data/learning/lecturer/lecturer-quiz-preview";

interface LecturerQuizPreviewClientProps {
  moduleId: string;
  data: LecturerQuizPreviewData;
}

export function LecturerQuizPreviewClient({
  moduleId,
  data,
}: LecturerQuizPreviewClientProps) {
  const [activeTab, setActiveTab] =
    useState<LecturerQuizPreviewTab>("overview");
  const [activeQuestionIndex, setActiveQuestionIndex] = useState(0);

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 pb-10 sm:pb-12 max-w-350 mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 sm:mb-8">
        <LecturerPreviewBackButton moduleId={moduleId} />

        <LecturerPreviewModeBadge label="Mode Analisis & Pratinjau Kuis" />
      </div>

      <LecturerQuizPreviewHeader quizInfo={data.quizInfo} />

      <LecturerQuizPreviewTabs
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />

      {activeTab === "overview" && (
        <LecturerQuizOverviewTab
          stats={data.generalStats}
          leaderboard={data.leaderboard}
        />
      )}

      {activeTab === "analysis" && (
        <LecturerQuizAnalysisTab
          questions={data.questionStats}
          activeQuestionIndex={activeQuestionIndex}
          onQuestionChange={setActiveQuestionIndex}
        />
      )}
    </div>
  );
}