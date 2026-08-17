import { setRequestLocale, getTranslations } from 'next-intl/server';
import { cookies } from 'next/headers';
import { Suspense } from 'react';

export const dynamic = 'force-dynamic';
import { Gift } from 'lucide-react';
import { HeaderNav } from '@/components/HeaderNav';
import { UserHeaderMenu } from '@/components/UserHeaderMenu';
import { fetchApi } from '@/lib/Api';
import { Link } from '@/lib/I18nNavigation';
import QueryProvider from '@/providers/QueryProvider';
import { BaseTemplate } from '@/templates/BaseTemplate';

function HeaderNavSkeleton() {
  return (
    <>
      <li className="flex items-center">
        <span className="inline-flex h-8 items-center justify-center px-1 text-xs leading-none font-bold font-semibold whitespace-nowrap text-emerald-800 xl:text-sm">
          ...
        </span>
      </li>
      <li className="flex items-center">
        <span className="inline-flex h-8 flex-shrink-0 items-center justify-center gap-1.5 rounded-full border border-amber-200/60 bg-[#FFFBEB] px-3 text-xs leading-none font-bold whitespace-nowrap text-[#D97706]">
          <Gift className="h-3.5 w-3.5 flex-shrink-0 text-[#D97706]" />
          <span>...</span>
        </span>
      </li>
      <li className="flex items-center">
        <span className="inline-flex h-8 items-center justify-center px-1 text-xs leading-none font-semibold whitespace-nowrap text-gray-600 xl:text-sm">
          ...
        </span>
      </li>
    </>
  );
}

export default async function Layout(props: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await props.params;
  setRequestLocale(locale);
  const tNav = await getTranslations({ locale, namespace: 'nav' });

  const cookieStore = await cookies();
  const token = cookieStore.get('user_session')?.value;

  let profile = null;
  if (token) {
    try {
      const res = await fetchApi('/v1/shared/user/profile');
      if (res.ok) {
        const json = await res.json();
        profile = json.data;
      }
    } catch (error) {
      console.error('Error fetching profile for header:', error);
    }
  }

  return (
    <QueryProvider>
      <BaseTemplate
        leftNav={
          <Suspense fallback={<HeaderNavSkeleton />}>
            <HeaderNav />
          </Suspense>
        }
        rightNav={
          <>
            {token ? (
              <UserHeaderMenu profile={profile} />
            ) : (
              <>
                <li className="flex items-center">
                  <Link
                    href="/sign-in/"
                    className="inline-flex h-8 items-center justify-center px-3 text-xs leading-none font-semibold text-gray-700 transition-colors hover:text-emerald-800 xl:text-sm"
                  >
                    {tNav('signIn')}
                  </Link>
                </li>
                <li className="flex items-center">
                  <Link
                    href="/sign-up/"
                    className="inline-flex h-8 items-center justify-center rounded-lg bg-[#43a047] px-4 text-xs leading-none font-bold text-white shadow-sm transition-colors hover:bg-[#388e3c] xl:text-sm"
                  >
                    {tNav('signUp')}
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
