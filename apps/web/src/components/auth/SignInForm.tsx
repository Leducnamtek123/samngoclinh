'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Mail, Lock, AlertCircle, CheckCircle2, X } from 'lucide-react';
import {
  Form,
  FormCheckbox,
  FormFloatingInput,
} from '@/components/ui/form';
import { Button, ButtonLoading } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Env } from '@/lib/Env';
import {
  signInEmailSchema,
  type SignInEmailFormValues,
} from '@/lib/validation/schemas';

function ReasonToast({ reason, onClose }: { reason: string; onClose: () => void }) {
  const getReasonMessage = (resVal: string | null) => {
    switch (resVal) {
      case 'campaigns':
        return {
          title: 'Vui lòng đăng nhập',
          description: 'Bạn cần đăng nhập để nhận cây sâm 1 năm.',
        };
      case 'ginseng':
        return {
          title: 'Vui lòng đăng nhập',
          description: 'Bạn cần đăng nhập để truy cập tính năng Trồng sâm.',
        };
      case 'cart':
        return {
          title: 'Vui lòng đăng nhập',
          description: 'Bạn cần đăng nhập để xem giỏ hàng của mình.',
        };
      default:
        return {
          title: 'Vui lòng đăng nhập',
          description: 'Bạn cần đăng nhập để tiếp tục truy cập trang này.',
        };
    }
  };

  const message = getReasonMessage(reason);
  return (
    <div className="fixed bottom-6 right-6 z-50 max-w-sm w-full bg-[#EF4444] text-white rounded-2xl shadow-2xl p-4 flex gap-3.5 border border-red-400/20 animate-in fade-in slide-in-from-bottom-10 duration-300">
      <div className="bg-white/20 p-2 rounded-xl h-10 w-10 flex items-center justify-center shrink-0">
        <AlertCircle className="w-5 h-5 text-white" />
      </div>
      <div className="flex-1 space-y-1">
        <h4 className="font-bold text-sm tracking-wide text-left">{message.title}</h4>
        <p className="text-xs text-white/90 font-medium leading-relaxed text-left">{message.description}</p>
      </div>
      <button 
        type="button" 
        onClick={onClose} 
        className="text-white/70 hover:text-white transition-colors shrink-0 align-top self-start cursor-pointer"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}

export default function SignInForm() {
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

  const onEmailSubmit = (values: SignInEmailFormValues) => {
    setLoading(true);
    setError('');
    setInfoMessage('');

    fetch('/api/auth/sign-in', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: values.email, password: values.password, type: 'email' }),
    })
      .then(async (res) => {
        if (!res.ok) {
          const data = await res.json().catch(() => ({}));
          throw new Error(data.message || 'Đăng nhập thất bại. Vui lòng kiểm tra lại email hoặc mật khẩu.');
        }
        return res.json();
      })
      .then((data) => {
        if (data.email && (data.email === 'admin@mail.com' || data.email.includes('admin'))) {
          const adminBaseUrl = Env.NEXT_PUBLIC_ADMIN_URL || 'http://localhost:3003';
          window.location.href = `${adminBaseUrl}/en`;
        } else {
          window.location.href = '/';
        }
      })
      .catch((err: any) => {
        setError(err.message || 'Đã xảy ra lỗi kết nối');
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <div className="w-full min-h-[calc(100vh-120px)] bg-gray-50 dark:bg-gray-950 flex items-center justify-center py-12 px-4">
      <Card className="w-full max-w-md p-8 space-y-6 shadow-xl border-gray-200 dark:border-gray-800">
        <div className="space-y-3 text-center">
          <Image
            src="/assets/images/logo_ruou_sam.png?v=2"
            alt="Rượu Sâm Ngọc Linh Logo"
            width={64}
            height={64}
            unoptimized
            className="mx-auto h-16 w-16 object-contain"
          />
          <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-gray-100">
            Đăng nhập tài khoản
          </h1>
          <p className="text-xs text-gray-500 font-medium">Nhập email và mật khẩu của bạn để tiếp tục</p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-xs font-medium flex items-center gap-1.5">
            <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {infoMessage && (
          <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 px-4 py-3 rounded-xl text-xs font-medium flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{infoMessage}</span>
          </div>
        )}

        <Form form={emailForm} onSubmit={emailForm.handleSubmit(onEmailSubmit)} className="space-y-5">
          <FormFloatingInput
            control={emailForm.control}
            name="email"
            type="email"
            label="Địa chỉ Email"
            required
            prefixIcon={<Mail className="w-4 h-4" />}
          />

          <FormFloatingInput
            control={emailForm.control}
            name="password"
            type="password"
            label="Mật khẩu"
            required
            prefixIcon={<Lock className="w-4 h-4" />}
          />

          <FormCheckbox control={emailForm.control} name="remember">
            Tin tưởng thiết bị này 30 ngày
          </FormCheckbox>

          <ButtonLoading
            type="submit"
            isLoading={loading}
            variant="default"
            className="w-full"
          >
            Đăng nhập
          </ButtonLoading>
        </Form>

        <div className="pt-4 border-t border-gray-150 dark:border-gray-800 text-center space-y-3">
          <p className="text-xs text-gray-500 font-medium">Bạn chưa có tài khoản?</p>
          <Button
            asChild
            variant="emerald"
            className="w-full"
          >
            <a href="/sign-up">Tạo tài khoản mới</a>
          </Button>
        </div>
      </Card>
      {showToast && reason && <ReasonToast reason={reason} onClose={() => setShowToast(false)} />}
    </div>
  );
}
