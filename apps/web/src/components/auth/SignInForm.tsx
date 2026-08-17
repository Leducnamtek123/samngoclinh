'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Mail, Lock, AlertCircle, CheckCircle2, X } from 'lucide-react';
import { useLocale, useTranslations } from 'next-intl';
import Image from 'next/image';
import { useSearchParams } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Button, ButtonLoading } from '@/components/ui/button';
import { Form, FormCheckbox, FormFloatingInput } from '@/components/ui/form';
import { Link } from '@/lib/I18nNavigation';
import { signInEmailSchema } from '@/lib/validation/schemas';
import type { SignInEmailFormValues } from '@/lib/validation/schemas';
import { apiSignIn } from '@/services/auth.service';

function ReasonToast({ reason, onClose }: { reason: string; onClose: () => void }) {
  const tAuth = useTranslations('toasts');
  const getReasonMessage = (resVal: string | null) => {
    switch (resVal) {
      case 'campaigns': {
        return {
          title: tAuth('loginRequired'),
          description: tAuth('loginRequired'),
        };
      }
      case 'ginseng': {
        return {
          title: tAuth('loginRequired'),
          description: tAuth('loginRequired'),
        };
      }
      case 'cart': {
        return {
          title: tAuth('loginRequired'),
          description: tAuth('loginRequired'),
        };
      }
      default: {
        return {
          title: tAuth('loginRequired'),
          description: tAuth('loginRequired'),
        };
      }
    }
  };

  const message = getReasonMessage(reason);
  return (
    <div className="animate-in fade-in slide-in-from-bottom-10 fixed right-6 bottom-6 z-50 flex w-full max-w-sm gap-3.5 rounded-2xl border border-red-400/20 bg-[#EF4444] p-4 text-white shadow-2xl transition-opacity duration-300">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/20 p-2">
        <AlertCircle className="h-5 w-5 text-white" />
      </div>
      <div className="flex-1 space-y-1">
        <h4 className="text-left text-sm font-bold tracking-wide">{message.title}</h4>
        <p className="text-left text-xs leading-relaxed font-medium text-white/90">
          {message.description}
        </p>
      </div>
      <Button
        type="button"
        variant="ghost"
        size="icon"
        onClick={onClose}
        className="h-6 w-6 shrink-0 cursor-pointer p-0 text-white/70 hover:bg-white/10 hover:text-white"
      >
        <X className="h-4 w-4" />
      </Button>
    </div>
  );
}

export default function SignInForm() {
  const locale = useLocale();
  const t = useTranslations('SignIn');
  const searchParams = useSearchParams();
  const reason = searchParams?.get('reason');

  const [showToast, setShowToast] = useState(!!reason);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [infoMessage, setInfoMessage] = useState('');

  const emailForm = useForm<SignInEmailFormValues>({
    resolver: zodResolver(signInEmailSchema),
    defaultValues: {
      email: '',
      password: '',
      remember: true,
    },
  });

  const onEmailSubmit = async (values: SignInEmailFormValues) => {
    setLoading(true);
    setError('');
    setInfoMessage('');

    try {
      const data = await apiSignIn({
        email: values.email,
        password: values.password,
        type: 'email',
      });
      const targetUrl = data.redirectUrl || `/${locale}`;
      window.location.assign(targetUrl);
    } catch (error: unknown) {
      const msg = error instanceof Error ? error.message : t('signInFailed');
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
            <p className="font-semibold text-white">SSL 256-bit Security</p>
            <p className="text-[11px] leading-relaxed">
              eKYC Verified &amp; Legal E-Contract System.
            </p>
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

          {infoMessage && (
            <div className="flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-xs font-medium text-emerald-700">
              <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600" />
              <span>{infoMessage}</span>
            </div>
          )}

          <Form
            form={emailForm}
            onSubmit={emailForm.handleSubmit(onEmailSubmit)}
            className="space-y-4"
          >
            <FormFloatingInput
              control={emailForm.control}
              name="email"
              type="email"
              label={t('identifierLabel')}
              placeholder={t('identifierPlaceholder')}
              required
              prefixIcon={<Mail className="h-4 w-4" />}
            />

            <FormFloatingInput
              control={emailForm.control}
              name="password"
              type="password"
              label={t('passwordLabel')}
              placeholder={t('passwordPlaceholder')}
              required
              prefixIcon={<Lock className="h-4 w-4" />}
            />

            <div className="flex items-center justify-between pt-1">
              <FormCheckbox control={emailForm.control} name="remember">
                <span className="text-xs text-gray-600 dark:text-gray-400">{t('rememberMe')}</span>
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
            <p className="text-xs font-normal text-gray-500">{t('noAccount')}</p>
            <Button
              asChild
              variant="outline"
              className="w-full rounded-xl border-gray-200 py-3 text-xs font-bold text-gray-800 transition-[transform,background-color] hover:bg-gray-50 active:scale-[0.98]"
            >
              <Link href="/sign-up">{t('signUpNow')}</Link>
            </Button>
          </div>
        </div>
      </div>

      {showToast && reason && (
        <ReasonToast
          reason={reason}
          onClose={() => {
            setShowToast(false);
          }}
        />
      )}
    </div>
  );
}
