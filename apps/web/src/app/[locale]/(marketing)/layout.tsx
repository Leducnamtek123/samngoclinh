import { setRequestLocale } from 'next-intl/server';
import { cookies } from 'next/headers';
import { Link } from '@/libs/I18nNavigation';
import { BaseTemplate } from '@/templates/BaseTemplate';
import { UserHeaderMenu } from '@/components/UserHeaderMenu';
import { fetchApi } from '@/libs/Api';
import { HeaderNav } from '@/components/HeaderNav';
import QueryProvider from '@/providers/QueryProvider';

export default async function Layout(props: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await props.params;
  setRequestLocale(locale);

  const cookieStore = await cookies();
  const token = cookieStore.get('user_session')?.value;

  let profile = null;
  if (token) {
    try {
      const res = await fetchApi('/user/profile/me');
      if (res.ok) {
        const json = await res.json();
        profile = json.data;
      }
    } catch (e) {
      console.error('Error fetching profile for header:', e);
    }
  }

  return (
    <QueryProvider>
      <BaseTemplate
        leftNav={<HeaderNav />}
        rightNav={
          <>
            {token ? (
              <UserHeaderMenu profile={profile} />
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
          </>
        }
      >
        <div className="w-full">{props.children}</div>
      </BaseTemplate>
    </QueryProvider>
  );
}
