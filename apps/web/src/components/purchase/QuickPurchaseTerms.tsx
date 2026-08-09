'use client';

import React from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from '@/components/ui/accordion';

type QuickPurchaseTermsProps = {
  agreedTerms: boolean;
  setAgreedTerms: (agreed: boolean) => void;
  t: (key: string) => string;
};

export const QuickPurchaseTerms: React.FC<QuickPurchaseTermsProps> = ({
  agreedTerms,
  setAgreedTerms,
  t,
}) => {
  return (
    <div className="space-y-3 border-t border-border pt-5">
      <label
        htmlFor="agreed-terms-checkbox"
        className="flex items-center gap-3 cursor-pointer select-none group py-1"
      >
        <Checkbox
          id="agreed-terms-checkbox"
          checked={agreedTerms}
          onCheckedChange={(checked: boolean | 'indeterminate') => setAgreedTerms(!!checked)}
          className="shrink-0"
        />
        <span className="text-xs text-foreground font-semibold leading-normal group-hover:text-primary transition-colors">
          {t('agreeTermsText')}
        </span>
      </label>

      {/* Pure shadcn Accordion */}
      <Accordion type="single" collapsible className="space-y-2 text-xs pt-1">
        <AccordionItem value="terms">
          <AccordionTrigger>{t('careTermsTitle')}</AccordionTrigger>
          <AccordionContent className="space-y-1.5 font-sans">
            <p>{t('careTermsItem1')}</p>
            <p>{t('careTermsItem2')}</p>
            <p>{t('careTermsItem3')}</p>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="contract">
          <AccordionTrigger>{t('contractSampleTitle')}</AccordionTrigger>
          <AccordionContent className="space-y-2 font-mono text-[11px]">
            <p className="font-bold text-foreground">{t('contractSampleLine1')}</p>
            <p className="font-bold text-primary">{t('contractSampleLine2')}</p>
            <p>{t('contractSampleLine3')}</p>
            <p>{t('contractSampleLine4')}</p>
            <p>{t('contractSampleLine5')}</p>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
};
