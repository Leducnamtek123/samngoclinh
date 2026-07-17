import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
import { GinsengClient } from '@/components/GinsengClient';
import { fetchApi } from '@/libs/Api';

type GinsengPageProps = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'Trồng Sâm Ngọc Linh | Rượu Sâm Ngọc Linh',
    description: 'Trải nghiệm mô hình trồng sâm cùng Rượu Sâm Ngọc Linh qua nền tảng công nghệ số.',
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

  return (
    <div className="w-full">
      <GinsengClient locale={locale} initialItems={initialItems} />
    </div>
  );
}
