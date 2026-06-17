import { ModuleDetailSearch } from "@/components/dashboard/student/modules/detail/ModuleDetailSearch";
import {
  DetailTab,
  ModuleDetailTabs,
} from "@/components/dashboard/student/modules/detail/ModuleDetailTabs";

interface ModuleDetailToolbarProps {
  activeTab: DetailTab;
  searchQuery: string;
  onTabChange: (tab: DetailTab) => void;
  onSearchChange: (value: string) => void;
}

export function ModuleDetailToolbar({
  activeTab,
  searchQuery,
  onTabChange,
  onSearchChange,
}: ModuleDetailToolbarProps) {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border mb-8 pb-1 sm:pb-0">
      <ModuleDetailTabs activeTab={activeTab} onTabChange={onTabChange} />

      <ModuleDetailSearch
        tab={activeTab}
        searchQuery={searchQuery}
        onSearchChange={onSearchChange}
      />
    </div>
  );
}