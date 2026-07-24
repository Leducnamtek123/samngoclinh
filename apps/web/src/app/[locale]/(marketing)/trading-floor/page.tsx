import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { setRequestLocale } from 'next-intl/server';
import { cookies } from 'next/headers';
import { TradingFloorClient } from '@/components/TradingFloorClient';
import { fetchApi } from '@/libs/Api';

type TradingFloorPageProps = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'Sàn Mua Bán Cây | Sâm Ngọc Linh',
    description: 'Sàn giao dịch P2P sâm Ngọc Linh kỹ thuật số minh bạch và bảo mật.',
  };
}

async function getInitialListings() {
  try {
    const res = await fetchApi('/public/marketplace/listings', { next: { revalidate: 60 } });
    if (res.ok) {
      const json = await res.json();
      return json.data?.items || [];
    }
  } catch (e) {
    console.error('Error fetching initial marketplace listings:', e);
  }
  return [];
}

export default async function TradingFloorPage(props: TradingFloorPageProps) {
  const { locale } = await props.params;
  setRequestLocale(locale);

  const cookieStore = await cookies();
  const isLoggedIn = !!cookieStore.get('user_session')?.value;

  if (!isLoggedIn) {
    redirect(`/${locale}/sign-in?reason=trading-floor`);
  }

  const initialListings = await getInitialListings();

  return (
    <div className="w-full">
      <TradingFloorClient locale={locale} initialListings={initialListings} isLoggedIn={isLoggedIn} />
    </div>
  );
}
