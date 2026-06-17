import type { LucideIcon } from "lucide-react";

interface ActionWidgetProps {
  icon: LucideIcon;
  bgIcon: LucideIcon;
  title: string;
  description: string;
  onClick: () => void;
  colorTheme?: "primary" | "teal";
}

export function ActionWidget({
  icon: Icon,
  bgIcon: BgIcon,
  title,
  description,
  onClick,
  colorTheme = "primary",
}: ActionWidgetProps) {
  const isPrimary = colorTheme === "primary";

  const borderHoverClass = isPrimary
    ? "hover:border-primary/50"
    : "hover:border-teal-500/50";
  const bgHoverClass = isPrimary
    ? "hover:bg-primary/5"
    : "hover:bg-teal-500/5";
  const iconBoxClass = isPrimary ? "bg-primary/10" : "bg-teal-500/10";
  const iconColorClass = isPrimary ? "text-primary" : "text-teal-600";
  const textHoverClass = isPrimary
    ? "group-hover:text-primary"
    : "group-hover:text-teal-600";
  const bgIconColorClass = isPrimary
    ? "text-primary/5 group-hover:text-primary/10"
    : "text-teal-500/5 group-hover:text-teal-500/10";

  return (
    <button
      type="button"
      onClick={onClick}
      className={`p-5 sm:p-6 rounded-2xl bg-card border-2 border-border transition-all text-left group relative overflow-hidden ${borderHoverClass} ${bgHoverClass}`}
    >
      <div
        className={`w-12 h-12 sm:w-14 sm:h-14 rounded-xl flex items-center justify-center mb-4 sm:mb-5 relative z-10 ${iconBoxClass}`}
      >
        <Icon
          size={24}
          className={`${iconColorClass} group-hover:scale-110 transition-transform sm:w-7 sm:h-7`}
        />
      </div>

      <p
        className={`text-sm sm:text-base font-extrabold text-foreground transition-colors relative z-10 ${textHoverClass}`}
      >
        {title}
      </p>

      <p className="text-xs text-muted-foreground mt-1.5 font-medium leading-relaxed relative z-10">
        {description}
      </p>

      <BgIcon
        size={90}
        className={`absolute -right-6 -bottom-6 transition-colors ${bgIconColorClass} ${
          isPrimary ? "rotate-12" : "-rotate-12"
        }`}
      />
    </button>
  );
}