'use client';

import { PenTool, AlertCircle, CheckCircle2, Sparkles } from 'lucide-react';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { Button } from '../ui/button';
import { Input } from '../ui/input';

type EContractSignaturePadProps = {
  signatureType: 'saved' | 'draw' | 'type';
  setSignatureType: (type: 'saved' | 'draw' | 'type') => void;
  savedSignatureUrl?: string | null;
  typedName: string;
  setTypedName: (name: string) => void;
  errorMessage: string;
  canvasRef: React.RefObject<HTMLCanvasElement | null>;
  hasCanvasDrawn: boolean;
  startDrawing: (
    e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>,
  ) => void;
  stopDrawing: () => void;
  draw: (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => void;
  clearCanvas: () => void;
};

export const EContractSignaturePad = ({
  signatureType,
  setSignatureType,
  savedSignatureUrl,
  typedName,
  setTypedName,
  errorMessage,
  canvasRef,
  hasCanvasDrawn,
  startDrawing,
  stopDrawing,
  draw,
  clearCanvas,
}: EContractSignaturePadProps) => {
  const t = useTranslations('econtract');
  const tKyc = useTranslations('kyc');
  const tActions = useTranslations('actions');

  return (
    <div className="space-y-4 rounded-2xl border border-slate-200 bg-slate-50/30 p-5 dark:border-gray-800 dark:bg-gray-900">
      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
        <h5 className="flex items-center gap-2 text-sm font-bold text-slate-900 dark:text-gray-100">
          <PenTool className="h-4 w-4 text-emerald-800 dark:text-emerald-400" />
          {t('signTitle')}
        </h5>
        <div className="flex items-center gap-1.5 rounded-xl bg-slate-200/80 p-1 text-xs font-semibold dark:bg-gray-800">
          {savedSignatureUrl && (
            <Button
              type="button"
              variant={signatureType === 'saved' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => {
                setSignatureType('saved');
              }}
              className="flex h-7 items-center gap-1 text-xs"
            >
              <Sparkles className="h-3 w-3 text-amber-400" />
              {t('savedSignature')}
            </Button>
          )}
          <Button
            type="button"
            variant={signatureType === 'draw' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => {
              setSignatureType('draw');
            }}
            className="h-7 text-xs"
          >
            {t('drawNewSignature')}
          </Button>
          <Button
            type="button"
            variant={signatureType === 'type' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => {
              setSignatureType('type');
            }}
            className="h-7 text-xs"
          >
            {t('typeSignature')}
          </Button>
        </div>
      </div>

      {errorMessage && (
        <div className="flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 p-3 text-xs font-medium text-red-700">
          <AlertCircle className="h-4 w-4 flex-shrink-0 text-red-500" />
          <span>{errorMessage}</span>
        </div>
      )}

      {signatureType === 'saved' && savedSignatureUrl ? (
        <div className="space-y-3">
          <div className="flex flex-col items-center justify-center gap-2 rounded-2xl border-2 border-emerald-500/80 bg-white p-4 shadow-xs dark:bg-gray-950">
            <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-700 dark:text-emerald-400">
              <CheckCircle2 className="h-4 w-4" />
              <span>{t('savedSignatureDesc')}</span>
            </div>
            <div className="relative flex h-28 w-full max-w-sm items-center justify-center rounded-xl bg-slate-50/50 p-2 dark:bg-gray-900">
              <Image
                src={savedSignatureUrl}
                alt="Signature"
                fill
                unoptimized
                className="object-contain"
              />
            </div>
          </div>
        </div>
      ) : signatureType === 'draw' ? (
        <div className="space-y-2">
          <div className="relative overflow-hidden rounded-2xl border-2 border-dashed border-slate-300 bg-white shadow-inner dark:border-gray-700 dark:bg-gray-950">
            <canvas
              ref={canvasRef}
              width={600}
              height={140}
              onMouseDown={startDrawing}
              onMouseUp={stopDrawing}
              onMouseMove={draw}
              onMouseLeave={stopDrawing}
              onTouchStart={startDrawing}
              onTouchEnd={stopDrawing}
              onTouchMove={draw}
              className="h-36 w-full cursor-crosshair touch-none bg-white dark:bg-gray-950"
            />
            {!hasCanvasDrawn && (
              <div className="pointer-events-none absolute inset-0 flex items-center justify-center gap-1.5 text-xs font-medium text-slate-400">
                <PenTool className="h-4 w-4 text-slate-400" />
                <span>{t('drawNewSignature')}</span>
              </div>
            )}
          </div>
          <div className="flex items-center justify-between text-xs">
            <span className="text-[11px] font-medium text-slate-500">
              {hasCanvasDrawn ? tKyc('uploadSuccess') : t('signTitle')}
            </span>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={clearCanvas}
              className="h-auto p-0 text-xs font-semibold text-slate-500 hover:text-red-600"
            >
              {tActions('delete')}
            </Button>
          </div>
        </div>
      ) : (
        <div className="space-y-2">
          <Input
            value={typedName}
            onChange={(e) => {
              setTypedName(e.target.value);
            }}
            placeholder={tKyc('fullNameLabel')}
            className="h-11 border-slate-300 bg-white font-serif text-base text-emerald-800 italic dark:bg-gray-950"
          />
        </div>
      )}
    </div>
  );
};
