import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
import { cookies } from 'next/headers';
import { ProductsClient } from '@/components/ProductsClient';
import { fetchApi } from '@/lib/Api';

type GinsengPageProps = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'Cửa Hàng Sản Phẩm | Rượu Sâm Ngọc Linh',
    description: 'Sở hữu sản phẩm Rượu Sâm Ngọc Linh chuẩn nguồn gốc chất lượng cao.',
  };
}

async function getInitialShopItems() {
  try {
    const res = await fetchApi('/public/catalog/shop-items', { next: { revalidate: 60 } });
    if (res.ok) {
      const json = await res.json();
      return json.data || [];
    }
  } catch (e) {
    console.error('Error fetching initial shop items for ginseng page:', e);
  }
  return [];
}

export default async function GinsengPage(props: GinsengPageProps) {
  const { locale } = await props.params;
  setRequestLocale(locale);

  const [cookieStore, initialItems] = await Promise.all([
    cookies(),
    getInitialShopItems(),
  ]);

  const isLoggedIn = !!cookieStore.get('user_session')?.value;

  return (
    <div className="w-full">
      <ProductsClient locale={locale} initialItems={initialItems} isLoggedIn={isLoggedIn} />
    </div>
  );
}
