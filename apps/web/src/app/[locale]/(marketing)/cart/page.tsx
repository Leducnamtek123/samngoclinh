import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
import { CartClient } from '@/components/CartClient';

type CartPageProps = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'Giỏ Hàng & Thanh Toán | Rượu Sâm Ngọc Linh',
    description: 'Quản lý giỏ hàng, nhập thông tin giao hàng và thanh toán VietQR qua SePay.',
  };
}

export default async function CartPage(props: CartPageProps) {
  const { locale } = await props.params;
  setRequestLocale(locale);

  return <CartClient locale={locale} />;
}
