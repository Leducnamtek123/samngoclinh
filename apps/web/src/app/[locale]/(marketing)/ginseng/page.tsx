import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
import { GinsengClient } from '@/components/GinsengClient';

type GinsengPageProps = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'Trồng Sâm Ngọc Linh | Rượu Sâm Ngọc Linh',
    description: 'Trải nghiệm mô hình trồng sâm cùng Rượu Sâm Ngọc Linh qua nền tảng công nghệ số.',
  };
}

export default async function GinsengPage(props: GinsengPageProps) {
  const { locale } = await props.params;
  setRequestLocale(locale);

  return (
    <div className="w-full">
      <GinsengClient locale={locale} />
    </div>
  );
}
