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
    title: locale === 'en'
      ? `Verify Electronic Contract #${contractCode} | Sâm Ngọc Linh`
      : `Xác Thực Hợp Đồng Điện Tử #${contractCode} | Sâm Ngọc Linh`,
    description: locale === 'en'
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
      if (!directRes.ok) return null;
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
              <span>{t('title')}</span>
            </span>
          </div>
        </div>

        {!verification ? (
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl rounded-3xl p-8 sm:p-12 text-center space-y-4">
            <div className="w-16 h-16 bg-red-100 dark:bg-red-950 text-red-600 rounded-full flex items-center justify-center mx-auto">
              <XCircle className="w-10 h-10" />
            </div>
            <h2 className="text-xl font-black text-slate-900 dark:text-slate-100">
              {t('notFoundTitle')}
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 max-w-md mx-auto">
              {t('notFoundDesc')}
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
                    <span>{t('verified')}</span>
                  </div>
                  <h1 className="text-xl sm:text-2xl font-black uppercase tracking-tight">
                    {t('title')}
                  </h1>
                  <p className="text-xs text-emerald-200/90 font-mono">
                    #{verification.contractCode}
                  </p>
                </div>
              </div>
            </div>

            {/* Certificate Details Body */}
            <div className="p-6 sm:p-8 space-y-6">
              {/* Document Overview Card */}
              <div className="bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 rounded-2xl p-5 space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs sm:text-sm">
                  <div>
                    <span className="text-slate-500 block text-xs">{t('partyA')}:</span>
                    <strong className="text-slate-900 dark:text-slate-100">
                      {verification.partyA}
                    </strong>
                  </div>

                  <div>
                    <span className="text-slate-500 block text-xs">{t('partyB')}:</span>
                    <div className="flex items-center gap-2">
                      <strong className="text-slate-900 dark:text-slate-100">
                        {verification.maskedCustomerName}
                      </strong>
                    </div>
                  </div>

                  <div>
                    <span className="text-slate-500 block text-xs">{t('contractValue')}:</span>
                    <strong className="text-emerald-700 dark:text-emerald-400 font-bold">
                      {formatVNDPrice(Number(verification.contractValue) || 0)}
                    </strong>
                  </div>

                  <div>
                    <span className="text-slate-500 block text-xs">{t('signedAt')}:</span>
                    <strong className="text-slate-900 dark:text-slate-100 font-mono">
                      {verification.signedAt ? new Date(verification.signedAt).toLocaleString() : '—'}
                    </strong>
                  </div>
                </div>
              </div>

              {/* Legal Note */}
              <div className="flex items-start gap-3 p-4 bg-slate-50 dark:bg-slate-800/40 rounded-2xl text-xs text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700/60">
                <Lock className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <p>
                  {t('legalDisclaimer')}
                </p>
              </div>

              {/* Actions: Download Official PDF */}
              <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-slate-200 dark:border-slate-800">
                <div className="flex items-center gap-2 text-xs text-slate-500">
                  <span>Sâm Ngọc Linh</span>
                </div>

                <a
                  href={pdfDownloadUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs sm:text-sm shadow-md transition-[background-color,transform] active:scale-[0.98]"
                >
                  <Download className="w-4 h-4" />
                  <span>PDF</span>
                </a>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
