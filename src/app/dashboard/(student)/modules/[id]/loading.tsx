export default function StudentModuleDetailLoading() {
  return (
    <div className="animate-pulse pb-10 sm:pb-12">
      <div className="rounded-2xl sm:rounded-3xl border border-border bg-card overflow-hidden shadow-sm mb-6">
        <div className="h-44 sm:h-56 bg-muted" />

        <div className="p-5 sm:p-6 space-y-5">
          <div className="space-y-3">
            <div className="h-7 w-2/3 rounded-xl bg-muted" />
            <div className="h-4 w-full max-w-xl rounded-lg bg-muted" />
            <div className="h-4 w-4/5 max-w-lg rounded-lg bg-muted" />
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            {Array.from({ length: 4 }).map((_, index) => (
              <div key={index} className="h-20 rounded-2xl bg-muted" />
            ))}
          </div>

          <div className="h-2 w-full rounded-full bg-muted" />
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-[1fr_340px] gap-6">
        <div className="space-y-4">
          {Array.from({ length: 5 }).map((_, index) => (
            <div
              key={index}
              className="rounded-2xl border border-border bg-card p-5 flex items-center gap-4"
            >
              <div className="h-12 w-12 rounded-xl bg-muted" />
              <div className="flex-1 space-y-2">
                <div className="h-5 w-2/3 rounded-lg bg-muted" />
                <div className="h-3 w-1/2 rounded-lg bg-muted" />
              </div>
              <div className="h-9 w-24 rounded-xl bg-muted" />
            </div>
          ))}
        </div>

        <div className="rounded-2xl border border-border bg-card p-5 space-y-4 h-fit">
          <div className="h-5 w-40 rounded-lg bg-muted" />
          <div className="h-4 w-full rounded-lg bg-muted" />
          <div className="h-4 w-4/5 rounded-lg bg-muted" />
          <div className="h-10 w-full rounded-xl bg-muted" />
        </div>
      </div>
    </div>
  );
}