import { setRequestLocale } from 'next-intl/server';
import { fetchApi } from '@/libs/Api';

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

export default async function UserProfilePage(props: { params: Promise<{ locale: string }> }) {
  const { locale } = await props.params;
  setRequestLocale(locale);

  const data = await getProfileData();

  if (!data || !data.profile) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center space-y-4">
        <span className="text-4xl">⚠️</span>
        <h2 className="text-xl font-bold text-gray-800">Không thể tải thông tin cá nhân</h2>
        <p className="text-gray-500 text-sm">Vui lòng thử lại sau.</p>
      </div>
    );
  }

  const { profile, business } = data;

  return (
    <div className="max-w-3xl mx-auto py-6 space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Hồ Sơ Nhà Đầu Tư</h1>
        <p className="text-sm text-gray-500">Quản lý và xem chi tiết thông tin cá nhân của bạn</p>
      </div>

      <div className="bg-white border border-gray-200 rounded-2xl shadow-sm divide-y divide-gray-100">
        {/* Basic Section */}
        <div className="p-6 space-y-4">
          <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider">Thông Tin Cơ Bản</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-1">
              <span className="text-xs text-gray-400 font-medium uppercase tracking-wider">Họ và tên</span>
              <p className="text-sm font-semibold text-gray-900">{profile.fullName || 'Chưa cập nhật'}</p>
            </div>
            <div className="space-y-1">
              <span className="text-xs text-gray-400 font-medium uppercase tracking-wider">Địa chỉ Email</span>
              <p className="text-sm font-semibold text-gray-900">{profile.email}</p>
            </div>
          </div>
        </div>

        {/* Business/Investor Section */}
        <div className="p-6 space-y-4">
          <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider">Thông Tin Đầu Tư</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-1">
              <span className="text-xs text-gray-400 font-medium uppercase tracking-wider">Cấp bậc thành viên</span>
              <p className="text-sm font-semibold text-primary">{profile.rank || 'Mới tham gia'}</p>
            </div>
            <div className="space-y-1">
              <span className="text-xs text-gray-400 font-medium uppercase tracking-wider">Mã giới thiệu</span>
              <p className="text-sm font-semibold text-gray-900">{profile.referralCode || 'Không có'}</p>
            </div>
            <div className="space-y-1">
              <span className="text-xs text-gray-400 font-medium uppercase tracking-wider">Xác minh tài khoản (KYC)</span>
              <p className="text-sm font-semibold text-secondary">
                {profile.verified ? '✓ Đã xác minh' : '✓ Hoạt động'}
              </p>
            </div>
            {business && (
              <div className="space-y-1">
                <span className="text-xs text-gray-400 font-medium uppercase tracking-wider">Số điện thoại liên kết</span>
                <p className="text-sm font-semibold text-gray-900">{business.phone || 'Chưa liên kết'}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
