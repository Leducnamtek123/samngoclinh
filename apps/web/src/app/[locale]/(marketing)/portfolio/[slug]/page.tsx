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
    title:
      locale === 'en'
        ? 'Collection Details | Sâm Ngọc Linh'
        : 'Bộ Sưu Tập Rượu Sâm Ngọc Linh | Rượu Sâm Ngọc Linh',
    description:
      locale === 'en'
        ? 'Exclusive premium aged Ginseng wine reserve.'
        : 'Chi tiết dòng sản phẩm bình rượu Sâm Ngọc Linh thượng hạng ngâm ủ lâu năm.',
  };
}

export default async function PortfolioDetail(props: PortfolioDetailPageProps) {
  const { locale, slug } = await props.params;
  setRequestLocale(locale);

  const tProducts = await getTranslations({ locale, namespace: 'products' });
  const tNav = await getTranslations({ locale, namespace: 'nav' });

  return (
    <div className="min-h-screen w-full bg-gray-50 py-16">
      <div className="mx-auto max-w-4xl space-y-8 px-4 sm:px-6">
        <div className="space-y-6 rounded-3xl border border-gray-200/80 bg-white p-8 shadow-sm">
          <div className="flex items-center justify-between border-b border-gray-100 pb-4">
            <span className="text-xs font-bold tracking-widest text-secondary uppercase">
              #{slug.toUpperCase()}
            </span>
            <Link
              href="/portfolio"
              className="text-xs font-bold text-primary transition-colors hover:text-secondary"
            >
              ← {tNav('portfolio')}
            </Link>
          </div>

          <div className="relative aspect-[16/9] w-full overflow-hidden rounded-2xl border border-gray-100 bg-gray-50">
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
            <h1 className="font-display-lg text-2xl font-extrabold text-primary sm:text-3xl">
              {locale === 'en'
                ? 'Premium Ngoc Linh Ginseng Wine Decanter'
                : 'Bình Rượu Sâm Ngọc Linh Thượng Hạng'}{' '}
              #{slug.toUpperCase()}
            </h1>
            <p className="text-sm leading-relaxed text-gray-600">
              {locale === 'en'
                ? 'Carefully curated from authentic Ngoc Linh ginseng roots grown in Kon Tum and Nam Tra My highlands, aged in detoxified terracotta jars for mellow flavor and supreme nourishing vitality.'
                : 'Tuyển chọn từ những củ sâm Ngọc Linh chuẩn vùng trồng Kon Tum và Nam Trà My, ngâm ủ trong chum sành khử độc tố, mang lại hương vị êm dịu, giá trị bổ dưỡng cao cấp và minh bạch chuỗi cung ứng.'}
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-4 border-t border-gray-100 pt-4">
            <Link
              href="/products"
              className="inline-flex items-center justify-center rounded-xl bg-primary px-6 py-3 text-sm font-bold text-white shadow-sm transition-colors hover:bg-primary-hover"
            >
              {tProducts('allProducts')}
            </Link>
            <Link
              href="/about"
              className="inline-flex items-center justify-center rounded-xl border border-gray-200 px-6 py-3 text-sm font-bold text-gray-700 transition-colors hover:bg-gray-50"
            >
              {tNav('about')}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
