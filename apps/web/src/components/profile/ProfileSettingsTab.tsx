'use client';

import { Bell, Shield, Moon, Sun, Monitor, Check } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import type { FormEvent } from 'react';
import { toast } from 'sonner';
import { Button, ButtonLoading } from '@/components/ui/button';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
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

  const emailNotif =
    userEmailNotif ??
    (typeof apiSettings?.emailNotif === 'boolean' ? apiSettings.emailNotif : true);
  const setEmailNotif = (val: boolean) => {
    setUserEmailNotif(val);
  };

  const orderNotif =
    userOrderNotif ??
    (typeof apiSettings?.orderNotif === 'boolean' ? apiSettings.orderNotif : true);
  const setOrderNotif = (val: boolean) => {
    setUserOrderNotif(val);
  };

  const promoNotif =
    userPromoNotif ??
    (typeof apiSettings?.promoNotif === 'boolean' ? apiSettings.promoNotif : false);
  const setPromoNotif = (val: boolean) => {
    setUserPromoNotif(val);
  };

  const autoLogoutStr =
    typeof apiSettings?.autoLogout === 'number' || typeof apiSettings?.autoLogout === 'string'
      ? String(apiSettings.autoLogout)
      : '30';
  const autoLogout = userAutoLogout ?? autoLogoutStr;
  const setAutoLogout = (val: string) => {
    setUserAutoLogout(val);
  };

  const themeMode = userThemeMode ?? (apiSettings?.themeMode || 'light');
  const setThemeMode = (val: string) => {
    setUserThemeMode(val);
  };

  const twoFactor =
    userTwoFactor ?? (typeof apiSettings?.twoFactor === 'boolean' ? apiSettings.twoFactor : false);
  const setTwoFactor = (val: boolean) => {
    setUserTwoFactor(val);
  };

  const handleSaveSettings = async (e: FormEvent) => {
    e.preventDefault();
    if (isSaving) {
      return;
    }
    setIsSaving(true);

    try {
      if (typeof window !== 'undefined') {
        localStorage.setItem(
          'samngoclinh_user_settings:v1',
          JSON.stringify({ autoLogout, themeMode, twoFactor }),
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
    <form
      onSubmit={handleSaveSettings}
      className="animate-in fade-in space-y-8 transition-opacity duration-200"
    >
      {/* 1. Cài đặt thông báo */}
      <div className="space-y-4">
        <div className="flex items-center gap-2.5 border-b border-gray-100 pb-2 dark:border-gray-800">
          <div className="rounded-lg bg-amber-50 p-2 text-amber-600">
            <Bell className="h-4 w-4" />
          </div>
          <div>
            <h3 className="text-base font-bold text-gray-900 dark:text-gray-100">
              {t('notificationsSection')}
            </h3>
            <p className="text-xs font-normal text-gray-400">{t('subtitle')}</p>
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between rounded-xl border border-gray-100 bg-gray-50/70 p-3.5 dark:border-gray-800 dark:bg-gray-900">
            <div>
              <p className="text-xs font-bold text-gray-800 sm:text-sm dark:text-gray-200">
                {t('emailNotif')}
              </p>
              <p className="text-[11px] text-gray-500">{t('emailNotifDesc')}</p>
            </div>
            <Switch
              checked={emailNotif}
              onCheckedChange={(val) => {
                setEmailNotif(val);
              }}
            />
          </div>

          <div className="flex items-center justify-between rounded-xl border border-gray-100 bg-gray-50/70 p-3.5 dark:border-gray-800 dark:bg-gray-900">
            <div>
              <p className="text-xs font-bold text-gray-800 sm:text-sm dark:text-gray-200">
                {t('orderUpdates')}
              </p>
              <p className="text-[11px] text-gray-500">{t('orderUpdatesDesc')}</p>
            </div>
            <Switch
              checked={orderNotif}
              onCheckedChange={(val) => {
                setOrderNotif(val);
              }}
            />
          </div>

          <div className="flex items-center justify-between rounded-xl border border-gray-100 bg-gray-50/70 p-3.5 dark:border-gray-800 dark:bg-gray-900">
            <div>
              <p className="text-xs font-bold text-gray-800 sm:text-sm dark:text-gray-200">
                {t('smsNotif')}
              </p>
              <p className="text-[11px] text-gray-500">{t('smsNotifDesc')}</p>
            </div>
            <Switch
              checked={promoNotif}
              onCheckedChange={(val) => {
                setPromoNotif(val);
              }}
            />
          </div>
        </div>
      </div>

      {/* 2. Bảo mật & Phiên làm việc */}
      <div className="space-y-4">
        <div className="flex items-center gap-2.5 border-b border-gray-100 pb-2 dark:border-gray-800">
          <div className="rounded-lg bg-emerald-50 p-2 text-emerald-700">
            <Shield className="h-4 w-4" />
          </div>
          <div>
            <h3 className="text-base font-bold text-gray-900 dark:text-gray-100">
              {t('languageSection')}
            </h3>
            <p className="text-xs font-normal text-gray-400">{t('selectLanguage')}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="space-y-2 rounded-xl border border-gray-100 bg-gray-50/70 p-4 dark:border-gray-800 dark:bg-gray-900">
            <span className="block text-xs font-bold text-gray-800 sm:text-sm dark:text-gray-200">
              {t('selectLanguage')}
            </span>
            <Select
              value={autoLogout}
              onValueChange={(val) => {
                setAutoLogout(val);
              }}
            >
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

          <div className="flex items-center justify-between rounded-xl border border-gray-100 bg-gray-50/70 p-4 dark:border-gray-800 dark:bg-gray-900">
            <div>
              <p className="text-xs font-bold text-gray-800 sm:text-sm dark:text-gray-200">2FA</p>
              <p className="text-[11px] text-gray-500">OTP via Email</p>
            </div>
            <Switch
              checked={twoFactor}
              onCheckedChange={(val) => {
                setTwoFactor(val);
              }}
            />
          </div>
        </div>
      </div>

      {/* 3. Giao diện & Trải nghiệm */}
      <div className="space-y-4">
        <div className="flex items-center gap-2.5 border-b border-gray-100 pb-2 dark:border-gray-800">
          <div className="rounded-lg bg-blue-50 p-2 text-blue-600">
            <Moon className="h-4 w-4" />
          </div>
          <div>
            <h3 className="text-base font-bold text-gray-900 dark:text-gray-100">
              {t('languageSection')}
            </h3>
            <p className="text-xs font-normal text-gray-400">{t('selectLanguage')}</p>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3">
          {[
            { id: 'light', label: 'Light', icon: <Sun className="h-5 w-5" /> },
            { id: 'dark', label: 'Dark', icon: <Moon className="h-5 w-5" /> },
            { id: 'system', label: 'System', icon: <Monitor className="h-5 w-5" /> },
          ].map((mode) => (
            <Button
              key={mode.id}
              type="button"
              variant={themeMode === mode.id ? 'default' : 'outline'}
              onClick={() => {
                setThemeMode(mode.id);
              }}
              className="flex h-auto flex-col items-center gap-2 py-3.5"
            >
              <span>{mode.icon}</span>
              <span>{mode.label}</span>
            </Button>
          ))}
        </div>
      </div>

      {/* Submit Button */}
      <div className="flex justify-end border-t border-gray-100 pt-4 dark:border-gray-800">
        <ButtonLoading
          type="submit"
          isLoading={isSaving}
          variant="default"
          className="flex items-center gap-2"
        >
          {!isSaving && <Check className="h-4 w-4" />}
          <span>{isSaving ? tActions('saving') : tActions('save')}</span>
        </ButtonLoading>
      </div>
    </form>
  );
};
