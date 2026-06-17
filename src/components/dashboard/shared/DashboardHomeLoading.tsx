export function DashboardHomeLoading() {
  return (
    <div className="animate-pulse pb-10">
      <div className="mb-6 sm:mb-8 rounded-2xl sm:rounded-3xl border border-border bg-card p-5 sm:p-6">
        <div className="h-7 w-56 rounded-xl bg-muted" />
        <div className="mt-3 h-4 w-80 max-w-full rounded-lg bg-muted" />
        <div className="mt-2 h-4 w-64 max-w-full rounded-lg bg-muted" />
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5 mb-6 sm:mb-8">
        {Array.from({ length: 4 }).map((_, index) => (
          <div
            key={index}
            className="rounded-2xl border border-border bg-card p-4 sm:p-5"
          >
            <div className="h-10 w-10 rounded-xl bg-muted" />
            <div className="mt-4 h-6 w-20 rounded-lg bg-muted" />
            <div className="mt-2 h-3 w-24 rounded-lg bg-muted" />
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-5 sm:gap-6 md:gap-8">
        <div className="lg:col-span-2 rounded-2xl sm:rounded-3xl border border-border bg-card p-5 sm:p-6">
          <div className="h-6 w-44 rounded-lg bg-muted" />
          <div className="mt-5 space-y-4">
            {Array.from({ length: 5 }).map((_, index) => (
              <div key={index} className="flex items-center gap-3">
                <div className="h-11 w-11 rounded-xl bg-muted" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 w-3/4 rounded-lg bg-muted" />
                  <div className="h-3 w-1/2 rounded-lg bg-muted" />
                </div>
                <div className="h-8 w-20 rounded-xl bg-muted" />
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-5 sm:space-y-6 md:space-y-8">
          <div className="rounded-2xl sm:rounded-3xl border border-border bg-card p-5 sm:p-6">
            <div className="h-6 w-36 rounded-lg bg-muted" />
            <div className="mt-5 space-y-3">
              <div className="h-16 rounded-2xl bg-muted" />
              <div className="h-16 rounded-2xl bg-muted" />
              <div className="h-16 rounded-2xl bg-muted" />
            </div>
          </div>

          <div className="rounded-2xl sm:rounded-3xl border border-border bg-card p-5 sm:p-6">
            <div className="h-6 w-32 rounded-lg bg-muted" />
            <div className="mt-4 h-4 w-full rounded-lg bg-muted" />
            <div className="mt-2 h-4 w-4/5 rounded-lg bg-muted" />
            <div className="mt-5 h-10 w-full rounded-xl bg-muted" />
          </div>
        </div>
      </div>
    </div>
  );
}