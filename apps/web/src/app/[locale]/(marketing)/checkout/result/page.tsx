import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
import Link from 'next/link';
import { fetchApi } from '@/lib/Api';

type PaymentResultPageProps = {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ order?: string; status?: string }>;
};

export function generateMetadata(): Metadata {
  return {
    title: 'Kết quả thanh toán | Sâm Ngọc Linh',
    description: 'Kết quả giao dịch thanh toán đơn hàng Sâm Ngọc Linh.',
  };
}

const VIEWS = {
  success: {
    title: 'Thanh toán thành công!',
    desc: 'Cảm ơn bạn. Đơn hàng đã được thanh toán và đang được xử lý.',
    path: 'M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z',
    ring: 'bg-emerald-100 text-emerald-600',
    text: 'text-emerald-700',
  },
  error: {
    title: 'Thanh toán thất bại',
    desc: 'Giao dịch không thành công. Vui lòng thử lại hoặc chọn phương thức khác.',
    path: 'M9.75 9.75l4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z',
    ring: 'bg-red-100 text-red-600',
    text: 'text-red-700',
  },
  cancel: {
    title: 'Đã hủy thanh toán',
    desc: 'Bạn đã hủy giao dịch. Đơn hàng vẫn đang chờ thanh toán.',
    path: 'M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z',
    ring: 'bg-orange-100 text-orange-600',
    text: 'text-orange-700',
  },
  pending: {
    title: 'Đang xử lý thanh toán',
    desc: 'Nếu bạn đã thanh toán, đơn hàng sẽ được cập nhật trong giây lát.',
    path: 'M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z',
    ring: 'bg-orange-100 text-orange-600',
    text: 'text-orange-700',
  },
} as const;

function resolveKind(orderStatus: string | null, status?: string): keyof typeof VIEWS {
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

  let orderStatus: string | null = null;
  let total = 0;
  let hasContract = false;
  let contractCode: string | null = null;

  if (order) {
    try {
      const res = await fetchApi(`/public/payment/sepay/verify/${order}`);
      if (res.ok) {
        const json = await res.json();
        orderStatus = json.data?.status ?? null;
        total = json.data?.total ?? 0;
        hasContract = Boolean(json.data?.hasContract);
        contractCode = json.data?.contractCode ?? null;
      }
    } catch (error) {
      console.error('Error verifying payment result:', error);
    }
  }

  const view = VIEWS[resolveKind(orderStatus, status)];

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
              <span className="text-gray-500">Mã đơn hàng</span>
              <span className="font-bold text-gray-900">{`#${order}`}</span>
            </div>
            {total > 0 ? (
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Tổng tiền</span>
                <span className="font-bold text-emerald-700">
                  {`${total.toLocaleString('vi-VN')} VND`}
                </span>
              </div>
            ) : null}
          </div>
        ) : null}

        {view === VIEWS.success && (
          hasContract ? (
            <div className="rounded-2xl border border-emerald-200 bg-emerald-50/70 p-4 text-left space-y-2.5">
              <div className="flex items-center gap-2 text-emerald-800 font-bold text-sm">
                <span>📜 Hợp đồng điện tử đã được ký kết & kích hoạt</span>
              </div>
              <p className="text-xs text-emerald-700 leading-relaxed">
                Hợp đồng ủy quyền chăm sóc & sở hữu cây sâm {contractCode ? `(#${contractCode}) ` : ''}của bạn đã được ký kết tự động bằng chữ ký số và có đầy đủ giá trị pháp lý.
              </p>
              <Link
                className="mt-2 inline-flex w-full items-center justify-center rounded-xl bg-emerald-700 py-2.5 text-xs sm:text-sm font-bold text-white shadow-xs transition-colors hover:bg-emerald-800"
                href={`/${locale}/profile?tab=contracts`}
              >
                📄 Xem & Quản Lý Hợp Đồng
              </Link>
            </div>
          ) : (
            <div className="rounded-2xl border border-gray-100 bg-gray-50 p-4 text-left space-y-1.5">
              <div className="flex items-center gap-2 text-gray-800 font-bold text-sm">
                <span>📦 Đơn hàng đang được đóng gói giao hàng</span>
              </div>
              <p className="text-xs text-gray-600 leading-relaxed">
                Đơn hàng sản phẩm của bạn đang được chuẩn bị và sẽ sớm được chuyển phát nhanh đến địa chỉ nhận hàng.
              </p>
            </div>
          )
        )}

        <div className="space-y-2 pt-2">
          <Link
            className="inline-block w-full rounded-xl bg-[#1C3F24] py-3 text-sm font-bold text-white transition-colors hover:bg-[#1C3F24]/90"
            href={`/${locale}/profile?tab=orders`}
          >
            Xem lịch sử đơn hàng
          </Link>

          <Link
            className="block text-sm font-medium text-gray-500 hover:text-emerald-800 transition-colors pt-1"
            href={`/${locale}`}
          >
            ← Về trang chủ
          </Link>
        </div>
      </div>
    </div>
  );
}
