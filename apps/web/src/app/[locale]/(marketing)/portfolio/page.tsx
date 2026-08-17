import {
  Award,
  ShieldCheck,
  Sparkles,
  Check,
  ArrowRight,
  Droplets,
  Clock,
  Flame,
} from 'lucide-react';
import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import Image from 'next/image';
import { ScrollReveal, StaggerContainer } from '@/components/animation';
import { Link } from '@/lib/I18nNavigation';
import { formatVNDPrice } from '@/utils/formatters';

type PortfolioPageProps = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata(props: PortfolioPageProps): Promise<Metadata> {
  const { locale } = await props.params;
  const t = await getTranslations({ locale, namespace: 'homepage' });
  return {
    title: `${t('vintageCollection')} | Sâm Ngọc Linh`,
    description: t('vintageCollectionSubtitle'),
  };
}

export default async function Portfolio(props: PortfolioPageProps) {
  const { locale } = await props.params;
  setRequestLocale(locale);

  const tHome = await getTranslations({ locale, namespace: 'homepage' });
  const tProd = await getTranslations({ locale, namespace: 'products' });

  const masterpiece = {
    id: 'COL-GRAND-01',
    code: 'SNL-VINTAGE-2014',
    title:
      locale === 'en'
        ? '12-Year-Old Ancient Ngoc Linh Ginseng Wine'
        : 'Rượu Sâm Ngọc Linh Cổ Thụ Độc Bản 12 Năm Tuổi',
    volume:
      locale === 'en'
        ? 'Crystal Decanter 20L • 12Y Wild Ginseng'
        : 'Bình Pha Lê 20 Lít • Củ Sâm Tự Nhiên 12 Năm',
    edition:
      locale === 'en'
        ? 'Limited Imperial Edition - 09 Decanters'
        : 'Phiên bản Hoàng gia giới hạn 09 bình',
    age: locale === 'en' ? '12 Years Old' : '12 năm tuổi',
    abv: '39% Vol',
    steepTime: locale === 'en' ? 'Aged 5 years in stone cellar' : 'Ngâm ủ 5 năm trong hầm đá ngầm',
    desc:
      locale === 'en'
        ? 'Selected from pristine whole wild Ngoc Linh ginseng roots harvested at 2,100m altitude. Combined with ancient herbal yeast wine and underground aged to perfection.'
        : 'Tuyển chọn từ củ sâm Ngọc Linh nguyên vẹn rễ nhánh khai thác ở độ cao 2.100m đỉnh núi Ngọc Linh. Kết hợp cùng rượu men lá thảo dược bí truyền của đồng bào Xơ Đăng, trải qua quá trình hạ thổ tách lọc độc tố Andehit hoàn hảo.',
    price: 68_000_000,
    image: '/images/products/wine_root.png',
    highlights: [
      locale === 'en'
        ? 'MR2 Saponin potency peaks at >52%'
        : 'Hàm lượng Saponin MR2 đạt đỉnh >52% tổng dược tính',
      locale === 'en'
        ? 'Velvety smooth finish, shimmering amber hue'
        : 'Rượu êm dịu, hậu vị ngọt sâu lắng, màu hổ phách sóng sánh',
      locale === 'en'
        ? 'Includes DNA Certificate & Anti-Counterfeit QR'
        : 'Đính kèm Chứng Thư Giám Định Gen DNA & Tem QR Chống Giả',
    ],
  };

  const reserveCollections = [
    {
      id: 'COL-02',
      code: 'SNL-RESERVE-8Y',
      title:
        locale === 'en'
          ? 'Premium 8-Year Underground Aged Ginseng Wine'
          : 'Rượu Sâm Ngọc Linh Hạ Thổ Thượng Hạng',
      volume: locale === 'en' ? '10L Jar • 8Y Root' : 'Bình 10 Lít • Sâm củ 8 năm tuổi',
      age: locale === 'en' ? '8 Years Old' : '8 năm tuổi',
      abv: '38% Vol',
      steepTime: locale === 'en' ? 'Cellar aged 3 years' : 'Hạ thổ 3 năm trong chum sành mộc',
      desc:
        locale === 'en'
          ? 'Brewed from pharmacopoeia-standard roots with rich herbal notes and natural revitalizing properties.'
          : 'Ngâm ủ từ những củ sâm đạt chuẩn dược điển, hương vị đậm đà, bổ khí huyết, tăng cường sinh lực và tăng khả năng miễn dịch.',
      price: 32_000_000,
      image: '/images/products/wine_root.png',
    },
    {
      id: 'COL-03',
      code: 'SNL-CLASSIC-6Y',
      title:
        locale === 'en'
          ? 'Classic 6-Year Ceramic Jar Ginseng Wine'
          : 'Rượu Sâm Ngọc Linh Chum Sành Cổ Truyền',
      volume: locale === 'en' ? '5L Jar • 6Y Root' : 'Bình 5 Lít • Sâm củ 6 năm tuổi',
      age: locale === 'en' ? '6 Years Old' : '6 năm tuổi',
      abv: '35% Vol',
      steepTime: locale === 'en' ? 'Aged 2 years' : 'Ngâm ủ 2 năm trong chum sành không tráng men',
      desc:
        locale === 'en'
          ? 'Ideal for diplomatic gifting or daily enjoyment, capturing the pure essence of Kon Tum rainforest.'
          : 'Dòng sản phẩm lý tưởng để thưởng thức hàng ngày hoặc làm quà biếu đối tác ngoại giao, mang trọn tinh hoa của núi rừng Kon Tum.',
      price: 15_500_000,
      image: '/images/products/wine_root.png',
    },
  ];

  return (
    <div className="min-h-screen w-full bg-brand-bg py-10 text-gray-900 sm:py-16">
      <div className="mx-auto max-w-7xl space-y-16 px-4 sm:space-y-20 sm:px-6 lg:px-8">
        {/* Header Section */}
        <ScrollReveal variant="fade-up">
          <div className="flex flex-col justify-between gap-6 border-b border-gray-200/80 pb-8 lg:flex-row lg:items-end">
            <div className="max-w-3xl space-y-3">
              <div className="inline-flex items-center gap-2 rounded-full bg-emerald-900 px-3.5 py-1.5 text-xs font-black tracking-widest text-amber-300 uppercase shadow-sm">
                <Sparkles className="h-3.5 w-3.5" />
                <span>{tHome('vintageCollection')}</span>
              </div>
              <h1 className="font-display text-3xl leading-tight font-black tracking-tight text-primary sm:text-5xl">
                {tHome('vintageCollection')}
              </h1>
              <p className="text-sm leading-relaxed font-normal text-gray-600 sm:text-base">
                {tHome('vintageCollectionSubtitle')}
              </p>
            </div>

            <div className="flex shrink-0 items-center gap-4 text-xs font-semibold text-gray-500">
              <span className="flex items-center gap-1.5 rounded-xl border border-gray-200 bg-white px-3.5 py-2 shadow-2xs">
                <ShieldCheck className="h-4 w-4 text-emerald-700" />
                <span>GI No. 00049</span>
              </span>
              <span className="flex items-center gap-1.5 rounded-xl border border-gray-200 bg-white px-3.5 py-2 shadow-2xs">
                <Award className="h-4 w-4 text-amber-600" />
                <span>GACP-WHO</span>
              </span>
            </div>
          </div>
        </ScrollReveal>

        {/* Masterpiece Feature Spotlight */}
        <ScrollReveal variant="scale" duration={1.1} scaleFrom={0.96}>
          <div className="relative overflow-hidden rounded-3xl border border-emerald-800/40 bg-gradient-to-br from-emerald-950 via-[#122B18] to-slate-950 p-6 text-white shadow-2xl sm:p-12">
            <div className="pointer-events-none absolute top-0 right-0 h-[500px] w-[500px] rounded-full bg-amber-500/10 blur-3xl" />
            <div className="pointer-events-none absolute bottom-0 left-0 h-96 w-96 rounded-full bg-emerald-500/10 blur-3xl" />

            <div className="relative z-10 grid grid-cols-1 items-center gap-8 lg:grid-cols-12 lg:gap-12">
              {/* Left Visual */}
              <div className="group relative lg:col-span-5">
                <div className="relative flex aspect-[4/5] items-center justify-center overflow-hidden rounded-2xl border border-emerald-700/40 bg-white/5 p-6 backdrop-blur-md sm:aspect-square lg:aspect-[4/5]">
                  <div className="absolute top-4 left-4 rounded-full bg-amber-400 px-3 py-1 text-[10px] font-black text-slate-950 uppercase shadow-md">
                    {masterpiece.edition}
                  </div>
                  <Image
                    src={masterpiece.image}
                    alt={masterpiece.title}
                    fill
                    sizes="(max-width: 1024px) 100vw, 40vw"
                    className="object-contain p-4 drop-shadow-[0_20px_30px_rgba(0,0,0,0.5)] transition-transform duration-700 group-hover:scale-108"
                    unoptimized
                  />
                </div>
              </div>

              {/* Right Content */}
              <div className="space-y-6 lg:col-span-7">
                <div className="space-y-2">
                  <span className="font-mono text-xs font-bold tracking-wider text-emerald-400">
                    {masterpiece.code}
                  </span>
                  <h2 className="font-display text-2xl leading-snug font-black tracking-tight text-white sm:text-4xl">
                    {masterpiece.title}
                  </h2>
                  <p className="text-xs leading-relaxed font-normal text-emerald-200/80 sm:text-sm">
                    {masterpiece.desc}
                  </p>
                </div>

                {/* Key Specs Matrix */}
                <div className="grid grid-cols-3 gap-3 rounded-2xl border border-emerald-700/30 bg-white/5 p-4 text-center">
                  <div className="space-y-1">
                    <span className="flex items-center justify-center gap-1 text-[10px] font-bold text-emerald-400 uppercase">
                      <Clock className="h-3 w-3" /> {locale === 'en' ? 'Age' : 'Tuổi sâm'}
                    </span>
                    <p className="text-sm font-extrabold text-white sm:text-base">
                      {masterpiece.age}
                    </p>
                  </div>
                  <div className="space-y-1 border-x border-emerald-800/60">
                    <span className="flex items-center justify-center gap-1 text-[10px] font-bold text-emerald-400 uppercase">
                      <Flame className="h-3 w-3" /> ABV
                    </span>
                    <p className="text-sm font-extrabold text-white sm:text-base">
                      {masterpiece.abv}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <span className="flex items-center justify-center gap-1 text-[10px] font-bold text-emerald-400 uppercase">
                      <Droplets className="h-3 w-3" /> Volume
                    </span>
                    <p className="text-sm font-extrabold text-white sm:text-base">20L</p>
                  </div>
                </div>

                {/* Highlights List */}
                <div className="space-y-2.5 text-xs text-emerald-100">
                  {masterpiece.highlights.map((point) => (
                    <div key={point} className="flex items-start gap-2">
                      <div className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-amber-400/20 text-amber-400">
                        <Check className="h-3 w-3" />
                      </div>
                      <span>{point}</span>
                    </div>
                  ))}
                </div>

                {/* Price & Action */}
                <div className="flex flex-col justify-between gap-4 border-t border-emerald-800/80 pt-4 sm:flex-row sm:items-center">
                  <div>
                    <span className="block text-[10px] font-bold tracking-wider text-emerald-400 uppercase">
                      {locale === 'en' ? 'Exclusive Price' : 'Giá niêm yết độc bản'}
                    </span>
                    <span className="text-2xl font-black tracking-tight text-amber-400 sm:text-3xl">
                      {formatVNDPrice(masterpiece.price)}
                    </span>
                  </div>

                  <Link
                    href={`/${locale}/products`}
                    className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-2xl bg-amber-400 px-7 py-3.5 text-xs font-black text-slate-950 shadow-xl transition-[transform,background-color] hover:scale-[1.02] hover:bg-amber-300 active:scale-[0.98] sm:text-sm"
                  >
                    <span>{tProd('buyNow')}</span>
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </ScrollReveal>

        {/* Reserve Editions */}
        <div className="space-y-8">
          <div className="border-b border-gray-200/80 pb-4">
            <h3 className="font-display text-2xl font-extrabold text-primary">
              {locale === 'en'
                ? 'Special Aged Reserve Cellar'
                : 'Các Dòng Rượu Hạ Thổ Dự Trữ Đặc Biệt'}
            </h3>
            <p className="mt-1 text-xs text-gray-500 sm:text-sm">
              {locale === 'en'
                ? 'Curated editions aged from 6 to 8 years in natural clay jars for connoisseurs.'
                : 'Tuyển chọn các phiên bản bình rượu sâm ngâm chum sành từ 6 đến 8 năm tuổi dành cho người sành thưởng thức.'}
            </p>
          </div>

          <StaggerContainer
            variant="fade-up"
            stagger={0.15}
            className="grid grid-cols-1 gap-8 lg:grid-cols-2"
          >
            {reserveCollections.map((item) => (
              <div
                key={item.id}
                className="group flex flex-col justify-between overflow-hidden rounded-3xl border border-gray-200/90 bg-white p-6 shadow-xs transition-shadow duration-300 hover:shadow-xl sm:p-8"
              >
                <div className="space-y-6">
                  {/* Top Image */}
                  <div className="grid grid-cols-1 items-center gap-6 sm:grid-cols-12">
                    <div className="relative flex aspect-square items-center justify-center overflow-hidden rounded-2xl border border-gray-100 bg-gray-50/80 p-4 sm:col-span-5">
                      <Image
                        src={item.image}
                        alt={item.title}
                        fill
                        sizes="(max-width: 640px) 100vw, 25vw"
                        className="object-contain p-2 transition-transform duration-500 group-hover:scale-105"
                        unoptimized
                      />
                    </div>

                    <div className="space-y-3 sm:col-span-7">
                      <span className="inline-block rounded-md border border-emerald-100 bg-emerald-50 px-2.5 py-1 font-mono text-[11px] font-bold text-emerald-800">
                        {item.code}
                      </span>
                      <h4 className="text-lg leading-snug font-extrabold text-gray-900 transition-colors group-hover:text-primary">
                        {item.title}
                      </h4>
                      <p className="line-clamp-3 text-xs leading-relaxed text-gray-500">
                        {item.desc}
                      </p>
                    </div>
                  </div>

                  {/* Spec Row */}
                  <div className="grid grid-cols-3 gap-2 rounded-xl border border-gray-100 bg-gray-50 p-3 text-center text-xs font-semibold text-gray-600">
                    <div>
                      <span className="block text-[10px] font-medium text-gray-400">
                        {locale === 'en' ? 'Volume' : 'Quy cách'}
                      </span>
                      <span className="font-bold text-gray-800">{item.volume.split('•')[0]}</span>
                    </div>
                    <div className="border-x border-gray-200">
                      <span className="block text-[10px] font-medium text-gray-400">
                        {locale === 'en' ? 'Age' : 'Niên vụ'}
                      </span>
                      <span className="font-bold text-gray-800">{item.age}</span>
                    </div>
                    <div>
                      <span className="block text-[10px] font-medium text-gray-400">
                        {locale === 'en' ? 'ABV' : 'Nồng độ'}
                      </span>
                      <span className="font-bold text-gray-800">{item.abv}</span>
                    </div>
                  </div>
                </div>

                {/* Bottom Action */}
                <div className="mt-6 flex items-center justify-between border-t border-gray-100 pt-6">
                  <div>
                    <span className="block text-[10px] font-bold text-gray-400 uppercase">
                      {locale === 'en' ? 'Price' : 'Giá niêm yết'}
                    </span>
                    <span className="text-xl font-black tracking-tight text-primary">
                      {formatVNDPrice(item.price)}
                    </span>
                  </div>

                  <Link
                    href={`/${locale}/products`}
                    className="inline-flex cursor-pointer items-center gap-1.5 rounded-xl bg-primary px-5 py-2.5 text-xs font-bold text-white shadow-xs transition-[box-shadow,transform,background-color] hover:bg-primary-hover hover:shadow-md active:scale-[0.98]"
                  >
                    <span>{tProd('buyNow')}</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </StaggerContainer>
        </div>
      </div>
    </div>
  );
}
