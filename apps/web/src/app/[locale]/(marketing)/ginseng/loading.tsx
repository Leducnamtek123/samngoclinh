export default function Loading() {
  return (
    <div className="w-full bg-gray-50 min-h-screen pb-16">
      {/* Search Section Placeholder */}
      <section className="max-w-7xl mx-auto px-4 md:px-8 py-8 flex justify-end">
        <div className="w-full max-w-md h-10 bg-gray-200 rounded-lg animate-pulse"></div>
      </section>

      {/* Catalog Grid */}
      <section className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((n) => (
            <div key={n} className="bg-white border border-gray-200 rounded-2xl overflow-hidden p-5 space-y-4 animate-pulse">
              <div className="bg-gray-200 h-64 rounded-xl"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              <div className="h-10 bg-gray-200 rounded"></div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
