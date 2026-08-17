import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { fetchApi } from '@/lib/Api';
import { PageBannerSlider } from '@/components/PageBannerSlider';
import { ShieldCheck, Cpu, Sparkles, CheckCircle2, Award, ArrowRight } from 'lucide-react';
import { ScrollReveal } from '@/components/animation';
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
      subtitle: locale === 'en'
        ? 'Connecting authentic natural treasures of Vietnam with transparent digital supply-chain solutions.'
        : 'Kết nối giá trị tự nhiên nguyên bản của Quốc bảo Sâm Ngọc Linh Quảng Nam với giải pháp công nghệ số minh bạch chuỗi cung ứng độc bản tại Việt Nam.',
      image: '/images/banners/about_banner.png',
      order: 0
    }
  ];
}

export default async function About(props: AboutPageProps) {
  const { locale } = await props.params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: 'about' });
  const tProd = await getTranslations({ locale, namespace: 'products' });

  const banners = await getAboutBanner(locale);

  return (
    <div className="w-full bg-brand-bg min-h-screen pb-16">
      
      {/* Hero Header Section */}
      <PageBannerSlider banners={banners} />

      {/* Main Grid Content */}
      <section className="max-w-6xl mx-auto px-4 md:px-8 py-16 space-y-20">
        
        {/* Core Values Bento Grid (Asymmetric Layout) */}
        <div className="space-y-4">
          <ScrollReveal variant="fade-up">
            <div className="max-w-2xl space-y-2">
              <span className="text-xs font-bold text-emerald-800 uppercase tracking-widest block">
                {t('heroTitle')}
              </span>
              <h2 className="text-2xl sm:text-4xl font-extrabold text-primary font-display tracking-tight">
                {t('meta_title')}
              </h2>
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pt-4">
            {/* Featured Master Card (7 Cols) */}
            <div className="lg:col-span-7 bg-white border border-gray-200/90 rounded-3xl p-8 sm:p-10 space-y-6 shadow-xs hover:shadow-xl transition-shadow duration-300 flex flex-col justify-between">
              <div className="space-y-4">
                <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-800 flex items-center justify-center border border-emerald-200/60 shadow-2xs">
                  <ShieldCheck className="w-7 h-7 text-emerald-700" />
                </div>
                <div className="space-y-2">
                  <span className="text-[11px] font-mono font-bold text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full inline-block">
                    GACP-WHO Standard
                  </span>
                  <h3 className="font-extrabold text-gray-900 text-xl font-display">
                    {t('visionTitle')}
                  </h3>
                  <p className="text-gray-600 text-xs sm:text-sm leading-relaxed font-normal">
                    {t('visionDesc')}
                  </p>
                </div>
              </div>

              <div className="pt-6 border-t border-gray-100 flex items-center gap-6 text-xs text-gray-500 font-semibold">
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>52 Saponin MR2</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Award className="w-4 h-4 text-amber-600" />
                  <span>100% DNA Verified</span>
                </div>
              </div>
            </div>

            {/* Right Stacked Column (5 Cols) */}
            <div className="lg:col-span-5 space-y-6 flex flex-col justify-between">
              {/* Stack 1: AgTech & IoT */}
              <div className="bg-white border border-gray-200/90 rounded-3xl p-6 sm:p-7 space-y-3 shadow-xs hover:shadow-lg transition-shadow duration-300">
                <div className="w-11 h-11 rounded-xl bg-slate-100 text-emerald-800 flex items-center justify-center">
                  <Cpu className="w-5 h-5 text-emerald-700" />
                </div>
                <h4 className="font-extrabold text-gray-900 text-base">
                  {t('missionTitle')}
                </h4>
                <p className="text-gray-500 text-xs leading-relaxed">
                  {t('missionDesc')}
                </p>
              </div>

              {/* Stack 2: Ancient Brewing */}
              <div className="bg-white border border-gray-200/90 rounded-3xl p-6 sm:p-7 space-y-3 shadow-xs hover:shadow-lg transition-shadow duration-300">
                <div className="w-11 h-11 rounded-xl bg-amber-50 text-amber-800 flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-amber-600" />
                </div>
                <h4 className="font-extrabold text-gray-900 text-base">
                  {t('storyTitle')}
                </h4>
                <p className="text-gray-500 text-xs leading-relaxed">
                  {t('storyP1')}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Detailed Story Section */}
        <ScrollReveal variant="fade-up">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            <div className="lg:col-span-7 space-y-5">
              <span className="text-xs font-bold text-emerald-800 uppercase tracking-widest">{t('heroTitle')}</span>
              <h2 className="text-2xl sm:text-4xl font-extrabold text-gray-950 font-display leading-tight tracking-tight">
                {t('storyTitle')}
              </h2>
              <div className="space-y-4 text-gray-600 text-xs sm:text-sm leading-relaxed font-normal">
                <p>{t('storyP1')}</p>
                <p>{t('storyP2')}</p>
              </div>

              <div className="pt-2">
                <Link
                  href={`/${locale}/products`}
                  className="inline-flex items-center gap-2 text-xs font-bold text-emerald-800 hover:text-emerald-950 transition-colors"
                >
                  <span>{tProd('viewDetails')}</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
            
            {/* Aesthetic Side Box */}
            <div className="lg:col-span-5 bg-gradient-to-br from-emerald-950 via-[#122B18] to-slate-950 text-white p-8 sm:p-10 rounded-3xl space-y-6 relative overflow-hidden shadow-2xl border border-emerald-800/40">
              <div className="absolute -right-16 -bottom-16 w-48 h-48 rounded-full bg-amber-400/10 blur-2xl pointer-events-none" />
              <h4 className="font-black text-xl sm:text-2xl text-amber-300 font-display">{t('visionTitle')}</h4>
              <p className="text-emerald-100/90 text-xs sm:text-sm leading-relaxed font-normal">
                {t('visionDesc')}
              </p>
              <div className="border-t border-emerald-800/80 pt-6 grid grid-cols-2 gap-4">
                <div>
                  <p className="text-3xl font-black text-amber-400 font-display">52+</p>
                  <p className="text-[10px] text-emerald-300 uppercase font-bold tracking-wider mt-0.5">Saponin MR2</p>
                </div>
                <div>
                  <p className="text-3xl font-black text-emerald-400 font-display">100%</p>
                  <p className="text-[10px] text-emerald-300 uppercase font-bold tracking-wider mt-0.5">DNA Certified</p>
                </div>
              </div>
            </div>
          </div>
        </ScrollReveal>

      </section>

    </div>
  );
}
