'use client';

import {
  Search,
  QrCode,
  ShieldCheck,
  ArrowRight,
  Sprout,
  FileText,
  Cpu,
  CheckCircle2,
} from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import { ScrollReveal } from '@/components/animation';
import { Button } from '@/components/ui/button';

export default function TraceIndexPage() {
  const t = useTranslations('trace');
  const [code, setCode] = useState('');
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = code.trim();
    if (!trimmed) {
      return;
    }

    if (trimmed.toLowerCase().startsWith('hd-') || trimmed.toLowerCase().startsWith('contract-')) {
      router.push(`/trace/contract/${trimmed}`);
    } else {
      router.push(`/trace/${trimmed}`);
    }
  };

  const sampleCodes = ['SAM-01', 'HD-SNL-2026', 'SNL-P01'];

  return (
    <div className="relative flex min-h-screen w-full items-center justify-center overflow-hidden bg-brand-bg px-4 py-12 sm:px-6 sm:py-20 lg:px-8">
      {/* Background ambient lighting */}
      <div className="pointer-events-none absolute top-1/3 left-1/2 h-[400px] w-[700px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-emerald-500/5 blur-3xl" />

      <div className="relative z-10 mx-auto w-full max-w-3xl space-y-10">
        {/* Header (Asymmetric High-Tech Editorial) */}
        <ScrollReveal variant="fade-up">
          <div className="space-y-4 text-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-700/50 bg-emerald-900 px-4 py-1.5 text-xs font-black tracking-wider text-emerald-300 uppercase shadow-sm">
              <Cpu className="h-3.5 w-3.5 text-amber-400" />
              <span>{t('badge')}</span>
            </div>
            <h1 className="font-display text-3xl leading-tight font-black tracking-tight text-primary sm:text-5xl">
              {t('title')}
            </h1>
            <p className="mx-auto max-w-xl text-sm leading-relaxed font-normal text-gray-600 sm:text-base">
              {t('subtitle')}
            </p>
          </div>
        </ScrollReveal>

        {/* Verification Terminal Box */}
        <ScrollReveal variant="scale" duration={1.1} scaleFrom={0.96}>
          <div className="relative space-y-8 overflow-hidden rounded-3xl border border-gray-200/90 bg-white p-6 shadow-2xl sm:p-10">
            {/* Top Laser Scanner Visual Bar */}
            <div className="flex items-center justify-between border-b border-gray-100 pb-4">
              <div className="flex items-center gap-2 text-xs font-bold text-emerald-800">
                <span className="h-2.5 w-2.5 animate-ping rounded-full bg-emerald-600" />
                <span>{t('readyStatus')}</span>
              </div>
              <span className="font-mono text-[11px] font-bold text-gray-400 uppercase">
                {t('standard')}
              </span>
            </div>

            {/* Input Form */}
            <form onSubmit={handleSearch} className="space-y-4">
              <div>
                <label
                  htmlFor="trace-code-input"
                  className="mb-2 block text-xs font-bold tracking-wider text-gray-700 uppercase"
                >
                  {t('inputLabel')}
                </label>
                <div className="group relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4.5 text-emerald-700">
                    <QrCode className="h-5 w-5" />
                  </div>
                  <input
                    id="trace-code-input"
                    type="text"
                    value={code}
                    onChange={(e) => {
                      setCode(e.target.value);
                    }}
                    placeholder={t('inputPlaceholder')}
                    className="w-full rounded-2xl border-2 border-gray-200 bg-gray-50/70 py-4 pr-4 pl-13 text-sm font-bold text-gray-900 shadow-inner transition-colors placeholder:text-gray-400 focus:border-emerald-700 focus:bg-white focus:outline-none sm:text-base"
                  />
                </div>
              </div>

              <div className="flex flex-col items-center justify-between gap-3 pt-1 sm:flex-row">
                {/* Sample quick chips */}
                <div className="flex items-center gap-1.5 text-xs font-medium text-gray-500">
                  <span className="text-[11px] text-gray-400">{t('sampleSuggestions')}</span>
                  {sampleCodes.map((sCode) => (
                    <button
                      key={sCode}
                      type="button"
                      onClick={() => {
                        setCode(sCode);
                      }}
                      className="cursor-pointer rounded-lg bg-gray-100 px-2.5 py-1 font-mono text-[11px] font-bold text-gray-700 transition-colors hover:bg-emerald-50 hover:text-emerald-800"
                    >
                      {sCode}
                    </button>
                  ))}
                </div>

                <Button
                  type="submit"
                  disabled={!code.trim()}
                  className="flex h-auto w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-primary px-8 py-4 text-sm font-bold text-white shadow-md transition-[transform,background-color,opacity] hover:scale-[1.02] hover:bg-primary-hover active:scale-[0.98] disabled:opacity-50 sm:w-auto sm:text-base"
                >
                  <Search className="h-4 w-4" />
                  <span>{t('verifyBtn')}</span>
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            </form>

            {/* Feature Division Cards */}
            <div className="grid grid-cols-1 gap-4 border-t border-gray-100 pt-4 sm:grid-cols-2">
              <div className="space-y-2 rounded-2xl border border-emerald-100 bg-emerald-50/60 p-4">
                <div className="flex items-center gap-2 text-sm font-bold text-emerald-900">
                  <Sprout className="h-4 w-4 text-emerald-700" />
                  <span>{t('featureTreeTitle')}</span>
                </div>
                <p className="text-xs leading-relaxed font-normal text-gray-600">
                  {t('featureTreeDesc')}
                </p>
              </div>

              <div className="space-y-2 rounded-2xl border border-slate-200/80 bg-slate-50 p-4">
                <div className="flex items-center gap-2 text-sm font-bold text-slate-900">
                  <FileText className="h-4 w-4 text-emerald-800" />
                  <span>{t('featureContractTitle')}</span>
                </div>
                <p className="text-xs leading-relaxed font-normal text-gray-600">
                  {t('featureContractDesc')}
                </p>
              </div>
            </div>

            {/* Bottom Guarantee Badges */}
            <div className="flex flex-wrap items-center justify-center gap-6 pt-2 text-xs font-semibold text-gray-500">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                <span>{t('guarantee1')}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="h-4 w-4 text-emerald-600" />
                <span>{t('guarantee2')}</span>
              </div>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </div>
  );
}
