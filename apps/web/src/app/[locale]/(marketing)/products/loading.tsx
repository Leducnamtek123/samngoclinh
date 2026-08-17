export default function Loading() {
  return (
    <div className="min-h-screen w-full bg-gray-50 pb-16">
      {/* Search Section Placeholder */}
      <section className="mx-auto flex max-w-7xl justify-end px-4 py-8 md:px-8">
        <div className="h-10 w-full max-w-md animate-pulse rounded-lg bg-gray-200" />
      </section>

      {/* Catalog Grid */}
      <section className="mx-auto max-w-7xl px-4 md:px-8">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
            <div
              key={n}
              className="animate-pulse space-y-4 overflow-hidden rounded-2xl border border-gray-200 bg-white p-4"
            >
              <div className="h-48 rounded-xl bg-gray-200" />
              <div className="space-y-2">
                <div className="h-4 w-3/4 rounded bg-gray-200" />
                <div className="h-3 w-1/2 rounded bg-gray-200" />
              </div>
              <div className="flex items-center justify-between border-t border-gray-100 pt-3.5">
                <div className="flex-1 space-y-1.5">
                  <div className="h-2.5 w-1/3 rounded bg-gray-200" />
                  <div className="h-4 w-2/3 rounded bg-gray-200" />
                </div>
                <div className="h-8 w-24 rounded-lg bg-gray-200" />
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
