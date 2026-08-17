export default function Loading() {
  return (
    <div className="min-h-screen w-full bg-gray-50 pb-16">
      {/* Page Banner Slider Shimmer */}
      <div className="flex h-64 w-full animate-pulse items-center justify-center border-b border-gray-200 bg-white md:h-80">
        <div className="mx-auto w-full max-w-7xl space-y-4 px-4 md:px-8">
          <div className="h-6 w-1/4 rounded bg-gray-200" />
          <div className="h-4 w-1/2 rounded bg-gray-200" />
        </div>
      </div>

      {/* Main Grid */}
      <section className="mx-auto max-w-7xl px-4 py-10 md:px-8">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
          {/* News articles skeleton list (lg:col-span-8) */}
          <div className="space-y-6 lg:col-span-8">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              {[1, 2, 4, 5].map((n) => (
                <div
                  key={n}
                  className="animate-pulse space-y-4 overflow-hidden rounded-2xl border border-gray-200 bg-white p-4 shadow-sm"
                >
                  <div className="h-48 rounded-xl bg-gray-200" />
                  <div className="space-y-2">
                    <div className="h-4.5 w-3/4 rounded bg-gray-200" />
                    <div className="h-3.5 w-full rounded bg-gray-200" />
                    <div className="h-3.5 w-2/3 rounded bg-gray-200" />
                  </div>
                  <div className="h-4 w-24 rounded bg-gray-200 pt-2" />
                </div>
              ))}
            </div>
          </div>

          {/* Sidebar skeleton (lg:col-span-4) */}
          <div className="space-y-6 lg:col-span-4">
            <div className="animate-pulse space-y-6 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
              <div className="space-y-2">
                <div className="h-4.5 w-1/3 rounded bg-gray-200" />
                <div className="h-10 rounded bg-gray-200" />
              </div>
              <div className="space-y-3">
                <div className="h-4.5 w-1/2 rounded bg-gray-200" />
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-8 rounded bg-gray-200" />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
