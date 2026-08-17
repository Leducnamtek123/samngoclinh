'use client';

import React, { useState } from 'react';
import { useTranslations } from 'next-intl';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { KeyRound, Check, AlertCircle } from 'lucide-react';
import { userService } from '@/services/user.service';
import { toast } from 'sonner';
import { Form, FormPassword } from '@/components/ui/form';
import { ButtonLoading } from '@/components/ui/button';
import {
  changePasswordSchema,
  type ChangePasswordFormValues,
} from '@/lib/validation/schemas';

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
    } catch (err: any) {
      setErrorMsg(
        err?.message || t('updateError')
      );
    }
    setIsSubmitting(false);
  };

  return (
    <Form
      form={form}
      onSubmit={form.handleSubmit(onValidSubmit)}
      className="space-y-6 max-w-lg transition-opacity animate-in fade-in duration-200"
    >
      <div className="flex items-center gap-2.5 pb-2 border-b border-gray-100 dark:border-gray-800">
        <div className="p-2 rounded-lg bg-emerald-50 text-emerald-700">
          <KeyRound className="w-4 h-4" />
        </div>
        <div>
          <h3 className="font-bold text-gray-900 dark:text-gray-100 text-base">
            {t('title')}
          </h3>
          <p className="text-xs text-gray-400 font-normal">
            {t('subtitle')}
          </p>
        </div>
      </div>

      {errorMsg && (
        <div className="p-3.5 bg-red-50 border border-red-200 text-red-700 rounded-xl text-xs font-semibold flex items-center gap-2">
          <AlertCircle className="w-4 h-4 flex-shrink-0 text-red-500" />
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
      <div className="pt-3 border-t border-gray-100 dark:border-gray-800">
        <ButtonLoading
          type="submit"
          isLoading={isSubmitting}
          variant="default"
          className="w-full flex items-center justify-center gap-2"
        >
          {!isSubmitting && <Check className="w-4 h-4" />}
          <span>{isSubmitting ? t('updating') : t('updatePasswordBtn')}</span>
        </ButtonLoading>
      </div>
    </Form>
  );
};
