'use client';

import { Camera, UploadCloud } from 'lucide-react';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import React from 'react';
import type { DocumentOption } from './types';

type KycPhotoUploadDropzoneProps = {
  activeOption: DocumentOption;
  frontImagePreview: string;
  backImagePreview: string;
  existingFront: string;
  existingBack: string;
  isReuploadMode: boolean;
  frontFileRef: React.MutableRefObject<File | null>;
  backFileRef: React.MutableRefObject<File | null>;
  setFrontImagePreview: (val: string) => void;
  setBackImagePreview: (val: string) => void;
};

export function KycPhotoUploadDropzone({
  activeOption,
  frontImagePreview,
  backImagePreview,
  existingFront,
  existingBack,
  isReuploadMode,
  frontFileRef,
  backFileRef,
  setFrontImagePreview,
  setBackImagePreview,
}: KycPhotoUploadDropzoneProps) {
  const t = useTranslations('kyc');

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
      {/* Front Photo Zone */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
            {activeOption.frontTitle} <span className="text-rose-500">*</span>
          </span>
          <span className="text-[11px] text-slate-400">{t('formatHint')}</span>
        </div>

        <label className="group relative flex min-h-[190px] cursor-pointer flex-col items-center justify-center gap-2 overflow-hidden rounded-2xl border-2 border-dashed border-slate-300 bg-white p-6 shadow-2xs transition-[border-color,box-shadow] hover:border-emerald-600 hover:shadow-xs dark:border-slate-700 dark:bg-slate-900 dark:hover:border-emerald-500">
          <input
            type="file"
            accept="image/png, image/jpeg, image/jpg"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) {
                frontFileRef.current = file;
                const reader = new FileReader();
                reader.onload = (ev) => {
                  setFrontImagePreview(ev.target?.result as string);
                };
                reader.readAsDataURL(file);
              }
            }}
          />
          {frontImagePreview ? (
            <div className="relative flex h-40 w-full items-center justify-center">
              <Image
                src={frontImagePreview}
                alt={t('frontAlt')}
                fill
                sizes="(max-width: 768px) 100vw, 400px"
                unoptimized
                className="rounded-xl object-contain"
              />
              <div className="absolute inset-0 flex items-center justify-center gap-1.5 rounded-xl bg-slate-950/40 text-xs font-bold text-white opacity-0 transition-opacity group-hover:opacity-100">
                <Camera className="h-4 w-4" />
                {t('reuploadOther')}
              </div>
              <span className="absolute right-2 bottom-2 rounded-md bg-emerald-700 px-2.5 py-1 text-[10px] font-bold text-white shadow-xs">
                {t('uploadSuccess')}
              </span>
            </div>
          ) : existingFront && !isReuploadMode ? (
            <div className="relative flex h-40 w-full items-center justify-center">
              <Image
                src={existingFront}
                alt={t('frontAlt')}
                fill
                sizes="(max-width: 768px) 100vw, 400px"
                unoptimized
                className="rounded-xl object-contain"
              />
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2.5 p-2 text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700 transition-transform group-hover:scale-110 dark:bg-emerald-950/60 dark:text-emerald-400">
                <UploadCloud className="h-6 w-6" />
              </div>
              <div>
                <span className="block text-xs font-bold text-slate-800 dark:text-slate-200">
                  {activeOption.frontTitle}
                </span>
                <span className="mt-0.5 block text-[11px] font-medium text-slate-400">
                  {activeOption.frontDescription}
                </span>
              </div>
            </div>
          )}
        </label>
      </div>

      {/* Back Photo Zone */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
            {activeOption.backTitle}{' '}
            {activeOption.isBackRequired ? (
              <span className="text-rose-500">*</span>
            ) : (
              <span className="font-normal text-slate-400">({t('optional')})</span>
            )}
          </span>
          <span className="text-[11px] text-slate-400">{t('formatHint')}</span>
        </div>

        <label className="group relative flex min-h-[190px] cursor-pointer flex-col items-center justify-center gap-2 overflow-hidden rounded-2xl border-2 border-dashed border-slate-300 bg-white p-6 shadow-2xs transition-[border-color,box-shadow] hover:border-emerald-600 hover:shadow-xs dark:border-slate-700 dark:bg-slate-900 dark:hover:border-emerald-500">
          <input
            type="file"
            accept="image/png, image/jpeg, image/jpg"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) {
                backFileRef.current = file;
                const reader = new FileReader();
                reader.onload = (ev) => {
                  setBackImagePreview(ev.target?.result as string);
                };
                reader.readAsDataURL(file);
              }
            }}
          />
          {backImagePreview ? (
            <div className="relative flex h-40 w-full items-center justify-center">
              <Image
                src={backImagePreview}
                alt={t('backAlt')}
                fill
                sizes="(max-width: 768px) 100vw, 400px"
                unoptimized
                className="rounded-xl object-contain"
              />
              <div className="absolute inset-0 flex items-center justify-center gap-1.5 rounded-xl bg-slate-950/40 text-xs font-bold text-white opacity-0 transition-opacity group-hover:opacity-100">
                <Camera className="h-4 w-4" />
                {t('reuploadOther')}
              </div>
              <span className="absolute right-2 bottom-2 rounded-md bg-emerald-700 px-2.5 py-1 text-[10px] font-bold text-white shadow-xs">
                {t('uploadSuccess')}
              </span>
            </div>
          ) : existingBack && !isReuploadMode ? (
            <div className="relative flex h-40 w-full items-center justify-center">
              <Image
                src={existingBack}
                alt={t('backAlt')}
                fill
                sizes="(max-width: 768px) 100vw, 400px"
                unoptimized
                className="rounded-xl object-contain"
              />
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2.5 p-2 text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700 transition-transform group-hover:scale-110 dark:bg-emerald-950/60 dark:text-emerald-400">
                <UploadCloud className="h-6 w-6" />
              </div>
              <div>
                <span className="block text-xs font-bold text-slate-800 dark:text-slate-200">
                  {activeOption.backTitle}
                </span>
                <span className="mt-0.5 block text-[11px] font-medium text-slate-400">
                  {activeOption.backDescription}
                </span>
              </div>
            </div>
          )}
        </label>
      </div>
    </div>
  );
}
