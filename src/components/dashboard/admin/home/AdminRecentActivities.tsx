import type { AdminRecentActivity } from "@/data/learning/admin/admin-dashboard";

interface AdminRecentActivitiesProps {
  activities: AdminRecentActivity[];
}

export function AdminRecentActivities({
  activities,
}: AdminRecentActivitiesProps) {
  return (
    <section className="bg-card rounded-2xl sm:rounded-3xl border border-border p-5 sm:p-8 shadow-sm w-full">
      <h2 className="text-lg sm:text-xl font-extrabold text-foreground mb-5 sm:mb-6 flex items-center gap-2">
        <span className="w-1.5 h-6 bg-primary rounded-full" />
        Log Aktivitas Terbaru
      </h2>

      {activities.length > 0 ? (
        <div className="space-y-5">
          {activities.map((activity, index) => (
            <div key={activity.id} className="flex gap-4 relative group">
              {index !== activities.length - 1 && (
                <div className="absolute left-1.75 top-6 w-0.5 h-10 bg-border group-hover:bg-primary/30 transition-colors" />
              )}

              <div className="w-4 h-4 rounded-full bg-primary/20 border-2 border-primary mt-1.5 shrink-0 z-10 group-hover:scale-125 transition-transform" />

              <div className="min-w-0">
                <p className="text-xs sm:text-sm font-bold text-foreground leading-snug group-hover:text-primary transition-colors">
                  {activity.text}
                </p>

                <p className="text-[10px] font-extrabold text-muted-foreground mt-1 uppercase tracking-wider">
                  {activity.time}
                </p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="py-10 text-center border border-dashed border-border rounded-2xl bg-muted/20">
          <p className="text-sm font-bold text-foreground">
            Belum ada aktivitas terbaru.
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            Aktivitas sistem akan muncul setelah data diperbarui.
          </p>
        </div>
      )}
    </section>
  );
}