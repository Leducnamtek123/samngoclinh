'use client';

import { Sprout, CheckCircle2, Gift, ArrowRight } from 'lucide-react';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Link } from '@/lib/I18nNavigation';
import { ClaimPlantModal } from './ClaimPlantModal';

export type FreeTreeSlot = {
  id: string;
  plantCatalog?: {
    name?: string;
    description?: string;
    ageYear?: number;
  };
  [key: string]: unknown;
};

type FreeTreeOfferGridProps = {
  slots: FreeTreeSlot[];
  token?: string;
};

export function FreeTreeOfferGrid({ slots, token }: FreeTreeOfferGridProps) {
  const t = useTranslations('freeTreeCampaign');
  const tAuth = useTranslations('auth');

  const [selectedItem, setSelectedItem] = useState<FreeTreeSlot | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const imageUrl =
    'https://lh3.googleusercontent.com/aida-public/AB6AXuD0gUrpDrfeFU_Yv52ojl__qDMu2iJBO5s34hrrsjYkLHK6Bhkz9mXaPsd4VPh7xDjttnsKtxie18TWAQSN-a44V3A3J9nHUQ15fnz3b8q9I_jGsiyWBzQoJcFp_LxW2lLvdKKOkoavmo-dncTVg7pAmy5QugtUYr9GgiW25eWHkOaLN8OkMDTpDqT1KRBXZjmHNuWHC9b20wnUhbHEHn9I_7KyjAWxOoh3g2MxGyF4yMbVilr4Z-Q8';

  const handleClaimClick = (slot: FreeTreeSlot) => {
    setSelectedItem(slot);
    setIsModalOpen(true);
  };

  return (
    <>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {slots.map((slot) => (
          <div
            key={slot.id}
            className="group flex flex-col justify-between overflow-hidden rounded-3xl border border-slate-200/80 bg-white shadow-xs transition-[box-shadow,transform] duration-300 hover:-translate-y-1 hover:shadow-2xl"
          >
            {/* Plant Image Container */}
            <div className="relative h-64 overflow-hidden bg-slate-100">
              <Image
                src={imageUrl}
                alt={slot.plantCatalog?.name || 'Sâm Ngọc Linh'}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                unoptimized
                className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
              />

              {/* Top Overlay Gradients */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />

              <div className="absolute top-3 right-3 flex items-center gap-1.5 rounded-full bg-primary/90 px-3 py-1 text-[11px] font-bold text-white shadow-md backdrop-blur-md">
                <Sprout className="h-3.5 w-3.5 text-emerald-400" />
                <span>{slot.plantCatalog?.ageYear || 1} Năm Tuổi</span>
              </div>

              {/* Bottom Image Tag */}
              <div className="absolute right-3 bottom-3 left-3 flex items-center justify-between text-xs font-semibold text-white drop-shadow-sm">
                <span className="rounded-lg bg-black/40 px-2.5 py-1 backdrop-blur-xs">
                  SNG-{slot.id.slice(0, 4).toUpperCase()}
                </span>
                <span className="rounded-lg bg-emerald-600/90 px-2.5 py-1 text-[11px] font-bold tracking-wider text-white uppercase">
                  OK
                </span>
              </div>
            </div>

            {/* Plant Details */}
            <div className="flex flex-1 flex-col justify-between space-y-4 p-5">
              <div className="space-y-2">
                <h3 className="line-clamp-1 text-lg font-extrabold text-slate-900 transition-colors group-hover:text-emerald-800">
                  {slot.plantCatalog?.name || 'Sâm Ngọc Linh'}
                </h3>
                <p className="line-clamp-2 text-xs leading-relaxed font-normal text-slate-500">
                  {slot.plantCatalog?.description || t('subtitle')}
                </p>
              </div>

              {/* Benefits List */}
              <div className="space-y-2 border-t border-slate-100 pt-2">
                <div className="flex items-center gap-2 text-xs font-medium text-slate-600">
                  <CheckCircle2 className="h-3.5 w-3.5 flex-shrink-0 text-emerald-600" />
                  <span>{t('rule2')}</span>
                </div>
                <div className="flex items-center gap-2 text-xs font-medium text-slate-600">
                  <CheckCircle2 className="h-3.5 w-3.5 flex-shrink-0 text-emerald-600" />
                  <span>{t('rule3')}</span>
                </div>
              </div>

              {/* Pricing Block */}
              <div className="flex items-center justify-between border-t border-slate-100 pt-3">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-500">
                  <Gift className="h-4 w-4 text-amber-600" />
                  <span>{t('eligibilityTitle')}</span>
                </div>
                <div className="text-right">
                  <span className="block text-base font-black tracking-tight text-[#D97706] uppercase">
                    100% Free
                  </span>
                </div>
              </div>

              {/* Action CTA Button */}
              <div className="pt-1">
                {token ? (
                  <Button
                    type="button"
                    onClick={() => {
                      handleClaimClick(slot);
                    }}
                    className="group/btn flex w-full cursor-pointer items-center justify-center gap-2 rounded-2xl bg-primary py-3 text-xs font-bold text-white shadow-md transition-colors duration-200 hover:bg-primary-hover hover:shadow-lg active:bg-emerald-950"
                  >
                    <span>{t('claimBtn')}</span>
                    <ArrowRight className="h-4 w-4 transition-transform group-hover/btn:translate-x-1" />
                  </Button>
                ) : (
                  <Link
                    href="/sign-in?reason=campaign"
                    className="group/btn flex w-full items-center justify-center gap-2 rounded-2xl bg-primary py-3 text-xs font-bold text-white shadow-md transition-colors duration-200 hover:bg-primary-hover hover:shadow-lg active:bg-emerald-950"
                  >
                    <span>{tAuth('login')}</span>
                    <ArrowRight className="h-4 w-4 transition-transform group-hover/btn:translate-x-1" />
                  </Link>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Claim Plant Modal */}
      <ClaimPlantModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
        }}
        item={selectedItem}
      />
    </>
  );
}
