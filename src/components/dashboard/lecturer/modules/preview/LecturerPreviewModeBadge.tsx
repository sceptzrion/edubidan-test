interface LecturerPreviewModeBadgeProps {
  label: string;
}

export function LecturerPreviewModeBadge({ label }: LecturerPreviewModeBadgeProps) {
  return (
    <div className="px-4 py-2 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-600 font-extrabold text-xs flex items-center gap-2 w-fit">
      <div className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
      {label}
    </div>
  );
}