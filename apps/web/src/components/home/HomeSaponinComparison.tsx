'use client';

import { Award, Check, Sparkles, X } from 'lucide-react';
import { useTranslations } from 'next-intl';
import React from 'react';
import { ScrollReveal } from '@/components/animation';

export const HomeSaponinComparison: React.FC = () => {
  const t = useTranslations('saponinComparison');
  const tHome = useTranslations('homepage');

  return (
    <section className="relative w-full overflow-hidden bg-gradient-to-b from-white via-emerald-50/40 to-white py-16 sm:py-24 dark:from-slate-950 dark:via-emerald-950/20 dark:to-slate-950">
      <div className="relative z-10 mx-auto max-w-7xl space-y-12 px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <ScrollReveal>
          <div className="mx-auto max-w-3xl space-y-3 text-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-300 bg-emerald-100 px-3.5 py-1 text-xs font-black tracking-wider text-emerald-900 uppercase shadow-2xs dark:border-emerald-700 dark:bg-emerald-950/80 dark:text-emerald-300">
              <Sparkles className="h-3.5 w-3.5 text-emerald-700 dark:text-emerald-400" />
              <span>{t('badge')}</span>
            </div>
            <h2 className="font-display-lg text-2xl leading-tight font-black tracking-tight text-gray-900 sm:text-4xl dark:text-gray-100">
              {t('title')}
            </h2>
            <p className="text-xs leading-relaxed font-medium text-gray-600 sm:text-base dark:text-gray-300">
              {t('subtitle')}
            </p>
          </div>
        </ScrollReveal>

        {/* Comparison Grid */}
        <div className="grid grid-cols-1 items-stretch gap-8 lg:grid-cols-3">
          {/* Card 1: Sâm Ngọc Linh (Hero/Winner) */}
          <ScrollReveal delay={0.1}>
            <div className="relative flex h-full transform flex-col justify-between rounded-3xl border-2 border-emerald-500 bg-gradient-to-b from-emerald-900 via-emerald-950 to-slate-950 p-8 text-white shadow-2xl lg:-translate-y-2">
              <div className="absolute -top-4 left-1/2 flex -translate-x-1/2 items-center gap-1.5 rounded-full bg-amber-400 px-4 py-1 text-xs font-black whitespace-nowrap text-slate-950 uppercase shadow-md">
                <Award className="h-3.5 w-3.5" />
                <span>{tHome('heroBadge')}</span>
              </div>

              <div className="space-y-6">
                <div className="border-b border-emerald-800/80 pb-5">
                  <span className="text-xs font-bold tracking-widest text-emerald-300 uppercase">
                    {t('vietnam')}
                  </span>
                  <h3 className="mt-1 text-2xl font-black text-white">{t('ngocLinhGinseng')}</h3>
                  <p className="font-mono text-xs text-emerald-300/80 italic">
                    Panax vietnamensis Ha et Grushv
                  </p>
                </div>

                <div className="space-y-2">
                  <div className="flex items-baseline gap-2">
                    <span className="text-5xl font-black text-amber-400">52</span>
                    <span className="text-sm font-bold text-emerald-200 uppercase">
                      {t('snlTotal')}
                    </span>
                  </div>
                  <p className="text-xs leading-relaxed text-emerald-200/90">{t('snlRank')}</p>
                </div>

                <div className="space-y-2.5 border-t border-emerald-800/60 pt-2 text-xs">
                  <div className="flex items-start gap-2">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-amber-400" />
                    <span>
                      <strong className="text-white">{t('mr2Title')}:</strong> {t('mr2Desc')}
                    </span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-amber-400" />
                    <span>
                      <strong className="text-white">{t('rg1Title')}:</strong> {t('rg1Desc')}
                    </span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-amber-400" />
                    <span>
                      <strong className="text-white">{t('rb1Title')}:</strong> {t('rb1Desc')}
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-8 border-t border-emerald-800/80 pt-4 text-center">
                <span className="inline-block text-[11px] font-bold tracking-wider text-emerald-300 uppercase">
                  {tHome('trustGenuine')} • GACP-WHO
                </span>
              </div>
            </div>
          </ScrollReveal>

          {/* Card 2: Korean Ginseng */}
          <ScrollReveal delay={0.2}>
            <div className="flex h-full flex-col justify-between rounded-3xl border border-gray-200 bg-white p-8 shadow-md dark:border-gray-800 dark:bg-slate-900">
              <div className="space-y-6">
                <div className="border-b border-gray-100 pb-5 dark:border-gray-800">
                  <span className="text-xs font-bold tracking-widest text-gray-400 uppercase">
                    {t('korea')}
                  </span>
                  <h3 className="mt-1 text-xl font-extrabold text-gray-900 dark:text-gray-100">
                    {t('koreanGinseng')}
                  </h3>
                  <p className="font-mono text-xs text-gray-400 italic">Panax ginseng C.A. Meyer</p>
                </div>

                <div className="space-y-2">
                  <div className="flex items-baseline gap-2">
                    <span className="text-4xl font-black text-gray-800 dark:text-gray-200">26</span>
                    <span className="text-xs font-bold text-gray-500 uppercase">
                      {t('snlTotal')}
                    </span>
                  </div>
                  <p className="text-xs leading-relaxed text-gray-600 dark:text-gray-400">
                    {t('koreanComparison')}
                  </p>
                </div>

                <div className="space-y-2.5 border-t border-gray-100 pt-2 text-xs text-gray-600 dark:border-gray-800 dark:text-gray-400">
                  <div className="flex items-start gap-2">
                    <X className="mt-0.5 h-4 w-4 shrink-0 text-red-500" />
                    <span>{t('noMR2')}</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
                    <span>{t('highRg1Rb1')}</span>
                  </div>
                </div>
              </div>

              <div className="mt-8 border-t border-gray-100 pt-4 text-center dark:border-gray-800">
                <span className="text-xs font-medium text-gray-400">GMP Standard</span>
              </div>
            </div>
          </ScrollReveal>

          {/* Card 3: American Ginseng */}
          <ScrollReveal delay={0.3}>
            <div className="flex h-full flex-col justify-between rounded-3xl border border-gray-200 bg-white p-8 shadow-md dark:border-gray-800 dark:bg-slate-900">
              <div className="space-y-6">
                <div className="border-b border-gray-100 pb-5 dark:border-gray-800">
                  <span className="text-xs font-bold tracking-widest text-gray-400 uppercase">
                    {t('northAmerica')}
                  </span>
                  <h3 className="mt-1 text-xl font-extrabold text-gray-900 dark:text-gray-100">
                    {t('americanGinseng')}
                  </h3>
                  <p className="font-mono text-xs text-gray-400 italic">Panax quinquefolius</p>
                </div>

                <div className="space-y-2">
                  <div className="flex items-baseline gap-2">
                    <span className="text-4xl font-black text-gray-800 dark:text-gray-200">14</span>
                    <span className="text-xs font-bold text-gray-500 uppercase">
                      {t('snlTotal')}
                    </span>
                  </div>
                  <p className="text-xs leading-relaxed text-gray-600 dark:text-gray-400">
                    {t('americanComparison')}
                  </p>
                </div>

                <div className="space-y-2.5 border-t border-gray-100 pt-2 text-xs text-gray-600 dark:border-gray-800 dark:text-gray-400">
                  <div className="flex items-start gap-2">
                    <X className="mt-0.5 h-4 w-4 shrink-0 text-red-500" />
                    <span>{t('noMR2')}</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
                    <span>{t('coolingEffect')}</span>
                  </div>
                </div>
              </div>

              <div className="mt-8 border-t border-gray-100 pt-4 text-center dark:border-gray-800">
                <span className="text-xs font-medium text-gray-400">USDA Organic</span>
              </div>
            </div>
          </ScrollReveal>
        </div>

        {/* Scientific Source Footnote */}
        <div className="pt-4 text-center text-xs text-gray-400 dark:text-gray-500">
          <p>{t('scientificSource')}</p>
        </div>
      </div>
    </section>
  );
};
