import Link from 'next/link';
import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';

type SignUpPageProps = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata(props: SignUpPageProps): Promise<Metadata> {
  const { locale } = await props.params;
  const t = await getTranslations({
    locale,
    namespace: 'SignUp',
  });

  return {
    title: t('meta_title'),
    description: t('meta_description'),
  };
}

export default async function SignUpPage(props: SignUpPageProps) {
  const { locale } = await props.params;
  setRequestLocale(locale);

  return (
    <div className="w-full max-w-md bg-white border border-gray-200 rounded-2xl shadow-xl p-8 space-y-6 text-center">
      <div className="space-y-2">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary text-2xl">
          🌱
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">
          Đăng ký iWE FARM
        </h1>
        <p className="text-sm text-gray-500">
          Tính năng tự đăng ký tài khoản hiện đang được bảo trì thử nghiệm.
        </p>
      </div>

      <div className="bg-gray-50 rounded-xl p-4 border border-gray-150 text-left space-y-2">
        <h4 className="text-xs font-bold text-gray-600 uppercase tracking-wider">Tài khoản thử nghiệm:</h4>
        <div className="text-sm space-y-1 text-gray-700">
          <p>• <strong>Email:</strong> <code className="bg-white px-1.5 py-0.5 border border-gray-200 rounded">user@mail.com</code></p>
          <p>• <strong>Mật khẩu:</strong> <code className="bg-white px-1.5 py-0.5 border border-gray-200 rounded">aaAA@123</code></p>
        </div>
      </div>

      <Link
        href="/sign-in"
        className="block w-full bg-primary text-white hover:bg-primary-hover active:bg-primary-dark font-semibold py-3 rounded-lg shadow-md transition-all text-sm"
      >
        Đi đến Đăng nhập
      </Link>
    </div>
  );
}
