import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
import { cookies } from 'next/headers';
import { GinsengClient } from '@/components/GinsengClient';
import { fetchApi } from '@/lib/Api';

type GinsengPageProps = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'Gói Cây Giống & Ủy Thác Canh Tác Sâm Ngọc Linh | Sâm Ngọc Linh',
    description:
      'Sở hữu và ủy quyền trồng cây sâm Ngọc Linh tại nông trường Kon Tum với quy trình số hóa và minh bạch 100%.',
  };
}

async function getInitialPlants() {
  try {
    const res = await fetchApi('/public/catalog/plants', { next: { revalidate: 60 } });
    if (res.ok) {
      const json = await res.json();
      return json.data || [];
    }
  } catch (error) {
    console.error('Error fetching initial plants for ginseng page:', error);
  }
  return [];
}

export default async function GinsengPage(props: GinsengPageProps) {
  const { locale } = await props.params;
  setRequestLocale(locale);

  const [cookieStore, initialItems] = await Promise.all([cookies(), getInitialPlants()]);

  const isLoggedIn = !!cookieStore.get('user_session')?.value;

  return (
    <div className="w-full">
      <GinsengClient locale={locale} initialItems={initialItems} isLoggedIn={isLoggedIn} />
    </div>
  );
}
