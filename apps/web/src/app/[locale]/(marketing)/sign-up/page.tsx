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
    <div className="w-full min-h-[calc(100vh-120px)] bg-gray-50 flex items-center justify-center py-12 px-4">
      <div className="w-full max-w-md bg-white border border-gray-200 rounded-3xl shadow-xl p-8 space-y-6 text-center">
        <div className="space-y-2">
          <img
            src="/assets/images/logo_ruou_sam.png"
            alt="Rượu Sâm Ngọc Linh Logo"
            className="mx-auto h-16 w-16 rounded-full object-cover shadow-sm border border-gray-100"
          />
          <h1 className="text-2xl font-bold tracking-tight text-gray-900 font-display-lg">
            Đăng ký tài khoản mới
          </h1>
          <p className="text-sm text-gray-500">
            Tính năng tự đăng ký tài khoản hiện đang được bảo trì thử nghiệm.
          </p>
        </div>

        <div className="bg-gray-50 rounded-2xl p-5 border border-gray-150 text-left space-y-2.5">
          <h4 className="text-xs font-bold text-gray-600 uppercase tracking-wider">Tài khoản thử nghiệm hệ thống:</h4>
          <div className="text-sm space-y-2 text-gray-700 font-medium">
            <p>
              • <strong>Khách hàng:</strong> <code className="bg-white px-2 py-0.5 border border-gray-200 rounded">user@mail.com</code> / <code className="bg-white px-2 py-0.5 border border-gray-200 rounded">aaAA@123</code>
            </p>
            <p>
              • <strong>Quản trị viên:</strong> <code className="bg-white px-2 py-0.5 border border-gray-200 rounded">admin@mail.com</code> / <code className="bg-white px-2 py-0.5 border border-gray-200 rounded">aaAA@123</code>
            </p>
          </div>
        </div>

        <Link
          href="/sign-in"
          className="block w-full bg-[#1C3F24] hover:bg-[#15301B] text-white font-bold py-3.5 rounded-xl shadow-md transition-all text-sm"
        >
          Quay lại Đăng nhập
        </Link>
      </div>
    </div>
  );
}
