import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
import { ProductsClient } from '@/components/ProductsClient';

type ProductsPageProps = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'Cửa Hàng Cây Giống | Rượu Sâm Ngọc Linh',
    description: 'Sở hữu và bảo tồn cây sâm Ngọc Linh chuẩn nguồn gốc qua công nghệ số hóa.',
  };
}

export default async function ProductsPage(props: ProductsPageProps) {
  const { locale } = await props.params;
  setRequestLocale(locale);

  return (
    <div className="w-full">
      <ProductsClient locale={locale} />
    </div>
  );
}
