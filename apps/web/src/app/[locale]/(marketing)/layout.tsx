import { Suspense } from 'react';
import { setRequestLocale, getTranslations } from 'next-intl/server';
import { cookies } from 'next/headers';

export const dynamic = 'force-dynamic';
import { Link } from '@/lib/I18nNavigation';
import { BaseTemplate } from '@/templates/BaseTemplate';
import { UserHeaderMenu } from '@/components/UserHeaderMenu';
import { fetchApi } from '@/lib/Api';
import { HeaderNav } from '@/components/HeaderNav';
import QueryProvider from '@/providers/QueryProvider';

import { Gift } from 'lucide-react';

function HeaderNavSkeleton() {
  return (
    <>
      <li className="flex items-center">
        <span className="h-8 px-1 inline-flex items-center justify-center font-semibold text-xs xl:text-sm leading-none text-emerald-800 font-bold whitespace-nowrap">
          ...
        </span>
      </li>
      <li className="flex items-center">
        <span className="h-8 px-3 rounded-full inline-flex items-center justify-center gap-1.5 text-xs font-bold leading-none whitespace-nowrap flex-shrink-0 border bg-[#FFFBEB] border-amber-200/60 text-[#D97706]">
          <Gift className="w-3.5 h-3.5 text-[#D97706] flex-shrink-0" />
          <span>...</span>
        </span>
      </li>
      <li className="flex items-center">
        <span className="h-8 px-1 inline-flex items-center justify-center font-semibold text-xs xl:text-sm leading-none text-gray-600 whitespace-nowrap">
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
    } catch (e) {
      console.error('Error fetching profile for header:', e);
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
                  <Link href="/sign-in/" className="h-8 px-3 text-gray-700 hover:text-emerald-800 transition-colors font-semibold text-xs xl:text-sm leading-none inline-flex items-center justify-center">
                    {tNav('signIn')}
                  </Link>
                </li>
                <li className="flex items-center">
                  <Link href="/sign-up/" className="h-8 px-4 bg-[#43a047] text-white hover:bg-[#388e3c] transition-colors rounded-lg text-xs xl:text-sm font-bold shadow-sm inline-flex items-center justify-center leading-none">
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
