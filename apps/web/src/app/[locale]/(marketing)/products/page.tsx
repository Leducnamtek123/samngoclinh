import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
import { cookies } from 'next/headers';
import { GinsengClient } from '@/components/GinsengClient';
import { fetchApi } from '@/lib/Api';

type ProductsPageProps = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'Trồng Sâm Ngọc Linh | Rượu Sâm Ngọc Linh',
    description: 'Trải nghiệm mô hình trồng sâm cùng Rượu Sâm Ngọc Linh qua nền tảng công nghệ số.',
  };
}

async function getInitialPlants() {
  try {
    const res = await fetchApi('/public/catalog/plants', { next: { revalidate: 60 } });
    if (res.ok) {
      const json = await res.json();
      return json.data || [];
    }
  } catch (e) {
    console.error('Error fetching initial plants for products page:', e);
  }
  return [];
}

export default async function ProductsPage(props: ProductsPageProps) {
  const { locale } = await props.params;
  setRequestLocale(locale);

  const [cookieStore, initialItems] = await Promise.all([
    cookies(),
    getInitialPlants(),
  ]);

  const isLoggedIn = !!cookieStore.get('user_session')?.value;

  return (
    <div className="w-full">
      <GinsengClient locale={locale} initialItems={initialItems} isLoggedIn={isLoggedIn} />
    </div>
  );
}
