import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
import { cookies } from 'next/headers';
import { ProductsClient } from '@/components/ProductsClient';
import { fetchApi } from '@/lib/Api';

type ProductsPageProps = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'Cửa Hàng Rượu Sâm & Chế Phẩm Cao Cấp | Sâm Ngọc Linh',
    description: 'Bộ sưu tập Rượu Sâm Ngọc Linh thượng hạng, củ sâm tươi nguyên khối và các chế phẩm chiết xuất cao cấp.',
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
    console.error('Error fetching initial shop items for products page:', e);
  }
  return [];
}

export default async function ProductsPage(props: ProductsPageProps) {
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
