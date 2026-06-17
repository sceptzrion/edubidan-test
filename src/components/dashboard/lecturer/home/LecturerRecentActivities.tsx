import { ActivityItem } from "@/components/dashboard/lecturer/ActivityItem";
import type { LecturerRecentActivity } from "@/data/learning/lecturer/lecturer-dashboard";

interface LecturerRecentActivitiesProps {
  activities: LecturerRecentActivity[];
}

export function LecturerRecentActivities({
  activities,
}: LecturerRecentActivitiesProps) {
  return (
    <section className="bg-card rounded-2xl sm:rounded-3xl border border-border p-5 sm:p-6 md:p-8 shadow-sm">
      <h2 className="text-lg sm:text-xl font-extrabold mb-5 sm:mb-6 text-foreground border-b border-border/50 pb-4">
        Aktivitas Terbaru
      </h2>

      {activities.length > 0 ? (
        <div className="space-y-4">
          {activities.map((activity) => (
            <ActivityItem
              key={activity.id}
              text={activity.text}
              highlight={activity.highlight}
              time={activity.time}
            />
          ))}
        </div>
      ) : (
        <div className="rounded-2xl border border-dashed border-border bg-muted/30 p-5 text-center">
          <p className="text-sm font-bold text-foreground mb-1">
            Belum ada aktivitas
          </p>
          <p className="text-xs text-muted-foreground font-medium leading-relaxed">
            Aktivitas pengerjaan kuis, publikasi modul, dan peserta baru akan
            muncul di sini.
          </p>
        </div>
      )}
    </section>
  );
}