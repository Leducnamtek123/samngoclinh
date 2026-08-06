'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
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
import { Card } from '@/components/ui/card';
import { signUpSchema, type SignUpFormValues } from '@/lib/validation/schemas';

export default function SignUpForm() {
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

    fetch('/api/auth/sign-up', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: values.fullName,
        email: values.email,
        phone: values.phone,
        password: values.password,
      }),
    })
      .then(async (res) => {
        if (!res.ok) {
          const data = await res.json().catch(() => ({}));
          throw new Error(data.message || 'Đăng ký không thành công.');
        }
        return res.json().catch(() => null);
      })
      .then(() => {
        setSuccess('Đăng ký tài khoản thành công! Đang chuyển đến trang đăng nhập...');
        setTimeout(() => {
          window.location.href = '/sign-in';
        }, 1500);
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
            Tạo tài khoản mới
          </h1>
          <p className="text-xs text-gray-500 font-medium">
            Đăng ký tài khoản để trải nghiệm dịch vụ Sâm Ngọc Linh cao cấp
          </p>
        </div>

        {error && (
          <div className="p-3.5 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl font-medium flex items-center gap-1.5 leading-relaxed">
            <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-xl font-medium flex items-center gap-1.5 leading-relaxed">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{success}</span>
          </div>
        )}

        <Form form={form} onSubmit={form.handleSubmit(onSignUpSubmit)} className="space-y-4">
          <FormFloatingInput
            control={form.control}
            name="fullName"
            label="Họ và tên"
            required
            prefixIcon={<User className="w-4 h-4" />}
          />

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

          <FormCheckbox control={form.control} name="agreeTerms">
            Tôi đồng ý với <span className="text-emerald-700 font-bold">Điều khoản dịch vụ</span> & <span className="text-emerald-700 font-bold">Chính sách bảo mật</span>
          </FormCheckbox>

          <ButtonLoading
            type="submit"
            isLoading={loading}
            variant="default"
            className="w-full mt-2"
          >
            {loading ? 'Đang khởi tạo tài khoản...' : 'Tạo tài khoản mới'}
          </ButtonLoading>
        </Form>

        <div className="pt-4 border-t border-gray-150 text-center">
          <p className="text-xs text-gray-500 font-medium">
            Bạn đã có tài khoản?{' '}
            <Link href="/sign-in" className="text-emerald-700 font-bold hover:underline">
              Đăng nhập ngay
            </Link>
          </p>
        </div>
      </Card>
    </div>
  );
}
