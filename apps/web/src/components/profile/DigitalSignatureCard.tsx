'use client';

import { PenTool, Upload, RotateCcw, Save, CheckCircle2 } from 'lucide-react';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import React, { useRef, useState, useEffect } from 'react';
import { toast } from 'sonner';
import { ButtonLoading } from '@/components/ui/button';
import { useUserSignature, useSaveUserSignature } from '@/hooks/queries/useUserSignature';

// Subcomponent: Drawing Canvas Area
function SignatureCanvasDrawArea({
  canvasRef,
  onStartDrawing,
  onDraw,
  onStopDrawing,
  onClear,
}: {
  canvasRef: React.RefObject<HTMLCanvasElement | null>;
  onStartDrawing: (
    e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>,
  ) => void;
  onDraw: (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => void;
  onStopDrawing: () => void;
  onClear: () => void;
}) {
  const tActions = useTranslations('actions');

  return (
    <div className="space-y-3">
      <div className="relative rounded-2xl border border-gray-200 bg-white p-2 shadow-xs dark:border-gray-700">
        <canvas
          ref={canvasRef}
          width={600}
          height={200}
          onMouseDown={onStartDrawing}
          onMouseMove={onDraw}
          onMouseUp={onStopDrawing}
          onMouseLeave={onStopDrawing}
          onTouchStart={onStartDrawing}
          onTouchMove={onDraw}
          onTouchEnd={onStopDrawing}
          className="h-48 w-full cursor-crosshair touch-none rounded-xl bg-white"
        />
      </div>

      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={onClear}
          className="flex cursor-pointer items-center gap-1.5 text-xs font-semibold text-gray-600 transition-colors hover:text-red-600 dark:text-gray-400"
        >
          <RotateCcw className="h-3.5 w-3.5" />
          <span>{tActions('delete')}</span>
        </button>
      </div>
    </div>
  );
}

// Subcomponent: Image Upload Area
function SignatureUploadArea({
  uploadedImageBase64,
  onFileUpload,
}: {
  uploadedImageBase64: string | null;
  onFileUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) {
  const tProfile = useTranslations('profile');

  return (
    <div className="space-y-3">
      <div className="rounded-2xl border-2 border-dashed border-gray-200 bg-gray-50/50 p-6 text-center transition-colors hover:border-emerald-600 dark:border-gray-700 dark:bg-gray-800/30">
        {uploadedImageBase64 ? (
          <div className="space-y-3">
            <Image
              src={uploadedImageBase64}
              alt="Signature"
              width={240}
              height={160}
              unoptimized
              className="mx-auto max-h-40 w-auto rounded-lg border border-gray-200 bg-white object-contain p-2"
            />
            <label className="inline-flex cursor-pointer items-center gap-1.5 text-xs font-bold text-emerald-800 hover:underline dark:text-emerald-400">
              <Upload className="h-3.5 w-3.5" />
              <span>{tProfile('uploadAvatar')}</span>
              <input type="file" accept="image/*" onChange={onFileUpload} className="hidden" />
            </label>
          </div>
        ) : (
          <label className="flex cursor-pointer flex-col items-center justify-center space-y-2 py-4">
            <Upload className="h-8 w-8 text-gray-400" />
            <span className="text-xs font-bold text-gray-700 dark:text-gray-300">
              {tProfile('uploadAvatar')}
            </span>
            <span className="text-[11px] text-gray-400">{tProfile('uploadAvatarHint')}</span>
            <input type="file" accept="image/*" onChange={onFileUpload} className="hidden" />
          </label>
        )}
      </div>
    </div>
  );
}

// Subcomponent: Saved Signature Preview
function SavedSignaturePreview({ savedSignatureUrl }: { savedSignatureUrl: string }) {
  const t = useTranslations('digitalSignature');
  const finalUrl =
    savedSignatureUrl.startsWith('data:') ||
    savedSignatureUrl.startsWith('http://') ||
    savedSignatureUrl.startsWith('https://')
      ? savedSignatureUrl
      : `${(process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api').replace(/\/api\/?$/, '')}${savedSignatureUrl.startsWith('/') ? '' : '/'}${savedSignatureUrl}`;

  return (
    <div className="space-y-2 border-t border-gray-100 pt-4 dark:border-gray-800">
      <div className="flex items-center justify-between">
        <span className="flex items-center gap-1.5 text-xs font-bold text-gray-700 dark:text-gray-300">
          <CheckCircle2 className="h-4 w-4 text-emerald-600" />
          <span>{t('testSuccess')}</span>
        </span>
      </div>
      <div className="inline-block rounded-xl border border-gray-200 bg-gray-50 p-3 dark:border-gray-700 dark:bg-gray-800/50">
        <Image
          src={finalUrl}
          alt="Saved Signature"
          width={200}
          height={96}
          unoptimized
          className="max-h-24 w-auto rounded-lg border border-gray-100 bg-white object-contain p-2 dark:border-gray-800 dark:bg-gray-900"
        />
      </div>
    </div>
  );
}

export const DigitalSignatureCard: React.FC = () => {
  const t = useTranslations('digitalSignature');
  const tActions = useTranslations('actions');
  const [mode, setMode] = useState<'draw' | 'upload'>('draw');
  const { data: savedSignatureUrl } = useUserSignature();
  const [uploadedImageBase64, setUploadedImageBase64] = useState<string | null>(null);

  const updateSignatureMutation = useSaveUserSignature();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const isDrawingRef = useRef(false);
  const hasDrawnRef = useRef(false);

  useEffect(() => {
    if (mode !== 'draw') {
      return;
    }
    const canvas = canvasRef.current;
    if (!canvas) {
      return;
    }
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      return;
    }
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }, [mode]);

  const getEventCoordinates = (
    e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>,
    canvas: HTMLCanvasElement,
  ) => {
    const rect = canvas.getBoundingClientRect();
    let clientX = 0;
    let clientY = 0;
    if ('touches' in e && e.touches && e.touches.length > 0 && e.touches[0]) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else if ('clientX' in e) {
      clientX = e.clientX;
      clientY = e.clientY;
    }
    const x = (clientX - rect.left) * (canvas.width / rect.width);
    const y = (clientY - rect.top) * (canvas.height / rect.height);
    return { x, y };
  };

  const startDrawing = (
    e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>,
  ) => {
    isDrawingRef.current = true;
    const canvas = canvasRef.current;
    if (!canvas) {
      return;
    }
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      return;
    }
    const { x, y } = getEventCoordinates(e, canvas);
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.strokeStyle = '#1C3F24';
    ctx.lineWidth = 2.5;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    hasDrawnRef.current = true;
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawingRef.current) {
      return;
    }
    const canvas = canvasRef.current;
    if (!canvas) {
      return;
    }
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      return;
    }
    const { x, y } = getEventCoordinates(e, canvas);
    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    isDrawingRef.current = false;
  };

  const handleClear = () => {
    const canvas = canvasRef.current;
    if (!canvas) {
      return;
    }
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      return;
    }
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    hasDrawnRef.current = false;
    setUploadedImageBase64(null);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) {
      return;
    }
    if (!file.type.startsWith('image/')) {
      toast.error(t('imageOnly'));
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error(t('maxSize'));
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      setUploadedImageBase64(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleSaveSignature = async () => {
    let signatureData = '';
    if (mode === 'draw') {
      const canvas = canvasRef.current;
      if (!canvas || !hasDrawnRef.current) {
        toast.error(t('testSuccess'));
        return;
      }
      signatureData = canvas.toDataURL('image/png');
    } else {
      if (!uploadedImageBase64) {
        toast.error(t('testSuccess'));
        return;
      }
      signatureData = uploadedImageBase64;
    }

    try {
      await updateSignatureMutation.mutateAsync(signatureData);
      toast.success(t('testSuccess'));
    } catch (error: unknown) {
      toast.error(error instanceof Error ? error.message : 'Error');
    }
  };

  return (
    <div className="space-y-5 rounded-2xl border border-gray-100 bg-white p-6 shadow-xs sm:p-7 dark:border-gray-800 dark:bg-gray-900">
      {/* Header */}
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <PenTool className="h-5 w-5 shrink-0 text-emerald-800 dark:text-emerald-400" />
          <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">{t('title')}</h3>
        </div>
        <p className="text-xs leading-relaxed font-normal text-gray-500 dark:text-gray-400">
          {t('legalNotice')}
        </p>
      </div>

      {/* Mode Switcher */}
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => {
            setMode('draw');
          }}
          className={`flex cursor-pointer items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold transition-[color,background-color,box-shadow] ${
            mode === 'draw'
              ? 'bg-primary text-white shadow-xs'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300'
          }`}
        >
          <PenTool className="h-3.5 w-3.5" />
          <span>Draw</span>
        </button>

        <button
          type="button"
          onClick={() => {
            setMode('upload');
          }}
          className={`flex cursor-pointer items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold transition-[color,background-color,box-shadow] ${
            mode === 'upload'
              ? 'bg-primary text-white shadow-xs'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300'
          }`}
        >
          <Upload className="h-3.5 w-3.5" />
          <span>Upload</span>
        </button>
      </div>

      {/* Editor Content Area */}
      {mode === 'draw' ? (
        <SignatureCanvasDrawArea
          canvasRef={canvasRef}
          onStartDrawing={startDrawing}
          onDraw={draw}
          onStopDrawing={stopDrawing}
          onClear={handleClear}
        />
      ) : (
        <SignatureUploadArea
          uploadedImageBase64={uploadedImageBase64}
          onFileUpload={handleFileUpload}
        />
      )}

      {/* Save Button */}
      <div className="pt-2">
        <ButtonLoading
          onClick={handleSaveSignature}
          isLoading={updateSignatureMutation.isPending}
          disabled={updateSignatureMutation.isPending}
          className="flex items-center gap-2 rounded-xl bg-primary px-6 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-primary-hover"
        >
          <Save className="h-4 w-4" />
          <span>{tActions('save')}</span>
        </ButtonLoading>
      </div>

      {savedSignatureUrl && <SavedSignaturePreview savedSignatureUrl={savedSignatureUrl} />}
    </div>
  );
};
