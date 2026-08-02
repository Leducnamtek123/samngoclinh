import { ProductDetailClient } from '@/components/products/ProductDetailClient';
import { getUserSessionToken } from '@/libs/Api';

type PageProps = {
  params: Promise<{
    locale: string;
    id: string;
  }>;
};

export default async function ProductDetailPage({ params }: PageProps) {
  const { locale, id } = await params;
  const token = await getUserSessionToken();
  const isLoggedIn = !!token;

  return <ProductDetailClient id={id} locale={locale} isLoggedIn={isLoggedIn} />;
}
