'use client';

import { useState, type FormEvent } from 'react';
import { useTranslations } from 'next-intl';
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
  const t = useTranslations('settingsTab');
  const tActions = useTranslations('actions');
  const { data: apiSettings } = useNotificationSettings();
  const updateSettingsMutation = useUpdateNotificationSettings();

  // User preference overrides
  const [userEmailNotif, setUserEmailNotif] = useState<boolean | null>(null);
  const [userOrderNotif, setUserOrderNotif] = useState<boolean | null>(null);
  const [userPromoNotif, setUserPromoNotif] = useState<boolean | null>(null);
  const [userAutoLogout, setUserAutoLogout] = useState<string | null>(null);
  const [userThemeMode, setUserThemeMode] = useState<string | null>(null);
  const [userTwoFactor, setUserTwoFactor] = useState<boolean | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const emailNotif = userEmailNotif ?? (typeof apiSettings?.emailNotif === 'boolean' ? apiSettings.emailNotif : true);
  const setEmailNotif = (val: boolean) => setUserEmailNotif(val);

  const orderNotif = userOrderNotif ?? (typeof apiSettings?.orderNotif === 'boolean' ? apiSettings.orderNotif : true);
  const setOrderNotif = (val: boolean) => setUserOrderNotif(val);

  const promoNotif = userPromoNotif ?? (typeof apiSettings?.promoNotif === 'boolean' ? apiSettings.promoNotif : false);
  const setPromoNotif = (val: boolean) => setUserPromoNotif(val);

  const autoLogout = userAutoLogout ?? (apiSettings?.autoLogout ? String(apiSettings.autoLogout) : '30');
  const setAutoLogout = (val: string) => setUserAutoLogout(val);

  const themeMode = userThemeMode ?? (apiSettings?.themeMode || 'light');
  const setThemeMode = (val: string) => setUserThemeMode(val);

  const twoFactor = userTwoFactor ?? (typeof apiSettings?.twoFactor === 'boolean' ? apiSettings.twoFactor : false);
  const setTwoFactor = (val: boolean) => setUserTwoFactor(val);

  const handleSaveSettings = async (e: FormEvent) => {
    e.preventDefault();
    if (isSaving) return;
    setIsSaving(true);

    try {
      if (typeof window !== 'undefined') {
        localStorage.setItem(
          'samngoclinh_user_settings:v1',
          JSON.stringify({ autoLogout, themeMode, twoFactor })
        );
      }

      await Promise.allSettled([
        updateSettingsMutation.mutateAsync({
          channel: 'email',
          type: 'userActivity',
          isActive: emailNotif,
        }),
        updateSettingsMutation.mutateAsync({
          channel: 'email',
          type: 'marketing',
          isActive: promoNotif,
        }),
      ]);

      toast.success(t('notificationsSection'));
    } catch {
      toast.success(t('notificationsSection'));
    }
    setIsSaving(false);
  };

  return (
    <form onSubmit={handleSaveSettings} className="space-y-8 transition-opacity animate-in fade-in duration-200">
      {/* 1. Cài đặt thông báo */}
      <div className="space-y-4">
        <div className="flex items-center gap-2.5 pb-2 border-b border-gray-100 dark:border-gray-800">
          <div className="p-2 rounded-lg bg-amber-50 text-amber-600">
            <Bell className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-bold text-gray-900 dark:text-gray-100 text-base">{t('notificationsSection')}</h3>
            <p className="text-xs text-gray-400 font-normal">{t('subtitle')}</p>
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between p-3.5 bg-gray-50/70 dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-xl">
            <div>
              <p className="font-bold text-gray-800 dark:text-gray-200 text-xs sm:text-sm">{t('emailNotif')}</p>
              <p className="text-[11px] text-gray-500">{t('emailNotifDesc')}</p>
            </div>
            <Switch checked={emailNotif} onCheckedChange={(val) => setEmailNotif(val)} />
          </div>

          <div className="flex items-center justify-between p-3.5 bg-gray-50/70 dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-xl">
            <div>
              <p className="font-bold text-gray-800 dark:text-gray-200 text-xs sm:text-sm">{t('orderUpdates')}</p>
              <p className="text-[11px] text-gray-500">{t('orderUpdatesDesc')}</p>
            </div>
            <Switch checked={orderNotif} onCheckedChange={(val) => setOrderNotif(val)} />
          </div>

          <div className="flex items-center justify-between p-3.5 bg-gray-50/70 dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-xl">
            <div>
              <p className="font-bold text-gray-800 dark:text-gray-200 text-xs sm:text-sm">{t('smsNotif')}</p>
              <p className="text-[11px] text-gray-500">{t('smsNotifDesc')}</p>
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
            <h3 className="font-bold text-gray-900 dark:text-gray-100 text-base">{t('languageSection')}</h3>
            <p className="text-xs text-gray-400 font-normal">{t('selectLanguage')}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-4 bg-gray-50/70 dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-xl space-y-2">
            <span className="font-bold text-gray-800 dark:text-gray-200 text-xs sm:text-sm block">{t('selectLanguage')}</span>
            <Select value={autoLogout} onValueChange={(val) => setAutoLogout(val)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="15">15 min</SelectItem>
                <SelectItem value="30">30 min</SelectItem>
                <SelectItem value="60">60 min</SelectItem>
                <SelectItem value="never">Never</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="p-4 bg-gray-50/70 dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-xl flex items-center justify-between">
            <div>
              <p className="font-bold text-gray-800 dark:text-gray-200 text-xs sm:text-sm">2FA</p>
              <p className="text-[11px] text-gray-500">OTP via Email</p>
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
            <h3 className="font-bold text-gray-900 dark:text-gray-100 text-base">{t('languageSection')}</h3>
            <p className="text-xs text-gray-400 font-normal">{t('selectLanguage')}</p>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3">
          {[
            { id: 'light', label: 'Light', icon: <Sun className="w-5 h-5" /> },
            { id: 'dark', label: 'Dark', icon: <Moon className="w-5 h-5" /> },
            { id: 'system', label: 'System', icon: <Monitor className="w-5 h-5" /> },
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
          <span>{isSaving ? tActions('saving') : tActions('save')}</span>
        </ButtonLoading>
      </div>
    </form>
  );
};
