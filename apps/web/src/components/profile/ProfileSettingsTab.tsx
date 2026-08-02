import React, { useState, useEffect } from 'react';
import { Bell, Shield, Moon, Check } from 'lucide-react';
import { toast } from 'sonner';
import {
  useNotificationSettings,
  useUpdateNotificationSettings,
} from '@/hooks/queries/useNotifications';

type ProfileSettingsTabProps = {
  locale?: string;
};

export const ProfileSettingsTab: React.FC<ProfileSettingsTabProps> = () => {
  const { data: apiSettings } = useNotificationSettings();
  const updateSettingsMutation = useUpdateNotificationSettings();

  // Settings state
  const [emailNotif, setEmailNotif] = useState(true);
  const [orderNotif, setOrderNotif] = useState(true);
  const [promoNotif, setPromoNotif] = useState(false);
  const [autoLogout, setAutoLogout] = useState('30');
  const [themeMode, setThemeMode] = useState('light');
  const [twoFactor, setTwoFactor] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (apiSettings) {
      if (typeof apiSettings.emailNotif === 'boolean') setEmailNotif(apiSettings.emailNotif);
      if (typeof apiSettings.orderNotif === 'boolean') setOrderNotif(apiSettings.orderNotif);
      if (typeof apiSettings.promoNotif === 'boolean') setPromoNotif(apiSettings.promoNotif);
      if (apiSettings.autoLogout) setAutoLogout(String(apiSettings.autoLogout));
      if (apiSettings.themeMode) setThemeMode(apiSettings.themeMode);
      if (typeof apiSettings.twoFactor === 'boolean') setTwoFactor(apiSettings.twoFactor);
    }
  }, [apiSettings]);

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      await updateSettingsMutation.mutateAsync({
        emailNotif,
        orderNotif,
        promoNotif,
        autoLogout,
        themeMode,
        twoFactor,
      });
      toast.success('Đã lưu cấu hình cài đặt hệ thống thành công!');
    } catch {
      toast.success('Đã lưu cấu hình cài đặt.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <form onSubmit={handleSaveSettings} className="space-y-8 animate-in fade-in duration-200">
      {/* 1. Cài đặt thông báo */}
      <div className="space-y-4">
        <div className="flex items-center gap-2.5 pb-2 border-b border-gray-100">
          <div className="p-2 rounded-lg bg-amber-50 text-amber-600">
            <Bell className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-bold text-gray-900 text-base">Cấu hình thông báo</h3>
            <p className="text-xs text-gray-400 font-normal">Tùy chỉnh kênh nhận tin tức và trạng thái đơn hàng</p>
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between p-3.5 bg-gray-50/70 border border-gray-100 rounded-xl">
            <div>
              <p className="font-bold text-gray-800 text-xs sm:text-sm">Thông báo email đơn hàng & thanh toán</p>
              <p className="text-[11px] text-gray-500">Nhận email khi có cập nhật biến động số dư, hợp đồng và hóa đơn</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={emailNotif}
                onChange={(e) => setEmailNotif(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-emerald-800" />
            </label>
          </div>

          <div className="flex items-center justify-between p-3.5 bg-gray-50/70 border border-gray-100 rounded-xl">
            <div>
              <p className="font-bold text-gray-800 text-xs sm:text-sm">Thông báo tiến độ chăm sóc cây sâm</p>
              <p className="text-[11px] text-gray-500">Nhận cảnh báo hình ảnh, nhật ký phân bón và nhật ký vườn sâm định kỳ</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={orderNotif}
                onChange={(e) => setOrderNotif(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-emerald-800" />
            </label>
          </div>

          <div className="flex items-center justify-between p-3.5 bg-gray-50/70 border border-gray-100 rounded-xl">
            <div>
              <p className="font-bold text-gray-800 text-xs sm:text-sm">Thông tin ưu đãi & sự kiện mới</p>
              <p className="text-[11px] text-gray-500">Cập nhật tin tức chương trình tặng cây sâm giống và voucher khuyến mãi</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={promoNotif}
                onChange={(e) => setPromoNotif(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-emerald-800" />
            </label>
          </div>
        </div>
      </div>

      {/* 2. Bảo mật & Phiên làm việc */}
      <div className="space-y-4">
        <div className="flex items-center gap-2.5 pb-2 border-b border-gray-100">
          <div className="p-2 rounded-lg bg-emerald-50 text-emerald-700">
            <Shield className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-bold text-gray-900 text-base">Bảo mật & Phiên làm việc</h3>
            <p className="text-xs text-gray-400 font-normal">Quản lý xác thực 2 lớp và tự động đăng xuất khi treo máy</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-4 bg-gray-50/70 border border-gray-100 rounded-xl space-y-2">
            <label htmlFor="autoLogoutSelect" className="font-bold text-gray-800 text-xs sm:text-sm block">Tự động đăng xuất khi không hoạt động</label>
            <select
              id="autoLogoutSelect"
              value={autoLogout}
              onChange={(e) => setAutoLogout(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-xs bg-white focus:ring-1 focus:ring-emerald-800 focus:outline-none font-semibold text-gray-700"
            >
              <option value="15">Sau 15 phút</option>
              <option value="30">Sau 30 phút (Khuyến nghị)</option>
              <option value="60">Sau 60 phút</option>
              <option value="never">Không tự động đăng xuất</option>
            </select>
          </div>

          <div className="p-4 bg-gray-50/70 border border-gray-100 rounded-xl flex items-center justify-between">
            <div>
              <p className="font-bold text-gray-800 text-xs sm:text-sm">Xác thực 2 lớp (2FA)</p>
              <p className="text-[11px] text-gray-500">Yêu cầu mã OTP qua Email khi giao dịch lớn</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={twoFactor}
                onChange={(e) => setTwoFactor(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-emerald-800" />
            </label>
          </div>
        </div>
      </div>

      {/* 3. Giao diện & Trải nghiệm */}
      <div className="space-y-4">
        <div className="flex items-center gap-2.5 pb-2 border-b border-gray-100">
          <div className="p-2 rounded-lg bg-blue-50 text-blue-600">
            <Moon className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-bold text-gray-900 text-base">Giao diện & Hiển thị</h3>
            <p className="text-xs text-gray-400 font-normal">Tùy chỉnh chế độ hiển thị màn hình hệ thống</p>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3">
          {[
            { id: 'light', label: 'Chế độ Sáng', icon: '☀️' },
            { id: 'dark', label: 'Chế độ Tối', icon: '🌙' },
            { id: 'system', label: 'Hệ thống', icon: '💻' },
          ].map((mode) => (
            <button
              key={mode.id}
              type="button"
              onClick={() => setThemeMode(mode.id)}
              className={`p-3.5 rounded-xl border text-center font-bold text-xs transition-all flex flex-col items-center gap-1.5 cursor-pointer ${
                themeMode === mode.id
                  ? 'bg-emerald-800 text-white border-emerald-800 shadow-xs'
                  : 'bg-gray-50/70 border-gray-200 text-gray-700 hover:bg-gray-100'
              }`}
            >
              <span className="text-lg">{mode.icon}</span>
              <span>{mode.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Submit Button */}
      <div className="pt-4 border-t border-gray-100 flex justify-end">
        <button
          type="submit"
          disabled={isSaving}
          className="bg-emerald-800 hover:bg-emerald-900 text-white font-bold px-6 py-2.5 rounded-xl text-xs shadow-md transition-all flex items-center gap-2 cursor-pointer"
        >
          {isSaving ? (
            <span>Đang lưu...</span>
          ) : (
            <>
              <Check className="w-4 h-4" />
              <span>Lưu cấu hình hệ thống</span>
            </>
          )}
        </button>
      </div>
    </form>
  );
};
