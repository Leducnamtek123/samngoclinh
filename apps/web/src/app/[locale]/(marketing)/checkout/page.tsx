import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
import { CheckoutConfirmClient } from '@/components/checkout/CheckoutConfirmClient';

type CheckoutPageProps = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'Xác Nhận Đơn Hàng | Rượu Sâm Ngọc Linh',
    description: 'Xác nhận địa chỉ giao hàng và thông tin thanh toán đơn hàng Sâm Ngọc Linh.',
  };
}

export default async function CheckoutPage(props: CheckoutPageProps) {
  const { locale } = await props.params;
  setRequestLocale(locale);

  return <CheckoutConfirmClient locale={locale} />;
}
