import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
import { cookies } from 'next/headers';
import { ProductsClient } from '@/components/ProductsClient';

type GinsengPageProps = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'Cửa Hàng Sản Phẩm | Rượu Sâm Ngọc Linh',
    description: 'Sở hữu sản phẩm Rượu Sâm Ngọc Linh chuẩn nguồn gốc chất lượng cao.',
  };
}

export default async function GinsengPage(props: GinsengPageProps) {
  const { locale } = await props.params;
  setRequestLocale(locale);

  const cookieStore = await cookies();
  const isLoggedIn = !!cookieStore.get('user_session')?.value;

  return (
    <div className="w-full">
      <ProductsClient locale={locale} isLoggedIn={isLoggedIn} />
    </div>
  );
}
