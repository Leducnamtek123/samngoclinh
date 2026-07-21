export default function Loading() {
  return (
    <div className="w-full bg-gray-50 min-h-screen pb-16">
      {/* Page Banner Slider Shimmer */}
      <div className="w-full bg-white border-b border-gray-200 h-64 md:h-80 animate-pulse flex items-center justify-center">
        <div className="max-w-7xl mx-auto px-4 md:px-8 w-full space-y-4">
          <div className="h-6 bg-gray-200 rounded w-1/4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        </div>
      </div>

      {/* Main Grid */}
      <section className="max-w-7xl mx-auto px-4 md:px-8 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* News articles skeleton list (lg:col-span-8) */}
          <div className="lg:col-span-8 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[1, 2, 4, 5].map((n) => (
                <div key={n} className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm animate-pulse space-y-4 p-4">
                  <div className="bg-gray-200 h-48 rounded-xl"></div>
                  <div className="space-y-2">
                    <div className="h-4.5 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-3.5 bg-gray-200 rounded w-full"></div>
                    <div className="h-3.5 bg-gray-200 rounded w-2/3"></div>
                  </div>
                  <div className="h-4 bg-gray-200 rounded w-24 pt-2"></div>
                </div>
              ))}
            </div>
          </div>

          {/* Sidebar skeleton (lg:col-span-4) */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm animate-pulse space-y-6">
              <div className="space-y-2">
                <div className="h-4.5 bg-gray-200 rounded w-1/3"></div>
                <div className="h-10 bg-gray-200 rounded"></div>
              </div>
              <div className="space-y-3">
                <div className="h-4.5 bg-gray-200 rounded w-1/2"></div>
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-8 bg-gray-200 rounded"></div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
