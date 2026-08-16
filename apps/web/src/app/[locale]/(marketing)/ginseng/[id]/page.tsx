import { GinsengDetailClient } from '@/components/ginseng/GinsengDetailClient';
import { fetchApi, getUserSessionToken } from '@/lib/Api';

type PageProps = {
  params: Promise<{
    locale: string;
    id: string;
  }>;
};

export default async function GinsengDetailPage({ params }: PageProps) {
  const { locale, id } = await params;
  const token = await getUserSessionToken();
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
  } catch (e) {
    console.warn('[GinsengDetailPage] Could not prefetch plant:', e);
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
