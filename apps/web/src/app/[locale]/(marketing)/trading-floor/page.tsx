import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
import { TradingFloorClient } from '@/components/TradingFloorClient';

type TradingFloorPageProps = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'Sàn Giao Dịch Ký Gửi | Rượu Sâm Ngọc Linh',
    description: 'Sàn giao dịch P2P sâm Ngọc Linh kỹ thuật số minh bạch và bảo mật.',
  };
}

export default async function TradingFloorPage(props: TradingFloorPageProps) {
  const { locale } = await props.params;
  setRequestLocale(locale);

  return (
    <div className="w-full">
      <TradingFloorClient locale={locale} />
    </div>
  );
}
