import { setRequestLocale } from 'next-intl/server';
import { fetchApi } from '@/libs/Api';
import Link from 'next/link';

async function getDashboardData() {
  try {
    // 1. Profile
    const profileRes = await fetchApi('/user/profile/me');
    if (!profileRes.ok) return null;
    const profile = await profileRes.json();

    // 2. Wallet Summary
    const walletRes = await fetchApi('/user/wallet/summary');
    const wallet = walletRes.ok ? await walletRes.json() : null;

    // 3. Cultivation Trees
    const treesRes = await fetchApi('/user/cultivation/trees');
    const trees = treesRes.ok ? await treesRes.json() : null;

    return {
      profile: profile.data,
      wallet: wallet?.data || { balancePoint: 0, treesOwned: 0, transactions: 0 },
      trees: trees?.data || [],
    };
  } catch (e) {
    console.error('Error loading user dashboard data:', e);
    return null;
  }
}

export default async function DashboardPage(props: { params: Promise<{ locale: string }> }) {
  const { locale } = await props.params;
  setRequestLocale(locale);

  const data = await getDashboardData();

  if (!data) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center space-y-4">
        <span className="text-4xl">⚠️</span>
        <h2 className="text-xl font-bold text-gray-800">Không thể tải dữ liệu tài khoản</h2>
        <p className="text-gray-500 text-sm max-w-sm">
          Đã xảy ra lỗi kết nối với máy chủ API. Vui lòng kiểm tra lại dịch vụ NestJS.
        </p>
        <button
          onClick={async () => {
            'use server';
            // Simple revalidate trigger
          }}
          className="bg-primary hover:bg-primary-hover text-white px-4 py-2 rounded-lg text-sm transition-colors"
        >
          Thử lại
        </button>
      </div>
    );
  }

  const { profile, wallet, trees } = data;

  return (
    <div className="space-y-8 py-4">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden bg-gradient-to-r from-[#1C3F24] to-[#122B18] text-white rounded-2xl p-8 shadow-lg">
        <div className="absolute right-0 bottom-0 opacity-10 translate-y-6 translate-x-6 select-none text-9xl">
          🌿
        </div>
        <div className="relative z-10 space-y-2">
          <span className="inline-flex items-center gap-1 bg-secondary/20 text-secondary border border-secondary/30 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider">
            💎 Thành viên {profile.rank || 'Mới'}
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Chào mừng quay trở lại, {profile.fullName || 'Nhà đầu tư'}!
          </h1>
          <p className="text-gray-300 text-sm max-w-xl">
            Theo dõi, quản lý vườn sâm Ngọc Linh và thực hiện các giao dịch đầu tư số hóa của bạn một cách tiện lợi.
          </p>
        </div>
      </div>

      {/* Stats Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Wallet Balance Card */}
        <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Ví Điểm Số</span>
            <span className="p-2 bg-secondary/10 text-secondary rounded-lg text-lg">💰</span>
          </div>
          <div className="mt-4 space-y-1">
            <h3 className="text-2xl font-bold text-gray-900">
              {wallet.balancePoint.toLocaleString('vi-VN')}
            </h3>
            <p className="text-xs text-gray-500">Điểm khả dụng (iWE Points)</p>
          </div>
        </div>

        {/* Trees Owned Card */}
        <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Cây Sâm Sở Hữu</span>
            <span className="p-2 bg-primary/10 text-primary rounded-lg text-lg">🌿</span>
          </div>
          <div className="mt-4 space-y-1">
            <h3 className="text-2xl font-bold text-gray-900">
              {wallet.treesOwned}
            </h3>
            <p className="text-xs text-gray-500">Cây giống kỹ thuật số trên hệ thống</p>
          </div>
        </div>

        {/* Transactions Card */}
        <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Số Giao Dịch</span>
            <span className="p-2 bg-indigo-50 text-indigo-600 rounded-lg text-lg">📊</span>
          </div>
          <div className="mt-4 space-y-1">
            <h3 className="text-2xl font-bold text-gray-900">
              {wallet.transactions}
            </h3>
            <p className="text-xs text-gray-500">Giao dịch đã thực hiện trong ví</p>
          </div>
        </div>
      </div>

      {/* Main Content Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: My Trees */}
        <div className="lg:col-span-8 space-y-6">
          <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
            <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-lg text-gray-900">Danh Mục Sâm Ngọc Linh Của Tôi</h3>
                <p className="text-xs text-gray-500">Phân loại cây sâm thật đang trồng tại vườn theo độ tuổi</p>
              </div>
              <span className="text-xs font-semibold bg-gray-50 text-gray-600 border border-gray-200 px-2.5 py-1 rounded-full">
                Thời gian thực
              </span>
            </div>

            {trees.length === 0 ? (
              <div className="p-12 text-center flex flex-col items-center justify-center space-y-3">
                <span className="text-4xl">🌱</span>
                <p className="text-gray-500 text-sm">Bạn chưa sở hữu cây sâm Ngọc Linh nào.</p>
                <Link
                  href="/"
                  className="bg-primary hover:bg-primary-hover text-white text-xs font-semibold px-4 py-2 rounded-lg transition-colors"
                >
                  Ghé Marketplace
                </Link>
              </div>
            ) : (
              <div className="divide-y divide-gray-100">
                {trees.map((tree: any, idx: number) => (
                  <div key={idx} className="px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 bg-primary/5 text-primary rounded-lg flex items-center justify-center text-lg">
                        🌲
                      </div>
                      <div>
                        <p className="font-bold text-gray-900 text-sm">Cây Sâm Ngọc Linh {tree.ageYear} Năm Tuổi</p>
                        <p className="text-xs text-gray-500">Sâm giống tự nhiên chuẩn DNA</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-gray-900 text-base">{tree.count} Cây</p>
                      <p className="text-[10px] text-secondary font-semibold uppercase tracking-wider">Đang chăm sóc</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Profile & Info */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm space-y-6">
            <div>
              <h3 className="font-bold text-lg text-gray-900">Thông Tin Nhà Đầu Tư</h3>
              <p className="text-xs text-gray-500">Thông tin tài khoản khách hàng</p>
            </div>
            
            <div className="space-y-4">
              <div className="flex justify-between items-center py-2 border-b border-gray-50">
                <span className="text-xs text-gray-500 uppercase tracking-wider font-medium">Họ và tên</span>
                <span className="text-sm font-semibold text-gray-900">{profile.fullName}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-gray-50">
                <span className="text-xs text-gray-500 uppercase tracking-wider font-medium">Email</span>
                <span className="text-sm font-semibold text-gray-900">{profile.email}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-gray-50">
                <span className="text-xs text-gray-500 uppercase tracking-wider font-medium">Mã giới thiệu</span>
                <span className="text-sm font-semibold text-primary">{profile.referralCode || 'Không có'}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-gray-50">
                <span className="text-xs text-gray-500 uppercase tracking-wider font-medium">Trạng thái KYC</span>
                <span className="inline-flex items-center gap-1 text-xs font-semibold text-secondary bg-secondary/10 px-2.5 py-0.5 rounded-full">
                  ✓ Đã liên kết
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
