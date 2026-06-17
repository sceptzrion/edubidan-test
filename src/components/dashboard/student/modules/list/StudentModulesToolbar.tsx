import { Grid3X3, List, Plus, Search } from "lucide-react";

export type StudentModulesLayout = "grid" | "list";

interface StudentModulesToolbarProps {
  search: string;
  layout: StudentModulesLayout;
  onSearchChange: (value: string) => void;
  onLayoutChange: (layout: StudentModulesLayout) => void;
  onJoinModule: () => void;
}

export function StudentModulesToolbar({
  search,
  layout,
  onSearchChange,
  onLayoutChange,
  onJoinModule,
}: StudentModulesToolbarProps) {
  return (
    <div className="flex flex-wrap lg:flex-nowrap items-center gap-2.5 sm:gap-3">
      <div className="relative w-full sm:w-auto flex-1 sm:flex-none">
        <Search
          size={16}
          className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground sm:w-4.5 sm:h-4.5"
        />

        <input
          value={search}
          onChange={(event) => onSearchChange(event.target.value)}
          placeholder="Cari modul..."
          className="w-full sm:w-60 pl-9 sm:pl-10 pr-4 py-2.5 sm:py-3 rounded-xl sm:rounded-2xl bg-card border border-border focus:border-primary focus:ring-1 focus:ring-primary outline-none text-xs sm:text-sm font-bold text-foreground transition-all shadow-sm"
        />
      </div>

      <div className="flex items-center gap-1 border border-border bg-card p-1 sm:p-1.5 rounded-xl sm:rounded-2xl shrink-0 shadow-sm">
        <button
          type="button"
          onClick={() => onLayoutChange("grid")}
          aria-label="Tampilan grid"
          className={`p-1.5 sm:p-2 rounded-lg sm:rounded-xl transition-colors ${
            layout === "grid"
              ? "bg-muted text-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
          }`}
        >
          <Grid3X3 size={16} className="sm:w-4.5 sm:h-4.5" />
        </button>

        <button
          type="button"
          onClick={() => onLayoutChange("list")}
          aria-label="Tampilan list"
          className={`p-1.5 sm:p-2 rounded-lg sm:rounded-xl transition-colors ${
            layout === "list"
              ? "bg-muted text-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
          }`}
        >
          <List size={16} className="sm:w-4.5 sm:h-4.5" />
        </button>
      </div>

      <button
        type="button"
        onClick={onJoinModule}
        className="w-full sm:w-auto bg-primary text-primary-foreground px-5 sm:px-6 py-2.5 sm:py-3 rounded-xl sm:rounded-2xl text-xs sm:text-sm font-extrabold flex items-center justify-center gap-2 hover:bg-primary/90 shadow-lg shadow-primary/20 transition-all hover:-translate-y-0.5 shrink-0"
      >
        <Plus size={16} className="sm:w-4.5 sm:h-4.5" />
        Gabung Modul
      </button>
    </div>
  );
}