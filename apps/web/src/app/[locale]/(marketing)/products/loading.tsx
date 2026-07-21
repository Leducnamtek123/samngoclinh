export default function Loading() {
  return (
    <div className="w-full bg-gray-50 min-h-screen pb-16">
      {/* Search Section Placeholder */}
      <section className="max-w-7xl mx-auto px-4 md:px-8 py-8 flex justify-end">
        <div className="w-full max-w-md h-10 bg-gray-200 rounded-lg animate-pulse"></div>
      </section>

      {/* Catalog Grid */}
      <section className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
            <div key={n} className="bg-white border border-gray-200 rounded-2xl overflow-hidden p-4 space-y-4 animate-pulse">
              <div className="bg-gray-200 h-48 rounded-xl"></div>
              <div className="space-y-2">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </div>
              <div className="flex items-center justify-between pt-3.5 border-t border-gray-100">
                <div className="space-y-1.5 flex-1">
                  <div className="h-2.5 bg-gray-200 rounded w-1/3"></div>
                  <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                </div>
                <div className="h-8 bg-gray-200 rounded-lg w-24"></div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
