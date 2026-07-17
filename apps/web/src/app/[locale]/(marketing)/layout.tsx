import { setRequestLocale } from 'next-intl/server';
import { cookies } from 'next/headers';
import { LocaleSwitcher } from '@/components/LocaleSwitcher';
import { Link } from '@/libs/I18nNavigation';
import { BaseTemplate } from '@/templates/BaseTemplate';

export default async function Layout(props: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await props.params;
  setRequestLocale(locale);

  const cookieStore = await cookies();
  const token = cookieStore.get('user_session')?.value;

  return (
    <>
      <BaseTemplate
        leftNav={
          <>
            <li>
              <Link href="/" className="text-gray-600 hover:text-primary transition-colors">
                Trang chủ
              </Link>
            </li>
            <li>
              <Link href="#" className="text-gray-600 hover:text-primary transition-colors">
                Khuyến mãi
              </Link>
            </li>
            <li>
              <Link href="#" className="text-gray-600 hover:text-primary transition-colors">
                Trồng sâm
              </Link>
            </li>
            <li>
              <Link href="#" className="text-gray-600 hover:text-primary transition-colors">
                Cửa hàng
              </Link>
            </li>
            <li>
              <Link href="#" className="text-gray-600 hover:text-primary transition-colors">
                Thông tin
              </Link>
            </li>
            <li>
              <Link href="#" className="text-gray-600 hover:text-primary transition-colors">
                Ký gửi
              </Link>
            </li>
            <li>
              <Link href="/about/" className="text-gray-600 hover:text-primary transition-colors">
                Giới thiệu
              </Link>
            </li>
          </>
        }
        rightNav={
          <>
            {token ? (
              <>
                <li>
                  <Link href="/dashboard/" className="text-primary hover:text-primary-hover font-bold transition-colors px-3 py-2">
                    Vào Dashboard
                  </Link>
                </li>
                <li>
                  <Link href="/dashboard/user-profile/" className="text-gray-700 hover:text-primary transition-colors px-3 py-2">
                    Tài khoản
                  </Link>
                </li>
              </>
            ) : (
              <>
                <li>
                  <Link href="/sign-in/" className="text-gray-700 hover:text-primary transition-colors px-3 py-2">
                    Đăng nhập
                  </Link>
                </li>
                <li>
                  <Link href="/sign-up/" className="bg-secondary text-white hover:bg-secondary-hover transition-colors px-4 py-2.5 rounded-lg shadow-sm">
                    Đăng ký
                  </Link>
                </li>
              </>
            )}

            <li className="ml-2">
              <LocaleSwitcher />
            </li>
          </>
        }
      >
        <div className="w-full">{props.children}</div>
      </BaseTemplate>
    </>
  );
}
