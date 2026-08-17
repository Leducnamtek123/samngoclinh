'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import { EmptyState } from '@/components/common';
import { Badge } from '@/components/ui';
import { Sprout, MapPin, Calendar } from 'lucide-react';

export interface GinsengBedsGridProps {
  beds: any[];
}

export const GinsengBedsGrid: React.FC<GinsengBedsGridProps> = ({ beds }) => {
  const t = useTranslations('trees');

  if (!beds || beds.length === 0) {
    return (
      <EmptyState
        title={t('cultivationBed')}
        description={t('emptyGinseng')}
        icon={Sprout}
      />
    );
  }

  return (
    <div className="space-y-4">
      <h3 className="text-sm font-extrabold text-gray-900">
        {t('cultivationBed')}
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {beds.map((bed: any) => (
          <div
            key={bed.code || bed.id}
            className="bg-white border border-gray-200 rounded-2xl p-5 space-y-3 shadow-xs hover:border-primary transition-colors"
          >
            <div className="flex justify-between items-center">
              <span className="font-extrabold text-sm text-primary">{t('bedCode')}: #{bed.code}</span>
              <Badge variant="secondary" className="bg-emerald-100 text-emerald-800 border-none">
                {bed.ageYear} {t('yearsOld')}
              </Badge>
            </div>
            <p className="text-xs text-gray-500 font-medium flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span>{bed.gardenName || bed.gardenLocation || 'Nam Trà My'}</span>
            </p>
            <div className="text-xs text-gray-600 space-y-1.5">
              <p className="flex items-center gap-1.5">
                <Sprout className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>{t('treeCount')}: <strong className="font-bold text-gray-800">{bed.treeCount || 50}</strong></span>
              </p>
              <p className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>
                  {t('plantedDate')}:{' '}
                  <strong className="font-bold text-gray-800">
                    {bed.plantedAt ? new Date(bed.plantedAt).toLocaleDateString() : '—'}
                  </strong>
                </span>
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
