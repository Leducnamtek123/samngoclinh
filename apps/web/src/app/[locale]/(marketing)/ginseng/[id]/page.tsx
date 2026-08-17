import { GinsengDetailClient } from '@/components/ginseng/GinsengDetailClient';
import { fetchApi, getUserSessionToken } from '@/lib/Api';

type PageProps = {
  params: Promise<{
    locale: string;
    id: string;
  }>;
};

export default async function GinsengDetailPage({ params }: PageProps) {
  const [{ locale, id }, token] = await Promise.all([params, getUserSessionToken()]);
  const isLoggedIn = !!token;

  let initialData = null;
  try {
    const res = await fetchApi(`/public/catalog/plants/${id}`, {
      next: { revalidate: 60 },
    });
    const payload = await res.json();
    if (payload?.data) {
      initialData = payload.data;
    }
  } catch (error) {
    console.warn('[GinsengDetailPage] Could not prefetch plant:', error);
  }

  return (
    <GinsengDetailClient
      id={id}
      locale={locale}
      isLoggedIn={isLoggedIn}
      initialData={initialData}
    />
  );
}
