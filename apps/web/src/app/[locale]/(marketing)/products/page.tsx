import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
import { cookies } from 'next/headers';
import { GinsengClient } from '@/components/GinsengClient';
import { fetchApi } from '@/libs/Api';

type ProductsPageProps = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'Trồng Sâm Ngọc Linh | Rượu Sâm Ngọc Linh',
    description: 'Trải nghiệm mô hình trồng sâm cùng Rượu Sâm Ngọc Linh qua nền tảng công nghệ số.',
  };
}

async function getPlants() {
  try {
    const res = await fetchApi('/public/catalog/plants', {
      cache: 'no-store',
    });
    if (!res.ok) {
      return [];
    }
    const json = await res.json();
    return json.data?.items || [];
  } catch (error) {
    console.error('Error fetching plants:', error);
    return [];
  }
}

export default async function ProductsPage(props: ProductsPageProps) {
  const { locale } = await props.params;
  setRequestLocale(locale);

  const initialItems = await getPlants();
  const cookieStore = await cookies();
  const isLoggedIn = !!cookieStore.get('user_session')?.value;

  return (
    <div className="w-full">
      <GinsengClient locale={locale} initialItems={initialItems} isLoggedIn={isLoggedIn} />
    </div>
  );
}
