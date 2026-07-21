'use client';

import { useProfileMe } from '@/hooks/queries/useProfile';
import { useMarketplaceListings } from '@/hooks/queries/useMarketplace';

type TradingFloorClientProps = {
  locale: string;
  isLoggedIn?: boolean;
};
export const TradingFloorClient = ({ locale, isLoggedIn }: TradingFloorClientProps) => {
  const { data: listings, isLoading: listingsLoading, isError: listingsError } = useMarketplaceListings();
  const { data: profile, isLoading: profileLoading } = useProfileMe();

  const handleAction = (e: React.MouseEvent) => {
    if (!isLoggedIn) {
      e.preventDefault();
      window.location.href = `/${locale}/sign-in?reason=trading-floor`;
    }
  };

  const isError = listingsError;

  const isVerified = profile?.verified || false;

  const displayListings = listings || [];

  return (
    <div className="w-full bg-gray-50 min-h-screen pb-16">
      {/* Top Header Bar */}
      <section className="bg-white border-b border-gray-200 py-6 px-4 md:px-8">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex items-center gap-3">
            <span className="text-primary text-2xl font-bold flex items-center gap-1.5 font-display-lg">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
              Ký gửi
            </span>
            <span className="flex h-2.5 w-2.5 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
            </span>
          </div>

          <div className="flex gap-3 text-xs font-bold text-gray-700">
            <button 
              onClick={handleAction}
              className="bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-lg flex items-center gap-1.5 transition-colors border border-gray-200"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
              </svg>
              Quản lý thẻ
            </button>
            <button 
              onClick={handleAction}
              className="bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-lg flex items-center gap-1.5 transition-colors border border-gray-200"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
              </svg>
              Lệnh Của Tôi
            </button>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 md:px-8 py-8 space-y-6">
        {/* Verification banner if user is not verified */}
        {!profileLoading && !isVerified && (
          <div className="bg-red-50 border border-red-200 rounded-2xl p-5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 shadow-sm">
            <div className="flex gap-3.5 items-start">
              <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0 text-red-600">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <div className="space-y-1">
                <h4 className="font-bold text-red-900 text-sm">Cần xác thực danh tính</h4>
                <p className="text-red-700 text-xs font-medium">Bạn phải xác thực danh tính bằng giấy tờ tùy thân để giao dịch trên sàn.</p>
              </div>
            </div>
            <a href="/profile?tabs=kyc" className="bg-white hover:bg-gray-50 text-red-700 border border-red-200 px-5 py-2.5 rounded-lg text-xs font-bold shadow-sm transition-colors whitespace-nowrap">
              Xác thực ngay
            </a>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column Listings (lg:col-span-8) */}
          <div className="lg:col-span-8 space-y-6">
            <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
              {/* Table Sub-header tabs */}
              <div className="flex border-b border-gray-200 px-6 py-4 bg-gray-50/50">
                <button className="text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-4 py-1.5 rounded-full flex items-center gap-1.5 shadow-sm">
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                  Thị Trường Giao Dịch
                  <span className="bg-emerald-600 text-white text-[9px] px-1.5 py-0.5 rounded-full">
                    {listingsLoading ? '...' : displayListings.length}
                  </span>
                </button>
                <button className="text-xs font-bold text-gray-500 hover:text-gray-800 px-4 py-1.5">
                  Lệnh bán của tôi
                </button>
                <button className="text-xs font-bold text-gray-500 hover:text-gray-800 px-4 py-1.5">
                  Lệnh mua phù hợp
                </button>
              </div>

              {listingsLoading ? (
                <div className="divide-y divide-gray-150">
                  {[1, 2, 3].map((n) => (
                    <div key={n} className="px-6 py-5 flex justify-between items-center gap-4 animate-pulse">
                      <div className="flex items-center gap-4 flex-1">
                        <div className="w-12 h-12 bg-gray-200 rounded-xl"></div>
                        <div className="space-y-2 flex-1">
                          <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                          <div className="h-3.5 bg-gray-200 rounded w-1/4"></div>
                        </div>
                      </div>
                      <div className="flex items-center gap-6">
                        <div className="space-y-1.5">
                          <div className="h-4.5 bg-gray-200 rounded w-20"></div>
                          <div className="h-3 bg-gray-200 rounded w-12 ml-8"></div>
                        </div>
                        <div className="h-8 bg-gray-200 rounded-lg w-16"></div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : isError ? (
                <div className="bg-red-50 text-red-700 p-8 text-center font-medium text-xs">
                  Có lỗi xảy ra khi tải dữ liệu sàn giao dịch. Vui lòng thử lại.
                </div>
              ) : displayListings.length === 0 ? (
                <div className="text-center py-12 text-gray-400 font-medium text-xs">
                  Chưa có lệnh ký gửi nào trên sàn giao dịch.
                </div>
              ) : (
                /* Listings table list */
                <div className="divide-y divide-gray-150">
                  {displayListings.map((listing: any) => (
                    <div key={listing.id} className="px-6 py-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 hover:bg-gray-50/50 transition-all">
                      {/* Item title & details */}
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-primary/5 border border-primary/10 rounded-xl flex items-center justify-center">
                          <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 19V9m0 0a4 4 0 10-8 0m8 0a4 4 0 118 0M7 21h10" />
                          </svg>
                        </div>
                        <div className="space-y-1">
                          <h4 className="font-bold text-gray-900 text-sm uppercase">{listing.title}</h4>
                          <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">{listing.note || '1 năm • Cây Khỏe'}</p>
                        </div>
                      </div>

                      {/* Price and Action */}
                      <div className="flex items-center gap-6 justify-between sm:justify-end w-full sm:w-auto">
                        <div className="text-right">
                          <p className="font-bold text-gray-900 text-base">{listing.price.toLocaleString('vi-VN')} đ</p>
                          {/* Payment badges */}
                          <div className="flex gap-1 justify-end mt-1">
                            {(listing.payments || ['Điểm']).map((p: string, idx: number) => (
                              <span key={idx} className="bg-gray-100 text-gray-600 border border-gray-200 text-[9px] font-bold px-2 py-0.5 rounded">
                                {p}
                              </span>
                            ))}
                          </div>
                        </div>

                        <button 
                          onClick={handleAction}
                          className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-5 py-2 rounded-lg shadow-sm transition-colors"
                        >
                          Mua
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right Column Action Card (lg:col-span-4) */}
          <div className="lg:col-span-4">
            <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
              {/* Form Tab header */}
              <div className="flex border-b border-gray-100 font-bold text-xs">
                <button className="flex-1 py-3.5 text-center text-gray-400 border-b border-transparent hover:text-gray-700">
                  Tạo lệnh mua
                </button>
                <button className="flex-1 py-3.5 text-center text-red-600 border-b-2 border-red-500 bg-red-50/20">
                  Bán
                </button>
              </div>

              {/* Form Content */}
              <div className="p-6 space-y-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Chọn cây để bán</label>
                  <input
                    type="text"
                    placeholder="Tìm cây theo tên, vườn, luống, ô..."
                    className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-xs focus:outline-none focus:border-primary bg-white font-semibold"
                  />
                  <select className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-xs focus:outline-none focus:border-primary bg-white text-gray-500 font-medium mt-2">
                    <option>Chọn cây từ danh sách của bạn</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Giá bán (VNĐ)</label>
                  <input
                    type="number"
                    placeholder="Nhập giá bán"
                    className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-xs focus:outline-none focus:border-primary bg-white font-semibold"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Thời gian giao dịch</label>
                  <div className="relative">
                    <input
                      type="number"
                      placeholder="15"
                      className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-xs focus:outline-none focus:border-primary bg-white font-semibold pr-10"
                    />
                    <span className="absolute right-3 top-3 text-xs text-gray-400 font-medium">phút</span>
                  </div>
                </div>

                <div className="space-y-3 pt-2">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block">Phương thức thanh toán</label>
                  <div className="space-y-2">
                    <label className="flex items-center gap-2.5 text-xs text-gray-600 font-semibold cursor-pointer">
                      <input
                        type="checkbox"
                        className="rounded border-gray-300 text-red-600 focus:ring-red-500 w-3.5 h-3.5"
                      />
                      <span>Thanh toán bằng điểm</span>
                    </label>
                    <label className="flex items-center gap-2.5 text-xs text-gray-600 font-semibold cursor-pointer">
                      <input
                        type="checkbox"
                        className="rounded border-gray-300 text-red-600 focus:ring-red-500 w-3.5 h-3.5"
                      />
                      <span>Chuyển khoản ngân hàng</span>
                    </label>
                  </div>
                </div>

                <button 
                  onClick={handleAction}
                  className="w-full bg-[#D32F2F] hover:bg-red-700 text-white font-bold py-3.5 rounded-lg text-sm transition-colors shadow-md shadow-red-600/10"
                >
                  Đăng Bán
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
