import type { Metadata } from 'next';
import { setRequestLocale, getTranslations } from 'next-intl/server';
import Image from 'next/image';
import { Link } from '@/lib/I18nNavigation';

type PortfolioDetailPageProps = {
  params: Promise<{ slug: string; locale: string }>;
};

export async function generateMetadata(props: PortfolioDetailPageProps): Promise<Metadata> {
  const { locale } = await props.params;
  return {
    title: locale === 'en' ? 'Collection Details | Sâm Ngọc Linh' : 'Bộ Sưu Tập Rượu Sâm Ngọc Linh | Rượu Sâm Ngọc Linh',
    description: locale === 'en' ? 'Exclusive premium aged Ginseng wine reserve.' : 'Chi tiết dòng sản phẩm bình rượu Sâm Ngọc Linh thượng hạng ngâm ủ lâu năm.',
  };
}

export default async function PortfolioDetail(props: PortfolioDetailPageProps) {
  const { locale, slug } = await props.params;
  setRequestLocale(locale);

  const tProducts = await getTranslations({ locale, namespace: 'products' });
  const tNav = await getTranslations({ locale, namespace: 'nav' });

  return (
    <div className="w-full bg-gray-50 min-h-screen py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 space-y-8">
        <div className="bg-white rounded-3xl p-8 border border-gray-200/80 shadow-sm space-y-6">
          <div className="flex items-center justify-between border-b border-gray-100 pb-4">
            <span className="text-xs font-bold text-secondary uppercase tracking-widest">
              #{slug.toUpperCase()}
            </span>
            <Link
              href="/portfolio"
              className="text-xs font-bold text-primary hover:text-secondary transition-colors"
            >
              ← {tNav('portfolio')}
            </Link>
          </div>

          <div className="relative aspect-[16/9] w-full rounded-2xl overflow-hidden bg-gray-50 border border-gray-100">
            <Image
              src="/images/kon_tum_ginseng.png"
              alt={tNav('portfolio')}
              fill
              sizes="(max-width: 768px) 100vw, 768px"
              className="object-cover"
              unoptimized
            />
          </div>

          <div className="space-y-4">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-primary font-display-lg">
              {locale === 'en' ? 'Premium Ngoc Linh Ginseng Wine Decanter' : 'Bình Rượu Sâm Ngọc Linh Thượng Hạng'} #{slug.toUpperCase()}
            </h1>
            <p className="text-gray-600 text-sm leading-relaxed">
              {locale === 'en'
                ? 'Carefully curated from authentic Ngoc Linh ginseng roots grown in Kon Tum and Nam Tra My highlands, aged in detoxified terracotta jars for mellow flavor and supreme nourishing vitality.'
                : 'Tuyển chọn từ những củ sâm Ngọc Linh chuẩn vùng trồng Kon Tum và Nam Trà My, ngâm ủ trong chum sành khử độc tố, mang lại hương vị êm dịu, giá trị bổ dưỡng cao cấp và minh bạch chuỗi cung ứng.'}
            </p>
          </div>

          <div className="pt-4 border-t border-gray-100 flex flex-wrap items-center justify-between gap-4">
            <Link
              href="/products"
              className="inline-flex items-center justify-center bg-primary hover:bg-primary-hover text-white font-bold px-6 py-3 rounded-xl text-sm transition-colors shadow-sm"
            >
              {tProducts('allProducts')}
            </Link>
            <Link
              href="/about"
              className="inline-flex items-center justify-center border border-gray-200 hover:bg-gray-50 text-gray-700 font-bold px-6 py-3 rounded-xl text-sm transition-colors"
            >
              {tNav('about')}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
