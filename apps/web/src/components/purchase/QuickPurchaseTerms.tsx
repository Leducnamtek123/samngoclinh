'use client';

import React, { useState } from 'react';
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
}) => {
  const [openTermsAccordion, setOpenTermsAccordion] = useState(false);
  const [openContractAccordion, setOpenContractAccordion] = useState(false);

  return (
    <div className="space-y-3 border-t border-gray-150 pt-5">
      <div
        className="flex items-start gap-2 cursor-pointer select-none"
        onClick={() => setAgreedTerms(!agreedTerms)}
      >
        <Checkbox
          checked={agreedTerms}
          onCheckedChange={(checked: boolean | 'indeterminate') => setAgreedTerms(!!checked)}
        />
        <span className="text-xs text-gray-700 font-semibold leading-relaxed">
          {t('agreeTermsText')}
        </span>
      </div>

      {/* Accordions */}
      <div className="space-y-2 text-xs">
        <div className="border border-gray-200 rounded-xl overflow-hidden">
          <button
            type="button"
            onClick={() => setOpenTermsAccordion(!openTermsAccordion)}
            className="w-full px-4 py-2.5 bg-gray-50 flex items-center justify-between font-bold text-gray-700 hover:bg-gray-100 transition-colors text-left cursor-pointer"
          >
            <span>{t('careTermsTitle')}</span>
            <span>{openTermsAccordion ? '▲' : '▼'}</span>
          </button>
          {openTermsAccordion && (
            <div className="p-4 text-[11px] text-gray-600 space-y-1.5 leading-relaxed bg-white border-t border-gray-200">
              <p>{t('careTermsItem1')}</p>
              <p>{t('careTermsItem2')}</p>
              <p>{t('careTermsItem3')}</p>
            </div>
          )}
        </div>

        <div className="border border-gray-200 rounded-xl overflow-hidden">
          <button
            type="button"
            onClick={() => setOpenContractAccordion(!openContractAccordion)}
            className="w-full px-4 py-2.5 bg-gray-50 flex items-center justify-between font-bold text-gray-700 hover:bg-gray-100 transition-colors text-left cursor-pointer"
          >
            <span>{t('contractSampleTitle')}</span>
            <span>{openContractAccordion ? '▲' : '▼'}</span>
          </button>
          {openContractAccordion && (
            <div className="p-4 text-[11px] text-gray-600 space-y-2 leading-relaxed bg-white border-t border-gray-200 font-mono">
              <p className="font-bold text-gray-900">{t('contractSampleLine1')}</p>
              <p className="font-bold text-primary">{t('contractSampleLine2')}</p>
              <p>{t('contractSampleLine3')}</p>
              <p>{t('contractSampleLine4')}</p>
              <p>{t('contractSampleLine5')}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
