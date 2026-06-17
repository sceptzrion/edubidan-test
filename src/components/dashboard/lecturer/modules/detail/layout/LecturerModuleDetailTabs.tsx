import { FileText, Users } from "lucide-react";

export type LecturerModuleDetailTab = "materi" | "peserta";

interface LecturerModuleDetailTabsProps {
  activeTab: LecturerModuleDetailTab;
  onTabChange: (tab: LecturerModuleDetailTab) => void;
}

const tabs = [
  {
    key: "materi",
    label: "Editor Materi & Kuis",
    icon: FileText,
  },
  {
    key: "peserta",
    label: "Manajemen Peserta",
    icon: Users,
  },
] satisfies {
  key: LecturerModuleDetailTab;
  label: string;
  icon: typeof FileText;
}[];

export function LecturerModuleDetailTabs({
  activeTab,
  onTabChange,
}: LecturerModuleDetailTabsProps) {
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
                ? "border-primary text-primary"
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