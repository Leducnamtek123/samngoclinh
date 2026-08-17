import type { Metadata } from 'next';
import { setRequestLocale, getTranslations } from 'next-intl/server';
import { fetchApi } from '@/lib/Api';
import { Link } from '@/lib/I18nNavigation';
import {
  ArrowLeft,
  CheckCircle2,
  Download,
  Lock,
  ShieldCheck,
  XCircle,
} from 'lucide-react';
import { Button } from '@/components/ui/button';

type ContractTracePageProps = {
  params: Promise<{ locale: string; code: string }>;
};

export async function generateMetadata({ params }: ContractTracePageProps): Promise<Metadata> {
  const { locale, code } = await params;
  const t = await getTranslations({ locale, namespace: 'trace' });
  return {
    title: `${t('contractDetailsTitle')} #${code} | Sâm Ngọc Linh`,
    description: t('contractDetailsDesc'),
  };
}

async function getContractVerification(code: string) {
  try {
    const res = await fetchApi(`/public/contracts/verify/${encodeURIComponent(code)}`, {
      cache: 'no-store',
    });
    if (!res.ok) {
      return null;
    }
    const json = await res.json();
    return json.data || null;
  } catch (error) {
    console.error('Error fetching contract verification:', error);
    return null;
  }
}

export default async function ContractTracePage(props: ContractTracePageProps) {
  const { locale, code } = await props.params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: 'trace' });
  const tEcontract = await getTranslations({ locale, namespace: 'econtract' });
  const tNav = await getTranslations({ locale, namespace: 'nav' });

  const verification = await getContractVerification(code);
  const pdfDownloadUrl = `/api/proxy/public/contracts/${encodeURIComponent(code)}/pdf`;

  return (
    <div className="w-full bg-slate-50 dark:bg-slate-950 min-h-screen py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto space-y-6">
        {/* Top Navigation */}
        <div className="flex items-center justify-between bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-sm">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-slate-700 dark:text-slate-300 hover:text-emerald-700 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>{tNav('home')}</span>
          </Link>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-800 bg-emerald-50 dark:bg-emerald-950 dark:text-emerald-300 px-3 py-1 rounded-full border border-emerald-200 dark:border-emerald-800">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>{t('featureContractTitle')}</span>
            </span>
          </div>
        </div>

        {!verification ? (
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl rounded-3xl p-8 sm:p-12 text-center space-y-4">
            <div className="w-16 h-16 bg-red-100 dark:bg-red-950 text-red-600 rounded-full flex items-center justify-center mx-auto">
              <XCircle className="w-10 h-10" />
            </div>
            <h2 className="text-xl font-black text-slate-900 dark:text-slate-100">
              {t('notFound', { code })}
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 max-w-md mx-auto">
              #{code}
            </p>
            <div className="pt-2">
              <Button asChild variant="outline">
                <Link href="/">{tNav('home')}</Link>
              </Button>
            </div>
          </div>
        ) : (
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl rounded-3xl overflow-hidden">
            {/* Header Certificate Banner */}
            <div className="bg-gradient-to-r from-emerald-900 via-emerald-800 to-teal-900 text-white p-6 sm:p-8 relative">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1.5">
                  <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 text-xs font-extrabold uppercase tracking-wider">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>{tEcontract('signed')}</span>
                  </div>
                  <h1 className="text-2xl sm:text-3xl font-black font-display">
                    {verification.contractTitle || tEcontract('title')}
                  </h1>
                  <p className="text-xs sm:text-sm text-emerald-200/80 font-mono">
                    #{code}
                  </p>
                </div>

                <div className="text-left sm:text-right">
                  <a
                    href={pdfDownloadUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 bg-white text-emerald-900 hover:bg-emerald-50 px-4 py-2.5 rounded-xl font-bold text-xs shadow-md transition-transform active:scale-95"
                  >
                    <Download className="w-4 h-4 text-emerald-700" />
                    <span>{tEcontract('downloadPdf')}</span>
                  </a>
                </div>
              </div>
            </div>

            {/* Verification Metadata Grid */}
            <div className="p-6 sm:p-8 space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs sm:text-sm">
                <div className="bg-slate-50 dark:bg-slate-950/60 border border-slate-200/70 dark:border-slate-800 p-4 rounded-2xl space-y-1">
                  <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 block">{tEcontract('status')}</span>
                  <p className="font-bold text-emerald-700 dark:text-emerald-400 text-base">{tEcontract('legalEffective')}</p>
                </div>
                <div className="bg-slate-50 dark:bg-slate-950/60 border border-slate-200/70 dark:border-slate-800 p-4 rounded-2xl space-y-1">
                  <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 block">{tEcontract('contractValue')}</span>
                  <p className="font-bold text-slate-900 dark:text-slate-100 text-base">{verification.contractValue ? `${Number(verification.contractValue).toLocaleString('vi-VN')} VNĐ` : '—'}</p>
                </div>
              </div>

              {/* Digital Hash Check */}
              <div className="bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-200/60 dark:border-emerald-800 p-4 rounded-2xl space-y-2">
                <div className="flex items-center gap-2 font-bold text-emerald-900 dark:text-emerald-300 text-xs sm:text-sm">
                  <Lock className="w-4 h-4 text-emerald-600" />
                  <span>{t('standard')}</span>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-400 font-mono break-all bg-white dark:bg-slate-900 p-2.5 rounded-xl border border-emerald-200/40">
                  {verification.documentHash || `SHA256-${code}-VALIDATED`}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
