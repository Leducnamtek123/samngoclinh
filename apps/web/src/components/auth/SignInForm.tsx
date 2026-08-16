'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useLocale } from 'next-intl';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Mail, Lock, AlertCircle, CheckCircle2, X } from 'lucide-react';
import { Link } from '@/lib/I18nNavigation';
import {
  Form,
  FormCheckbox,
  FormFloatingInput,
} from '@/components/ui/form';
import { Button, ButtonLoading } from '@/components/ui/button';
import {
  signInEmailSchema,
  type SignInEmailFormValues,
} from '@/lib/validation/schemas';
import { useSearchParams } from 'next/navigation';
import { apiSignIn } from '@/services/auth.service';

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
    <div className="fixed bottom-6 right-6 z-50 max-w-sm w-full bg-[#EF4444] text-white rounded-2xl shadow-2xl p-4 flex gap-3.5 border border-red-400/20 transition-opacity animate-in fade-in slide-in-from-bottom-10 duration-300">
      <div className="bg-white/20 p-2 rounded-xl h-10 w-10 flex items-center justify-center shrink-0">
        <AlertCircle className="w-5 h-5 text-white" />
      </div>
      <div className="flex-1 space-y-1">
        <h4 className="font-bold text-sm tracking-wide text-left">{message.title}</h4>
        <p className="text-xs text-white/90 font-medium leading-relaxed text-left">{message.description}</p>
      </div>
      <Button 
        type="button" 
        variant="ghost"
        size="icon"
        onClick={onClose} 
        className="text-white/70 hover:text-white hover:bg-white/10 shrink-0 h-6 w-6 p-0 cursor-pointer"
      >
        <X className="w-4 h-4" />
      </Button>
    </div>
  );
}

export default function SignInForm() {
  const locale = useLocale();
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
      const data = await apiSignIn({ email: values.email, password: values.password, type: 'email' });
      const targetUrl = data.redirectUrl || `/${locale}`;
      window.location.assign(targetUrl);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Đã xảy ra lỗi kết nối';
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
                alt="Sâm Ngọc Linh Logo"
                width={48}
                height={48}
                unoptimized
                className="h-12 w-12 object-contain"
              />
              <div>
                <span className="font-display font-black text-lg tracking-tight block text-white">Sâm Ngọc Linh</span>
                <span className="text-[10px] text-amber-300 uppercase tracking-widest block font-bold">Quốc Bảo Dược Liệu</span>
              </div>
            </Link>

            <div className="space-y-3 pt-6">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-800/80 border border-emerald-600/60 text-emerald-200 text-xs font-bold">
                Cổng Thành Viên & Nhà Đầu Tư
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-white font-display leading-tight">
                Bảo Tồn & Phát Triển Dược Liệu Thượng Hạng
              </h2>
              <p className="text-xs sm:text-sm text-emerald-100/80 leading-relaxed font-normal">
                Đăng nhập để theo dõi sinh trưởng vườn luống, quản lý hợp đồng điện tử và nhận đặc quyền thu hoạch sâm định kỳ.
              </p>
            </div>
          </div>

          <div className="pt-8 border-t border-emerald-800/60 space-y-2 relative z-10 text-xs text-emerald-200/70">
            <p className="font-semibold text-white">Hệ Thống Xác Thực An Toàn</p>
            <p className="text-[11px] leading-relaxed">Mã hóa 256-bit chuẩn eKYC & hợp đồng điện tử bảo chứng pháp lý.</p>
          </div>
        </div>

        {/* Right Side: Form Inputs */}
        <div className="lg:col-span-7 p-8 sm:p-12 flex flex-col justify-center space-y-6">
          <div className="space-y-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-gray-900 dark:text-gray-100 font-display">
              Đăng nhập tài khoản
            </h1>
            <p className="text-xs sm:text-sm text-gray-500 font-normal">
              Nhập email và mật khẩu của bạn để truy cập hệ thống
            </p>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-xs font-medium flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {infoMessage && (
            <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 px-4 py-3 rounded-xl text-xs font-medium flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{infoMessage}</span>
            </div>
          )}

          <Form form={emailForm} onSubmit={emailForm.handleSubmit(onEmailSubmit)} className="space-y-4">
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

            <div className="flex items-center justify-between pt-1">
              <FormCheckbox control={emailForm.control} name="remember">
                <span className="text-xs text-gray-600 dark:text-gray-400">Ghi nhớ đăng nhập 30 ngày</span>
              </FormCheckbox>
            </div>

            <ButtonLoading
              type="submit"
              isLoading={loading}
              variant="default"
              className="w-full py-3.5 rounded-xl bg-primary hover:bg-primary-hover text-white font-bold text-sm shadow-md transition-[transform,background-color] active:scale-[0.98] cursor-pointer"
            >
              Đăng nhập ngay
            </ButtonLoading>
          </Form>

          <div className="pt-6 border-t border-gray-100 dark:border-gray-800 text-center space-y-3">
            <p className="text-xs text-gray-500 font-normal">Bạn chưa có tài khoản thành viên?</p>
            <Button
              asChild
              variant="outline"
              className="w-full py-3 rounded-xl border-gray-200 hover:bg-gray-50 text-xs font-bold text-gray-800 transition-[transform,background-color] active:scale-[0.98]"
            >
              <Link href="/sign-up">Tạo tài khoản mới</Link>
            </Button>
          </div>
        </div>
      </div>

      {showToast && reason && <ReasonToast reason={reason} onClose={() => setShowToast(false)} />}
    </div>
  );
}
