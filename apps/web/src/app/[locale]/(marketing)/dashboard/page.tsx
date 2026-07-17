import { setRequestLocale } from 'next-intl/server';
import { fetchApi } from '@/libs/Api';
import { Link } from '@/libs/I18nNavigation';

async function getDashboardData() {
  const errors: string[] = [];
  let profile = null;
  let wallet = null;
  let trees = null;

  try {
    // 1. Profile
    const profileRes = await fetchApi('/user/profile/me');
    if (!profileRes.ok) {
      const body = await profileRes.json().catch(() => ({}));
      errors.push(`Profile endpoint (/user/profile/me) returned status ${profileRes.status}: ${JSON.stringify(body)}`);
    } else {
      const payload = await profileRes.json();
      profile = payload.data;
    }

    // 2. Wallet Summary
    const walletRes = await fetchApi('/user/wallet/summary');
    if (!walletRes.ok) {
      const body = await walletRes.json().catch(() => ({}));
      errors.push(`Wallet endpoint (/user/wallet/summary) returned status ${walletRes.status}: ${JSON.stringify(body)}`);
    } else {
      const payload = await walletRes.json();
      wallet = payload.data;
    }

    // 3. Cultivation Trees
    const treesRes = await fetchApi('/user/cultivation/trees');
    if (!treesRes.ok) {
      const body = await treesRes.json().catch(() => ({}));
      errors.push(`Trees endpoint (/user/cultivation/trees) returned status ${treesRes.status}: ${JSON.stringify(body)}`);
    } else {
      const payload = await treesRes.json();
      trees = payload.data;
    }
  } catch (e: any) {
    errors.push(`Fetch exception: ${e.message}`);
  }

  if (errors.length > 0) {
    return { errorDetails: errors };
  }

  return { profile, wallet, trees };
}

export default async function DashboardPage(props: { params: Promise<{ locale: string }> }) {
  const { locale } = await props.params;
  setRequestLocale(locale);

  const data = await getDashboardData();

  if (!data || data.errorDetails) {
    return (
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-12">
        <div className="flex flex-col items-center justify-center py-16 text-center space-y-4 bg-white border border-gray-200 rounded-2xl p-8 shadow-sm">
          <div className="w-16 h-16 rounded-full bg-amber-50 flex items-center justify-center text-amber-500">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-gray-800">Không thể tải dữ liệu tài khoản</h2>
          <div className="text-left bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-xs font-mono max-w-lg space-y-1 overflow-auto max-h-60">
            {data?.errorDetails?.map((err: string, i: number) => (
              <p key={i}>{err}</p>
            )) || <p>Lỗi kết nối không xác định</p>}
          </div>
          <p className="text-gray-500 text-sm max-w-sm">
            Đã xảy ra lỗi kết nối với máy chủ API. Vui lòng kiểm tra lại dịch vụ NestJS.
          </p>
        </div>
      </div>
    );
  }

  const { profile, wallet, trees } = data;

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 py-10 space-y-8">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden bg-gradient-to-r from-[#1C3F24] to-[#122B18] text-white rounded-2xl p-8 shadow-lg">
        <div className="absolute right-0 bottom-0 opacity-10 translate-y-6 translate-x-6 select-none text-9xl text-white">
          <svg xmlns="http://www.w3.org/2000/svg" className="w-40 h-40" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 19V9m0 0a4 4 0 10-8 0m8 0a4 4 0 118 0M7 21h10" />
          </svg>
        </div>
        <div className="relative z-10 space-y-2">
          <span className="inline-flex items-center gap-1.5 bg-secondary/20 text-secondary border border-secondary/30 px-3 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5 text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
            </svg>
            Thành viên {profile.rank || 'Mới'}
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
            <span className="p-2 bg-secondary/10 rounded-lg">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </span>
          </div>
          <div className="mt-4 space-y-1">
            <h3 className="text-2xl font-bold text-gray-900">
              {wallet.balancePoint.toLocaleString('vi-VN')}
            </h3>
            <p className="text-xs text-gray-500">Điểm khả dụng (Điểm Sâm)</p>
          </div>
        </div>

        {/* Trees Owned Card */}
        <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Cây Sâm Sở Hữu</span>
            <span className="p-2 bg-primary/10 rounded-lg">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 19V9m0 0a4 4 0 10-8 0m8 0a4 4 0 118 0M7 21h10" />
              </svg>
            </span>
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
            <span className="p-2 bg-indigo-50 rounded-lg">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 00-2-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </span>
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
                <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center text-gray-400">
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 19V9m0 0a4 4 0 10-8 0m8 0a4 4 0 118 0M7 21h10" />
                  </svg>
                </div>
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
                      <div className="h-10 w-10 bg-primary/5 text-primary rounded-lg flex items-center justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M12 19V9m0 0a4 4 0 10-8 0m8 0a4 4 0 118 0M7 21h10" />
                        </svg>
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
                <span className="text-xs font-bold bg-emerald-50 text-emerald-600 border border-emerald-200 px-2.5 py-1 rounded-full flex items-center gap-1 mt-0.5">
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                  Đã liên kết
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
