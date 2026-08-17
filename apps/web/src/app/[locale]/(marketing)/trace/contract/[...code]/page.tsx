import { ArrowLeft, CheckCircle2, Download, Lock, ShieldCheck, XCircle } from 'lucide-react';
import type { Metadata } from 'next';
import { setRequestLocale, getTranslations } from 'next-intl/server';
import { Button } from '@/components/ui/button';
import { fetchApi } from '@/lib/Api';
import { Link } from '@/lib/I18nNavigation';
import { formatVNDPrice } from '@/utils/formatters';

type ContractTracePageProps = {
  params: Promise<{ locale: string; code: string | string[] }>;
};

function resolveCode(code: string | string[]): string {
  if (Array.isArray(code)) {
    return code.join('/');
  }
  return code || '';
}

export async function generateMetadata({ params }: ContractTracePageProps): Promise<Metadata> {
  const { locale, code } = await params;
  const contractCode = resolveCode(code);
  return {
    title:
      locale === 'en'
        ? `Verify Electronic Contract #${contractCode} | Sâm Ngọc Linh`
        : `Xác Thực Hợp Đồng Điện Tử #${contractCode} | Sâm Ngọc Linh`,
    description:
      locale === 'en'
        ? `Verify legal validity, digital signature, and SHA-256 integrity for contract #${contractCode}.`
        : `Tra cứu tính pháp lý, toàn vẹn và thông tin chứng thực điện tử của hợp đồng #${contractCode}.`,
  };
}

async function getContractVerification(code: string) {
  try {
    const res = await fetchApi(`/public/contracts/verify?code=${encodeURIComponent(code)}`, {
      cache: 'no-store',
    });
    if (!res.ok) {
      const directRes = await fetchApi(`/public/contracts/verify/${encodeURIComponent(code)}`, {
        cache: 'no-store',
      });
      if (!directRes.ok) {
        return null;
      }
      const directJson = await directRes.json();
      return directJson.data || null;
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
  const tNav = await getTranslations({ locale, namespace: 'nav' });

  const contractCode = resolveCode(code);
  const verification = await getContractVerification(contractCode);
  const pdfDownloadUrl = `/api/proxy/public/contracts/pdf?code=${encodeURIComponent(contractCode)}`;

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
              <span>{t('title')}</span>
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
                    <span>{t('verified')}</span>
                  </div>
                  <h1 className="text-xl font-black tracking-tight uppercase sm:text-2xl">
                    {t('title')}
                  </h1>
                  <p className="font-mono text-xs text-emerald-200/90">
                    #{verification.contractCode}
                  </p>
                </div>
              </div>
            </div>

            {/* Certificate Details Body */}
            <div className="space-y-6 p-6 sm:p-8">
              {/* Document Overview Card */}
              <div className="space-y-4 rounded-2xl border border-slate-200 bg-slate-50 p-5 dark:border-slate-700/60 dark:bg-slate-800/60">
                <div className="grid grid-cols-1 gap-4 text-xs sm:grid-cols-2 sm:text-sm">
                  <div>
                    <span className="block text-xs text-slate-500">{t('partyA')}:</span>
                    <strong className="text-slate-900 dark:text-slate-100">
                      {verification.partyA}
                    </strong>
                  </div>

                  <div>
                    <span className="block text-xs text-slate-500">{t('partyB')}:</span>
                    <div className="flex items-center gap-2">
                      <strong className="text-slate-900 dark:text-slate-100">
                        {verification.maskedCustomerName}
                      </strong>
                    </div>
                  </div>

                  <div>
                    <span className="block text-xs text-slate-500">{t('contractValue')}:</span>
                    <strong className="font-bold text-emerald-700 dark:text-emerald-400">
                      {formatVNDPrice(Number(verification.contractValue) || 0)}
                    </strong>
                  </div>

                  <div>
                    <span className="block text-xs text-slate-500">{t('signedAt')}:</span>
                    <strong className="font-mono text-slate-900 dark:text-slate-100">
                      {verification.signedAt
                        ? new Date(verification.signedAt).toLocaleString()
                        : '—'}
                    </strong>
                  </div>
                </div>
              </div>

              {/* Legal Note */}
              <div className="flex items-start gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-4 text-xs text-slate-600 dark:border-slate-700/60 dark:bg-slate-800/40 dark:text-slate-400">
                <Lock className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
                <p>{t('legalDisclaimer')}</p>
              </div>

              {/* Actions: Download Official PDF */}
              <div className="flex flex-col items-center justify-between gap-4 border-t border-slate-200 pt-2 sm:flex-row dark:border-slate-800">
                <div className="flex items-center gap-2 text-xs text-slate-500">
                  <span>Sâm Ngọc Linh</span>
                </div>

                <a
                  href={pdfDownloadUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-700 px-6 py-3 text-xs font-bold text-white shadow-md transition-[background-color,transform] hover:bg-emerald-800 active:scale-[0.98] sm:w-auto sm:text-sm"
                >
                  <Download className="h-4 w-4" />
                  <span>PDF</span>
                </a>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-4 rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-xl sm:p-12 dark:border-slate-800 dark:bg-slate-900">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-100 text-red-600 dark:bg-red-950">
              <XCircle className="h-10 w-10" />
            </div>
            <h2 className="text-xl font-black text-slate-900 dark:text-slate-100">
              {t('notFoundTitle')}
            </h2>
            <p className="mx-auto max-w-md text-sm text-slate-500 dark:text-slate-400">
              {t('notFoundDesc')}
            </p>
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
