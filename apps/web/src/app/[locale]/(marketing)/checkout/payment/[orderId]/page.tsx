import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
import { CheckoutPaymentClient } from '@/components/checkout/CheckoutPaymentClient';

type PaymentPageProps = {
  params: Promise<{ locale: string; orderId: string }>;
};

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'Thanh Toán Đơn Hàng | Rượu Sâm Ngọc Linh',
    description: 'Thanh toán trực tuyến cho đơn hàng Sâm Ngọc Linh.',
  };
}

export default async function PaymentPage(props: PaymentPageProps) {
  const { locale, orderId } = await props.params;
  setRequestLocale(locale);

  return <CheckoutPaymentClient locale={locale} orderId={orderId} />;
}
