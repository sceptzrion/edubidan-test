export default function LecturerModulesLoading() {
  return (
    <div className="animate-pulse pb-10 sm:pb-12">
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4 sm:gap-6 mb-6 sm:mb-8">
        <div>
          <div className="h-8 w-56 rounded-xl bg-muted" />
          <div className="mt-3 h-4 w-80 max-w-full rounded-lg bg-muted" />
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <div className="h-11 w-full sm:w-64 rounded-xl bg-muted" />
          <div className="h-11 w-full sm:w-36 rounded-xl bg-muted" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5 sm:gap-6">
        {Array.from({ length: 6 }).map((_, index) => (
          <div
            key={index}
            className="rounded-2xl border border-border bg-card overflow-hidden shadow-sm"
          >
            <div className="h-36 bg-muted" />

            <div className="p-5 space-y-4">
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-2 flex-1">
                  <div className="h-5 w-3/4 rounded-lg bg-muted" />
                  <div className="h-3 w-1/2 rounded-lg bg-muted" />
                </div>
                <div className="h-7 w-16 rounded-full bg-muted" />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="h-16 rounded-xl bg-muted" />
                <div className="h-16 rounded-xl bg-muted" />
              </div>

              <div className="flex gap-3 pt-2">
                <div className="h-10 flex-1 rounded-xl bg-muted" />
                <div className="h-10 w-12 rounded-xl bg-muted" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}