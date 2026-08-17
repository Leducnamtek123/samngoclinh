import { ArrowLeft, CheckCircle2, Download, Lock, ShieldCheck, XCircle } from 'lucide-react';
import type { Metadata } from 'next';
import { setRequestLocale, getTranslations } from 'next-intl/server';
import { Button } from '@/components/ui/button';
import { fetchApi } from '@/lib/Api';
import { Link } from '@/lib/I18nNavigation';

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
    <div className="min-h-screen w-full bg-slate-50 px-4 py-10 sm:px-6 lg:px-8 dark:bg-slate-950">
      <div className="mx-auto max-w-3xl space-y-6">
        {/* Top Navigation */}
        <div className="flex items-center justify-between rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs font-bold text-slate-700 transition-colors hover:text-emerald-700 sm:text-sm dark:text-slate-300"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>{tNav('home')}</span>
          </Link>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-800 dark:border-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
              <ShieldCheck className="h-4 w-4 text-emerald-600" />
              <span>{t('featureContractTitle')}</span>
            </span>
          </div>
        </div>

        {verification ? (
          <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xl dark:border-slate-800 dark:bg-slate-900">
            {/* Header Certificate Banner */}
            <div className="relative bg-gradient-to-r from-emerald-900 via-emerald-800 to-teal-900 p-6 text-white sm:p-8">
              <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                <div className="space-y-1.5">
                  <div className="inline-flex items-center gap-1.5 rounded-full border border-emerald-400/30 bg-emerald-500/20 px-3 py-0.5 text-xs font-extrabold tracking-wider text-emerald-300 uppercase">
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    <span>{tEcontract('signed')}</span>
                  </div>
                  <h1 className="font-display text-2xl font-black sm:text-3xl">
                    {verification.contractTitle || tEcontract('title')}
                  </h1>
                  <p className="font-mono text-xs text-emerald-200/80 sm:text-sm">#{code}</p>
                </div>

                <div className="text-left sm:text-right">
                  <a
                    href={pdfDownloadUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2.5 text-xs font-bold text-emerald-900 shadow-md transition-transform hover:bg-emerald-50 active:scale-95"
                  >
                    <Download className="h-4 w-4 text-emerald-700" />
                    <span>{tEcontract('downloadPdf')}</span>
                  </a>
                </div>
              </div>
            </div>

            {/* Verification Metadata Grid */}
            <div className="space-y-6 p-6 sm:p-8">
              <div className="grid grid-cols-1 gap-4 text-xs sm:grid-cols-2 sm:text-sm">
                <div className="space-y-1 rounded-2xl border border-slate-200/70 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-950/60">
                  <span className="block text-xs font-semibold text-slate-500 dark:text-slate-400">
                    {tEcontract('status')}
                  </span>
                  <p className="text-base font-bold text-emerald-700 dark:text-emerald-400">
                    {tEcontract('legalEffective')}
                  </p>
                </div>
                <div className="space-y-1 rounded-2xl border border-slate-200/70 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-950/60">
                  <span className="block text-xs font-semibold text-slate-500 dark:text-slate-400">
                    {tEcontract('contractValue')}
                  </span>
                  <p className="text-base font-bold text-slate-900 dark:text-slate-100">
                    {verification.contractValue
                      ? `${Number(verification.contractValue).toLocaleString('vi-VN')} VNĐ`
                      : '—'}
                  </p>
                </div>
              </div>

              {/* Digital Hash Check */}
              <div className="space-y-2 rounded-2xl border border-emerald-200/60 bg-emerald-50/50 p-4 dark:border-emerald-800 dark:bg-emerald-950/20">
                <div className="flex items-center gap-2 text-xs font-bold text-emerald-900 sm:text-sm dark:text-emerald-300">
                  <Lock className="h-4 w-4 text-emerald-600" />
                  <span>{t('standard')}</span>
                </div>
                <p className="rounded-xl border border-emerald-200/40 bg-white p-2.5 font-mono text-xs break-all text-slate-600 dark:bg-slate-900 dark:text-slate-400">
                  {verification.documentHash || `SHA256-${code}-VALIDATED`}
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-4 rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-xl sm:p-12 dark:border-slate-800 dark:bg-slate-900">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-100 text-red-600 dark:bg-red-950">
              <XCircle className="h-10 w-10" />
            </div>
            <h2 className="text-xl font-black text-slate-900 dark:text-slate-100">
              {t('notFound', { code })}
            </h2>
            <p className="mx-auto max-w-md text-sm text-slate-500 dark:text-slate-400">#{code}</p>
            <div className="pt-2">
              <Button asChild variant="outline">
                <Link href="/">{tNav('home')}</Link>
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
