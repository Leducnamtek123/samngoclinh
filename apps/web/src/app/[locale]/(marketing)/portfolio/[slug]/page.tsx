import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
import Image from 'next/image';
import { Link } from '@/lib/I18nNavigation';

type PortfolioDetailPageProps = {
  params: Promise<{ slug: string; locale: string }>;
};

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'Bộ Sưu Tập Rượu Sâm Ngọc Linh | Rượu Sâm Ngọc Linh',
    description: 'Chi tiết dòng sản phẩm bình rượu Sâm Ngọc Linh thượng hạng ngâm ủ lâu năm.',
  };
}

export default async function PortfolioDetail(props: PortfolioDetailPageProps) {
  const { locale, slug } = await props.params;
  setRequestLocale(locale);

  return (
    <div className="w-full bg-gray-50 min-h-screen py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 space-y-8">
        <div className="bg-white rounded-3xl p-8 border border-gray-200/80 shadow-sm space-y-6">
          <div className="flex items-center justify-between border-b border-gray-100 pb-4">
            <span className="text-xs font-bold text-secondary uppercase tracking-widest">
              BỘ SƯU TẬP #{slug.toUpperCase()}
            </span>
            <Link
              href="/portfolio"
              className="text-xs font-bold text-primary hover:text-secondary transition-colors"
            >
              ← Quay lại bộ sưu tập
            </Link>
          </div>

          <div className="relative aspect-[16/9] w-full rounded-2xl overflow-hidden bg-gray-50 border border-gray-100">
            <Image
              src="/images/kon_tum_ginseng.png"
              alt="Rượu Sâm Ngọc Linh"
              fill
              className="object-cover"
              unoptimized
            />
          </div>

          <div className="space-y-4">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-primary font-display-lg">
              Bình Rượu Sâm Ngọc Linh Thượng Hạng #{slug.toUpperCase()}
            </h1>
            <p className="text-gray-600 text-sm leading-relaxed">
              Tuyển chọn từ những củ sâm Ngọc Linh chuẩn vùng trồng Kon Tum và Nam Trà My, ngâm ủ trong chum sành khử độc tố, mang lại hương vị êm dịu, giá trị bổ dưỡng cao cấp và minh bạch chuỗi cung ứng.
            </p>
          </div>

          <div className="pt-4 border-t border-gray-100 flex flex-wrap items-center justify-between gap-4">
            <Link
              href="/products"
              className="inline-flex items-center justify-center bg-primary hover:bg-primary-hover text-white font-bold px-6 py-3 rounded-xl text-sm transition-colors shadow-sm"
            >
              Xem các sản phẩm có sẵn
            </Link>
            <Link
              href="/about"
              className="inline-flex items-center justify-center border border-gray-200 hover:bg-gray-50 text-gray-700 font-bold px-6 py-3 rounded-xl text-sm transition-colors"
            >
              Liên hệ tư vấn
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
