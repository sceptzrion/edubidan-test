export function AdminUsersLoadingState() {
  return (
    <div className="p-4 sm:p-6 animate-pulse">
      <div className="hidden md:block overflow-hidden rounded-2xl border border-border">
        <div className="grid grid-cols-[1.3fr_1.1fr_0.8fr_0.8fr_1fr] gap-4 bg-muted/50 px-5 py-4">
          {Array.from({ length: 5 }).map((_, index) => (
            <div key={index} className="h-4 rounded-lg bg-muted" />
          ))}
        </div>

        <div className="divide-y divide-border">
          {Array.from({ length: 7 }).map((_, rowIndex) => (
            <div
              key={rowIndex}
              className="grid grid-cols-[1.3fr_1.1fr_0.8fr_0.8fr_1fr] gap-4 px-5 py-4"
            >
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-muted" />
                <div className="space-y-2 flex-1">
                  <div className="h-4 w-3/4 rounded-lg bg-muted" />
                  <div className="h-3 w-1/2 rounded-lg bg-muted" />
                </div>
              </div>

              <div className="h-4 self-center rounded-lg bg-muted" />
              <div className="h-7 w-20 self-center rounded-full bg-muted" />
              <div className="h-7 w-20 self-center rounded-full bg-muted" />
              <div className="flex items-center justify-end gap-2">
                <div className="h-9 w-9 rounded-xl bg-muted" />
                <div className="h-9 w-9 rounded-xl bg-muted" />
                <div className="h-9 w-9 rounded-xl bg-muted" />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="md:hidden space-y-4">
        {Array.from({ length: 5 }).map((_, index) => (
          <div
            key={index}
            className="rounded-2xl border border-border bg-card p-4 space-y-4"
          >
            <div className="flex items-center gap-3">
              <div className="h-11 w-11 rounded-full bg-muted" />
              <div className="space-y-2 flex-1">
                <div className="h-4 w-3/4 rounded-lg bg-muted" />
                <div className="h-3 w-1/2 rounded-lg bg-muted" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="h-8 rounded-xl bg-muted" />
              <div className="h-8 rounded-xl bg-muted" />
            </div>

            <div className="flex gap-2">
              <div className="h-9 flex-1 rounded-xl bg-muted" />
              <div className="h-9 flex-1 rounded-xl bg-muted" />
            </div>
          </div>
        ))}
      </div>

      <p className="mt-5 text-center text-sm font-semibold text-muted-foreground">
        Memuat data pengguna...
      </p>
    </div>
  );
}