import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { Link } from '@/lib/I18nNavigation';
import {
  ShieldCheck,
  ChevronRight,
  ArrowLeft,
  FileText,
  Clock,
  Phone,
  Mail,
  Truck,
  CheckCircle2,
  CreditCard,
  RotateCcw,
  Building2,
} from 'lucide-react';
import { getTermsPolicies, TERMS_POLICIES } from '../terms-data';

type PolicyPageProps = {
  params: Promise<{ locale: string; slug: string }>;
};

export async function generateMetadata(props: PolicyPageProps): Promise<Metadata> {
  const { locale, slug } = await props.params;
  const policies = getTermsPolicies(locale);
  const policy = policies[slug];
  if (!policy) {
    return {
      title: 'Policy Not Found – Sâm Ngọc Linh',
    };
  }

  return {
    title: `${policy.title} – Sâm Ngọc Linh`,
    description: policy.shortDesc,
  };
}

export function generateStaticParams() {
  return Object.keys(TERMS_POLICIES).map((slug) => ({ slug }));
}

const POLICY_ICONS: Record<string, React.ElementType> = {
  'privacy-policy': ShieldCheck,
  'shipping-policy': Truck,
  'inspection-policy': CheckCircle2,
  'payment-policy': CreditCard,
  'return-policy': RotateCcw,
};

export default async function PolicyDetailPage(props: PolicyPageProps) {
  const { locale, slug } = await props.params;
  setRequestLocale(locale);
  const tTerms = await getTranslations({ locale, namespace: 'termsPage' });
  const tNav = await getTranslations({ locale, namespace: 'nav' });

  const policies = getTermsPolicies(locale);
  const policy = policies[slug];
  if (!policy) {
    notFound();
  }

  const IconComponent = POLICY_ICONS[slug] || FileText;

  return (
    <div className="w-full bg-slate-50 min-h-screen py-8 sm:py-14 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-4xl mx-auto space-y-6 sm:space-y-8">
        {/* Navigation Breadcrumb */}
        <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs sm:text-sm text-slate-500">
          <Link href="/" className="hover:text-emerald-800 transition-colors font-medium">
            {tNav('home')}
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          <Link href="/terms" className="hover:text-emerald-800 transition-colors font-medium">
            {tTerms('title')}
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          <span className="text-slate-900 font-bold truncate max-w-[200px] sm:max-w-none">
            {policy.title}
          </span>
        </nav>

        {/* Header Hero Card */}
        <div className="bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-10 shadow-sm space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-full text-xs font-bold tracking-wide">
              <IconComponent className="w-4 h-4 text-emerald-700" />
              <span>{tTerms('badge')}</span>
            </div>
            <div className="inline-flex items-center gap-1.5 text-xs text-slate-500 font-medium">
              <Clock className="w-3.5 h-3.5 text-slate-400" />
              <span>Updated: {policy.lastUpdated}</span>
            </div>
          </div>

          <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
            {policy.title}
          </h1>

          <p className="text-sm sm:text-base text-slate-600 leading-relaxed font-normal">
            {policy.shortDesc}
          </p>
        </div>

        {/* Main Content Card */}
        <div className="bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-10 shadow-sm space-y-8">
          {policy.sections.map((sec) => (
            <section key={sec.heading} className="space-y-3 pb-6 border-b border-slate-100 last:border-0 last:pb-0">
              <h2 className="text-base sm:text-lg font-bold text-slate-900 text-emerald-950 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-600 shrink-0" />
                {sec.heading}
              </h2>
              <div className="space-y-2 pl-4">
                {sec.content.map((p) => (
                  <p key={p} className="text-sm sm:text-base text-slate-700 leading-relaxed font-normal">
                    {p}
                  </p>
                ))}
              </div>
            </section>
          ))}
        </div>

        {/* Company Guarantee & Contact Support Box */}
        <div className="bg-gradient-to-br from-emerald-950 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl space-y-6">
          <div className="flex items-start gap-4">
            <div className="p-3 rounded-2xl bg-emerald-800/60 border border-emerald-500/30 text-emerald-300">
              <Building2 className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <h3 className="text-lg font-bold text-white tracking-tight">
                CÔNG TY CỔ PHẦN SÂM NGỌC LINH
              </h3>
              <p className="text-xs sm:text-sm text-slate-300">
                Nam Trà My, Quảng Nam
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-emerald-800/40 text-xs sm:text-sm">
            <div className="flex items-center gap-2.5 text-slate-200">
              <Phone className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Hotline: <strong className="text-white font-bold">0967 234 234</strong> (24/7)</span>
            </div>
            <div className="flex items-center gap-2.5 text-slate-200">
              <Mail className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Email: <strong className="text-white font-bold">hotro@samngoclinh.vn</strong></span>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
            <Link
              href="/terms"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs sm:text-sm font-semibold transition-colors border border-white/15"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>{locale === 'en' ? 'View all policies' : 'Xem tất cả chính sách'}</span>
            </Link>

            <Link
              href="/contracts/hop-dong-mua-ban-ky-gui-cham-soc-sam-ngoc-linh"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs sm:text-sm shadow-md transition-[background-color,transform] active:scale-98"
            >
              <FileText className="w-4 h-4" />
              <span>{tTerms('viewContractSample')}</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
