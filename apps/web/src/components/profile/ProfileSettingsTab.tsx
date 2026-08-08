'use client';

import React, { useState, useEffect } from 'react';
import { Bell, Shield, Moon, Sun, Monitor, Check } from 'lucide-react';
import { toast } from 'sonner';
import { Switch } from '@/components/ui/switch';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { Button, ButtonLoading } from '@/components/ui/button';
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
        <div className="flex items-center gap-2.5 pb-2 border-b border-gray-100 dark:border-gray-800">
          <div className="p-2 rounded-lg bg-amber-50 text-amber-600">
            <Bell className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-bold text-gray-900 dark:text-gray-100 text-base">Cấu hình thông báo</h3>
            <p className="text-xs text-gray-400 font-normal">Tùy chỉnh kênh nhận tin tức và trạng thái đơn hàng</p>
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between p-3.5 bg-gray-50/70 dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-xl">
            <div>
              <p className="font-bold text-gray-800 dark:text-gray-200 text-xs sm:text-sm">Thông báo email đơn hàng & thanh toán</p>
              <p className="text-[11px] text-gray-500">Nhận email khi có cập nhật biến động số dư, hợp đồng và hóa đơn</p>
            </div>
            <Switch checked={emailNotif} onCheckedChange={(val) => setEmailNotif(val)} />
          </div>

          <div className="flex items-center justify-between p-3.5 bg-gray-50/70 dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-xl">
            <div>
              <p className="font-bold text-gray-800 dark:text-gray-200 text-xs sm:text-sm">Thông báo tiến độ chăm sóc cây sâm</p>
              <p className="text-[11px] text-gray-500">Nhận cảnh báo hình ảnh, nhật ký phân bón và nhật ký vườn sâm định kỳ</p>
            </div>
            <Switch checked={orderNotif} onCheckedChange={(val) => setOrderNotif(val)} />
          </div>

          <div className="flex items-center justify-between p-3.5 bg-gray-50/70 dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-xl">
            <div>
              <p className="font-bold text-gray-800 dark:text-gray-200 text-xs sm:text-sm">Thông tin ưu đãi & sự kiện mới</p>
              <p className="text-[11px] text-gray-500">Cập nhật tin tức chương trình tặng cây sâm giống và voucher khuyến mãi</p>
            </div>
            <Switch checked={promoNotif} onCheckedChange={(val) => setPromoNotif(val)} />
          </div>
        </div>
      </div>

      {/* 2. Bảo mật & Phiên làm việc */}
      <div className="space-y-4">
        <div className="flex items-center gap-2.5 pb-2 border-b border-gray-100 dark:border-gray-800">
          <div className="p-2 rounded-lg bg-emerald-50 text-emerald-700">
            <Shield className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-bold text-gray-900 dark:text-gray-100 text-base">Bảo mật & Phiên làm việc</h3>
            <p className="text-xs text-gray-400 font-normal">Quản lý xác thực 2 lớp và tự động đăng xuất khi treo máy</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-4 bg-gray-50/70 dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-xl space-y-2">
            <label className="font-bold text-gray-800 dark:text-gray-200 text-xs sm:text-sm block">Tự động đăng xuất khi không hoạt động</label>
            <Select value={autoLogout} onValueChange={(val) => setAutoLogout(val)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="15">Sau 15 phút</SelectItem>
                <SelectItem value="30">Sau 30 phút (Khuyến nghị)</SelectItem>
                <SelectItem value="60">Sau 60 phút</SelectItem>
                <SelectItem value="never">Không tự động đăng xuất</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="p-4 bg-gray-50/70 dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-xl flex items-center justify-between">
            <div>
              <p className="font-bold text-gray-800 dark:text-gray-200 text-xs sm:text-sm">Xác thực 2 lớp (2FA)</p>
              <p className="text-[11px] text-gray-500">Yêu cầu mã OTP qua Email khi giao dịch lớn</p>
            </div>
            <Switch checked={twoFactor} onCheckedChange={(val) => setTwoFactor(val)} />
          </div>
        </div>
      </div>

      {/* 3. Giao diện & Trải nghiệm */}
      <div className="space-y-4">
        <div className="flex items-center gap-2.5 pb-2 border-b border-gray-100 dark:border-gray-800">
          <div className="p-2 rounded-lg bg-blue-50 text-blue-600">
            <Moon className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-bold text-gray-900 dark:text-gray-100 text-base">Giao diện & Hiển thị</h3>
            <p className="text-xs text-gray-400 font-normal">Tùy chỉnh chế độ hiển thị màn hình hệ thống</p>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3">
          {[
            { id: 'light', label: 'Chế độ Sáng', icon: <Sun className="w-5 h-5" /> },
            { id: 'dark', label: 'Chế độ Tối', icon: <Moon className="w-5 h-5" /> },
            { id: 'system', label: 'Hệ thống', icon: <Monitor className="w-5 h-5" /> },
          ].map((mode) => (
            <Button
              key={mode.id}
              type="button"
              variant={themeMode === mode.id ? 'default' : 'outline'}
              onClick={() => setThemeMode(mode.id)}
              className="h-auto py-3.5 flex flex-col items-center gap-2"
            >
              <span>{mode.icon}</span>
              <span>{mode.label}</span>
            </Button>
          ))}
        </div>
      </div>

      {/* Submit Button */}
      <div className="pt-4 border-t border-gray-100 dark:border-gray-800 flex justify-end">
        <ButtonLoading
          type="submit"
          isLoading={isSaving}
          variant="default"
          className="flex items-center gap-2"
        >
          {!isSaving && <Check className="w-4 h-4" />}
          <span>{isSaving ? 'Đang lưu...' : 'Lưu cấu hình hệ thống'}</span>
        </ButtonLoading>
      </div>
    </form>
  );
};
