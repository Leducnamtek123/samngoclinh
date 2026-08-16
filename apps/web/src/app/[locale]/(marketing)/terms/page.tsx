import type { Metadata } from 'next';
import Link from 'next/link';
import { setRequestLocale } from 'next-intl/server';
import {
  ShieldCheck,
  FileText,
  Truck,
  CheckCircle2,
  CreditCard,
  RotateCcw,
  ArrowRight,
  ChevronRight,
  Sparkles,
} from 'lucide-react';

type TermsPageProps = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'Chính Sách và Điều Khoản – Sâm Ngọc Linh',
    description:
      'Tổng hợp toàn bộ các chính sách bảo mật, vận chuyển, kiểm hàng, thanh toán, đổi trả và quy chế giao dịch của Nền tảng Sâm Ngọc Linh.',
  };
}

const POLICY_LIST = [
  {
    slug: 'privacy-policy',
    title: 'Chính sách bảo mật',
    desc: 'Thu thập, sử dụng, lưu trữ và bảo mật dữ liệu người dùng tuân thủ Nghị định 13/2023/NĐ-CP.',
    icon: ShieldCheck,
    badge: 'Bảo mật SSL 256-bit',
  },
  {
    slug: 'shipping-policy',
    title: 'Chính sách vận chuyển',
    desc: 'Giao hàng hỏa tốc toàn quốc, bảo hiểm rơi vỡ 100% và quy trình đóng gói sâm tươi giữ ẩm chuyên dụng.',
    icon: Truck,
    badge: 'Toàn quốc & Hỏa tốc',
  },
  {
    slug: 'inspection-policy',
    title: 'Chính sách kiểm hàng',
    desc: '100% quyền đồng kiểm ngoại quan, kiểm tra tem chống giả và mã QR trước khi thanh toán nhận hàng.',
    icon: CheckCircle2,
    badge: '100% Đồng kiểm',
  },
  {
    slug: 'payment-policy',
    title: 'Chính sách thanh toán',
    desc: 'Hỗ trợ COD tiền mặt, chuyển khoản VietQR tự động, thanh toán thẻ bảo mật PCI-DSS và xuất hóa đơn VAT.',
    icon: CreditCard,
    badge: 'Xuất hóa đơn VAT',
  },
  {
    slug: 'return-policy',
    title: 'Chính sách đổi trả',
    desc: 'Đổi trả miễn phí trong 7 ngày đối với sản phẩm lỗi và cam kết bồi hoàn 200% nếu sai chuẩn Gen Sâm.',
    icon: RotateCcw,
    badge: 'Bồi hoàn 200% Gen',
  },
];

export default async function TermsPage(props: TermsPageProps) {
  const { locale } = await props.params;
  setRequestLocale(locale);

  return (
    <div className="w-full bg-slate-50 min-h-screen py-10 sm:py-16 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Navigation Breadcrumb */}
        <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs sm:text-sm text-slate-500">
          <Link href="/" className="hover:text-emerald-800 transition-colors font-medium">
            Trang chủ
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          <span className="text-slate-900 font-bold">Chính sách &amp; Điều khoản</span>
        </nav>

        {/* Header Hero Banner */}
        <div className="bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-10 shadow-sm space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-full text-xs font-bold tracking-wide">
            <Sparkles className="w-4 h-4 text-emerald-700" />
            <span>QUY CHẾ VẬN HÀNH &amp; MINH BẠCH</span>
          </div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
            Chính Sách và Điều Khoản – Sâm Ngọc Linh
          </h1>
          <p className="text-sm sm:text-base text-slate-600 leading-relaxed font-normal">
            Hệ thống văn bản pháp lý chính thức quy định mọi hoạt động giao dịch mua bán rượu sâm, cây sâm giống, ký gửi chăm sóc và bảo mật thông tin trên nền tảng Sâm Ngọc Linh.
          </p>
        </div>

        {/* Highlight Callout Box for e-Contract */}
        <div className="bg-gradient-to-r from-emerald-950 via-emerald-900 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl space-y-4">
          <div className="flex items-center gap-2.5 text-emerald-300 font-bold text-sm uppercase tracking-wider">
            <FileText className="w-5 h-5" />
            <span>Hợp Đồng Mua Bán, Ký Gửi &amp; Chăm Sóc Cây Sâm Ngọc Linh</span>
          </div>
          <p className="text-sm text-slate-200 leading-relaxed">
            Hợp đồng số hóa có chữ ký số điện tử pháp lý, cam kết bảo trợ chăm sóc cây sâm, bồi thường rủi ro nông nghiệp và bảo đảm khối lượng củ khi thu hoạch.
          </p>
          <div className="pt-2">
            <Link
              href="/contracts/hop-dong-mua-ban-ky-gui-cham-soc-sam-ngoc-linh"
              target="_blank"
              className="inline-flex items-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold text-sm px-5 py-2.5 rounded-xl transition-all shadow-md active:scale-98"
            >
              <span>Xem Văn Bản Mẫu Hợp Đồng Điện Tử</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* List of 5 Main Policy Cards */}
        <div className="space-y-4">
          <h2 className="text-lg font-bold text-slate-900 px-1 flex items-center gap-2">
            <span>Danh mục các Chính sách &amp; Quy định</span>
            <span className="text-xs bg-emerald-100 text-emerald-800 font-semibold px-2 py-0.5 rounded-full">5 văn bản</span>
          </h2>

          <div className="grid grid-cols-1 gap-4">
            {POLICY_LIST.map((policy, idx) => {
              const Icon = policy.icon;
              return (
                <Link
                  key={policy.slug}
                  href={`/terms/${policy.slug}`}
                  className="group bg-white hover:bg-emerald-50/40 border border-slate-200 hover:border-emerald-500/60 rounded-2xl p-5 sm:p-6 transition-all duration-200 shadow-sm hover:shadow-md flex items-start sm:items-center justify-between gap-4"
                >
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-emerald-100/80 text-emerald-800 group-hover:bg-emerald-800 group-hover:text-white transition-all flex items-center justify-center font-bold text-base">
                      <Icon className="w-5 h-5 sm:w-6 sm:h-6" />
                    </div>

                    <div className="space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-xs text-slate-400 font-bold">{idx + 1}.</span>
                        <h3 className="text-base sm:text-lg font-bold text-slate-900 group-hover:text-emerald-800 transition-colors">
                          {policy.title}
                        </h3>
                        <span className="text-[10px] font-bold px-2 py-0.5 bg-slate-100 text-slate-600 rounded-md">
                          {policy.badge}
                        </span>
                      </div>
                      <p className="text-xs sm:text-sm text-slate-500 line-clamp-2 leading-relaxed">
                        {policy.desc}
                      </p>
                    </div>
                  </div>

                  <div className="flex-shrink-0 hidden sm:flex items-center text-emerald-700 group-hover:translate-x-1 transition-transform">
                    <ArrowRight className="w-5 h-5" />
                  </div>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Official Footer Note */}
        <div className="text-center text-xs text-slate-400 pt-4">
          <p>© {new Date().getFullYear()} Công ty Cổ phần Sâm Ngọc Linh. Mọi quyền được bảo lưu.</p>
          <p className="mt-1">Địa chỉ: Xã Trà Linh, Huyện Nam Trà My, Tỉnh Quảng Nam. Hotline: 0967 234 234</p>
        </div>
      </div>
    </div>
  );
}
