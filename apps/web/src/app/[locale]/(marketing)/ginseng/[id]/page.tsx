import { GinsengDetailClient } from '@/components/ginseng/GinsengDetailClient';
import { getUserSessionToken } from '@/lib/Api';

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

  return <GinsengDetailClient id={id} locale={locale} isLoggedIn={isLoggedIn} />;
}
