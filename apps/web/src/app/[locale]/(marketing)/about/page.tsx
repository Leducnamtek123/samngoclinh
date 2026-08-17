import { ShieldCheck, Cpu, Sparkles, CheckCircle2, Award, ArrowRight } from 'lucide-react';
import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { ScrollReveal } from '@/components/animation';
import { PageBannerSlider } from '@/components/PageBannerSlider';
import { fetchApi } from '@/lib/Api';
import { Link } from '@/lib/I18nNavigation';

export const dynamic = 'force-dynamic';

type AboutPageProps = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata(props: AboutPageProps): Promise<Metadata> {
  const { locale } = await props.params;
  const t = await getTranslations({ locale, namespace: 'about' });
  return {
    title: t('meta_title'),
    description: t('heroDesc'),
  };
}

async function getAboutBanner(locale: string) {
  try {
    const res = await fetchApi('/public/banners/about', { next: { revalidate: 60 } });
    if (res.ok) {
      const json = await res.json();
      return Array.isArray(json.data) ? json.data : [json.data];
    }
  } catch (error) {
    console.error('Error fetching about banner:', error);
  }
  return [
    {
      id: 'about-default',
      pageKey: 'about',
      title: locale === 'en' ? 'Journey of Ngoc Linh Ginseng' : 'Hành Trình Rượu Sâm Ngọc Linh',
      subtitle:
        locale === 'en'
          ? 'Connecting authentic natural treasures of Vietnam with transparent digital supply-chain solutions.'
          : 'Kết nối giá trị tự nhiên nguyên bản của Quốc bảo Sâm Ngọc Linh Quảng Nam với giải pháp công nghệ số minh bạch chuỗi cung ứng độc bản tại Việt Nam.',
      image: '/images/banners/about_banner.png',
      order: 0,
    },
  ];
}

export default async function About(props: AboutPageProps) {
  const { locale } = await props.params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: 'about' });
  const tProd = await getTranslations({ locale, namespace: 'products' });

  const banners = await getAboutBanner(locale);

  return (
    <div className="min-h-screen w-full bg-brand-bg pb-16">
      {/* Hero Header Section */}
      <PageBannerSlider banners={banners} />

      {/* Main Grid Content */}
      <section className="mx-auto max-w-6xl space-y-20 px-4 py-16 md:px-8">
        {/* Core Values Bento Grid (Asymmetric Layout) */}
        <div className="space-y-4">
          <ScrollReveal variant="fade-up">
            <div className="max-w-2xl space-y-2">
              <span className="block text-xs font-bold tracking-widest text-emerald-800 uppercase">
                {t('heroTitle')}
              </span>
              <h2 className="font-display text-2xl font-extrabold tracking-tight text-primary sm:text-4xl">
                {t('meta_title')}
              </h2>
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-1 gap-6 pt-4 lg:grid-cols-12">
            {/* Featured Master Card (7 Cols) */}
            <div className="flex flex-col justify-between space-y-6 rounded-3xl border border-gray-200/90 bg-white p-8 shadow-xs transition-shadow duration-300 hover:shadow-xl sm:p-10 lg:col-span-7">
              <div className="space-y-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-emerald-200/60 bg-emerald-50 text-emerald-800 shadow-2xs">
                  <ShieldCheck className="h-7 w-7 text-emerald-700" />
                </div>
                <div className="space-y-2">
                  <span className="inline-block rounded-full bg-emerald-50 px-3 py-1 font-mono text-[11px] font-bold text-emerald-800">
                    GACP-WHO Standard
                  </span>
                  <h3 className="font-display text-xl font-extrabold text-gray-900">
                    {t('visionTitle')}
                  </h3>
                  <p className="text-xs leading-relaxed font-normal text-gray-600 sm:text-sm">
                    {t('visionDesc')}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-6 border-t border-gray-100 pt-6 text-xs font-semibold text-gray-500">
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                  <span>52 Saponin MR2</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Award className="h-4 w-4 text-amber-600" />
                  <span>100% DNA Verified</span>
                </div>
              </div>
            </div>

            {/* Right Stacked Column (5 Cols) */}
            <div className="flex flex-col justify-between space-y-6 lg:col-span-5">
              {/* Stack 1: AgTech & IoT */}
              <div className="space-y-3 rounded-3xl border border-gray-200/90 bg-white p-6 shadow-xs transition-shadow duration-300 hover:shadow-lg sm:p-7">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-100 text-emerald-800">
                  <Cpu className="h-5 w-5 text-emerald-700" />
                </div>
                <h4 className="text-base font-extrabold text-gray-900">{t('missionTitle')}</h4>
                <p className="text-xs leading-relaxed text-gray-500">{t('missionDesc')}</p>
              </div>

              {/* Stack 2: Ancient Brewing */}
              <div className="space-y-3 rounded-3xl border border-gray-200/90 bg-white p-6 shadow-xs transition-shadow duration-300 hover:shadow-lg sm:p-7">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-50 text-amber-800">
                  <Sparkles className="h-5 w-5 text-amber-600" />
                </div>
                <h4 className="text-base font-extrabold text-gray-900">{t('storyTitle')}</h4>
                <p className="text-xs leading-relaxed text-gray-500">{t('storyP1')}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Detailed Story Section */}
        <ScrollReveal variant="fade-up">
          <div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-12 lg:gap-12">
            <div className="space-y-5 lg:col-span-7">
              <span className="text-xs font-bold tracking-widest text-emerald-800 uppercase">
                {t('heroTitle')}
              </span>
              <h2 className="font-display text-2xl leading-tight font-extrabold tracking-tight text-gray-950 sm:text-4xl">
                {t('storyTitle')}
              </h2>
              <div className="space-y-4 text-xs leading-relaxed font-normal text-gray-600 sm:text-sm">
                <p>{t('storyP1')}</p>
                <p>{t('storyP2')}</p>
              </div>

              <div className="pt-2">
                <Link
                  href={`/${locale}/products`}
                  className="inline-flex items-center gap-2 text-xs font-bold text-emerald-800 transition-colors hover:text-emerald-950"
                >
                  <span>{tProd('viewDetails')}</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>

            {/* Aesthetic Side Box */}
            <div className="relative space-y-6 overflow-hidden rounded-3xl border border-emerald-800/40 bg-gradient-to-br from-emerald-950 via-[#122B18] to-slate-950 p-8 text-white shadow-2xl sm:p-10 lg:col-span-5">
              <div className="pointer-events-none absolute -right-16 -bottom-16 h-48 w-48 rounded-full bg-amber-400/10 blur-2xl" />
              <h4 className="font-display text-xl font-black text-amber-300 sm:text-2xl">
                {t('visionTitle')}
              </h4>
              <p className="text-xs leading-relaxed font-normal text-emerald-100/90 sm:text-sm">
                {t('visionDesc')}
              </p>
              <div className="grid grid-cols-2 gap-4 border-t border-emerald-800/80 pt-6">
                <div>
                  <p className="font-display text-3xl font-black text-amber-400">52+</p>
                  <p className="mt-0.5 text-[10px] font-bold tracking-wider text-emerald-300 uppercase">
                    Saponin MR2
                  </p>
                </div>
                <div>
                  <p className="font-display text-3xl font-black text-emerald-400">100%</p>
                  <p className="mt-0.5 text-[10px] font-bold tracking-wider text-emerald-300 uppercase">
                    DNA Certified
                  </p>
                </div>
              </div>
            </div>
          </div>
        </ScrollReveal>
      </section>
    </div>
  );
}
