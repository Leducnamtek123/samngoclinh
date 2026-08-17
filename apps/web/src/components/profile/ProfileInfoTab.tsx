'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Edit2, User, Award, Copy } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Badge } from '@/components/ui/badge';
import { Button, ButtonLoading } from '@/components/ui/button';
import { FormDatePicker } from '@/components/ui/form/FormDatePicker';
import { profileInfoSchema } from '@/lib/validation/schemas';
import type { ProfileInfoFormValues } from '@/lib/validation/schemas';
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

import type { UseFormReturn } from 'react-hook-form';

// Subcomponent: Profile Edit Form Fields
function ProfileEditFormFields({
  form,
  email,
  onValidSave,
}: {
  form: UseFormReturn<ProfileInfoFormValues>;
  email: string;
  onValidSave: (values: ProfileInfoFormValues) => Promise<void>;
}) {
  const t = useTranslations('profile');

  return (
    <form onSubmit={form.handleSubmit(onValidSave)} className="space-y-5 pt-1">
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        <div className="space-y-1.5">
          <label
            htmlFor="profile-full-name"
            className="block text-xs font-bold text-gray-600 uppercase dark:text-gray-400"
          >
            {t('fullName')} <span className="text-red-500">*</span>
          </label>
          <input
            id="profile-full-name"
            type="text"
            {...form.register('fullName')}
            placeholder={t('fullNamePlaceholder')}
            className="w-full rounded-xl border border-gray-300 bg-white px-3.5 py-2.5 text-sm font-semibold text-gray-900 transition-colors focus:border-transparent focus:ring-2 focus:ring-emerald-500 focus:outline-none dark:border-gray-700 dark:bg-slate-800 dark:text-gray-100"
          />
          {form.formState.errors.fullName && (
            <p className="text-xs font-semibold text-red-500">
              {form.formState.errors.fullName.message}
            </p>
          )}
        </div>

        <div className="space-y-1.5">
          <span className="block text-xs font-bold text-gray-600 uppercase dark:text-gray-400">
            {t('email')}
          </span>
          <div className="flex items-center justify-between rounded-xl border border-gray-200 bg-gray-50 px-3.5 py-2.5 text-sm font-semibold text-gray-700 dark:border-gray-800 dark:bg-slate-900/50 dark:text-gray-300">
            <span>{email || '—'}</span>
            <span className="text-[10px] font-normal text-gray-400 italic">—</span>
          </div>
        </div>

        <div className="space-y-1.5">
          <span className="block text-xs font-bold text-gray-600 uppercase dark:text-gray-400">
            {t('gender')} <span className="text-red-500">*</span>
          </span>
          <div className="flex items-center gap-6 pt-1">
            <label className="inline-flex cursor-pointer items-center gap-2 text-sm font-semibold text-gray-800 dark:text-gray-200">
              <input
                type="radio"
                value="male"
                {...form.register('gender')}
                className="h-4 w-4 cursor-pointer text-emerald-600 accent-emerald-600 focus:ring-emerald-500"
              />
              <span>{t('male')}</span>
            </label>
            <label className="inline-flex cursor-pointer items-center gap-2 text-sm font-semibold text-gray-800 dark:text-gray-200">
              <input
                type="radio"
                value="female"
                {...form.register('gender')}
                className="h-4 w-4 cursor-pointer text-emerald-600 accent-emerald-600 focus:ring-emerald-500"
              />
              <span>{t('female')}</span>
            </label>
          </div>
          {form.formState.errors.gender && (
            <p className="text-xs font-semibold text-red-500">
              {form.formState.errors.gender.message}
            </p>
          )}
        </div>

        <FormDatePicker
          control={form.control}
          name="birthDate"
          label={t('birthDate')}
          placeholder={t('birthDate')}
        />

        <div className="space-y-1.5 md:col-span-2">
          <label
            htmlFor="profile-phone"
            className="block text-xs font-bold text-gray-600 uppercase dark:text-gray-400"
          >
            {t('phone')} <span className="text-red-500">*</span>
          </label>
          <input
            id="profile-phone"
            type="tel"
            {...form.register('phone')}
            placeholder={t('phonePlaceholder')}
            className="w-full rounded-xl border border-gray-300 bg-white px-3.5 py-2.5 text-sm font-semibold text-gray-900 transition-colors focus:border-transparent focus:ring-2 focus:ring-emerald-500 focus:outline-none dark:border-gray-700 dark:bg-slate-800 dark:text-gray-100"
          />
          {form.formState.errors.phone && (
            <p className="text-xs font-semibold text-red-500">
              {form.formState.errors.phone.message}
            </p>
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
    if (gender === 'female' || gender === 'Nữ') {
      return t('female');
    }
    if (gender === 'male' || gender === 'Nam') {
      return t('male');
    }
    return t('other');
  };

  return (
    <div className="grid grid-cols-1 gap-5 pt-1 md:grid-cols-2">
      <div className="space-y-1 rounded-2xl border border-gray-100 bg-gray-50/80 p-4 dark:border-gray-800 dark:bg-slate-900/50">
        <span className="block text-[11px] font-bold tracking-wider text-gray-400 uppercase">
          {t('fullName')}
        </span>
        <p className="text-sm font-bold text-gray-900 dark:text-gray-100">
          {cleanName || <span className="font-normal text-gray-400 italic">—</span>}
        </p>
      </div>

      <div className="space-y-1 rounded-2xl border border-gray-100 bg-gray-50/80 p-4 dark:border-gray-800 dark:bg-slate-900/50">
        <span className="block text-[11px] font-bold tracking-wider text-gray-400 uppercase">
          {t('email')}
        </span>
        <div className="flex items-center justify-between gap-2">
          <p className="truncate text-sm font-bold text-gray-900 dark:text-gray-100">
            {email || '—'}
          </p>
          {isEmailVerified ? (
            <Badge
              variant="secondary"
              className="shrink-0 border-emerald-200 bg-emerald-50 text-[10px] font-bold text-emerald-700"
            >
              {tCommon('verified')}
            </Badge>
          ) : (
            <Button
              variant="ghost"
              size="sm"
              onClick={onVerifyEmailClick}
              className="h-6 shrink-0 cursor-pointer border border-amber-200 bg-amber-50 text-[10px] font-bold text-amber-800 hover:bg-amber-100"
            >
              {tAuth('verifyBtn')}
            </Button>
          )}
        </div>
      </div>

      <div className="space-y-1 rounded-2xl border border-gray-100 bg-gray-50/80 p-4 dark:border-gray-800 dark:bg-slate-900/50">
        <span className="block text-[11px] font-bold tracking-wider text-gray-400 uppercase">
          {t('gender')}
        </span>
        <p className="text-sm font-bold text-gray-900 dark:text-gray-100">
          {getGenderText(profile?.gender)}
        </p>
      </div>

      <div className="space-y-1 rounded-2xl border border-gray-100 bg-gray-50/80 p-4 dark:border-gray-800 dark:bg-slate-900/50">
        <span className="block text-[11px] font-bold tracking-wider text-gray-400 uppercase">
          {t('birthDate')}
        </span>
        <p className="text-sm font-bold text-gray-900 dark:text-gray-100">
          {formatBirthDate(profile?.birthDate) || (
            <span className="font-normal text-gray-400 italic">—</span>
          )}
        </p>
      </div>

      <div className="space-y-1 rounded-2xl border border-gray-100 bg-gray-50/80 p-4 md:col-span-2 dark:border-gray-800 dark:bg-slate-900/50">
        <span className="block text-[11px] font-bold tracking-wider text-gray-400 uppercase">
          {t('phone')}
        </span>
        <p className="text-sm font-bold text-gray-900 dark:text-gray-100">
          {currentPhone || <span className="font-normal text-gray-400 italic">—</span>}
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
    <div className="flex flex-col justify-between gap-4 rounded-2xl border border-emerald-200/80 bg-gradient-to-r from-emerald-50 to-teal-50 p-5 shadow-2xs sm:flex-row sm:items-center dark:border-emerald-800/40 dark:from-emerald-950/30 dark:to-teal-950/20">
      <div className="space-y-0.5">
        <span className="flex items-center gap-1.5 text-xs font-black tracking-wider text-emerald-800 uppercase dark:text-emerald-300">
          <Award className="h-4 w-4 text-emerald-600" />
          {t('myCode')}
        </span>
        <p className="text-xs text-gray-600 dark:text-gray-400">{t('subtitle')}</p>
      </div>
      <div className="flex shrink-0 items-center gap-2">
        <div className="rounded-xl border border-emerald-300 bg-white px-4 py-2 font-mono text-sm font-black text-emerald-800 shadow-xs dark:bg-slate-900 dark:text-emerald-300">
          {referralCode}
        </div>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => {
            onCopyText(referralCode, t('myCode'));
          }}
          className="flex cursor-pointer items-center gap-1 border-emerald-300 bg-white text-emerald-800 hover:bg-emerald-50"
        >
          <Copy className="h-3.5 w-3.5" />
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
  const initialGender =
    profile?.gender === 'female' || profile?.gender === 'Nữ' ? 'female' : 'male';

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
    if (isSaving) {
      return;
    }
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
      } catch (error) {
        console.error('Save profile error:', error);
      }
      setIsSaving(false);
    } else {
      setIsEditing(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-3 border-b border-gray-100 pb-4 sm:flex-row sm:items-center dark:border-gray-800">
        <div>
          <h3 className="flex items-center gap-2 text-xl font-extrabold text-gray-900 dark:text-gray-100">
            <User className="h-5 w-5 text-emerald-700" />
            <span>{t('personalInfo')}</span>
          </h3>
          <p className="mt-0.5 text-xs font-medium text-gray-400">
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
                className="cursor-pointer bg-emerald-800 text-xs text-white hover:bg-emerald-900"
              >
                {t('saveChanges')}
              </ButtonLoading>
            </>
          ) : (
            <Button
              variant="outline"
              size="sm"
              onClick={handleStartEdit}
              className="flex cursor-pointer items-center gap-1.5 border-gray-300 text-xs hover:border-emerald-600 hover:text-emerald-700"
            >
              <Edit2 className="h-3.5 w-3.5" />
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
