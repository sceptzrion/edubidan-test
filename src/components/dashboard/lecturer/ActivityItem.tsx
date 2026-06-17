interface ActivityItemProps {
  text: string;
  highlight: string;
  time: string;
}

export function ActivityItem({ text, highlight, time }: ActivityItemProps) {
  return (
    <div className="flex items-start gap-3 sm:gap-4 p-4 rounded-2xl bg-muted/30 border border-border/50 hover:bg-muted/60 transition-colors cursor-default">
      <div className="w-2.5 h-2.5 rounded-full bg-primary mt-1.5 shrink-0 shadow-[0_0_8px_rgba(13,148,136,0.6)]" />

      <div>
        <p className="text-xs sm:text-sm font-bold text-foreground leading-relaxed">
          {text}{" "}
          <span className="text-primary font-extrabold">({highlight})</span>
        </p>

        <p className="text-[10px] sm:text-xs text-muted-foreground mt-1.5 font-bold uppercase tracking-wider">
          {time}
        </p>
      </div>
    </div>
  );
}