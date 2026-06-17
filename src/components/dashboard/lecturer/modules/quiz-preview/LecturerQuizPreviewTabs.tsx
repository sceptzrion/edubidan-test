import { BarChart3, Target } from "lucide-react";

import type { LecturerQuizPreviewTab } from "@/data/learning/lecturer/lecturer-quiz-preview";

interface LecturerQuizPreviewTabsProps {
  activeTab: LecturerQuizPreviewTab;
  onTabChange: (tab: LecturerQuizPreviewTab) => void;
}

const tabs = [
  {
    key: "overview",
    label: "Statistik & Peringkat",
    icon: BarChart3,
  },
  {
    key: "analysis",
    label: "Analisis Butir Soal",
    icon: Target,
  },
] satisfies {
  key: LecturerQuizPreviewTab;
  label: string;
  icon: typeof BarChart3;
}[];

export function LecturerQuizPreviewTabs({
  activeTab,
  onTabChange,
}: LecturerQuizPreviewTabsProps) {
  return (
    <div className="flex gap-2 sm:gap-4 border-b border-border mb-6 sm:mb-8 overflow-x-auto scrollbar-none">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.key;

        return (
          <button
            key={tab.key}
            type="button"
            onClick={() => onTabChange(tab.key)}
            className={`px-4 sm:px-6 py-3 text-xs sm:text-sm transition-all flex items-center gap-2 whitespace-nowrap border-b-2 font-extrabold ${
              isActive
                ? "border-amber-500 text-amber-500"
                : "border-transparent text-muted-foreground hover:text-foreground hover:border-border"
            }`}
          >
            <Icon size={18} />
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}