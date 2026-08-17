import type { Metadata } from 'next';
import { setRequestLocale, getTranslations } from 'next-intl/server';
import Image from 'next/image';
import { ScrollReveal, StaggerContainer } from '@/components/animation';
import { HomeFeaturedProducts } from '@/components/home/HomeFeaturedProducts';
import { HomeSaponinComparison } from '@/components/home/HomeSaponinComparison';
import { PageBannerSlider } from '@/components/PageBannerSlider';
import { fetchApi } from '@/lib/Api';
import { Link } from '@/lib/I18nNavigation';
import type { Article, Banner } from '@/types';

type TranslationFn = Awaited<ReturnType<typeof getTranslations>>;

export const revalidate = 60;

type IndexPageProps = {
  params: Promise<{ locale: string }>;
};

const getCategoryLabel = (category: string, locale: string) => {
  const labelsVi: Record<string, string> = {
    news: 'Tin tức',
    event: 'Sự kiện',
    guide: 'Hướng dẫn',
    faq: 'Kiến thức',
  };
  const labelsEn: Record<string, string> = {
    news: 'News',
    event: 'Events',
    guide: 'Guide',
    faq: 'Knowledge',
  };
  const map = locale === 'en' ? labelsEn : labelsVi;
  return map[category] || category || (locale === 'en' ? 'News' : 'Tin tức');
};

async function getArticles() {
  try {
    const res = await fetchApi('/public/content/articles', {
      next: { revalidate: 60 },
    });
    if (!res.ok) {
      console.error('Failed to fetch articles:', res.statusText);
      return [];
    }
    const json = await res.json();
    return json.data || [];
  } catch (error) {
    console.error('Error fetching articles:', error);
    return [];
  }
}

async function getInitialPlants() {
  try {
    const res = await fetchApi('/public/catalog/plants', { next: { revalidate: 60 } });
    if (res.ok) {
      const json = await res.json();
      return json.data || [];
    }
  } catch (error) {
    console.error('Error fetching initial plants for homepage:', error);
  }
  return [];
}

async function getInitialShopItems() {
  try {
    const res = await fetchApi('/public/catalog/shop-items', { next: { revalidate: 60 } });
    if (res.ok) {
      const json = await res.json();
      return json.data || [];
    }
  } catch (error) {
    console.error('Error fetching initial shop items for homepage:', error);
  }
  return [];
}

async function getBannerImages(): Promise<string[]> {
  const defaultImages = [
    '/images/banners/homepage_banner_1.png',
    '/images/banners/homepage_banner_2.png',
    '/images/banners/homepage_banner_3.png',
    '/images/banners/homepage_banner_4.png',
    '/images/banners/homepage_banner_5.png',
  ];
  try {
    const res = await fetchApi('/public/banners/home', { next: { revalidate: 60 } });
    if (res.ok) {
      const json = await res.json();
      const list = json.data;
      if (Array.isArray(list) && list.length > 0) {
        return list.map((item: Partial<Banner>) => item.image || '').filter(Boolean);
      }
    }
  } catch (error) {
    console.error('Error fetching home banners:', error);
  }
  return defaultImages;
}

export async function generateMetadata(props: IndexPageProps): Promise<Metadata> {
  const { locale } = await props.params;
  const t = await getTranslations({ locale, namespace: 'homepage' });
  return {
    title: `${t('heroTitle')} | Sâm Ngọc Linh`,
    description: t('heroSubtitle'),
  };
}

function AboutSection({ t }: { t: TranslationFn }) {
  return (
    <section className="relative overflow-hidden bg-white py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-12 lg:gap-12">
          <div className="group relative lg:col-span-5">
            <ScrollReveal variant="fade-left" duration={1.1} distance={60}>
              <div className="relative aspect-[4/3] max-h-[520px] overflow-hidden rounded-3xl border border-gray-100 bg-gray-50 shadow-xl sm:aspect-[16/10] lg:aspect-[4/5]">
                <Image
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                  src="/images/kon_tum_ginseng.png"
                  alt={t('aboutTitle')}
                  fill
                  sizes="(max-width: 768px) 100vw, 40vw"
                  unoptimized
                />
              </div>
            </ScrollReveal>
          </div>

          <div className="space-y-6 text-left lg:col-span-7">
            <ScrollReveal variant="fade-up" delay={0.1}>
              <div className="space-y-4">
                <span className="block text-xs font-bold tracking-widest text-secondary uppercase">
                  {t('aboutUsBadge')}
                </span>
                <h2 className="font-display-lg text-3xl leading-tight font-extrabold text-primary sm:text-4xl">
                  {t('aboutTitle')}
                </h2>
                <p className="text-sm leading-relaxed font-medium text-gray-600 sm:text-base">
                  {t('aboutDesc')}
                </p>
                <div>
                  <Link
                    href="/about"
                    className="group/link inline-flex items-center gap-2 text-sm font-bold text-secondary transition-colors hover:text-secondary-hover"
                  >
                    <span>{t('learnMore')}</span>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={2.5}
                      stroke="currentColor"
                      className="h-4 w-4 transition-transform duration-300 group-hover/link:translate-x-1"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"
                      />
                    </svg>
                  </Link>
                </div>
              </div>
            </ScrollReveal>

            <StaggerContainer
              variant="fade-up"
              stagger={0.1}
              distance={40}
              className="grid grid-cols-1 gap-4 pt-2 sm:grid-cols-2"
            >
              <div className="flex items-center gap-4 rounded-2xl border border-gray-100 bg-white p-4 shadow-sm transition-shadow duration-300 hover:shadow-md sm:p-5">
                <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-secondary/10 text-secondary">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={2}
                    stroke="currentColor"
                    className="h-6 w-6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 3v17a2 2 0 01-2 2H8M12 3C7 3 3 7 3 12c0 2.5 1.5 5 4 6M12 3c5 0 9 4 9 9c0 2.5-1.5 5-4 6M12 10c-2-2-4-2-6 0M12 14c2-2 4-2 6 0"
                    />
                  </svg>
                </div>
                <div>
                  <p className="text-2xl font-extrabold text-primary">10+</p>
                  <p className="mt-0.5 text-xs leading-snug font-semibold text-gray-500">
                    {t('yearsExperience')}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4 rounded-2xl border border-gray-100 bg-white p-4 shadow-sm transition-shadow duration-300 hover:shadow-md sm:p-5">
                <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-secondary/10 text-secondary">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={2}
                    stroke="currentColor"
                    className="h-6 w-6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z"
                    />
                  </svg>
                </div>
                <div>
                  <p className="text-2xl font-extrabold text-primary">1500m+</p>
                  <p className="mt-0.5 text-xs leading-snug font-semibold text-gray-500">
                    {t('altitude')}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4 rounded-2xl border border-gray-100 bg-white p-4 shadow-sm transition-shadow duration-300 hover:shadow-md sm:p-5">
                <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-secondary/10 text-secondary">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={2}
                    stroke="currentColor"
                    className="h-6 w-6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M18 18.72a6 6 0 00-3.44-5.32M15 7.25a3.25 3.25 0 11-6.5 0 3.25 3.25 0 016.5 0zM9 13.72A6.002 6.002 0 003 19.5h12m.002-5.78a6.002 6.002 0 016 5.78H15.002z"
                    />
                  </svg>
                </div>
                <div>
                  <p className="text-2xl font-extrabold text-primary">5000+</p>
                  <p className="mt-0.5 text-xs leading-snug font-semibold text-gray-500">
                    {t('happyCustomers')}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4 rounded-2xl border border-gray-100 bg-white p-4 shadow-sm transition-shadow duration-300 hover:shadow-md sm:p-5">
                <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-secondary/10 text-secondary">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={2}
                    stroke="currentColor"
                    className="h-6 w-6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M9.75 9V5.25m0 3.75a2.25 2.25 0 0 0 2.25 2.25h0A2.25 2.25 0 0 0 14.25 9V5.25m-4.5 0h4.5m-4.5 0V3h4.5v2.25m-4.5 3.75h4.5M9 11.25v8.25a2.25 2.25 0 0 0 2.25 2.25h5.5A2.25 2.25 0 0 0 19 19.5v-8.25A2.25 2.25 0 0 0 16.75 9h-5.5A2.25 2.25 0 0 0 9 11.25Z"
                    />
                  </svg>
                </div>
                <div>
                  <p className="text-2xl font-extrabold text-primary">100.000+</p>
                  <p className="mt-0.5 text-xs leading-snug font-semibold text-gray-500">
                    {t('bottlesSupplied')}
                  </p>
                </div>
              </div>
            </StaggerContainer>
          </div>
        </div>
      </div>
    </section>
  );
}

function NewsSection({
  t,
  latestArticles,
  newsImages,
  locale,
}: {
  t: TranslationFn;
  latestArticles: Article[];
  newsImages: string[];
  locale: string;
}) {
  if (!latestArticles.length) {
    return null;
  }
  return (
    <section className="mx-auto max-w-7xl border-t border-gray-100 px-4 py-20 sm:px-6 lg:px-8">
      <ScrollReveal variant="fade-up">
        <div className="mb-16 space-y-3 text-center">
          <h2 className="font-display-lg text-3xl font-extrabold text-primary">
            {t('latestNews')}
          </h2>
          <p className="mx-auto max-w-2xl text-sm font-medium text-gray-500">
            {t('latestNewsDesc')}
          </p>
        </div>
      </ScrollReveal>

      <StaggerContainer
        variant="fade-up"
        stagger={0.12}
        distance={50}
        className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4"
      >
        {latestArticles.slice(0, 4).map((article: Article, idx: number) => (
          <article
            key={article.id}
            className="flex flex-col justify-between overflow-hidden rounded-3xl border border-gray-100 bg-white transition-[box-shadow,transform] duration-300 hover:-translate-y-1 hover:shadow-lg"
          >
            <div>
              <div className="relative h-52 overflow-hidden bg-gray-100 p-3">
                <Link href={`/news/${article.slug}`}>
                  <Image
                    className="h-full w-full cursor-pointer rounded-2xl object-cover transition-transform duration-500 hover:scale-105"
                    src={article.image || newsImages[idx % newsImages.length] || '/images/default_plant.png'}
                    alt={article.title}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                    unoptimized
                  />
                </Link>
                <span className="absolute top-6 left-6 flex items-center gap-1 rounded-full border border-emerald-100/50 bg-[#EAF5ED] px-3 py-1 text-[10px] font-bold text-[#2D7A4D] shadow-sm">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#2D7A4D]" />
                  {getCategoryLabel(article.category || '', locale)}
                </span>
              </div>
              <div className="space-y-3 p-6">
                <div className="flex items-center gap-1.5 text-[11px] font-bold tracking-wider text-gray-400 uppercase">
                  {article.publishedAt
                    ? new Date(article.publishedAt).toLocaleDateString(
                        locale === 'en' ? 'en-US' : 'vi-VN',
                        { day: 'numeric', month: 'long', year: 'numeric' },
                      )
                    : ''}
                </div>
                <Link href={`/news/${article.slug}`}>
                  <h3 className="line-clamp-2 min-h-[44px] cursor-pointer text-base leading-snug font-bold text-gray-900 transition-colors hover:text-primary">
                    {article.title}
                  </h3>
                </Link>
                <p className="line-clamp-3 text-xs leading-relaxed text-gray-500">
                  {article.summary}
                </p>
              </div>
            </div>
            <div className="mt-4 flex items-center justify-between border-t border-gray-50 p-6 pt-0">
              <div className="flex items-center gap-1.5 pt-4 text-xs font-semibold text-gray-500">
                <span>{article.author || 'Sâm Ngọc Linh'}</span>
              </div>
              <Link
                href={`/news/${article.slug}`}
                className="group inline-flex cursor-pointer items-center gap-1 pt-4 text-xs font-bold text-secondary transition-colors hover:text-secondary-hover"
              >
                <span>{locale === 'en' ? 'Read more' : 'Đọc thêm'}</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="2.5"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
          </article>
        ))}
      </StaggerContainer>

      <ScrollReveal variant="scale" delay={0.2} className="mt-12 text-center">
        <Link
          href="/news"
          className="inline-flex items-center gap-2 rounded-lg border border-gray-300 px-8 py-3 text-sm font-bold text-primary transition-colors duration-200 hover:border-secondary hover:text-secondary"
        >
          <span>{locale === 'en' ? 'View all news' : 'Xem tất cả'}</span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2.5}
            stroke="currentColor"
            className="h-4 w-4"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"
            />
          </svg>
        </Link>
      </ScrollReveal>
    </section>
  );
}

function ContactSection({ locale }: { locale: string }) {
  return (
    <section className="relative overflow-hidden border-t border-gray-100 bg-white py-20">
      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <ScrollReveal variant="fade-up">
          <div className="mb-16 space-y-2 text-center">
            <h2 className="font-display-lg pt-1 text-4xl font-extrabold text-primary">
              {locale === 'en' ? 'Contact Us' : 'Liên hệ với chúng tôi'}
            </h2>
            <p className="mx-auto max-w-2xl text-sm font-medium text-gray-500">
              {locale === 'en'
                ? 'Let us assist you in finding your ideal ginseng products.'
                : 'Hãy để chúng tôi hỗ trợ bạn tìm được những cây sâm ưng ý nhất'}
            </p>
          </div>
        </ScrollReveal>

        <ScrollReveal variant="scale" duration={1.1} scaleFrom={0.94}>
          <div className="relative mx-auto max-w-4xl rounded-[32px] border border-gray-100 bg-gray-50/70 px-6 pt-20 pb-8 shadow-xl shadow-gray-900/[0.02] sm:px-12">
            <div className="absolute -top-12 left-1/2 z-20 flex h-24 w-24 -translate-x-1/2 items-center justify-center rounded-full border border-gray-100 bg-white p-3.5 shadow-md">
              <Image
                src="/assets/images/logo_ruou_sam.png?v=2"
                alt="Logo"
                width={96}
                height={96}
                unoptimized
                className="h-full w-full object-contain"
              />
            </div>

            <div className="relative z-10">
              <div className="text-center">
                <h3 className="font-display-md text-[17px] font-black tracking-wide text-emerald-800 uppercase">
                  CÔNG TY CỔ PHẦN SÂM NGỌC LINH
                </h3>
                <div className="flex items-center justify-center gap-3 py-3">
                  <div className="h-[1px] w-8 bg-emerald-600/10" />
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-3.5 w-3.5 text-emerald-600/40"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
                    />
                  </svg>
                  <div className="h-[1px] w-8 bg-emerald-600/10" />
                </div>
              </div>

              <StaggerContainer
                variant="fade-up"
                stagger={0.1}
                className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2"
              >
                <div className="flex items-center gap-5 rounded-2xl border border-gray-100 bg-white p-5 transition-[border-color,box-shadow] duration-300 hover:border-emerald-600/20 hover:shadow-sm">
                  <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full border border-emerald-100/30 bg-emerald-50 text-emerald-600">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={2}
                      stroke="currentColor"
                      className="h-5 w-5"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z"
                      />
                    </svg>
                  </div>
                  <div>
                    <span className="mb-1 block text-[11px] font-black tracking-wider text-emerald-700 uppercase">
                      {locale === 'en' ? 'Address' : 'Địa chỉ'}
                    </span>
                    <p className="text-sm leading-relaxed font-bold text-gray-700">
                      Showroom 156 Tây Thạnh, P. Tây Thạnh, TP. Hồ Chí Minh, Việt Nam
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-5 rounded-2xl border border-gray-100 bg-white p-5 transition-[border-color,box-shadow] duration-300 hover:border-emerald-600/20 hover:shadow-sm">
                  <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full border border-emerald-100/30 bg-emerald-50 text-emerald-600">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={2}
                      stroke="currentColor"
                      className="h-5 w-5"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 0 0 2.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-1.514 2.022a13.978 13.978 0 0 1-5.717-5.717l2.022-1.514c.361-.272.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 0 0-1.091-.852H4.5A2.25 2.25 0 0 0 2.25 4.5v2.25z"
                      />
                    </svg>
                  </div>
                  <div>
                    <span className="mb-1 block text-[11px] font-black tracking-wider text-emerald-700 uppercase">
                      {locale === 'en' ? 'Phone' : 'Điện thoại'}
                    </span>
                    <p className="text-sm leading-relaxed font-bold text-gray-700">
                      <a href="tel:0967234234" className="transition-colors hover:text-secondary">
                        0967 234 234
                      </a>
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-5 rounded-2xl border border-gray-100 bg-white p-5 transition-[border-color,box-shadow] duration-300 hover:border-emerald-600/20 hover:shadow-sm">
                  <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full border border-emerald-100/30 bg-emerald-50 text-emerald-600">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={2}
                      stroke="currentColor"
                      className="h-5 w-5"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5A3.375 3.375 0 0 0 10.125 2.25H9.75m0 18.75h4.5m-4.5 0H8.25m2.25 0V12m4.5 9V3M3.75 6h16.5M3.75 12h16.5m-16.5 6h16.5"
                      />
                    </svg>
                  </div>
                  <div>
                    <span className="mb-1 block text-[11px] font-black tracking-wider text-emerald-700 uppercase">
                      {locale === 'en' ? 'Business License' : 'Giấy phép kinh doanh'}
                    </span>
                    <p className="text-sm leading-relaxed font-bold text-gray-700">
                      Số 0316913632 cấp ngày 22/06/2021 tại Sở Kế hoạch và Đầu tư TP.HCM
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-5 rounded-2xl border border-gray-100 bg-white p-5 transition-[border-color,box-shadow] duration-300 hover:border-emerald-600/20 hover:shadow-sm">
                  <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full border border-emerald-100/30 bg-emerald-50 text-emerald-600">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={2}
                      stroke="currentColor"
                      className="h-5 w-5"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75"
                      />
                    </svg>
                  </div>
                  <div>
                    <span className="mb-1 block text-[11px] font-black tracking-wider text-emerald-700 uppercase">
                      Email
                    </span>
                    <p className="text-sm leading-relaxed font-bold text-gray-700">
                      <a
                        href="mailto:admin@samngoclinh.vn"
                        className="transition-colors hover:text-secondary"
                      >
                        admin@samngoclinh.vn
                      </a>
                    </p>
                  </div>
                </div>
              </StaggerContainer>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}

function CtaBanner({ t }: { t: TranslationFn }) {
  return (
    <section className="relative overflow-hidden border-t border-emerald-800/40 bg-gradient-to-r from-emerald-950 via-primary to-emerald-950 px-4 py-16 text-center text-white sm:px-6 sm:py-20 lg:px-8">
      <div className="pointer-events-none absolute top-1/2 left-1/2 h-[350px] w-[700px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-emerald-500/10 blur-3xl" />
      <div className="relative z-10 mx-auto max-w-4xl space-y-6">
        <ScrollReveal variant="fade-up">
          <span className="mb-2 inline-flex items-center gap-2 rounded-full border border-emerald-600/50 bg-emerald-800/60 px-3.5 py-1.5 text-xs font-black tracking-wider text-emerald-300 uppercase">
            {t('heroBadge')}
          </span>
          <h2 className="font-display-lg mt-2 text-2xl font-extrabold tracking-tight text-white sm:text-3xl lg:text-4xl">
            {t('ctaTitle')}
          </h2>
        </ScrollReveal>
        <ScrollReveal variant="fade-up" delay={0.15}>
          <p className="mx-auto max-w-2xl text-sm leading-relaxed font-normal text-emerald-100/90 sm:text-base">
            {t('ctaSubtitle')}
          </p>
        </ScrollReveal>
        <ScrollReveal variant="scale" delay={0.3} scaleFrom={0.92} className="pt-2">
          <Link
            href="/products"
            className="group inline-flex cursor-pointer items-center justify-center rounded-full bg-amber-400 px-8 py-3.5 text-sm font-black text-slate-950 shadow-xl transition-[color,box-shadow,transform] duration-300 hover:scale-[1.02] hover:bg-amber-300 hover:shadow-2xl active:scale-[0.98] sm:text-base"
          >
            <span>{t('exploreProducts')}</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2.5}
              stroke="currentColor"
              className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"
              />
            </svg>
          </Link>
        </ScrollReveal>
      </div>
    </section>
  );
}

export default async function Index(props: IndexPageProps) {
  const { locale } = await props.params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: 'homepage' });

  const [articles, bannerImages, initialPlants, initialShopItems] = await Promise.all([
    getArticles(),
    getBannerImages(),
    getInitialPlants(),
    getInitialShopItems(),
  ]);

  const latestArticles = (articles || [])
    .toSorted(
      (a: Article, b: Article) =>
        new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime(),
    )
    .slice(0, 4);

  const newsImages = [
    '/images/news/news1.png',
    '/images/news/news2.png',
    '/images/news/news3.png',
    '/images/news/news4.png',
  ];

  return (
    <div className="w-full bg-brand-bg text-gray-800">
      <section className="w-full bg-brand-bg py-6 sm:py-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <PageBannerSlider images={bannerImages} />
        </div>
      </section>

      {/* Featured Products Showcase Section */}
      <HomeFeaturedProducts
        locale={locale}
        initialPlants={initialPlants}
        initialShopItems={initialShopItems}
      />

      {/* Saponin Chemistry Comparison Section */}
      <HomeSaponinComparison />

      <AboutSection t={t} />
      <NewsSection t={t} latestArticles={latestArticles} newsImages={newsImages} locale={locale} />
      <ContactSection locale={locale} />
      <CtaBanner t={t} />
    </div>
  );
}
