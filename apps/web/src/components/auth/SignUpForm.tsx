'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { User, Mail, Lock, AlertCircle, CheckCircle2 } from 'lucide-react';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { ButtonLoading } from '@/components/ui/button';
import { Form, FormPhoneInput, FormCheckbox, FormFloatingInput } from '@/components/ui/form';
import { Link } from '@/lib/I18nNavigation';
import { signUpSchema } from '@/lib/validation/schemas';
import type { SignUpFormValues } from '@/lib/validation/schemas';
import { apiSignUp } from '@/services/auth.service';

export default function SignUpForm() {
  const router = useRouter();
  const t = useTranslations('SignUp');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const form = useForm<SignUpFormValues>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      fullName: '',
      email: '',
      phone: '',
      password: '',
      confirmPassword: '',
      agreeTerms: true,
    },
  });

  const onSignUpSubmit = async (values: SignUpFormValues) => {
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      await apiSignUp({
        name: values.fullName,
        email: values.email,
        phone: values.phone,
        password: values.password,
      });

      setSuccess(t('signUpSuccess'));
      setTimeout(() => {
        router.push('/sign-in');
      }, 1500);
    } catch (error: unknown) {
      const msg = error instanceof Error ? error.message : t('signUpFailed');
      setError(msg);
    }
    setLoading(false);
  };

  return (
    <div className="flex min-h-[calc(100vh-120px)] w-full items-center justify-center bg-brand-bg px-4 py-8 sm:px-6 sm:py-16 lg:px-8">
      <div className="grid w-full max-w-5xl grid-cols-1 overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-2xl lg:grid-cols-12 dark:border-gray-800 dark:bg-slate-900">
        {/* Left Side: Brand Story & Heritage Panel */}
        <div className="relative flex flex-col justify-between overflow-hidden bg-gradient-to-br from-emerald-950 via-[#122B18] to-slate-950 p-8 text-white sm:p-10 lg:col-span-5">
          <div className="pointer-events-none absolute top-0 right-0 h-80 w-80 rounded-full bg-amber-400/10 blur-3xl" />

          <div className="relative z-10 space-y-6">
            <Link href="/" className="inline-flex items-center gap-3">
              <Image
                src="/assets/images/logo_ruou_sam.png?v=2"
                alt="Logo"
                width={48}
                height={48}
                unoptimized
                className="h-12 w-12 object-contain"
              />
              <div>
                <span className="block font-display text-lg font-black tracking-tight text-white">
                  Sâm Ngọc Linh
                </span>
                <span className="block text-[10px] font-bold tracking-widest text-amber-300 uppercase">
                  {t('brandTagline')}
                </span>
              </div>
            </Link>

            <div className="space-y-3 pt-6">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-600/60 bg-emerald-800/80 px-3 py-1 text-xs font-bold text-emerald-200">
                {t('title')}
              </span>
              <h2 className="font-display text-2xl leading-tight font-black text-white sm:text-3xl">
                {t('subtitle')}
              </h2>
              <p className="text-xs leading-relaxed font-normal text-emerald-100/80 sm:text-sm">
                {t('meta_description')}
              </p>
            </div>
          </div>

          <div className="relative z-10 space-y-2 border-t border-emerald-800/60 pt-8 text-xs text-emerald-200/70">
            <p className="font-semibold text-white">{t('securityBadge')}</p>
            <p className="text-[11px] leading-relaxed">{t('securityDesc')}</p>
          </div>
        </div>

        {/* Right Side: Form Inputs */}
        <div className="flex flex-col justify-center space-y-6 p-8 sm:p-12 lg:col-span-7">
          <div className="space-y-2">
            <h1 className="font-display text-2xl font-extrabold tracking-tight text-gray-900 sm:text-3xl dark:text-gray-100">
              {t('title')}
            </h1>
            <p className="text-xs font-normal text-gray-500 sm:text-sm">{t('subtitle')}</p>
          </div>

          {error && (
            <div className="flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-xs font-medium text-red-700">
              <AlertCircle className="h-4 w-4 shrink-0 text-red-500" />
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div className="flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-xs font-medium text-emerald-700">
              <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600" />
              <span>{success}</span>
            </div>
          )}

          <Form form={form} onSubmit={form.handleSubmit(onSignUpSubmit)} className="space-y-4">
            <FormFloatingInput
              control={form.control}
              name="fullName"
              label={t('fullNameLabel')}
              placeholder={t('fullNamePlaceholder')}
              required
              prefixIcon={<User className="h-4 w-4" />}
            />

            <FormFloatingInput
              control={form.control}
              name="email"
              type="email"
              label={t('emailLabel')}
              placeholder={t('emailPlaceholder')}
              required
              prefixIcon={<Mail className="h-4 w-4" />}
            />

            <FormPhoneInput
              control={form.control}
              name="phone"
              label={t('phoneLabel')}
              placeholder={t('phonePlaceholder')}
              required
            />

            <FormFloatingInput
              control={form.control}
              name="password"
              type="password"
              label={t('passwordLabel')}
              placeholder={t('passwordPlaceholder')}
              required
              prefixIcon={<Lock className="h-4 w-4" />}
            />

            <FormFloatingInput
              control={form.control}
              name="confirmPassword"
              type="password"
              label={t('confirmPasswordLabel')}
              placeholder={t('confirmPasswordPlaceholder')}
              required
              prefixIcon={<Lock className="h-4 w-4" />}
            />

            <div className="pt-1">
              <FormCheckbox control={form.control} name="agreeTerms">
                <span className="text-xs leading-relaxed text-gray-600 dark:text-gray-400">
                  {t('agreeTermsPrefix')}{' '}
                  <Link
                    href="/terms/terms-of-service"
                    target="_blank"
                    className="font-semibold text-emerald-700 hover:underline"
                  >
                    {t('termsOfService')}
                  </Link>{' '}
                  {t('andWord')}{' '}
                  <Link
                    href="/terms/privacy-policy"
                    target="_blank"
                    className="font-semibold text-emerald-700 hover:underline"
                  >
                    {t('privacyPolicy')}
                  </Link>
                </span>
              </FormCheckbox>
            </div>

            <ButtonLoading
              type="submit"
              isLoading={loading}
              variant="default"
              className="w-full cursor-pointer rounded-xl bg-primary py-3.5 text-sm font-bold text-white shadow-md transition-[transform,background-color] hover:bg-primary-hover active:scale-[0.98]"
            >
              {t('submitBtn')}
            </ButtonLoading>
          </Form>

          <div className="space-y-3 border-t border-gray-100 pt-6 text-center dark:border-gray-800">
            <p className="text-xs font-normal text-gray-500">{t('hasAccount')}</p>
            <ButtonLoading
              type="button"
              variant="outline"
              className="w-full rounded-xl border-gray-200 py-3 text-xs font-bold text-gray-800 transition-[transform,background-color] hover:bg-gray-50 active:scale-[0.98]"
              onClick={() => {
                router.push('/sign-in');
              }}
            >
              {t('signInNow')}
            </ButtonLoading>
          </div>
        </div>
      </div>
    </div>
  );
}
