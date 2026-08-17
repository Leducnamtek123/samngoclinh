'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { Search, QrCode, ShieldCheck, ArrowRight, Sprout, FileText, Cpu, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollReveal } from '@/components/animation';

export default function TraceIndexPage() {
  const t = useTranslations('trace');
  const [code, setCode] = useState('');
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = code.trim();
    if (!trimmed) return;

    if (trimmed.toLowerCase().startsWith('hd-') || trimmed.toLowerCase().startsWith('contract-')) {
      router.push(`/trace/contract/${trimmed}`);
    } else {
      router.push(`/trace/${trimmed}`);
    }
  };

  const sampleCodes = ['SAM-01', 'HD-SNL-2026', 'SNL-P01'];

  return (
    <div className="w-full bg-brand-bg min-h-screen py-12 sm:py-20 px-4 sm:px-6 lg:px-8 flex items-center justify-center relative overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-3xl w-full mx-auto space-y-10 relative z-10">
        {/* Header (Asymmetric High-Tech Editorial) */}
        <ScrollReveal variant="fade-up">
          <div className="text-center space-y-4">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-900 text-emerald-300 border border-emerald-700/50 text-xs font-black uppercase tracking-wider shadow-sm">
              <Cpu className="w-3.5 h-3.5 text-amber-400" />
              <span>{t('badge')}</span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-black text-primary tracking-tight font-display leading-tight">
              {t('title')}
            </h1>
            <p className="text-sm sm:text-base text-gray-600 max-w-xl mx-auto font-normal leading-relaxed">
              {t('subtitle')}
            </p>
          </div>
        </ScrollReveal>

        {/* Verification Terminal Box */}
        <ScrollReveal variant="scale" duration={1.1} scaleFrom={0.96}>
          <div className="bg-white rounded-3xl border border-gray-200/90 shadow-2xl p-6 sm:p-10 space-y-8 relative overflow-hidden">
            {/* Top Laser Scanner Visual Bar */}
            <div className="flex items-center justify-between pb-4 border-b border-gray-100">
              <div className="flex items-center gap-2 text-xs font-bold text-emerald-800">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 animate-ping" />
                <span>{t('readyStatus')}</span>
              </div>
              <span className="text-[11px] font-mono text-gray-400 font-bold uppercase">
                {t('standard')}
              </span>
            </div>

            {/* Input Form */}
            <form onSubmit={handleSearch} className="space-y-4">
              <div>
                <label htmlFor="trace-code-input" className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                  {t('inputLabel')}
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4.5 flex items-center pointer-events-none text-emerald-700">
                    <QrCode className="w-5 h-5" />
                  </div>
                  <input
                    id="trace-code-input"
                    type="text"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    placeholder={t('inputPlaceholder')}
                    className="w-full pl-13 pr-4 py-4 rounded-2xl border-2 border-gray-200 bg-gray-50/70 text-gray-900 font-bold text-sm sm:text-base focus:outline-none focus:border-emerald-700 focus:bg-white transition-colors shadow-inner placeholder:text-gray-400"
                  />
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-1">
                {/* Sample quick chips */}
                <div className="flex items-center gap-1.5 text-xs text-gray-500 font-medium">
                  <span className="text-[11px] text-gray-400">{t('sampleSuggestions')}</span>
                  {sampleCodes.map((sCode) => (
                    <button
                      key={sCode}
                      type="button"
                      onClick={() => {
                        setCode(sCode);
                      }}
                      className="px-2.5 py-1 rounded-lg bg-gray-100 hover:bg-emerald-50 hover:text-emerald-800 text-gray-700 font-mono text-[11px] font-bold transition-colors cursor-pointer"
                    >
                      {sCode}
                    </button>
                  ))}
                </div>

                <Button
                  type="submit"
                  disabled={!code.trim()}
                  className="w-full sm:w-auto px-8 py-4 h-auto rounded-xl bg-primary hover:bg-primary-hover text-white font-bold text-sm sm:text-base shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 transition-[transform,background-color,opacity] hover:scale-[1.02] active:scale-[0.98]"
                >
                  <Search className="w-4 h-4" />
                  <span>{t('verifyBtn')}</span>
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </div>
            </form>

            {/* Feature Division Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-gray-100">
              <div className="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-100 space-y-2">
                <div className="flex items-center gap-2 font-bold text-emerald-900 text-sm">
                  <Sprout className="w-4 h-4 text-emerald-700" />
                  <span>{t('featureTreeTitle')}</span>
                </div>
                <p className="text-xs text-gray-600 leading-relaxed font-normal">
                  {t('featureTreeDesc')}
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
                <div className="flex items-center gap-2 font-bold text-slate-900 text-sm">
                  <FileText className="w-4 h-4 text-emerald-800" />
                  <span>{t('featureContractTitle')}</span>
                </div>
                <p className="text-xs text-gray-600 leading-relaxed font-normal">
                  {t('featureContractDesc')}
                </p>
              </div>
            </div>

            {/* Bottom Guarantee Badges */}
            <div className="flex flex-wrap items-center justify-center gap-6 text-xs text-gray-500 pt-2 font-semibold">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>{t('guarantee1')}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>{t('guarantee2')}</span>
              </div>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </div>
  );
}
