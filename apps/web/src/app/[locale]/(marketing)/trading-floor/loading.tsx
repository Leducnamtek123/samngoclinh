export default function Loading() {
  return (
    <div className="w-full bg-gray-50 min-h-screen pb-16">
      {/* Top Header Bar Placeholder */}
      <section className="bg-white border-b border-gray-200 py-6 px-4 md:px-8">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-32"></div>
          <div className="flex gap-3">
            <div className="h-8 bg-gray-200 rounded w-28"></div>
            <div className="h-8 bg-gray-200 rounded w-28"></div>
          </div>
        </div>
      </section>

      {/* Main Content Grid */}
      <section className="max-w-7xl mx-auto px-4 md:px-8 py-8 space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column Listings Shimmer */}
          <div className="lg:col-span-8 space-y-6">
            <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden animate-pulse">
              <div className="h-12 bg-gray-100/80 border-b border-gray-200"></div>
              <div className="divide-y divide-gray-150">
                {[1, 2, 3].map((n) => (
                  <div key={n} className="px-6 py-5 flex justify-between items-center gap-4">
                    <div className="flex items-center gap-4 flex-1">
                      <div className="w-12 h-12 bg-gray-200 rounded-xl"></div>
                      <div className="space-y-2 flex-1">
                        <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                        <div className="h-3.5 bg-gray-200 rounded w-1/4"></div>
                      </div>
                    </div>
                    <div className="flex items-center gap-6">
                      <div className="space-y-1.5">
                        <div className="h-4 bg-gray-200 rounded w-20"></div>
                        <div className="h-3 bg-gray-200 rounded w-12 ml-8"></div>
                      </div>
                      <div className="h-8 bg-gray-200 rounded-lg w-16"></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column Action Card Shimmer */}
          <div className="lg:col-span-4">
            <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden animate-pulse p-6 space-y-6">
              <div className="h-10 bg-gray-100 rounded"></div>
              <div className="space-y-2">
                <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                <div className="h-10 bg-gray-200 rounded"></div>
              </div>
              <div className="space-y-2">
                <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                <div className="h-10 bg-gray-200 rounded"></div>
              </div>
              <div className="h-12 bg-gray-200 rounded-lg"></div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
