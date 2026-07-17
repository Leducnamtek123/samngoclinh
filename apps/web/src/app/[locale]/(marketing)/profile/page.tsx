import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
import { fetchApi } from '@/libs/Api';
import { Link } from '@/libs/I18nNavigation';

type ProfilePageProps = {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ tabs?: string }>;
};

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'Hồ Sơ Cá Nhân | Rượu Sâm Ngọc Linh',
    description: 'Quản lý thông tin tài khoản, ví điểm và tài sản của bạn.',
  };
}

async function getProfileData() {
  try {
    const profileRes = await fetchApi('/user/profile/me');
    const businessRes = await fetchApi('/user/profile/business');

    const profile = profileRes.ok ? await profileRes.json() : null;
    const business = businessRes.ok ? await businessRes.json() : null;

    return {
      profile: profile?.data,
      business: business?.data,
    };
  } catch (e) {
    console.error('Error fetching profile data:', e);
    return null;
  }
}

export default async function ProfilePage(props: ProfilePageProps) {
  const { locale } = await props.params;
  setRequestLocale(locale);

  const { tabs = 'info' } = await props.searchParams;
  const data = await getProfileData();

  if (!data || !data.profile) {
    return (
      <div className="max-w-4xl mx-auto py-16 px-4 text-center space-y-4 flex flex-col items-center">
        <div className="w-16 h-16 rounded-full bg-amber-50 flex items-center justify-center text-amber-500">
          <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-gray-800">Không thể tải thông tin hồ sơ</h2>
        <p className="text-gray-500">Vui lòng kiểm tra lại kết nối hoặc đăng nhập lại.</p>
        <Link href="/sign-in" className="inline-block bg-primary text-white px-6 py-2.5 rounded-lg font-bold">
          Đăng nhập
        </Link>
      </div>
    );
  }

  const { profile, business } = data;
  const fullName = profile.fullName || 'Nhà đầu tư';
  const email = profile.email;
  const rank = profile.rank || 'Đồng';
  const referralCode = profile.referralCode || '6D544T';

  // Active tab state styling helper
  const tabClass = (current: string) =>
    `flex-1 py-3.5 text-center font-bold text-sm border-b-2 transition-all ${
      tabs === current
        ? 'border-secondary text-secondary'
        : 'border-transparent text-gray-500 hover:text-gray-800'
    }`;

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
              <p className="text-sm text-gray-500 font-medium">
                {email}
              </p>
              {/* Badges */}
              <div className="flex flex-wrap gap-2 pt-1 justify-center sm:justify-start">
                <span className="bg-primary/10 text-primary text-[11px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                  Khách hàng
                </span>
                <span className="bg-secondary/15 text-secondary text-[11px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                  Hạng {rank}
                </span>
                <span className="bg-gray-150 text-gray-600 text-[11px] font-semibold px-3 py-1 rounded-full">
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
        <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden flex">
          <Link href="/profile?tabs=info" className={tabClass('info')}>
            Thông tin
          </Link>
          <Link href="/profile?tabs=address" className={tabClass('address')}>
            Địa chỉ
          </Link>
          <Link href="/profile?tabs=pin" className={tabClass('pin')}>
            Mã PIN
          </Link>
          <Link href="/profile?tabs=referral" className={tabClass('referral')}>
            Giới thiệu
          </Link>
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

          {tabs === 'referral' && (
            <div className="space-y-8">
              {/* Level Up Requirements */}
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-bold text-gray-900">Điều kiện lên cấp</h3>
                  <p className="text-xs text-gray-400 font-medium">Theo dõi tiến trình và điều kiện để lên hạng cao hơn</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Current Rank Card */}
                  <div className="bg-amber-50/50 border border-amber-200/60 rounded-xl p-5 space-y-2">
                    <span className="text-xs font-semibold text-amber-600 uppercase tracking-wider">Hạng hiện tại</span>
                    <h4 className="text-2xl font-black text-amber-800">{rank}</h4>
                    <p className="text-xs text-amber-700 font-medium">Cấp 1</p>
                  </div>
                  {/* Next Rank Card */}
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
}
