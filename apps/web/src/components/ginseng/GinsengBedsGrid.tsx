'use client';

import { Sprout, MapPin, Calendar } from 'lucide-react';
import { useTranslations } from 'next-intl';
import React from 'react';
import { EmptyState } from '@/components/common';
import { Badge } from '@/components/ui';
import type { CultivationBed } from '@/types';

export type GinsengBedsGridProps = {
  beds: CultivationBed[];
};

export const GinsengBedsGrid: React.FC<GinsengBedsGridProps> = ({ beds }) => {
  const t = useTranslations('trees');

  if (!beds || beds.length === 0) {
    return <EmptyState title={t('cultivationBed')} description={t('emptyGinseng')} icon={Sprout} />;
  }

  return (
    <div className="space-y-4">
      <h3 className="text-sm font-extrabold text-gray-900">{t('cultivationBed')}</h3>
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {beds.map((bed: CultivationBed) => (
          <div
            key={bed.code || bed.id}
            className="space-y-3 rounded-2xl border border-gray-200 bg-white p-5 shadow-xs transition-colors hover:border-primary"
          >
            <div className="flex items-center justify-between">
              <span className="text-sm font-extrabold text-primary">
                {t('bedCode')}: #{bed.code}
              </span>
              <Badge variant="secondary" className="border-none bg-emerald-100 text-emerald-800">
                {bed.ageYear} {t('yearsOld')}
              </Badge>
            </div>
            <p className="flex items-center gap-1 text-xs font-medium text-gray-500">
              <MapPin className="h-3.5 w-3.5 shrink-0 text-emerald-600" />
              <span>{bed.gardenName || bed.gardenLocation || 'Nam Trà My'}</span>
            </p>
            <div className="space-y-1.5 text-xs text-gray-600">
              <p className="flex items-center gap-1.5">
                <Sprout className="h-3.5 w-3.5 shrink-0 text-emerald-600" />
                <span>
                  {t('treeCount')}:{' '}
                  <strong className="font-bold text-gray-800">{bed.treeCount || 50}</strong>
                </span>
              </p>
              <p className="flex items-center gap-1.5">
                <Calendar className="h-3.5 w-3.5 shrink-0 text-emerald-600" />
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
