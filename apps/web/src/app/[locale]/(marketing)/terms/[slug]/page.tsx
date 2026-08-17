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
import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { Link } from '@/lib/I18nNavigation';
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
    <div className="min-h-screen w-full bg-slate-50 px-4 py-8 font-sans sm:px-6 sm:py-14 lg:px-8">
      <div className="mx-auto max-w-4xl space-y-6 sm:space-y-8">
        {/* Navigation Breadcrumb */}
        <nav
          aria-label="Breadcrumb"
          className="flex items-center gap-2 text-xs text-slate-500 sm:text-sm"
        >
          <Link href="/" className="font-medium transition-colors hover:text-emerald-800">
            {tNav('home')}
          </Link>
          <ChevronRight className="h-3.5 w-3.5 text-slate-400" />
          <Link href="/terms" className="font-medium transition-colors hover:text-emerald-800">
            {tTerms('title')}
          </Link>
          <ChevronRight className="h-3.5 w-3.5 text-slate-400" />
          <span className="max-w-[200px] truncate font-bold text-slate-900 sm:max-w-none">
            {policy.title}
          </span>
        </nav>

        {/* Header Hero Card */}
        <div className="space-y-4 rounded-3xl border border-slate-200/90 bg-white p-6 shadow-sm sm:p-10">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-bold tracking-wide text-emerald-800">
              <IconComponent className="h-4 w-4 text-emerald-700" />
              <span>{tTerms('badge')}</span>
            </div>
            <div className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-500">
              <Clock className="h-3.5 w-3.5 text-slate-400" />
              <span>Updated: {policy.lastUpdated}</span>
            </div>
          </div>

          <h1 className="text-2xl leading-tight font-extrabold tracking-tight text-slate-900 sm:text-3xl md:text-4xl">
            {policy.title}
          </h1>

          <p className="text-sm leading-relaxed font-normal text-slate-600 sm:text-base">
            {policy.shortDesc}
          </p>
        </div>

        {/* Main Content Card */}
        <div className="space-y-8 rounded-3xl border border-slate-200/90 bg-white p-6 shadow-sm sm:p-10">
          {policy.sections.map((sec) => (
            <section
              key={sec.heading}
              className="space-y-3 border-b border-slate-100 pb-6 last:border-0 last:pb-0"
            >
              <h2 className="flex items-center gap-2 text-base font-bold text-emerald-950 text-slate-900 sm:text-lg">
                <span className="h-2 w-2 shrink-0 rounded-full bg-emerald-600" />
                {sec.heading}
              </h2>
              <div className="space-y-2 pl-4">
                {sec.content.map((p) => (
                  <p
                    key={p}
                    className="text-sm leading-relaxed font-normal text-slate-700 sm:text-base"
                  >
                    {p}
                  </p>
                ))}
              </div>
            </section>
          ))}
        </div>

        {/* Company Guarantee & Contact Support Box */}
        <div className="space-y-6 rounded-3xl bg-gradient-to-br from-emerald-950 to-slate-900 p-6 text-white shadow-xl sm:p-8">
          <div className="flex items-start gap-4">
            <div className="rounded-2xl border border-emerald-500/30 bg-emerald-800/60 p-3 text-emerald-300">
              <Building2 className="h-6 w-6" />
            </div>
            <div className="space-y-1">
              <h3 className="text-lg font-bold tracking-tight text-white">
                CÔNG TY CỔ PHẦN SÂM NGỌC LINH
              </h3>
              <p className="text-xs text-slate-300 sm:text-sm">Nam Trà My, Quảng Nam</p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 border-t border-emerald-800/40 pt-2 text-xs sm:grid-cols-2 sm:text-sm">
            <div className="flex items-center gap-2.5 text-slate-200">
              <Phone className="h-4 w-4 shrink-0 text-emerald-400" />
              <span>
                Hotline: <strong className="font-bold text-white">0967 234 234</strong> (24/7)
              </span>
            </div>
            <div className="flex items-center gap-2.5 text-slate-200">
              <Mail className="h-4 w-4 shrink-0 text-emerald-400" />
              <span>
                Email: <strong className="font-bold text-white">hotro@samngoclinh.vn</strong>
              </span>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
            <Link
              href="/terms"
              className="inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/10 px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-white/20 sm:text-sm"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>{locale === 'en' ? 'View all policies' : 'Xem tất cả chính sách'}</span>
            </Link>

            <Link
              href="/contracts/hop-dong-mua-ban-ky-gui-cham-soc-sam-ngoc-linh"
              className="inline-flex items-center gap-2 rounded-xl bg-emerald-500 px-5 py-2.5 text-xs font-bold text-slate-950 shadow-md transition-[background-color,transform] hover:bg-emerald-400 active:scale-98 sm:text-sm"
            >
              <FileText className="h-4 w-4" />
              <span>{tTerms('viewContractSample')}</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
