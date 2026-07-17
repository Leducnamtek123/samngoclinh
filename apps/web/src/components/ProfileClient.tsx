'use client';

import { useState } from 'react';
import { useProfileMe, useProfileBusiness } from '@/hooks/queries/useProfile';
import { useWalletSummary } from '@/hooks/queries/useWallet';
import { useCultivationTrees } from '@/hooks/queries/useCultivation';

type ProfileClientProps = {
  locale: string;
  initialTab?: string;
};

export const ProfileClient = ({ locale: _locale, initialTab = 'info' }: ProfileClientProps) => {
  const [tabs, setTabs] = useState(initialTab);

  // Queries
  const { data: profile, isLoading: profileLoading, isError: profileError, refetch: refetchProfile } = useProfileMe();
  const { data: business, isLoading: businessLoading } = useProfileBusiness();
  const { data: wallet, isLoading: walletLoading } = useWalletSummary();
  const { data: trees, isLoading: treesLoading } = useCultivationTrees();

  const isLoading = profileLoading || businessLoading || walletLoading || treesLoading;
  const isError = profileError || !profile;

  // Active tab state styling helper
  const tabClass = (current: string) =>
    `flex-1 py-3.5 text-center font-bold text-sm border-b-2 transition-all whitespace-nowrap px-4 cursor-pointer ${
      tabs === current
        ? 'border-secondary text-secondary'
        : 'border-transparent text-gray-500 hover:text-gray-800'
    }`;

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto py-16 px-4 space-y-8 animate-pulse">
        {/* Header Shimmer */}
        <div className="bg-white border border-gray-200 rounded-2xl p-6 sm:p-8 flex items-center gap-6">
          <div className="w-20 h-20 bg-gray-200 rounded-full"></div>
          <div className="space-y-3 flex-1">
            <div className="h-6 bg-gray-200 rounded-lg w-1/3"></div>
            <div className="h-4 bg-gray-200 rounded-lg w-1/2"></div>
          </div>
        </div>
        {/* Navigation Shimmer */}
        <div className="bg-white border border-gray-200 rounded-xl h-12"></div>
        {/* Content Shimmer */}
        <div className="bg-white border border-gray-200 rounded-2xl p-8 h-64"></div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="max-w-4xl mx-auto py-16 px-4 text-center space-y-4 flex flex-col items-center">
        <div className="w-16 h-16 rounded-full bg-amber-50 flex items-center justify-center text-amber-500">
          <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-gray-800">Không thể tải thông tin hồ sơ</h2>
        <p className="text-gray-500">Vui lòng kiểm tra lại kết nối hoặc đăng nhập lại.</p>
        <button
          onClick={() => refetchProfile()}
          className="inline-block bg-primary text-white px-6 py-2.5 rounded-lg font-bold hover:bg-primary-hover transition-colors"
        >
          Thử lại
        </button>
      </div>
    );
  }

  const fullName = profile.fullName || 'Nhà đầu tư';
  const email = profile.email;
  const rank = profile.rank || 'Đồng';
  const referralCode = profile.referralCode || '6D544T';

  return (
    <div className="w-full bg-gray-50 min-h-screen py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Main Header Card */}
        <div className="bg-white border border-gray-200 rounded-2xl p-6 sm:p-8 shadow-sm flex flex-col sm:flex-row justify-between items-center gap-6">
          <div className="flex flex-col sm:flex-row items-center gap-5 text-center sm:text-left">
            {/* Avatar Circle */}
            <div className="w-20 h-20 rounded-full bg-primary flex items-center justify-center text-white text-3xl font-bold shadow-sm shadow-primary/20">
              {fullName.charAt(0).toUpperCase()}
            </div>

            <div className="space-y-2">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 font-display-lg">
                {fullName}
              </h1>
              <p className="text-sm text-gray-500 font-medium">{email}</p>
              {/* Badges */}
              <div className="flex flex-wrap gap-2 pt-1 justify-center sm:justify-start">
                <span className="bg-primary/10 text-primary text-[11px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                  Khách hàng
                </span>
                <span className="bg-secondary/15 text-secondary text-[11px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                  Hạng {rank}
                </span>
                <span className="bg-gray-100 text-gray-600 text-[11px] font-semibold px-3 py-1 rounded-full">
                  Mã giới thiệu: {referralCode}
                </span>
              </div>
            </div>
          </div>

          <button className="bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 font-bold px-6 py-2.5 rounded-lg text-sm shadow-sm transition-colors">
            Chỉnh sửa
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-x-auto flex scrollbar-thin">
          <button onClick={() => setTabs('info')} className={tabClass('info')}>
            Thông tin
          </button>
          <button onClick={() => setTabs('orders')} className={tabClass('orders')}>
            Đơn hàng
          </button>
          <button onClick={() => setTabs('assets')} className={tabClass('assets')}>
            Tài sản
          </button>
          <button onClick={() => setTabs('address')} className={tabClass('address')}>
            Địa chỉ
          </button>
          <button onClick={() => setTabs('pin')} className={tabClass('pin')}>
            Mã PIN
          </button>
          <button onClick={() => setTabs('kyc')} className={tabClass('kyc')}>
            Căn cước
          </button>
          <button onClick={() => setTabs('referral')} className={tabClass('referral')}>
            Giới thiệu
          </button>
        </div>

        {/* Tab Contents */}
        <div className="bg-white border border-gray-200 rounded-2xl p-6 sm:p-8 shadow-sm">
          {tabs === 'info' && (
            <div className="space-y-6">
              <h3 className="text-lg font-bold text-gray-900">Thông tin cá nhân</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                <div className="space-y-1">
                  <span className="text-xs text-gray-400 font-bold uppercase tracking-wider">Họ và tên</span>
                  <p className="text-sm font-semibold text-gray-800">{fullName}</p>
                </div>
                <div className="space-y-1">
                  <span className="text-xs text-gray-400 font-bold uppercase tracking-wider">Địa chỉ Email</span>
                  <p className="text-sm font-semibold text-gray-800">{email}</p>
                </div>
                <div className="space-y-1">
                  <span className="text-xs text-gray-400 font-bold uppercase tracking-wider">Xác minh danh tính (KYC)</span>
                  <div className="text-sm font-semibold text-emerald-600 flex items-center gap-1 mt-0.5">
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                    <span>{profile.verified ? 'Đã xác minh' : 'Hoạt động'}</span>
                  </div>
                </div>
                {business && (
                  <div className="space-y-1">
                    <span className="text-xs text-gray-400 font-bold uppercase tracking-wider">Số điện thoại liên kết</span>
                    <p className="text-sm font-semibold text-gray-800">{business.phone || 'Chưa liên kết'}</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {tabs === 'orders' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-bold text-gray-900">Lịch sử đơn hàng</h3>
                <p className="text-xs text-gray-400 font-medium">Theo dõi và quản lý các đơn mua sâm Ngọc Linh và gói chăm sóc</p>
              </div>
              <div className="bg-gray-50 border border-gray-200 border-dashed rounded-xl p-8 text-center space-y-3">
                <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center text-gray-400 mx-auto">
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                  </svg>
                </div>
                <p className="text-sm text-gray-500">Bạn chưa thực hiện đơn hàng nào.</p>
                <a href="/#shop" className="inline-block bg-primary text-white hover:bg-primary-hover px-5 py-2 rounded-lg text-xs font-bold transition-colors shadow-sm">
                  Ghé Cửa hàng ngay
                </a>
              </div>
            </div>
          )}

          {tabs === 'assets' && (
            <div className="space-y-8">
              <div>
                <h3 className="text-lg font-bold text-gray-900">Tài sản của tôi</h3>
                <p className="text-xs text-gray-400 font-medium">Quản lý số dư Điểm Sâm và chi tiết cây sâm sở hữu</p>
              </div>

              {/* Stats sub-cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-secondary/5 border border-secondary/15 rounded-xl p-5 flex flex-col justify-between">
                  <span className="text-xs font-bold text-secondary uppercase tracking-wider">Ví Điểm Số</span>
                  <h4 className="text-3xl font-black text-secondary mt-2">
                    {wallet?.balancePoint?.toLocaleString('vi-VN') || 0}
                  </h4>
                  <p className="text-[10px] text-gray-500 mt-1">Điểm khả dụng (Điểm Sâm)</p>
                </div>
                <div className="bg-primary/5 border border-primary/15 rounded-xl p-5 flex flex-col justify-between">
                  <span className="text-xs font-bold text-primary uppercase tracking-wider">Cây giống sở hữu</span>
                  <h4 className="text-3xl font-black text-primary mt-2">
                    {wallet?.treesOwned || 0} Cây
                  </h4>
                  <p className="text-[10px] text-gray-500 mt-1">Cây giống kỹ thuật số trên hệ thống</p>
                </div>
              </div>

              {/* Trees owned list */}
              <div className="space-y-4">
                <h4 className="font-bold text-gray-900 text-sm">Danh sách cây giống chi tiết</h4>
                {!trees || trees.length === 0 ? (
                  <p className="text-sm text-gray-500">Bạn chưa sở hữu cây sâm Ngọc Linh nào.</p>
                ) : (
                  <div className="border border-gray-150 rounded-xl divide-y divide-gray-100 overflow-hidden bg-gray-50/30">
                    {trees.map((tree: any, idx: number) => (
                      <div key={idx} className="px-5 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors">
                        <div className="flex items-center gap-3">
                          <div className="h-9 w-9 bg-primary/10 text-primary rounded-lg flex items-center justify-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M12 19V9m0 0a4 4 0 10-8 0m8 0a4 4 0 118 0M7 21h10" />
                            </svg>
                          </div>
                          <div>
                            <p className="font-bold text-gray-800 text-sm">Cây Sâm Ngọc Linh {tree.ageYear} Năm Tuổi</p>
                            <p className="text-[10px] text-gray-400">Sâm giống chuẩn DNA</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-gray-800 text-sm">{tree.count} Cây</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {tabs === 'address' && (
            <div className="space-y-6">
              <h3 className="text-lg font-bold text-gray-900">Sổ địa chỉ</h3>
              <p className="text-sm text-gray-500">Chưa có địa chỉ giao hàng nào được lưu. Bạn có thể thêm địa chỉ mới khi thanh toán đơn hàng.</p>
            </div>
          )}

          {tabs === 'pin' && (
            <div className="space-y-6">
              <h3 className="text-lg font-bold text-gray-900">Mã PIN bảo mật</h3>
              <p className="text-sm text-gray-500">Mã PIN dùng để xác thực các giao dịch rút điểm số và mua sản phẩm.</p>
              <button className="bg-primary text-white hover:bg-primary-hover px-6 py-2.5 rounded-lg font-bold text-sm transition-colors shadow-sm">
                Thiết lập mã PIN
              </button>
            </div>
          )}

          {tabs === 'kyc' && (
            <div className="space-y-8">
              <div>
                <h3 className="text-lg font-bold text-gray-900">Căn cước công dân (KYC)</h3>
                <p className="text-xs text-gray-400 font-medium">Quản lý trạng thái xác minh thông tin cá nhân</p>
              </div>

              {profile.verified ? (
                <div className="bg-emerald-50/50 border border-emerald-200 text-emerald-800 p-5 rounded-xl space-y-3">
                  <div className="flex items-center gap-2 font-bold text-sm">
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Tài khoản đã được xác minh thành công!
                  </div>
                  <p className="text-xs text-emerald-700 leading-relaxed font-medium">
                    Thông tin căn cước công dân (CCCD) của bạn đã được đối soát chính xác trên hệ thống. Bạn đã đủ điều kiện nhận các quyền lợi và chương trình khuyến mãi đặc biệt.
                  </p>
                </div>
              ) : (
                <div className="bg-white border border-gray-200 rounded-2xl p-6 sm:p-8 space-y-6 shadow-sm">
                  {/* Warning banner */}
                  <div className="bg-amber-50/50 border border-amber-200 text-amber-900 p-5 rounded-xl space-y-2 flex gap-3">
                    <div className="text-amber-600 flex-shrink-0">
                      <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                      </svg>
                    </div>
                    <div className="space-y-1">
                      <h4 className="font-bold text-sm">Xác thực danh tính</h4>
                      <p className="text-xs text-amber-700 font-medium">Để tham gia giao dịch, bạn cần xác thực danh tính bằng giấy tờ tùy thân</p>
                    </div>
                  </div>

                  {/* Form fields grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-sm">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Loại giấy tờ</label>
                      <select className="w-full border border-gray-300 rounded-lg px-3 py-2.5 bg-white focus:outline-none focus:border-primary text-gray-700">
                        <option>Chọn loại giấy tờ</option>
                        <option>Căn cước công dân (CCCD)</option>
                        <option>Chứng minh nhân dân (CMND)</option>
                        <option>Hộ chiếu (Passport)</option>
                      </select>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Số định danh</label>
                      <input
                        type="text"
                        placeholder="Nhập số CMND/CCCD/Hộ chiếu"
                        className="w-full border border-gray-300 rounded-lg px-3 py-2.5 bg-white focus:outline-none focus:border-primary font-medium"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Họ và tên</label>
                      <input
                        type="text"
                        placeholder="Nguyễn Văn A"
                        className="w-full border border-gray-300 rounded-lg px-3 py-2.5 bg-white focus:outline-none focus:border-primary font-medium"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Ngày sinh</label>
                      <input
                        type="date"
                        className="w-full border border-gray-300 rounded-lg px-3 py-2.5 bg-white focus:outline-none focus:border-primary text-gray-700 font-medium"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Giới tính</label>
                      <input
                        type="text"
                        placeholder="Nam/Nữ"
                        className="w-full border border-gray-300 rounded-lg px-3 py-2.5 bg-white focus:outline-none focus:border-primary font-medium"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Nơi cấp</label>
                      <input
                        type="text"
                        placeholder="Cục CSQLHC về TTXH"
                        className="w-full border border-gray-300 rounded-lg px-3 py-2.5 bg-white focus:outline-none focus:border-primary font-medium"
                      />
                    </div>

                    <div className="space-y-1.5 md:col-span-2">
                      <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Địa chỉ thường trú</label>
                      <input
                        type="text"
                        placeholder="Nhập địa chỉ trên giấy tờ"
                        className="w-full border border-gray-300 rounded-lg px-3 py-2.5 bg-white focus:outline-none focus:border-primary font-medium"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Ngày cấp</label>
                      <input
                        type="date"
                        className="w-full border border-gray-300 rounded-lg px-3 py-2.5 bg-white focus:outline-none focus:border-primary text-gray-700 font-medium"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Ngày hết hạn</label>
                      <input
                        type="date"
                        className="w-full border border-gray-300 rounded-lg px-3 py-2.5 bg-white focus:outline-none focus:border-primary text-gray-700 font-medium"
                      />
                    </div>
                  </div>

                  <div className="bg-amber-50/30 border border-amber-100 rounded-xl p-4 text-[11px] text-amber-800 leading-relaxed font-medium">
                    Khách hàng chịu trách nhiệm về tính chính xác của thông tin và ảnh giấy tờ đã tải lên. Rượu Sâm Ngọc Linh không chịu trách nhiệm đối với sai sót, giả mạo hoặc thông tin không chính xác do khách hàng cung cấp.
                  </div>

                  <label className="flex items-start gap-2.5 text-xs text-gray-600 font-semibold cursor-pointer select-none">
                    <input
                      type="checkbox"
                      className="rounded border-gray-300 text-primary focus:ring-primary w-4 h-4 mt-0.5"
                    />
                    <span className="leading-relaxed">
                      Tôi xác nhận thông tin giấy tờ là chính xác và đồng ý với điều khoản trách nhiệm, miễn trừ trách nhiệm nếu sai sót phát sinh từ phía khách hàng.
                    </span>
                  </label>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2">
                    <div className="space-y-2">
                      <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Ảnh mặt trước</span>
                      <div className="border-2 border-dashed border-gray-200 rounded-xl p-6 flex flex-col items-center justify-center gap-2 hover:border-primary cursor-pointer transition-colors bg-gray-50/50">
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                        </svg>
                        <span className="text-xs text-gray-500 font-bold">Tải ảnh lên</span>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Ảnh mặt sau</span>
                      <div className="border-2 border-dashed border-gray-200 rounded-xl p-6 flex flex-col items-center justify-center gap-2 hover:border-primary cursor-pointer transition-colors bg-gray-50/50">
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                        </svg>
                        <span className="text-xs text-gray-500 font-bold">Tải ảnh lên</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-4 pt-4 border-t border-gray-100">
                    <button className="flex-grow sm:flex-none bg-[#1C3F24] hover:bg-emerald-800 text-white font-bold px-8 py-3 rounded-xl text-xs transition-colors shadow-md shadow-primary/10">
                      Gửi xác thực
                    </button>
                    <button className="bg-gray-100 hover:bg-gray-200 text-gray-700 border border-gray-200 font-bold px-8 py-3 rounded-xl text-xs transition-colors">
                      Hủy
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {tabs === 'referral' && (
            <div className="space-y-8">
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-bold text-gray-900">Điều kiện lên cấp</h3>
                  <p className="text-xs text-gray-400 font-medium">Theo dõi tiến trình và điều kiện để lên hạng cao hơn</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-amber-50/50 border border-amber-200/60 rounded-xl p-5 space-y-2">
                    <span className="text-xs font-semibold text-amber-600 uppercase tracking-wider">Hạng hiện tại</span>
                    <h4 className="text-2xl font-black text-amber-800">{rank}</h4>
                    <p className="text-xs text-amber-700 font-medium">Cấp 1</p>
                  </div>
                  <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 space-y-2">
                    <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Hạng tiếp theo</span>
                    <h4 className="text-2xl font-black text-slate-800">Bạc</h4>
                    <p className="text-xs text-slate-500 font-medium">Cấp 2</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
