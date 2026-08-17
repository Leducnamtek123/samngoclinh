'use client';

import { ArrowLeft, Printer, ShieldCheck, Share2, Check } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Link } from '@/lib/I18nNavigation';

type ContractToolbarProps = {
  backHref?: string;
  contractCode?: string;
  contractTitle?: string;
};

export const ContractToolbar = ({
  backHref = '/campaigns/free-tree',
  contractCode,
  contractTitle,
}: ContractToolbarProps) => {
  const t = useTranslations('econtract');
  const resolvedTitle = contractTitle || t('title');
  const [copied, setCopied] = useState(false);

  const handlePrint = () => {
    if (typeof window !== 'undefined') {
      window.print();
    }
  };

  const handleCopyLink = async () => {
    if (typeof window !== 'undefined') {
      try {
        await navigator.clipboard.writeText(window.location.href);
        setCopied(true);
        setTimeout(() => {
          setCopied(false);
        }, 2500);
      } catch (error) {
        console.error('Failed to copy link:', error);
      }
    }
  };

  return (
    <aside
      aria-label={t('toolbarAria')}
      className="no-print sticky top-20 z-40 mb-6 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-200/90 bg-white/95 p-3.5 shadow-sm backdrop-blur-md sm:top-24 sm:p-4"
    >
      {/* Left side: Back link & Title */}
      <div className="flex items-center gap-3">
        <Link
          href={backHref}
          className="inline-flex items-center gap-2 rounded-xl px-2.5 py-1.5 text-xs font-bold text-slate-700 transition-colors hover:bg-slate-100/80 hover:text-emerald-800 sm:text-sm"
        >
          <ArrowLeft className="h-4 w-4 text-slate-500" />
          <span>{t('back')}</span>
        </Link>

        <span className="hidden items-center gap-1.5 rounded-full border border-emerald-200/80 bg-emerald-50 px-3 py-1.5 text-xs font-bold text-emerald-800 sm:inline-flex">
          <ShieldCheck className="h-4 w-4 shrink-0 text-emerald-600" />
          <span>{contractCode ? `${resolvedTitle} (${contractCode})` : resolvedTitle}</span>
        </span>
      </div>

      {/* Right side: Action Buttons */}
      <div className="flex items-center gap-2">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={handleCopyLink}
          className="inline-flex h-9 items-center gap-1.5 rounded-xl border-slate-200 px-3 text-xs font-semibold text-slate-700 hover:bg-slate-100"
          title={t('share')}
        >
          {copied ? (
            <>
              <Check className="h-3.5 w-3.5 text-emerald-600" />
              <span className="text-emerald-700">{t('copied')}</span>
            </>
          ) : (
            <>
              <Share2 className="h-3.5 w-3.5 text-slate-500" />
              <span className="xs:inline hidden">{t('share')}</span>
            </>
          )}
        </Button>

        <Button
          type="button"
          onClick={handlePrint}
          className="inline-flex h-9 cursor-pointer items-center gap-2 rounded-xl bg-emerald-800 px-4 text-xs font-bold text-white shadow-xs transition-[box-shadow,background-color] hover:bg-emerald-900 hover:shadow-md"
          title={t('printPdf')}
        >
          <Printer className="h-4 w-4" />
          <span>{t('printPdf')}</span>
        </Button>
      </div>
    </aside>
  );
};
