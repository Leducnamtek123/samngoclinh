'use client';

import { ExternalLink, ShieldCheck, FileCheck } from 'lucide-react';
import Link from 'next/link';
import React from 'react';
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from '@/components/ui/accordion';
import { Checkbox } from '@/components/ui/checkbox';

type QuickPurchaseTermsProps = {
  agreedTerms: boolean;
  setAgreedTerms: (agreed: boolean) => void;
  t: (key: string) => string;
};

export const QuickPurchaseTerms: React.FC<QuickPurchaseTermsProps> = ({
  agreedTerms,
  setAgreedTerms,
  t,
}) => (
  <div className="space-y-3 border-t border-border pt-5">
    <label
      htmlFor="agreed-terms-checkbox"
      className="group flex cursor-pointer items-start gap-3 py-1 select-none sm:items-center"
    >
      <Checkbox
        id="agreed-terms-checkbox"
        checked={agreedTerms}
        onCheckedChange={(checked: boolean | 'indeterminate') => {
          setAgreedTerms(!!checked);
        }}
        className="mt-0.5 shrink-0 sm:mt-0"
      />
      <span className="text-xs leading-normal font-semibold text-foreground transition-colors group-hover:text-primary">
        {t('termsAgreeCheckbox')}
      </span>
    </label>

    {/* Pure shadcn Accordion */}
    <Accordion type="single" collapsible className="space-y-2 pt-1 font-sans text-xs">
      {/* Item 1: Terms of Use */}
      <AccordionItem
        value="terms"
        className="rounded-xl border border-border/80 bg-slate-50/50 px-3"
      >
        <AccordionTrigger className="py-2.5 text-xs font-bold text-slate-800 hover:no-underline">
          <span className="flex items-center gap-2">
            <ShieldCheck className="h-4 w-4 shrink-0 text-emerald-700" />
            <span>{t('termsUseTitle')}</span>
          </span>
        </AccordionTrigger>
        <AccordionContent className="space-y-2 pt-1 pb-3 text-xs text-slate-700">
          <p className="leading-relaxed">{t('termsUseSummary')}</p>
          <div className="border-t border-slate-200/80 pt-1.5">
            <Link
              href="/terms"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 font-bold text-primary transition-colors hover:text-emerald-950"
            >
              <span>{t('viewFullTerms')}</span>
              <ExternalLink className="h-3.5 w-3.5" />
            </Link>
          </div>
        </AccordionContent>
      </AccordionItem>

      {/* Item 2: Legal eContract */}
      <AccordionItem
        value="contract"
        className="rounded-xl border border-border/80 bg-slate-50/50 px-3"
      >
        <AccordionTrigger className="py-2.5 text-xs font-bold text-slate-800 hover:no-underline">
          <span className="flex items-center gap-2">
            <FileCheck className="h-4 w-4 shrink-0 text-emerald-700" />
            <span>{t('termsContractTitle')}</span>
          </span>
        </AccordionTrigger>
        <AccordionContent className="space-y-2 pt-1 pb-3 text-xs text-slate-700">
          <p className="leading-relaxed">{t('termsContractSummary')}</p>
          <div className="border-t border-slate-200/80 pt-1.5">
            <Link
              href="/contracts/hop-dong-mua-ban-ky-gui-cham-soc-sam-ngoc-linh"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 font-bold text-primary transition-colors hover:text-emerald-950"
            >
              <span>{t('viewFullContract')}</span>
              <ExternalLink className="h-3.5 w-3.5" />
            </Link>
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  </div>
);
