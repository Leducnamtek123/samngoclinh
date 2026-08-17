'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { Link } from '@/lib/I18nNavigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { User, Mail, Lock, AlertCircle, CheckCircle2 } from 'lucide-react';
import {
  Form,
  FormPhoneInput,
  FormCheckbox,
  FormFloatingInput,
} from '@/components/ui/form';
import { ButtonLoading } from '@/components/ui/button';
import { signUpSchema, type SignUpFormValues } from '@/lib/validation/schemas';
import { useRouter } from 'next/navigation';
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
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : t('signUpFailed');
      setError(msg);
    }
    setLoading(false);
  };

  return (
    <div className="w-full min-h-[calc(100vh-120px)] bg-brand-bg flex items-center justify-center py-8 sm:py-16 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-5xl bg-white dark:bg-slate-900 rounded-3xl border border-gray-200 dark:border-gray-800 shadow-2xl overflow-hidden grid grid-cols-1 lg:grid-cols-12">
        {/* Left Side: Brand Story & Heritage Panel */}
        <div className="lg:col-span-5 bg-gradient-to-br from-emerald-950 via-[#122B18] to-slate-950 p-8 sm:p-10 text-white flex flex-col justify-between relative overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 bg-amber-400/10 rounded-full blur-3xl pointer-events-none" />
          
          <div className="space-y-6 relative z-10">
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
                <span className="font-display font-black text-lg tracking-tight block text-white">Sâm Ngọc Linh</span>
                <span className="text-[10px] text-amber-300 uppercase tracking-widest block font-bold">{t('brandTagline')}</span>
              </div>
            </Link>

            <div className="space-y-3 pt-6">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-800/80 border border-emerald-600/60 text-emerald-200 text-xs font-bold">
                {t('title')}
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-white font-display leading-tight">
                {t('subtitle')}
              </h2>
              <p className="text-xs sm:text-sm text-emerald-100/80 leading-relaxed font-normal">
                {t('meta_description')}
              </p>
            </div>
          </div>

          <div className="pt-8 border-t border-emerald-800/60 space-y-2 relative z-10 text-xs text-emerald-200/70">
            <p className="font-semibold text-white">{t('securityBadge')}</p>
            <p className="text-[11px] leading-relaxed">{t('securityDesc')}</p>
          </div>
        </div>

        {/* Right Side: Form Inputs */}
        <div className="lg:col-span-7 p-8 sm:p-12 flex flex-col justify-center space-y-6">
          <div className="space-y-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-gray-900 dark:text-gray-100 font-display">
              {t('title')}
            </h1>
            <p className="text-xs sm:text-sm text-gray-500 font-normal">
              {t('subtitle')}
            </p>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-xs font-medium flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 px-4 py-3 rounded-xl text-xs font-medium flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
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
              prefixIcon={<User className="w-4 h-4" />}
            />

            <FormFloatingInput
              control={form.control}
              name="email"
              type="email"
              label={t('emailLabel')}
              placeholder={t('emailPlaceholder')}
              required
              prefixIcon={<Mail className="w-4 h-4" />}
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
              prefixIcon={<Lock className="w-4 h-4" />}
            />

            <FormFloatingInput
              control={form.control}
              name="confirmPassword"
              type="password"
              label={t('confirmPasswordLabel')}
              placeholder={t('confirmPasswordPlaceholder')}
              required
              prefixIcon={<Lock className="w-4 h-4" />}
            />

            <div className="pt-1">
              <FormCheckbox control={form.control} name="agreeTerms">
                <span className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
                  {t('agreeTermsPrefix')}{' '}
                  <Link href="/terms/terms-of-service" target="_blank" className="text-emerald-700 font-semibold hover:underline">
                    {t('termsOfService')}
                  </Link>{' '}
                  {t('andWord')}{' '}
                  <Link href="/terms/privacy-policy" target="_blank" className="text-emerald-700 font-semibold hover:underline">
                    {t('privacyPolicy')}
                  </Link>
                </span>
              </FormCheckbox>
            </div>

            <ButtonLoading
              type="submit"
              isLoading={loading}
              variant="default"
              className="w-full py-3.5 rounded-xl bg-primary hover:bg-primary-hover text-white font-bold text-sm shadow-md transition-[transform,background-color] active:scale-[0.98] cursor-pointer"
            >
              {t('submitBtn')}
            </ButtonLoading>
          </Form>

          <div className="pt-6 border-t border-gray-100 dark:border-gray-800 text-center space-y-3">
            <p className="text-xs text-gray-500 font-normal">{t('hasAccount')}</p>
            <ButtonLoading
              type="button"
              variant="outline"
              className="w-full py-3 rounded-xl border-gray-200 hover:bg-gray-50 text-xs font-bold text-gray-800 transition-[transform,background-color] active:scale-[0.98]"
              onClick={() => router.push('/sign-in')}
            >
              {t('signInNow')}
            </ButtonLoading>
          </div>
        </div>
      </div>
    </div>
  );
}
