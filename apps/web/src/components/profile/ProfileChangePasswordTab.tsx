'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { KeyRound, Check, AlertCircle } from 'lucide-react';
import { useTranslations } from 'next-intl';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { ButtonLoading } from '@/components/ui/button';
import { Form, FormPassword } from '@/components/ui/form';
import { changePasswordSchema } from '@/lib/validation/schemas';
import type { ChangePasswordFormValues } from '@/lib/validation/schemas';
import { userService } from '@/services/user.service';

type ProfileChangePasswordTabProps = {
  locale?: string;
};

export const ProfileChangePasswordTab: React.FC<ProfileChangePasswordTabProps> = ({
  locale = 'vi',
}) => {
  const t = useTranslations('security');
  const [errorMsg, setErrorMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<ChangePasswordFormValues>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      oldPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
  });

  const onValidSubmit = async (values: ChangePasswordFormValues) => {
    setErrorMsg('');
    setIsSubmitting(true);
    try {
      await userService.changePassword({
        currentPassword: values.oldPassword,
        newPassword: values.newPassword,
      });

      toast.success(t('updateSuccess'));
      form.reset();

      setTimeout(() => {
        window.location.href = `/${locale}/sign-in?reason=password_changed`;
      }, 1500);
    } catch (error: unknown) {
      setErrorMsg(error instanceof Error ? error.message : t('updateError'));
    }
    setIsSubmitting(false);
  };

  return (
    <Form
      form={form}
      onSubmit={form.handleSubmit(onValidSubmit)}
      className="animate-in fade-in max-w-lg space-y-6 transition-opacity duration-200"
    >
      <div className="flex items-center gap-2.5 border-b border-gray-100 pb-2 dark:border-gray-800">
        <div className="rounded-lg bg-emerald-50 p-2 text-emerald-700">
          <KeyRound className="h-4 w-4" />
        </div>
        <div>
          <h3 className="text-base font-bold text-gray-900 dark:text-gray-100">{t('title')}</h3>
          <p className="text-xs font-normal text-gray-400">{t('subtitle')}</p>
        </div>
      </div>

      {errorMsg && (
        <div className="flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 p-3.5 text-xs font-semibold text-red-700">
          <AlertCircle className="h-4 w-4 flex-shrink-0 text-red-500" />
          <span>{errorMsg}</span>
        </div>
      )}

      <FormPassword
        control={form.control}
        name="oldPassword"
        label={t('currentPassword')}
        placeholder={t('currentPasswordPlaceholder')}
        required
      />

      <FormPassword
        control={form.control}
        name="newPassword"
        label={t('newPassword')}
        placeholder={t('newPasswordPlaceholder')}
        required
      />

      <FormPassword
        control={form.control}
        name="confirmPassword"
        label={t('confirmPassword')}
        placeholder={t('confirmPasswordPlaceholder')}
        required
      />

      {/* Submit Button */}
      <div className="border-t border-gray-100 pt-3 dark:border-gray-800">
        <ButtonLoading
          type="submit"
          isLoading={isSubmitting}
          variant="default"
          className="flex w-full items-center justify-center gap-2"
        >
          {!isSubmitting && <Check className="h-4 w-4" />}
          <span>{isSubmitting ? t('updating') : t('updatePasswordBtn')}</span>
        </ButtonLoading>
      </div>
    </Form>
  );
};
