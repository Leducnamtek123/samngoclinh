'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import { Award, Check, Sparkles, X } from 'lucide-react';
import { ScrollReveal } from '@/components/animation';

export const HomeSaponinComparison: React.FC = () => {
  const t = useTranslations('saponinComparison');
  const tHome = useTranslations('homepage');

  return (
    <section className="w-full py-16 sm:py-24 bg-gradient-to-b from-white via-emerald-50/40 to-white dark:from-slate-950 dark:via-emerald-950/20 dark:to-slate-950 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-12">
        {/* Header */}
        <ScrollReveal>
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950/80 border border-emerald-300 dark:border-emerald-700 text-emerald-900 dark:text-emerald-300 text-xs font-black uppercase tracking-wider shadow-2xs">
              <Sparkles className="w-3.5 h-3.5 text-emerald-700 dark:text-emerald-400" />
              <span>{t('badge')}</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-black text-gray-900 dark:text-gray-100 tracking-tight leading-tight font-display-lg">
              {t('title')}
            </h2>
            <p className="text-xs sm:text-base text-gray-600 dark:text-gray-300 leading-relaxed font-medium">
              {t('subtitle')}
            </p>
          </div>
        </ScrollReveal>

        {/* Comparison Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
          {/* Card 1: Sâm Ngọc Linh (Hero/Winner) */}
          <ScrollReveal delay={0.1}>
            <div className="relative rounded-3xl p-8 bg-gradient-to-b from-emerald-900 via-emerald-950 to-slate-950 text-white shadow-2xl border-2 border-emerald-500 flex flex-col justify-between h-full transform lg:-translate-y-2">
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-amber-400 text-slate-950 font-black text-xs uppercase px-4 py-1 rounded-full shadow-md flex items-center gap-1.5 whitespace-nowrap">
                <Award className="w-3.5 h-3.5" />
                <span>{tHome('heroBadge')}</span>
              </div>

              <div className="space-y-6">
                <div className="border-b border-emerald-800/80 pb-5">
                  <span className="text-xs font-bold uppercase tracking-widest text-emerald-300">{t('vietnam')}</span>
                  <h3 className="text-2xl font-black text-white mt-1">{t('ngocLinhGinseng')}</h3>
                  <p className="text-xs text-emerald-300/80 font-mono italic">Panax vietnamensis Ha et Grushv</p>
                </div>

                <div className="space-y-2">
                  <div className="flex items-baseline gap-2">
                    <span className="text-5xl font-black text-amber-400">52</span>
                    <span className="text-sm font-bold text-emerald-200 uppercase">{t('snlTotal')}</span>
                  </div>
                  <p className="text-xs text-emerald-200/90 leading-relaxed">
                    {t('snlRank')}
                  </p>
                </div>

                <div className="space-y-2.5 pt-2 border-t border-emerald-800/60 text-xs">
                  <div className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                    <span><strong className="text-white">{t('mr2Title')}:</strong> {t('mr2Desc')}</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                    <span><strong className="text-white">{t('rg1Title')}:</strong> {t('rg1Desc')}</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                    <span><strong className="text-white">{t('rb1Title')}:</strong> {t('rb1Desc')}</span>
                  </div>
                </div>
              </div>

              <div className="mt-8 pt-4 border-t border-emerald-800/80 text-center">
                <span className="inline-block text-[11px] font-bold text-emerald-300 uppercase tracking-wider">
                  {tHome('trustGenuine')} • GACP-WHO
                </span>
              </div>
            </div>
          </ScrollReveal>

          {/* Card 2: Korean Ginseng */}
          <ScrollReveal delay={0.2}>
            <div className="rounded-3xl p-8 bg-white dark:bg-slate-900 border border-gray-200 dark:border-gray-800 shadow-md flex flex-col justify-between h-full">
              <div className="space-y-6">
                <div className="border-b border-gray-100 dark:border-gray-800 pb-5">
                  <span className="text-xs font-bold uppercase tracking-widest text-gray-400">{t('korea')}</span>
                  <h3 className="text-xl font-extrabold text-gray-900 dark:text-gray-100 mt-1">{t('koreanGinseng')}</h3>
                  <p className="text-xs text-gray-400 font-mono italic">Panax ginseng C.A. Meyer</p>
                </div>

                <div className="space-y-2">
                  <div className="flex items-baseline gap-2">
                    <span className="text-4xl font-black text-gray-800 dark:text-gray-200">26</span>
                    <span className="text-xs font-bold text-gray-500 uppercase">{t('snlTotal')}</span>
                  </div>
                  <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
                    {t('koreanComparison')}
                  </p>
                </div>

                <div className="space-y-2.5 pt-2 border-t border-gray-100 dark:border-gray-800 text-xs text-gray-600 dark:text-gray-400">
                  <div className="flex items-start gap-2">
                    <X className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                    <span>{t('noMR2')}</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>{t('highRg1Rb1')}</span>
                  </div>
                </div>
              </div>

              <div className="mt-8 pt-4 border-t border-gray-100 dark:border-gray-800 text-center">
                <span className="text-xs text-gray-400 font-medium">GMP Standard</span>
              </div>
            </div>
          </ScrollReveal>

          {/* Card 3: American Ginseng */}
          <ScrollReveal delay={0.3}>
            <div className="rounded-3xl p-8 bg-white dark:bg-slate-900 border border-gray-200 dark:border-gray-800 shadow-md flex flex-col justify-between h-full">
              <div className="space-y-6">
                <div className="border-b border-gray-100 dark:border-gray-800 pb-5">
                  <span className="text-xs font-bold uppercase tracking-widest text-gray-400">{t('northAmerica')}</span>
                  <h3 className="text-xl font-extrabold text-gray-900 dark:text-gray-100 mt-1">{t('americanGinseng')}</h3>
                  <p className="text-xs text-gray-400 font-mono italic">Panax quinquefolius</p>
                </div>

                <div className="space-y-2">
                  <div className="flex items-baseline gap-2">
                    <span className="text-4xl font-black text-gray-800 dark:text-gray-200">14</span>
                    <span className="text-xs font-bold text-gray-500 uppercase">{t('snlTotal')}</span>
                  </div>
                  <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
                    {t('americanComparison')}
                  </p>
                </div>

                <div className="space-y-2.5 pt-2 border-t border-gray-100 dark:border-gray-800 text-xs text-gray-600 dark:text-gray-400">
                  <div className="flex items-start gap-2">
                    <X className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                    <span>{t('noMR2')}</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>{t('coolingEffect')}</span>
                  </div>
                </div>
              </div>

              <div className="mt-8 pt-4 border-t border-gray-100 dark:border-gray-800 text-center">
                <span className="text-xs text-gray-400 font-medium">USDA Organic</span>
              </div>
            </div>
          </ScrollReveal>
        </div>

        {/* Scientific Source Footnote */}
        <div className="text-center text-xs text-gray-400 dark:text-gray-500 pt-4">
          <p>{t('scientificSource')}</p>
        </div>
      </div>
    </section>
  );
};
