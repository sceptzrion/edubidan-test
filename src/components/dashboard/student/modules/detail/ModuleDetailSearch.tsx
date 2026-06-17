import { Search } from "lucide-react";

import type { DetailTab } from "@/components/dashboard/student/modules/detail/ModuleDetailTabs";

interface ModuleDetailSearchProps {
  tab: DetailTab;
  searchQuery: string;
  onSearchChange: (value: string) => void;
}

function getSearchPlaceholder(tab: DetailTab) {
  if (tab === "pembelajaran") return "Cari materi atau kuis...";
  if (tab === "evaluasi") return "Cari kuis evaluasi...";
  return "Cari peserta...";
}

export function ModuleDetailSearch({
  tab,
  searchQuery,
  onSearchChange,
}: ModuleDetailSearchProps) {
  return (
    <div className="relative w-full md:w-64 md:mb-1">
      <Search
        size={14}
        className="sm:w-4 sm:h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground"
      />

      <input
        value={searchQuery}
        onChange={(event) => onSearchChange(event.target.value)}
        placeholder={getSearchPlaceholder(tab)}
        className="w-full pl-9 pr-4 py-2 sm:py-2.5 rounded-lg bg-card border border-border focus:border-primary focus:ring-1 focus:ring-primary outline-none text-[10px] sm:text-xs font-medium transition-all"
      />
    </div>
  );
}