'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Edit2, User, Award, Copy } from 'lucide-react';
import { Button, ButtonLoading } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { FormDatePicker } from '@/components/ui/form/FormDatePicker';
import {
  profileInfoSchema,
  type ProfileInfoFormValues,
} from '@/lib/validation/schemas';
import type { UserProfile, UserBusiness } from '@/types';
import { formatBirthDate, formatInputDate } from '@/utils/formatters';

type ProfileInfoTabProps = {
  fullName: string;
  email: string;
  rank: string;
  referralCode: string;
  profile?: UserProfile | null;
  business?: UserBusiness | null;
  editPhone: string;
  onEditClick?: () => void;
  onCopyText: (text: string, label: string) => void;
  onVerifyEmailClick?: () => void;
  onSaveProfile?: (updated: {
    fullName: string;
    gender: string;
    birthDate: string;
    phone: string;
  }) => Promise<boolean>;
};

// Subcomponent: Profile Edit Form Fields
function ProfileEditFormFields({
  form,
  email,
  onValidSave,
}: {
  form: any;
  email: string;
  onValidSave: (values: ProfileInfoFormValues) => Promise<void>;
}) {
  const t = useTranslations('profile');

  return (
    <form onSubmit={form.handleSubmit(onValidSave)} className="space-y-5 pt-1">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="space-y-1.5">
          <label htmlFor="profile-full-name" className="text-xs font-bold uppercase text-gray-600 dark:text-gray-400 block">
            {t('fullName')} <span className="text-red-500">*</span>
          </label>
          <input
            id="profile-full-name"
            type="text"
            {...form.register('fullName')}
            placeholder={t('fullNamePlaceholder')}
            className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-slate-800 text-sm font-semibold text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-colors"
          />
          {form.formState.errors.fullName && (
            <p className="text-xs font-semibold text-red-500">{form.formState.errors.fullName.message}</p>
          )}
        </div>

        <div className="space-y-1.5">
          <span className="text-xs font-bold uppercase text-gray-600 dark:text-gray-400 block">{t('email')}</span>
          <div className="px-3.5 py-2.5 rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-slate-900/50 text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center justify-between">
            <span>{email || '—'}</span>
            <span className="text-[10px] text-gray-400 font-normal italic">—</span>
          </div>
        </div>

        <div className="space-y-1.5">
          <span className="text-xs font-bold uppercase text-gray-600 dark:text-gray-400 block">
            {t('gender')} <span className="text-red-500">*</span>
          </span>
          <div className="flex items-center gap-6 pt-1">
            <label className="inline-flex items-center gap-2 cursor-pointer text-sm font-semibold text-gray-800 dark:text-gray-200">
              <input
                type="radio"
                value="male"
                {...form.register('gender')}
                className="w-4 h-4 text-emerald-600 focus:ring-emerald-500 accent-emerald-600 cursor-pointer"
              />
              <span>{t('male')}</span>
            </label>
            <label className="inline-flex items-center gap-2 cursor-pointer text-sm font-semibold text-gray-800 dark:text-gray-200">
              <input
                type="radio"
                value="female"
                {...form.register('gender')}
                className="w-4 h-4 text-emerald-600 focus:ring-emerald-500 accent-emerald-600 cursor-pointer"
              />
              <span>{t('female')}</span>
            </label>
          </div>
          {form.formState.errors.gender && (
            <p className="text-xs font-semibold text-red-500">{form.formState.errors.gender.message}</p>
          )}
        </div>

        <FormDatePicker
          control={form.control}
          name="birthDate"
          label={t('birthDate')}
          placeholder={t('birthDate')}
        />

        <div className="space-y-1.5 md:col-span-2">
          <label htmlFor="profile-phone" className="text-xs font-bold uppercase text-gray-600 dark:text-gray-400 block">
            {t('phone')} <span className="text-red-500">*</span>
          </label>
          <input
            id="profile-phone"
            type="tel"
            {...form.register('phone')}
            placeholder={t('phonePlaceholder')}
            className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-slate-800 text-sm font-semibold text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-colors"
          />
          {form.formState.errors.phone && (
            <p className="text-xs font-semibold text-red-500">{form.formState.errors.phone.message}</p>
          )}
        </div>
      </div>
    </form>
  );
}

// Subcomponent: Profile Read-Only View Grid
function ProfileViewDetailsGrid({
  cleanName,
  email,
  isEmailVerified,
  profile,
  currentPhone,
  onVerifyEmailClick,
}: {
  cleanName: string;
  email: string;
  isEmailVerified: boolean;
  profile?: UserProfile | null;
  currentPhone: string;
  onVerifyEmailClick?: () => void;
}) {
  const t = useTranslations('profile');
  const tAuth = useTranslations('verifyEmailModal');
  const tCommon = useTranslations('status');

  const getGenderText = (gender?: string) => {
    if (gender === 'female' || gender === 'Nữ') return t('female');
    if (gender === 'male' || gender === 'Nam') return t('male');
    return t('other');
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-1">
      <div className="p-4 rounded-2xl bg-gray-50/80 dark:bg-slate-900/50 border border-gray-100 dark:border-gray-800 space-y-1">
        <span className="text-[11px] text-gray-400 font-bold uppercase tracking-wider block">{t('fullName')}</span>
        <p className="text-sm font-bold text-gray-900 dark:text-gray-100">
          {cleanName || <span className="text-gray-400 font-normal italic">—</span>}
        </p>
      </div>

      <div className="p-4 rounded-2xl bg-gray-50/80 dark:bg-slate-900/50 border border-gray-100 dark:border-gray-800 space-y-1">
        <span className="text-[11px] text-gray-400 font-bold uppercase tracking-wider block">{t('email')}</span>
        <div className="flex items-center justify-between gap-2">
          <p className="text-sm font-bold text-gray-900 dark:text-gray-100 truncate">{email || '—'}</p>
          {isEmailVerified ? (
            <Badge variant="secondary" className="bg-emerald-50 text-emerald-700 border-emerald-200 text-[10px] shrink-0 font-bold">
              {tCommon('verified')}
            </Badge>
          ) : (
            <Button
              variant="ghost"
              size="sm"
              onClick={onVerifyEmailClick}
              className="h-6 text-[10px] bg-amber-50 text-amber-800 hover:bg-amber-100 border border-amber-200 shrink-0 font-bold cursor-pointer"
            >
              {tAuth('verifyBtn')}
            </Button>
          )}
        </div>
      </div>

      <div className="p-4 rounded-2xl bg-gray-50/80 dark:bg-slate-900/50 border border-gray-100 dark:border-gray-800 space-y-1">
        <span className="text-[11px] text-gray-400 font-bold uppercase tracking-wider block">{t('gender')}</span>
        <p className="text-sm font-bold text-gray-900 dark:text-gray-100">
          {getGenderText(profile?.gender)}
        </p>
      </div>

      <div className="p-4 rounded-2xl bg-gray-50/80 dark:bg-slate-900/50 border border-gray-100 dark:border-gray-800 space-y-1">
        <span className="text-[11px] text-gray-400 font-bold uppercase tracking-wider block">{t('birthDate')}</span>
        <p className="text-sm font-bold text-gray-900 dark:text-gray-100">
          {formatBirthDate(profile?.birthDate) || <span className="text-gray-400 font-normal italic">—</span>}
        </p>
      </div>

      <div className="p-4 rounded-2xl bg-gray-50/80 dark:bg-slate-900/50 border border-gray-100 dark:border-gray-800 space-y-1 md:col-span-2">
        <span className="text-[11px] text-gray-400 font-bold uppercase tracking-wider block">{t('phone')}</span>
        <p className="text-sm font-bold text-gray-900 dark:text-gray-100">
          {currentPhone || <span className="text-gray-400 font-normal italic">—</span>}
        </p>
      </div>
    </div>
  );
}

// Subcomponent: Referral Code Banner
function ProfileReferralBanner({
  referralCode,
  onCopyText,
}: {
  referralCode: string;
  onCopyText: (text: string, label: string) => void;
}) {
  const t = useTranslations('referralTab');
  const tActions = useTranslations('actions');

  return (
    <div className="p-5 rounded-2xl bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-950/30 dark:to-teal-950/20 border border-emerald-200/80 dark:border-emerald-800/40 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-2xs">
      <div className="space-y-0.5">
        <span className="text-xs font-black uppercase tracking-wider text-emerald-800 dark:text-emerald-300 flex items-center gap-1.5">
          <Award className="w-4 h-4 text-emerald-600" />
          {t('myCode')}
        </span>
        <p className="text-xs text-gray-600 dark:text-gray-400">
          {t('subtitle')}
        </p>
      </div>
      <div className="flex items-center gap-2 shrink-0">
        <div className="px-4 py-2 bg-white dark:bg-slate-900 rounded-xl font-mono font-black text-emerald-800 dark:text-emerald-300 text-sm border border-emerald-300 shadow-xs">
          {referralCode}
        </div>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => onCopyText(referralCode, t('myCode'))}
          className="flex items-center gap-1 bg-white hover:bg-emerald-50 text-emerald-800 border-emerald-300 cursor-pointer"
        >
          <Copy className="w-3.5 h-3.5" />
          <span>{tActions('copy')}</span>
        </Button>
      </div>
    </div>
  );
}

export const ProfileInfoTab = ({
  fullName,
  email,
  referralCode,
  profile,
  business,
  editPhone,
  onCopyText,
  onVerifyEmailClick,
  onSaveProfile,
}: ProfileInfoTabProps) => {
  const t = useTranslations('profile');
  const tActions = useTranslations('actions');
  const isEmailVerified = !!(profile?.isEmailVerified || profile?.emailVerified);

  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const cleanName = (fullName === '—' ? '' : fullName) || profile?.name || '';
  const currentPhone = profile?.mobileNumbers?.[0]?.number || business?.phone || editPhone || '';
  const initialGender = profile?.gender === 'female' || profile?.gender === 'Nữ' ? 'female' : 'male';

  const form = useForm<ProfileInfoFormValues>({
    resolver: zodResolver(profileInfoSchema),
    defaultValues: {
      fullName: cleanName,
      gender: initialGender,
      birthDate: formatInputDate(profile?.birthDate),
      phone: currentPhone,
    },
  });

  useEffect(() => {
    if (profile && !isEditing) {
      form.reset({
        fullName: cleanName,
        gender: profile?.gender === 'female' || profile?.gender === 'Nữ' ? 'female' : 'male',
        birthDate: formatInputDate(profile?.birthDate),
        phone: currentPhone,
      });
    }
  }, [profile, isEditing, cleanName, currentPhone, form]);

  const handleStartEdit = () => {
    form.reset({
      fullName: cleanName,
      gender: profile?.gender === 'female' || profile?.gender === 'Nữ' ? 'female' : 'male',
      birthDate: formatInputDate(profile?.birthDate),
      phone: currentPhone,
    });
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
  };

  const onValidSave = async (values: ProfileInfoFormValues) => {
    if (isSaving) return;
    if (onSaveProfile) {
      setIsSaving(true);
      try {
        const ok = await onSaveProfile({
          fullName: values.fullName,
          gender: values.gender,
          birthDate: values.birthDate,
          phone: values.phone,
        });
        if (ok) {
          setIsEditing(false);
        }
      } catch (err) {
        console.error('Save profile error:', err);
      }
      setIsSaving(false);
    } else {
      setIsEditing(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gray-100 dark:border-gray-800 pb-4">
        <div>
          <h3 className="text-xl font-extrabold text-gray-900 dark:text-gray-100 flex items-center gap-2">
            <User className="w-5 h-5 text-emerald-700" />
            <span>{t('personalInfo')}</span>
          </h3>
          <p className="text-xs text-gray-400 font-medium mt-0.5">
            {isEditing ? t('subtitle') : t('subtitle')}
          </p>
        </div>

        <div className="flex items-center gap-2">
          {isEditing ? (
            <>
              <Button
                variant="outline"
                size="sm"
                onClick={handleCancelEdit}
                disabled={isSaving}
                className="cursor-pointer text-xs"
              >
                {tActions('cancel')}
              </Button>
              <ButtonLoading
                variant="default"
                size="sm"
                isLoading={isSaving}
                onClick={form.handleSubmit(onValidSave)}
                className="bg-emerald-800 hover:bg-emerald-900 text-white cursor-pointer text-xs"
              >
                {t('saveChanges')}
              </ButtonLoading>
            </>
          ) : (
            <Button
              variant="outline"
              size="sm"
              onClick={handleStartEdit}
              className="flex items-center gap-1.5 cursor-pointer text-xs border-gray-300 hover:border-emerald-600 hover:text-emerald-700"
            >
              <Edit2 className="w-3.5 h-3.5" />
              <span>{tActions('edit')}</span>
            </Button>
          )}
        </div>
      </div>

      {isEditing ? (
        <ProfileEditFormFields form={form} email={email} onValidSave={onValidSave} />
      ) : (
        <ProfileViewDetailsGrid
          cleanName={cleanName}
          email={email}
          isEmailVerified={isEmailVerified}
          profile={profile}
          currentPhone={currentPhone}
          onVerifyEmailClick={onVerifyEmailClick}
        />
      )}

      <ProfileReferralBanner referralCode={referralCode} onCopyText={onCopyText} />
    </div>
  );
};
