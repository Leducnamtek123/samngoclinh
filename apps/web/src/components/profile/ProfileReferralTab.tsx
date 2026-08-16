import React from 'react';
import { Gift, Copy } from 'lucide-react';
import { Button } from '@/components/ui/button';

type ProfileReferralTabProps = {
  referralCode: string;
  onCopyText: (text: string, label: string) => void;
};

export const ProfileReferralTab: React.FC<ProfileReferralTabProps> = ({
  referralCode,
  onCopyText,
}) => {
  const referralLink = typeof window !== 'undefined'
    ? `${window.location.origin}/sign-up?ref=${referralCode}`
    : `https://samngoclinh.vn/sign-up?ref=${referralCode}`;

  return (
    <div className="space-y-6">
      <div className="border-b border-gray-100 dark:border-gray-800 pb-4">
        <h3 className="text-xl font-extrabold text-gray-900 dark:text-gray-100 flex items-center gap-2">
          <Gift className="w-5 h-5 text-amber-600" />
          <span>Chương Trình Giới Thiệu Bạn Bè</span>
        </h3>
        <p className="text-xs text-gray-400 font-medium mt-0.5">
          Mời bạn bè cùng tham gia nền tảng Sâm Ngọc Linh để nhận thêm Điểm Sâm thưởng và quà tặng cây giống
        </p>
      </div>

      {/* Hero Banner Card */}
      <div className="rounded-3xl p-6 sm:p-8 bg-gradient-to-br from-emerald-900 via-emerald-950 to-slate-950 text-white shadow-xl border border-emerald-500/30 space-y-6">
        <div className="flex items-center gap-2">
          <span className="px-3 py-1 rounded-full bg-amber-400 text-slate-950 text-xs font-black uppercase">
            Thưởng Giới Thiệu
          </span>
          <span className="text-xs text-emerald-300 font-medium">Tích lũy không giới hạn</span>
        </div>

        <div className="space-y-2">
          <h4 className="text-2xl sm:text-3xl font-black text-white font-display-lg">
            Tặng 50.000 Điểm Sâm Cho Mỗi Lượt Giới Thiệu
          </h4>
          <p className="text-xs sm:text-sm text-emerald-200/90 leading-relaxed max-w-xl">
            Khi người được giới thiệu đăng ký và phát sinh đơn hàng đầu tiên, cả 2 bạn đều nhận được điểm thưởng dùng để quy đổi voucher hoặc giảm giá mua sâm.
          </p>
        </div>

        {/* Code & Link Box */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
          <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 space-y-2">
            <span className="text-[11px] font-bold text-emerald-300 uppercase tracking-wider block">Mã giới thiệu của bạn</span>
            <div className="flex items-center justify-between gap-2">
              <span className="text-xl font-black text-amber-400 font-mono tracking-widest">{referralCode}</span>
              <Button
                type="button"
                variant="secondary"
                size="sm"
                onClick={() => onCopyText(referralCode, 'Mã giới thiệu')}
                className="bg-white/20 hover:bg-white/30 text-white border-0 text-xs cursor-pointer"
              >
                <Copy className="w-3.5 h-3.5 mr-1" />
                <span>Sao chép</span>
              </Button>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 space-y-2">
            <span className="text-[11px] font-bold text-emerald-300 uppercase tracking-wider block">Link đăng ký trực tiếp</span>
            <div className="flex items-center justify-between gap-2">
              <span className="text-xs text-white/80 truncate font-mono">{referralLink}</span>
              <Button
                type="button"
                variant="secondary"
                size="sm"
                onClick={() => onCopyText(referralLink, 'Link giới thiệu')}
                className="bg-white/20 hover:bg-white/30 text-white border-0 text-xs shrink-0 cursor-pointer"
              >
                <Copy className="w-3.5 h-3.5 mr-1" />
                <span>Copy Link</span>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Benefits Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl bg-gray-50 dark:bg-slate-900 border border-gray-200/80 dark:border-gray-800 space-y-2">
          <div className="size-10 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold">
            1
          </div>
          <h5 className="font-bold text-sm text-gray-900 dark:text-gray-100">Chia Sẻ Mã</h5>
          <p className="text-xs text-gray-500">Gửi mã hoặc link cho bạn bè, người thân có nhu cầu sử dụng sâm quý.</p>
        </div>

        <div className="p-5 rounded-2xl bg-gray-50 dark:bg-slate-900 border border-gray-200/80 dark:border-gray-800 space-y-2">
          <div className="size-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
            2
          </div>
          <h5 className="font-bold text-sm text-gray-900 dark:text-gray-100">Bạn Bè Đăng Ký</h5>
          <p className="text-xs text-gray-500">Người được giới thiệu tạo tài khoản và xác minh thông tin thành công.</p>
        </div>

        <div className="p-5 rounded-2xl bg-gray-50 dark:bg-slate-900 border border-gray-200/80 dark:border-gray-800 space-y-2">
          <div className="size-10 rounded-xl bg-blue-100 text-blue-800 flex items-center justify-center font-bold">
            3
          </div>
          <h5 className="font-bold text-sm text-gray-900 dark:text-gray-100">Nhận Thưởng Ngay</h5>
          <p className="text-xs text-gray-500">Hệ thống tự động cộng Điểm Sâm vào ví của cả hai tài khoản.</p>
        </div>
      </div>
    </div>
  );
};
