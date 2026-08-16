import { ProductDetailClient } from '@/components/products/ProductDetailClient';
import { fetchApi, getUserSessionToken } from '@/lib/Api';

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

  let initialData = null;
  try {
    const res = await fetchApi(`/public/catalog/shop-items/${id}`, {
      next: { revalidate: 60 },
    });
    const payload = await res.json();
    if (payload?.data) {
      initialData = payload.data;
    }
  } catch (e) {
    console.warn('[ProductDetailPage] Could not prefetch product:', e);
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
