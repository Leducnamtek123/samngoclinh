import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
import { cookies } from 'next/headers';
import { ProductsClient } from '@/components/ProductsClient';
import { fetchApi } from '@/libs/Api';

type GinsengPageProps = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'Cửa Hàng Sản Phẩm | Rượu Sâm Ngọc Linh',
    description: 'Sở hữu sản phẩm Rượu Sâm Ngọc Linh chuẩn nguồn gốc chất lượng cao.',
  };
}

async function getShopItems() {
  try {
    const res = await fetchApi('/public/catalog/shop-items', {
      cache: 'no-store',
    });
    if (!res.ok) {
      return [];
    }
    const json = await res.json();
    return json.data?.items || [];
  } catch (error) {
    console.error('Error fetching shop items:', error);
    return [];
  }
}

export default async function GinsengPage(props: GinsengPageProps) {
  const { locale } = await props.params;
  setRequestLocale(locale);

  const initialItems = await getShopItems();
  const cookieStore = await cookies();
  const isLoggedIn = !!cookieStore.get('user_session')?.value;

  return (
    <div className="w-full">
      <ProductsClient locale={locale} initialItems={initialItems} isLoggedIn={isLoggedIn} />
    </div>
  );
}
