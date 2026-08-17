import { ProductDetailClient } from '@/components/products/ProductDetailClient';
import { fetchApi, getUserSessionToken } from '@/lib/Api';

type PageProps = {
  params: Promise<{
    locale: string;
    id: string;
  }>;
};

export default async function ProductDetailPage({ params }: PageProps) {
  const [{ locale, id }, token] = await Promise.all([params, getUserSessionToken()]);
  const isLoggedIn = !!token;

  let initialData = null;
  try {
    const res = await fetchApi(`/public/catalog/shop-items/${id}`, {
      next: { revalidate: 60 },
    });
    const payload = await res.json();
    if (payload?.data) {
      initialData = payload.data;
    }
  } catch (error) {
    console.warn('[ProductDetailPage] Could not prefetch product:', error);
  }

  return (
    <ProductDetailClient
      id={id}
      locale={locale}
      isLoggedIn={isLoggedIn}
      initialData={initialData}
    />
  );
}
