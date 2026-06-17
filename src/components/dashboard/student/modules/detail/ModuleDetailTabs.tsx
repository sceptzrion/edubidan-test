import { BookOpen, HelpCircle, Users } from "lucide-react";

export type DetailTab = "pembelajaran" | "evaluasi" | "peserta";

interface ModuleDetailTabsProps {
  activeTab: DetailTab;
  onTabChange: (tab: DetailTab) => void;
}

const tabs = [
  {
    key: "pembelajaran",
    label: "Daftar Pembelajaran",
    icon: BookOpen,
  },
  {
    key: "evaluasi",
    label: "Kuis & Evaluasi",
    icon: HelpCircle,
  },
  {
    key: "peserta",
    label: "Peserta",
    icon: Users,
  },
] satisfies {
  key: DetailTab;
  label: string;
  icon: typeof BookOpen;
}[];

export function ModuleDetailTabs({
  activeTab,
  onTabChange,
}: ModuleDetailTabsProps) {
  return (
    <div className="flex gap-1 sm:gap-2 overflow-x-auto scrollbar-none w-full md:w-auto">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.key;

        return (
          <button
            key={tab.key}
            type="button"
            onClick={() => onTabChange(tab.key)}
            className={`px-3 py-2.5 sm:px-5 sm:py-4 text-[11px] sm:text-sm font-bold border-b-2 transition-all whitespace-nowrap flex items-center gap-1.5 sm:gap-2 ${
              isActive
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            <Icon size={14} className="sm:w-4.25 sm:h-4.25" />
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}