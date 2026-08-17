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
import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { Link } from '@/lib/I18nNavigation';
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
    <div className="min-h-screen w-full bg-slate-50 px-4 py-10 font-sans sm:px-6 sm:py-16 lg:px-8">
      <div className="mx-auto max-w-4xl space-y-8">
        {/* Navigation Breadcrumb */}
        <nav
          aria-label="Breadcrumb"
          className="flex items-center gap-2 text-xs text-slate-500 sm:text-sm"
        >
          <Link href="/" className="font-medium transition-colors hover:text-emerald-800">
            {tNav('home')}
          </Link>
          <ChevronRight className="h-3.5 w-3.5 text-slate-400" />
          <span className="font-bold text-slate-900">{t('title')}</span>
        </nav>

        {/* Header Hero Banner */}
        <div className="space-y-4 rounded-3xl border border-slate-200/90 bg-white p-6 shadow-sm sm:p-10">
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-bold tracking-wide text-emerald-800">
            <Sparkles className="h-4 w-4 text-emerald-700" />
            <span>{t('badge')}</span>
          </div>
          <h1 className="text-2xl leading-tight font-extrabold tracking-tight text-slate-900 sm:text-3xl md:text-4xl">
            {t('title')}
          </h1>
          <p className="text-sm leading-relaxed font-normal text-slate-600 sm:text-base">
            {t('subtitle')}
          </p>
        </div>

        {/* Highlight Callout Box for e-Contract */}
        <div className="space-y-4 rounded-3xl bg-gradient-to-r from-emerald-950 via-emerald-900 to-slate-900 p-6 text-white shadow-xl sm:p-8">
          <div className="flex items-center gap-2.5 text-sm font-bold tracking-wider text-emerald-300 uppercase">
            <FileText className="h-5 w-5" />
            <span>{t('contractCardTitle')}</span>
          </div>
          <p className="text-sm leading-relaxed text-slate-200">{t('contractCardDesc')}</p>
          <div className="pt-2">
            <Link
              href="/contracts/hop-dong-mua-ban-ky-gui-cham-soc-sam-ngoc-linh"
              target="_blank"
              className="inline-flex items-center gap-2 rounded-xl bg-emerald-500 px-5 py-2.5 text-sm font-extrabold text-slate-950 shadow-md transition-[background-color,transform] hover:bg-emerald-400 active:scale-98"
            >
              <span>{t('viewContractSample')}</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>

        {/* List of Main Policy Cards */}
        <div className="space-y-4">
          <h2 className="flex items-center gap-2 px-1 text-lg font-bold text-slate-900">
            <span>{t('categoryTitle')}</span>
            <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-semibold text-emerald-800">
              {policyList.length} documents
            </span>
          </h2>

          <div className="grid grid-cols-1 gap-4">
            {policyList.map((policy, idx) => {
              const Icon = policyIcons[policy.slug] || FileText;
              return (
                <Link
                  key={policy.slug}
                  href={`/terms/${policy.slug}`}
                  className="group flex items-start justify-between gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-[background-color,border-color,box-shadow] duration-200 hover:border-emerald-500/60 hover:bg-emerald-50/40 hover:shadow-md sm:items-center sm:p-6"
                >
                  <div className="flex items-start gap-4">
                    <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-2xl bg-emerald-100/80 text-base font-bold text-emerald-800 transition-colors group-hover:bg-emerald-800 group-hover:text-white sm:h-12 sm:w-12">
                      <Icon className="h-5 w-5 sm:h-6 sm:w-6" />
                    </div>

                    <div className="space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-xs font-bold text-slate-400">{idx + 1}.</span>
                        <h3 className="text-base font-bold text-slate-900 transition-colors group-hover:text-emerald-800 sm:text-lg">
                          {policy.title}
                        </h3>
                      </div>
                      <p className="line-clamp-2 text-xs leading-relaxed text-slate-500 sm:text-sm">
                        {policy.shortDesc}
                      </p>
                    </div>
                  </div>

                  <div className="hidden flex-shrink-0 items-center text-emerald-700 transition-transform group-hover:translate-x-1 sm:flex">
                    <ArrowRight className="h-5 w-5" />
                  </div>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Official Footer Note */}
        <div className="pt-4 text-center text-xs text-slate-400">
          <p>{t('footerCopyright', { year: new Date().getFullYear() })}</p>
          <p className="mt-1">{t('footerAddress')}</p>
        </div>
      </div>
    </div>
  );
}
