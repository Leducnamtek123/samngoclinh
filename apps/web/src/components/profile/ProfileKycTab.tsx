import Image from 'next/image';
import { CheckCircle2, Clock, AlertTriangle, Camera } from 'lucide-react';
import { ButtonLoading } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

type ProfileKycTabProps = {
  profile: any;
  kycStatusData: any;
  kycErrorMsg: string;
  kycFullName?: string;
  setKycFullName?: (val: string) => void;
  kycIdentityNumber?: string;
  setKycIdentityNumber?: (val: string) => void;
  frontImagePreview: string;
  setFrontImagePreview: (val: string) => void;
  backImagePreview: string;
  setBackImagePreview: (val: string) => void;
  setFrontFile: (file: File | null) => void;
  setBackFile: (file: File | null) => void;
  submitKycMutation: any;
  onSubmit: (e: React.FormEvent) => void;
};

export const ProfileKycTab = ({
  profile,
  kycStatusData,
  kycErrorMsg,
  frontImagePreview,
  setFrontImagePreview,
  backImagePreview,
  setBackImagePreview,
  setFrontFile,
  setBackFile,
  submitKycMutation,
  onSubmit,
}: ProfileKycTabProps) => {
  const actualKycData = kycStatusData?.data || kycStatusData;
  const existingFront = actualKycData?.frontImageUrl || actualKycData?.front || frontImagePreview;
  const existingBack = actualKycData?.backImageUrl || actualKycData?.back || backImagePreview;
  const isVerified = !!(profile?.isVerified || profile?.verified || actualKycData?.status === 'VERIFIED' || actualKycData?.status === 'APPROVED');
  const isPending = !isVerified && !!(actualKycData?.status === 'PENDING' || actualKycData?.frontImageUrl || actualKycData?.front || actualKycData?.id);

  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">Căn cước công dân (KYC)</h3>
        <p className="text-xs text-gray-400 font-medium">Quản lý trạng thái xác minh thông tin cá nhân và tài khoản</p>
      </div>

      {isVerified ? (
        <Card className="bg-emerald-50/70 border-emerald-200 text-emerald-800 p-6">
          <CardContent className="p-0 space-y-3">
            <div className="flex items-center gap-2.5 font-bold text-base">
              <CheckCircle2 className="w-6 h-6 text-emerald-600" />
              Tài khoản đã được xác minh chính thức (eKYC Verified)
            </div>
            <p className="text-xs text-emerald-700 leading-relaxed font-medium">
              Thông tin căn cước công dân (CCCD/CMND) của bạn đã được đối soát hợp lệ trên hệ thống. Bạn hiện có đầy đủ quyền lợi giao dịch trên hệ thống.
            </p>
          </CardContent>
        </Card>
      ) : isPending ? (
        <Card className="bg-amber-50/70 border-amber-200 text-amber-900 p-6">
          <CardContent className="p-0 space-y-4">
            <div className="flex items-center gap-2.5 font-bold text-base">
              <Clock className="w-6 h-6 text-amber-600 animate-pulse" />
              Hồ sơ đã được lưu thành công – Đang chờ duyệt eKYC
            </div>
            <p className="text-xs text-amber-800 leading-relaxed font-medium">
              Hồ sơ eKYC của bạn đã được tải lên hệ thống và đang chờ quản trị viên đối soát phê duyệt.
            </p>
            {existingFront && existingBack && (
              <div className="grid grid-cols-2 gap-4 pt-2 border-t border-amber-200/60">
                <div>
                  <span className="text-[11px] font-bold text-amber-800 block mb-1">Mặt trước CCCD</span>
                  <Image src={existingFront} alt="Mặt trước" width={200} height={144} unoptimized className="max-h-28 object-contain rounded-lg border border-amber-200 bg-white" />
                </div>
                <div>
                  <span className="text-[11px] font-bold text-amber-800 block mb-1">Mặt sau CCCD</span>
                  <Image src={existingBack} alt="Mặt sau" width={200} height={144} unoptimized className="max-h-28 object-contain rounded-lg border border-amber-200 bg-white" />
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      ) : (
        <form onSubmit={onSubmit} className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-6 sm:p-8 space-y-6 shadow-xs">
          {kycStatusData?.status === 'REJECTED' && (
            <div className="bg-red-50 border border-red-200 text-red-800 p-4 rounded-xl text-xs font-bold space-y-1">
              <p className="font-extrabold text-sm">Hồ sơ xác minh bị từ chối</p>
              <p className="font-normal text-red-700">{kycStatusData?.rejectReason || 'Thông tin ảnh chụp chưa đủ rõ nét hoặc thông tin không khớp. Vui lòng nộp lại.'}</p>
            </div>
          )}

          <div className="bg-amber-50/50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900 text-amber-900 dark:text-amber-200 p-5 rounded-xl space-y-2 flex gap-3">
            <div className="text-amber-600 flex-shrink-0">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <h4 className="font-bold text-sm">Xác thực danh tính chủ tài khoản</h4>
              <p className="text-xs text-amber-700 dark:text-amber-300 font-medium">Để tham gia giao dịch & đảm bảo tính pháp lý hợp đồng, bạn cần xác thực CCCD/CMND chính chủ.</p>
            </div>
          </div>

          {kycErrorMsg && kycErrorMsg !== 'Not Found' && (
            <div className="bg-red-50 border border-red-200 text-red-700 text-xs p-3.5 rounded-xl font-bold">
              {kycErrorMsg}
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2">
            <div className="space-y-2">
              <span className="text-xs font-bold text-gray-500 uppercase tracking-wider block">Ảnh mặt trước CMND/CCCD *</span>
              <label className="border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-xl p-6 flex flex-col items-center justify-center gap-2 hover:border-emerald-600 cursor-pointer transition-colors bg-gray-50/50 dark:bg-gray-800/50 min-h-[140px]">
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      setFrontFile(file);
                      const reader = new FileReader();
                      reader.onload = (ev) => setFrontImagePreview(ev.target?.result as string);
                      reader.readAsDataURL(file);
                    }
                  }}
                />
                {existingFront ? (
                  <Image src={existingFront} alt="Mặt trước" width={200} height={144} unoptimized className="max-h-36 object-contain rounded-lg shadow-xs" />
                ) : (
                  <span className="text-xs text-gray-500 font-bold flex items-center gap-1.5">
                    <Camera className="w-4 h-4 text-gray-400" />
                    Tải ảnh mặt trước lên
                  </span>
                )}
              </label>
            </div>

            <div className="space-y-2">
              <span className="text-xs font-bold text-gray-500 uppercase tracking-wider block">Ảnh mặt sau CMND/CCCD *</span>
              <label className="border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-xl p-6 flex flex-col items-center justify-center gap-2 hover:border-emerald-600 cursor-pointer transition-colors bg-gray-50/50 dark:bg-gray-800/50 min-h-[140px]">
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      setBackFile(file);
                      const reader = new FileReader();
                      reader.onload = (ev) => setBackImagePreview(ev.target?.result as string);
                      reader.readAsDataURL(file);
                    }
                  }}
                />
                {existingBack ? (
                  <Image src={existingBack} alt="Mặt sau" width={200} height={144} unoptimized className="max-h-36 object-contain rounded-lg shadow-xs" />
                ) : (
                  <span className="text-xs text-gray-500 font-bold flex items-center gap-1.5">
                    <Camera className="w-4 h-4 text-gray-400" />
                    Tải ảnh mặt sau lên
                  </span>
                )}
              </label>
            </div>
          </div>

          <div className="flex gap-4 pt-4 border-t border-gray-100 dark:border-gray-800">
            <ButtonLoading
              type="submit"
              isLoading={submitKycMutation.isPending}
              variant="default"
              className="w-full sm:w-auto px-8"
            >
              {submitKycMutation.isPending ? 'Đang gửi hồ sơ API...' : 'Gửi xác thực eKYC'}
            </ButtonLoading>
          </div>
        </form>
      )}
    </div>
  );
};
