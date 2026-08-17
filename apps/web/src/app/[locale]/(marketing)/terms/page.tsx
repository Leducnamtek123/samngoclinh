import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { Link } from '@/lib/I18nNavigation';
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
import { getTermsPolicies } from './terms-data';

type TermsPageProps = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata(props: TermsPageProps): Promise<Metadata> {
  const { locale } = await props.params;
  const t = await getTranslations({ locale, namespace: 'termsPage' });
  return {
    title: `${t('title')} – Sâm Ngọc Linh`,
    description: t('subtitle'),
  };
}

export default async function TermsPage(props: TermsPageProps) {
  const { locale } = await props.params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: 'termsPage' });
  const tNav = await getTranslations({ locale, namespace: 'nav' });

  const policiesData = getTermsPolicies(locale);

  const policyIcons: Record<string, any> = {
    'privacy-policy': ShieldCheck,
    'shipping-policy': Truck,
    'inspection-policy': CheckCircle2,
    'payment-policy': CreditCard,
    'return-policy': RotateCcw,
  };

  const policyList = Object.values(policiesData);

  return (
    <div className="w-full bg-slate-50 min-h-screen py-10 sm:py-16 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Navigation Breadcrumb */}
        <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs sm:text-sm text-slate-500">
          <Link href="/" className="hover:text-emerald-800 transition-colors font-medium">
            {tNav('home')}
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          <span className="text-slate-900 font-bold">{t('title')}</span>
        </nav>

        {/* Header Hero Banner */}
        <div className="bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-10 shadow-sm space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-full text-xs font-bold tracking-wide">
            <Sparkles className="w-4 h-4 text-emerald-700" />
            <span>{t('badge')}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
            {t('title')}
          </h1>
          <p className="text-sm sm:text-base text-slate-600 leading-relaxed font-normal">
            {t('subtitle')}
          </p>
        </div>

        {/* Highlight Callout Box for e-Contract */}
        <div className="bg-gradient-to-r from-emerald-950 via-emerald-900 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl space-y-4">
          <div className="flex items-center gap-2.5 text-emerald-300 font-bold text-sm uppercase tracking-wider">
            <FileText className="w-5 h-5" />
            <span>{t('contractCardTitle')}</span>
          </div>
          <p className="text-sm text-slate-200 leading-relaxed">
            {t('contractCardDesc')}
          </p>
          <div className="pt-2">
            <Link
              href="/contracts/hop-dong-mua-ban-ky-gui-cham-soc-sam-ngoc-linh"
              target="_blank"
              className="inline-flex items-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold text-sm px-5 py-2.5 rounded-xl transition-[background-color,transform] shadow-md active:scale-98"
            >
              <span>{t('viewContractSample')}</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* List of Main Policy Cards */}
        <div className="space-y-4">
          <h2 className="text-lg font-bold text-slate-900 px-1 flex items-center gap-2">
            <span>{t('categoryTitle')}</span>
            <span className="text-xs bg-emerald-100 text-emerald-800 font-semibold px-2 py-0.5 rounded-full">{policyList.length} documents</span>
          </h2>

          <div className="grid grid-cols-1 gap-4">
            {policyList.map((policy, idx) => {
              const Icon = policyIcons[policy.slug] || FileText;
              return (
                <Link
                  key={policy.slug}
                  href={`/terms/${policy.slug}`}
                  className="group bg-white hover:bg-emerald-50/40 border border-slate-200 hover:border-emerald-500/60 rounded-2xl p-5 sm:p-6 transition-[background-color,border-color,box-shadow] duration-200 shadow-sm hover:shadow-md flex items-start sm:items-center justify-between gap-4"
                >
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-emerald-100/80 text-emerald-800 group-hover:bg-emerald-800 group-hover:text-white transition-colors flex items-center justify-center font-bold text-base">
                      <Icon className="w-5 h-5 sm:w-6 sm:h-6" />
                    </div>

                    <div className="space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-xs text-slate-400 font-bold">{idx + 1}.</span>
                        <h3 className="text-base sm:text-lg font-bold text-slate-900 group-hover:text-emerald-800 transition-colors">
                          {policy.title}
                        </h3>
                      </div>
                      <p className="text-xs sm:text-sm text-slate-500 line-clamp-2 leading-relaxed">
                        {policy.shortDesc}
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
          <p>{t('footerCopyright', { year: new Date().getFullYear() })}</p>
          <p className="mt-1">{t('footerAddress')}</p>
        </div>
      </div>
    </div>
  );
}
