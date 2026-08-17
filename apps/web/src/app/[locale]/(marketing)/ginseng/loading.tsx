export default function Loading() {
  return (
    <div className="min-h-screen w-full bg-gray-50 pb-16">
      {/* Search Section Placeholder */}
      <section className="mx-auto flex max-w-7xl justify-end px-4 py-8 md:px-8">
        <div className="h-10 w-full max-w-md animate-pulse rounded-lg bg-gray-200" />
      </section>

      {/* Catalog Grid */}
      <section className="mx-auto max-w-7xl px-4 md:px-8">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map((n) => (
            <div
              key={n}
              className="animate-pulse space-y-4 overflow-hidden rounded-2xl border border-gray-200 bg-white p-5"
            >
              <div className="h-64 rounded-xl bg-gray-200" />
              <div className="h-4 w-3/4 rounded bg-gray-200" />
              <div className="h-4 w-1/2 rounded bg-gray-200" />
              <div className="h-10 rounded bg-gray-200" />
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
