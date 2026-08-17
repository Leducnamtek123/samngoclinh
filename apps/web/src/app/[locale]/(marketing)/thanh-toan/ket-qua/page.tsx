import { FileText, PenTool } from 'lucide-react';
import type { Metadata } from 'next';
import { setRequestLocale, getTranslations } from 'next-intl/server';
import { fetchApi } from '@/lib/Api';
import { Link } from '@/lib/I18nNavigation';
import { formatVNDPrice } from '@/utils/formatters';

type PaymentResultPageProps = {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ order?: string; status?: string }>;
};

export async function generateMetadata(props: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await props.params;
  const t = await getTranslations({ locale, namespace: 'checkoutResult' });
  return {
    title: `${t('successTitle')} | Sâm Ngọc Linh`,
    description: t('successDesc'),
  };
}

function resolveKind(orderStatus: string | null, status?: string) {
  if (orderStatus === 'paid') {
    return 'success';
  }
  if (orderStatus === 'cancelled' || status === 'cancel') {
    return 'cancel';
  }
  if (status === 'error') {
    return 'error';
  }
  return 'pending';
}

export default async function PaymentResultPage(props: PaymentResultPageProps) {
  const { locale } = await props.params;
  const { order, status } = await props.searchParams;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: 'checkoutResult' });

  let orderStatus: string | null = null;
  let total = 0;
  if (order) {
    try {
      const res = await fetchApi(`/public/payment/sepay/verify/${order}`);
      if (res.ok) {
        const json = await res.json();
        orderStatus = json.data?.status ?? null;
        total = json.data?.total ?? 0;
      }
    } catch (error) {
      console.error('Error verifying payment result:', error);
    }
  }

  const kind = resolveKind(orderStatus, status);

  const viewData = {
    success: {
      title: t('successTitle'),
      desc: t('successDesc'),
      path: 'M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z',
      ring: 'bg-emerald-100 text-emerald-600',
      text: 'text-emerald-700',
    },
    error: {
      title: t('errorTitle'),
      desc: t('errorDesc'),
      path: 'M9.75 9.75l4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z',
      ring: 'bg-red-100 text-red-600',
      text: 'text-red-700',
    },
    cancel: {
      title: t('cancelTitle'),
      desc: t('cancelDesc'),
      path: 'M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z',
      ring: 'bg-orange-100 text-orange-600',
      text: 'text-orange-700',
    },
    pending: {
      title: t('pendingTitle'),
      desc: t('pendingDesc'),
      path: 'M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z',
      ring: 'bg-orange-100 text-orange-600',
      text: 'text-orange-700',
    },
  };

  const view = viewData[kind];

  return (
    <div className="flex min-h-[70vh] w-full items-center justify-center bg-gray-50 px-4 py-16">
      <div className="w-full max-w-md space-y-5 rounded-3xl bg-white p-8 text-center shadow-xl">
        <div
          className={`mx-auto flex h-20 w-20 items-center justify-center rounded-full ${view.ring}`}
        >
          <svg
            aria-hidden="true"
            className="h-11 w-11"
            fill="none"
            stroke="currentColor"
            strokeWidth={1.8}
            viewBox="0 0 24 24"
          >
            <path d={view.path} strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>

        <h1 className={`text-2xl font-extrabold ${view.text}`}>{view.title}</h1>
        <p className="text-sm leading-relaxed text-gray-500">{view.desc}</p>

        {order ? (
          <div className="space-y-2 rounded-2xl border border-gray-100 bg-gray-50 p-4 text-left">
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">{t('orderCode')}</span>
              <span className="font-bold text-gray-900">{`#${order}`}</span>
            </div>
            {total > 0 ? (
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">{t('totalAmount')}</span>
                <span className="font-bold text-emerald-700">{formatVNDPrice(total)}</span>
              </div>
            ) : null}
          </div>
        ) : null}

        {kind === 'success' && (
          <div className="space-y-2 rounded-2xl border border-emerald-200 bg-emerald-50/70 p-4 text-left">
            <div className="flex items-center gap-2 text-sm font-bold text-emerald-800">
              <FileText className="h-4 w-4 shrink-0 text-emerald-600" />
              <span>{t('contractActivated')}</span>
            </div>
            <p className="text-xs leading-relaxed text-emerald-700">{t('contractActivatedDesc')}</p>
            <Link
              className="mt-2 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 py-2.5 text-xs font-bold text-white shadow-xs transition-colors hover:bg-emerald-700 sm:text-sm"
              href="/profile?tabs=contracts"
            >
              <PenTool className="h-4 w-4 shrink-0" />
              <span>{t('viewContractBtn')}</span>
            </Link>
          </div>
        )}

        <div className="space-y-2 pt-2">
          <Link
            className="inline-block w-full rounded-xl bg-[#1C3F24] py-3 text-sm font-bold text-white transition-colors hover:bg-[#1C3F24]/90"
            href="/profile?tabs=orders"
          >
            {t('viewOrderHistory')}
          </Link>

          <Link
            className="block pt-1 text-sm font-medium text-gray-500 transition-colors hover:text-emerald-800"
            href="/"
          >
            {t('backToHome')}
          </Link>
        </div>
      </div>
    </div>
  );
}
