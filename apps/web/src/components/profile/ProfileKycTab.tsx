import Image from 'next/image';

type ProfileKycTabProps = {
  profile: any;
  kycStatusData: any;
  kycErrorMsg: string;
  kycFullName: string;
  setKycFullName: (val: string) => void;
  kycIdentityNumber: string;
  setKycIdentityNumber: (val: string) => void;
  frontImagePreview: string;
  setFrontImagePreview: (val: string) => void;
  backImagePreview: string;
  setBackImagePreview: (val: string) => void;
  submitKycMutation: any;
  onSubmit: (e: React.FormEvent) => void;
};

export const ProfileKycTab = ({
  profile,
  kycStatusData,
  kycErrorMsg,
  kycFullName,
  setKycFullName,
  kycIdentityNumber,
  setKycIdentityNumber,
  frontImagePreview,
  setFrontImagePreview,
  backImagePreview,
  setBackImagePreview,
  submitKycMutation,
  onSubmit,
}: ProfileKycTabProps) => {
  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-lg font-bold text-gray-900">Căn cước công danh (KYC)</h3>
        <p className="text-xs text-gray-400 font-medium">Quản lý trạng thái xác minh thông tin cá nhân và tài khoản</p>
      </div>

      {profile?.verified || kycStatusData?.status === 'VERIFIED' ? (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-6 rounded-2xl space-y-3 shadow-xs">
          <div className="flex items-center gap-2.5 font-bold text-base">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Tài khoản đã được xác minh chính thức (eKYC Verified)
          </div>
          <p className="text-xs text-emerald-700 leading-relaxed font-medium">
            Thông tin căn cước công dân (CCCD/CMND) của bạn đã được đối soát hợp lệ trên hệ thống. Bạn hiện có đầy đủ quyền lợi giao dịch và đăng bán trên Sàn Giao Dịch P2P.
          </p>
        </div>
      ) : kycStatusData?.status === 'PENDING' ? (
        <div className="bg-amber-50 border border-amber-200 text-amber-900 p-6 rounded-2xl space-y-3 shadow-xs">
          <div className="flex items-center gap-2.5 font-bold text-base">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-amber-600 animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Hồ sơ đang chờ xét duyệt
          </div>
          <p className="text-xs text-amber-800 leading-relaxed font-medium">
            Hồ sơ eKYC của bạn đã được gửi thành công. Ban quản trị đang tiến hành kiểm tra thông tin. Kết quả sẽ được cập nhật sớm nhất.
          </p>
        </div>
      ) : (
        <form onSubmit={onSubmit} className="bg-white border border-gray-200 rounded-2xl p-6 sm:p-8 space-y-6 shadow-sm">
          {kycStatusData?.status === 'REJECTED' && (
            <div className="bg-red-50 border border-red-200 text-red-800 p-4 rounded-xl text-xs font-bold space-y-1">
              <p className="font-extrabold text-sm">Hồ sơ xác minh bị từ chối</p>
              <p className="font-normal text-red-700">{kycStatusData?.rejectReason || 'Thông tin ảnh chụp chưa đủ rõ nét hoặc thông tin không khớp. Vui lòng nộp lại.'}</p>
            </div>
          )}

          <div className="bg-amber-50/50 border border-amber-200 text-amber-900 p-5 rounded-xl space-y-2 flex gap-3">
            <div className="text-amber-600 flex-shrink-0">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <div className="space-y-1">
              <h4 className="font-bold text-sm">Xác thực danh tính chủ tài khoản</h4>
              <p className="text-xs text-amber-700 font-medium">Để tham gia giao dịch & đảm bảo tính pháp lý hợp đồng, bạn cần xác thực CCCD/CMND chính chủ.</p>
            </div>
          </div>

          {kycErrorMsg && (
            <div className="bg-red-50 border border-red-200 text-red-700 text-xs p-3.5 rounded-xl font-bold">
              {kycErrorMsg}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-sm">
            <div className="space-y-1.5">
              <label htmlFor="kycFullNameInput" className="text-xs font-bold text-gray-500 uppercase tracking-wider block">Họ và tên trên giấy tờ *</label>
              <input
                id="kycFullNameInput"
                type="text"
                required
                value={kycFullName}
                onChange={(e) => setKycFullName(e.target.value)}
                placeholder="Nhập họ và tên đầy đủ"
                className="w-full border border-gray-300 rounded-lg px-3 py-2.5 font-medium focus:ring-1 focus:ring-[#1C3F24] focus:outline-none"
              />
            </div>

            <div className="space-y-1.5">
              <label htmlFor="kycIdentityNumberInput" className="text-xs font-bold text-gray-500 uppercase tracking-wider block">Số CMND / CCCD *</label>
              <input
                id="kycIdentityNumberInput"
                type="text"
                required
                value={kycIdentityNumber}
                onChange={(e) => setKycIdentityNumber(e.target.value)}
                placeholder="Nhập số định danh 9 hoặc 12 số"
                className="w-full border border-gray-300 rounded-lg px-3 py-2.5 font-medium focus:ring-1 focus:ring-[#1C3F24] focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2">
            <div className="space-y-2">
              <span className="text-xs font-bold text-gray-500 uppercase tracking-wider block">Ảnh mặt trước CMND/CCCD *</span>
              <label className="border-2 border-dashed border-gray-200 rounded-xl p-6 flex flex-col items-center justify-center gap-2 hover:border-[#1C3F24] cursor-pointer transition-colors bg-gray-50/50 block min-h-[140px]">
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      const reader = new FileReader();
                      reader.onload = (ev) => setFrontImagePreview(ev.target?.result as string);
                      reader.readAsDataURL(file);
                    }
                  }}
                />
                {frontImagePreview ? (
                  <Image src={frontImagePreview} alt="Mặt trước" width={200} height={144} unoptimized className="max-h-36 object-contain rounded-lg shadow-xs" />
                ) : (
                  <span className="text-xs text-gray-500 font-bold flex items-center gap-1.5">
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    Tải ảnh mặt trước lên
                  </span>
                )}
              </label>
            </div>

            <div className="space-y-2">
              <span className="text-xs font-bold text-gray-500 uppercase tracking-wider block">Ảnh mặt sau CMND/CCCD *</span>
              <label className="border-2 border-dashed border-gray-200 rounded-xl p-6 flex flex-col items-center justify-center gap-2 hover:border-[#1C3F24] cursor-pointer transition-colors bg-gray-50/50 block min-h-[140px]">
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      const reader = new FileReader();
                      reader.onload = (ev) => setBackImagePreview(ev.target?.result as string);
                      reader.readAsDataURL(file);
                    }
                  }}
                />
                {backImagePreview ? (
                  <Image src={backImagePreview} alt="Mặt sau" width={200} height={144} unoptimized className="max-h-36 object-contain rounded-lg shadow-xs" />
                ) : (
                  <span className="text-xs text-gray-500 font-bold flex items-center gap-1.5">
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    Tải ảnh mặt sau lên
                  </span>
                )}
              </label>
            </div>
          </div>

          <div className="flex gap-4 pt-4 border-t border-gray-100">
            <button
              type="submit"
              disabled={submitKycMutation.isPending}
              className="flex-grow sm:flex-none bg-[#1C3F24] hover:bg-emerald-900 text-white font-bold px-8 py-3 rounded-xl text-xs transition-colors shadow-md disabled:opacity-50 cursor-pointer"
            >
              {submitKycMutation.isPending ? 'Đang gửi hồ sơ API...' : 'Gửi xác thực eKYC'}
            </button>
          </div>
        </form>
      )}
    </div>
  );
};
