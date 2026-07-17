import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
import { ProductsClient } from '@/components/ProductsClient';
import { fetchApi } from '@/libs/Api';

type ProductsPageProps = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'Cửa Hàng Cây Giống | Rượu Sâm Ngọc Linh',
    description: 'Sở hữu và bảo tồn cây sâm Ngọc Linh chuẩn nguồn gốc qua công nghệ số hóa.',
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

  return (
    <div className="w-full">
      <ProductsClient locale={locale} initialItems={initialItems} />
    </div>
  );
}
