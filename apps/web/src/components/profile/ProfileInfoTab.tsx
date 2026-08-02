type ProfileInfoTabProps = {
  fullName: string;
  email: string;
  rank: string;
  referralCode: string;
  profile: any;
  business: any;
  editPhone: string;
  onEditClick: () => void;
  onCopyText: (text: string, label: string) => void;
  onVerifyEmailClick?: () => void;
};

export const ProfileInfoTab = ({
  fullName,
  email,
  rank,
  referralCode,
  profile,
  business,
  editPhone,
  onEditClick,
  onCopyText,
  onVerifyEmailClick,
}: ProfileInfoTabProps) => {
  const isEmailVerified = !!(profile?.isEmailVerified || profile?.emailVerified);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center border-b border-gray-100 pb-4">
        <div>
          <h3 className="text-xl font-extrabold text-gray-900 font-display-lg">Thông tin cá nhân</h3>
          <p className="text-xs text-gray-400 font-medium">Quản lý hồ sơ và chi tiết tài khoản của bạn</p>
        </div>
        <button
          type="button"
          onClick={onEditClick}
          className="bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 font-bold px-4 py-2 rounded-lg text-xs shadow-sm transition-colors cursor-pointer"
        >
          Chỉnh sửa
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
        <div className="space-y-1">
          <span className="text-xs text-gray-400 font-bold uppercase tracking-wider">Họ và tên</span>
          <p className="text-sm font-semibold text-gray-800">{fullName}</p>
        </div>
        <div className="space-y-1">
          <span className="text-xs text-gray-400 font-bold uppercase tracking-wider">Địa chỉ Email</span>
          <div className="flex items-center gap-2">
            <p className="text-sm font-semibold text-gray-800">{email}</p>
            {isEmailVerified ? (
              <span className="bg-emerald-100 text-emerald-700 text-[10px] font-bold px-2 py-0.5 rounded-full inline-flex items-center gap-1">
                ✓ Đã xác thực
              </span>
            ) : (
              <button
                type="button"
                onClick={onVerifyEmailClick}
                className="bg-amber-100 hover:bg-amber-200 text-amber-800 text-[10px] font-bold px-2 py-0.5 rounded-full transition-colors cursor-pointer"
              >
                Xác thực ngay
              </button>
            )}
          </div>
        </div>
        <div className="space-y-1">
          <span className="text-xs text-gray-400 font-bold uppercase tracking-wider">Hạng tài khoản</span>
          <p className="text-sm font-semibold text-secondary">Hạng {rank}</p>
        </div>
        <div className="space-y-1">
          <span className="text-xs text-gray-400 font-bold uppercase tracking-wider">Mã giới thiệu</span>
          <button
            type="button"
            onClick={() => onCopyText(referralCode, 'Mã giới thiệu')}
            className="text-xs font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 px-3 py-1 rounded-full transition-colors inline-flex items-center gap-1.5 mt-0.5 cursor-pointer"
          >
            <span>{referralCode}</span>
            <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
          </button>
        </div>
        <div className="space-y-1">
          <span className="text-xs text-gray-400 font-bold uppercase tracking-wider">Xác minh danh tính (KYC)</span>
          <div className="text-sm font-semibold text-emerald-600 flex items-center gap-1 mt-0.5">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
            <span>{profile?.verified ? 'Đã xác minh' : 'Hoạt động'}</span>
          </div>
        </div>
        <div className="space-y-1">
          <span className="text-xs text-gray-400 font-bold uppercase tracking-wider">Số điện thoại liên kết</span>
          <p className="text-sm font-semibold text-gray-800">{business?.phone || editPhone || 'Chưa liên kết'}</p>
        </div>
      </div>
    </div>
  );
};

