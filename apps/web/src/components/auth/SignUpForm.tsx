'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Link } from '@/lib/I18nNavigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { User, Mail, Lock, ShieldCheck, AlertCircle, CheckCircle2 } from 'lucide-react';
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

      setSuccess('Đăng ký tài khoản thành công! Đang chuyển đến trang đăng nhập...');
      setTimeout(() => {
        router.push('/sign-in');
      }, 1500);
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
                Đặc Quyền Thành Viên Mới
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-white font-display leading-tight">
                Gia Nhập Cộng Đồng Sở Hữu Sâm Ngọc Linh
              </h2>
              <p className="text-xs sm:text-sm text-emerald-100/80 leading-relaxed font-normal">
                Đăng ký ngay để nhận cơ hội tham gia chương trình tài trợ cây giống, ký gửi chăm sóc tại vườn farm chuẩn GACP-WHO và hưởng ưu đãi dành riêng.
              </p>
            </div>
          </div>

          <div className="pt-8 border-t border-emerald-800/60 space-y-2 relative z-10 text-xs text-emerald-200/70">
            <p className="font-semibold text-white">Bảo Mật Tuyệt Đối</p>
            <p className="text-[11px] leading-relaxed">Thông tin cá nhân được bảo vệ theo Nghị định 13/2023/NĐ-CP.</p>
          </div>
        </div>

        {/* Right Side: Form Inputs */}
        <div className="lg:col-span-7 p-8 sm:p-12 flex flex-col justify-center space-y-6">
          <div className="space-y-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-gray-900 dark:text-gray-100 font-display">
              Tạo tài khoản mới
            </h1>
            <p className="text-xs sm:text-sm text-gray-500 font-normal">
              Đăng ký để bắt đầu trải nghiệm dịch vụ Sâm Ngọc Linh cao cấp
            </p>
          </div>

          {error && (
            <div className="p-3.5 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl font-medium flex items-center gap-2 leading-relaxed">
              <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div className="p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-xl font-medium flex items-center gap-2 leading-relaxed">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{success}</span>
            </div>
          )}

          <Form form={form} onSubmit={form.handleSubmit(onSignUpSubmit)} className="space-y-3.5">
            <FormFloatingInput
              control={form.control}
              name="fullName"
              label="Họ và tên"
              required
              prefixIcon={<User className="w-4 h-4" />}
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <FormFloatingInput
                control={form.control}
                name="email"
                type="email"
                label="Địa chỉ Email"
                required
                prefixIcon={<Mail className="w-4 h-4" />}
              />

              <FormPhoneInput
                control={form.control}
                name="phone"
                label="Số điện thoại"
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <FormFloatingInput
                control={form.control}
                name="password"
                type="password"
                label="Mật khẩu"
                required
                prefixIcon={<Lock className="w-4 h-4" />}
              />

              <FormFloatingInput
                control={form.control}
                name="confirmPassword"
                type="password"
                label="Xác nhận mật khẩu"
                required
                prefixIcon={<ShieldCheck className="w-4 h-4" />}
              />
            </div>

            <FormCheckbox control={form.control} name="agreeTerms">
              <span className="text-xs text-gray-600 dark:text-gray-400">
                Tôi đồng ý với <Link href="/terms" className="text-emerald-700 font-bold hover:underline">Điều khoản</Link> & <Link href="/privacy" className="text-emerald-700 font-bold hover:underline">Chính sách bảo mật</Link>
              </span>
            </FormCheckbox>

            <ButtonLoading
              type="submit"
              isLoading={loading}
              variant="default"
              className="w-full py-3.5 rounded-xl bg-primary hover:bg-primary-hover text-white font-bold text-sm shadow-md transition-[transform,background-color] active:scale-[0.98] cursor-pointer mt-2"
            >
              {loading ? 'Đang khởi tạo tài khoản...' : 'Tạo tài khoản mới'}
            </ButtonLoading>
          </Form>

          <div className="pt-6 border-t border-gray-100 dark:border-gray-800 text-center">
            <p className="text-xs text-gray-500 font-normal">
              Bạn đã có tài khoản thành viên?{' '}
              <Link href="/sign-in" className="text-emerald-700 font-bold hover:underline">
                Đăng nhập ngay
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
