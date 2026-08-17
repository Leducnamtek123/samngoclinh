'use client';

import React, { useRef, useState, useEffect } from 'react';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { FileText, ShieldCheck, PenTool, RotateCcw, Info, CheckCircle2, Sparkles } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useUserSignature, useSaveUserSignature } from '@/hooks/queries/useUserSignature';
import type { UserProfile, IdentityVerificationStatus } from '@/types';
import { formatVNDPrice } from '@/utils/formatters';

type CheckoutContractSigningCardProps = {
  profile?: UserProfile | null;
  kycStatusData?: IdentityVerificationStatus | null;
  legalName: string;
  setLegalName: (name: string) => void;
  identityNumber: string;
  setIdentityNumber: (idNum: string) => void;
  signatureData: string;
  setSignatureData: (sig: string) => void;
  isAgreed: boolean;
  setIsAgreed: (agreed: boolean) => void;
  totalPlants: number;
  totalAmount: number;
};

export const CheckoutContractSigningCard: React.FC<CheckoutContractSigningCardProps> = ({
  profile,
  kycStatusData,
  legalName,
  setLegalName,
  identityNumber,
  setIdentityNumber,
  signatureData,
  setSignatureData,
  isAgreed,
  setIsAgreed,
  totalPlants,
  totalAmount,
}) => {
  const tKyc = useTranslations('kyc');
  const tContracts = useTranslations('contractsTab');
  const tActions = useTranslations('actions');

  const { data: savedSignatureUrl } = useUserSignature();
  const saveSignatureMutation = useSaveUserSignature();

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasDrawn, setHasDrawn] = useState(false);
  const [signatureMode, setSignatureMode] = useState<'saved' | 'draw' | 'type'>('saved');
  const [typedSignName, setTypedSignName] = useState('');

  // Prefill from profile/KYC and saved signature
  useEffect(() => {
    const kycDoc = kycStatusData as any;
    const profMeta = profile as any;
    if (!legalName && (kycDoc?.fullName || profile?.fullName)) {
      setLegalName(kycDoc?.fullName || profile?.fullName || '');
    }
    if (!identityNumber && (kycDoc?.idCardNumber || profMeta?.metadata?.identityNumber)) {
      setIdentityNumber(kycDoc?.idCardNumber || profMeta?.metadata?.identityNumber || '');
    }
    if (savedSignatureUrl) {
      setSignatureMode('saved');
      if (!signatureData) {
        setSignatureData(savedSignatureUrl);
      }
    } else if (signatureMode === 'saved') {
      setSignatureMode('draw');
    }
  }, [profile, kycStatusData, savedSignatureUrl, legalName, identityNumber, signatureData, setLegalName, setIdentityNumber, setSignatureData]);

  // Handle canvas drawing
  const getCoordinates = (
    e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>
  ) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    if ('touches' in e && e.touches && e.touches[0]) {
      const touch = e.touches[0];
      return {
        x: (touch.clientX - rect.left) * scaleX,
        y: (touch.clientY - rect.top) * scaleY,
      };
    }
    const mouseEvent = e as React.MouseEvent<HTMLCanvasElement>;
    return {
      x: (mouseEvent.clientX - rect.left) * scaleX,
      y: (mouseEvent.clientY - rect.top) * scaleY,
    };
  };

  const startDrawing = (
    e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>
  ) => {
    if ('touches' in e && e.cancelable) e.preventDefault();
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const { x, y } = getCoordinates(e);
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineWidth = 2.5;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.strokeStyle = '#047857'; // emerald-700
    setIsDrawing(true);
    setHasDrawn(true);
  };

  const draw = (
    e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>
  ) => {
    if (!isDrawing) return;
    if ('touches' in e && e.cancelable) e.preventDefault();
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const { x, y } = getCoordinates(e);
    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    if (!isDrawing) return;
    setIsDrawing(false);
    const canvas = canvasRef.current;
    if (canvas) {
      const base64 = canvas.toDataURL('image/png');
      setSignatureData(base64);
      saveSignatureMutation.mutate(base64);
    }
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setHasDrawn(false);
    setSignatureData('');
  };

  const handleTypeSignature = (name: string) => {
    setTypedSignName(name);
    if (!name.trim()) {
      setSignatureData('');
      return;
    }
    const canvas = document.createElement('canvas');
    canvas.width = 600;
    canvas.height = 160;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.font = 'italic bold 36px "Dancing Script", cursive, "Segoe UI", sans-serif';
      ctx.fillStyle = '#047857';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(name.trim(), 300, 80);
      const generated = canvas.toDataURL('image/png');
      setSignatureData(generated);
      saveSignatureMutation.mutate(generated);
    }
  };

  const isKycVerified =
    kycStatusData?.status === 'VERIFIED' ||
    (kycStatusData as any)?.status === 'APPROVED' ||
    profile?.isVerified;

  return (
    <Card className="p-6 space-y-6 shadow-sm border-emerald-300/80 bg-emerald-50/30 dark:bg-emerald-950/20 dark:border-emerald-800">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-emerald-200/70 dark:border-emerald-800 pb-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-emerald-700 text-white rounded-lg">
              <FileText className="w-4 h-4" />
            </div>
            <h3 className="font-extrabold text-slate-900 dark:text-slate-100 text-base">
              {tContracts('title')}
            </h3>
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-300 font-medium">
            {tContracts('subtitle')} ({totalPlants} plants)
          </p>
        </div>

        {isKycVerified ? (
          <Badge variant="secondary" className="bg-emerald-100 text-emerald-800 border-none font-bold text-xs flex items-center gap-1 w-fit">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>{tKyc('verified')}</span>
          </Badge>
        ) : (
          <Badge variant="outline" className="bg-amber-50 text-amber-800 border-amber-300 font-bold text-xs flex items-center gap-1 w-fit">
            <Info className="w-3.5 h-3.5" />
            <span>{tKyc('unverified')}</span>
          </Badge>
        )}
      </div>

      {/* Contract Terms Summary Box */}
      <div className="bg-white/80 dark:bg-slate-900/80 p-4 rounded-xl border border-emerald-200/80 dark:border-emerald-800 text-xs space-y-2">
        <div className="font-bold text-slate-900 dark:text-slate-100 flex items-center gap-1.5 text-xs">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>{tContracts('contractName')}:</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-slate-600 dark:text-slate-400">
          <div>• <strong>{tContracts('contractName')}:</strong> Sâm Ngọc Linh Joint Stock Company</div>
          <div>• <strong>{tContracts('contractValue')}:</strong> {totalPlants} plants ({formatVNDPrice(totalAmount)})</div>
        </div>
      </div>

      {/* Legal Inputs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <label htmlFor="contract-legal-name" className="block text-xs font-bold text-slate-800 dark:text-slate-200">
            {tKyc('fullNameLabel')} <span className="text-red-500">*</span>
          </label>
          <Input
            id="contract-legal-name"
            value={legalName}
            onChange={(e) => setLegalName(e.target.value)}
            placeholder="NGUYEN VAN A"
            className="h-10 text-xs uppercase font-semibold bg-white dark:bg-slate-900 border-slate-300"
          />
        </div>

        <div className="space-y-1.5">
          <label htmlFor="contract-identity-number" className="block text-xs font-bold text-slate-800 dark:text-slate-200">
            {tKyc('docTypes.cccdFieldLabel')} <span className="text-red-500">*</span>
          </label>
          <Input
            id="contract-identity-number"
            value={identityNumber}
            onChange={(e) => setIdentityNumber(e.target.value)}
            placeholder={tKyc('docTypes.cccdPlaceholder')}
            maxLength={12}
            className="h-10 text-xs font-mono font-semibold bg-white dark:bg-slate-900 border-slate-300"
          />
        </div>
      </div>

      {/* Digital Signature Pad */}
      <div className="space-y-3 pt-1">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <span className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
            <PenTool className="w-3.5 h-3.5 text-emerald-700" />
            <span>{tContracts('signNow')} <span className="text-red-500">*</span></span>
          </span>
          <div className="flex items-center gap-1 bg-slate-200/80 dark:bg-slate-800 p-0.5 rounded-lg text-xs font-semibold">
            {savedSignatureUrl && (
              <button
                type="button"
                onClick={() => {
                  setSignatureMode('saved');
                  setSignatureData(savedSignatureUrl);
                }}
                className={`px-2.5 py-1 rounded-md text-xs transition-colors cursor-pointer flex items-center gap-1 ${
                  signatureMode === 'saved'
                    ? 'bg-white dark:bg-slate-900 text-emerald-800 dark:text-emerald-400 shadow-2xs font-bold'
                    : 'text-slate-600 dark:text-slate-400'
                }`}
              >
                <Sparkles className="w-3 h-3 text-amber-500" />
                <span>Saved Signature</span>
              </button>
            )}
            <button
              type="button"
              onClick={() => setSignatureMode('draw')}
              className={`px-2.5 py-1 rounded-md text-xs transition-colors cursor-pointer ${
                signatureMode === 'draw'
                  ? 'bg-white dark:bg-slate-900 text-emerald-800 dark:text-emerald-400 shadow-2xs font-bold'
                  : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              Draw
            </button>
            <button
              type="button"
              onClick={() => setSignatureMode('type')}
              className={`px-2.5 py-1 rounded-md text-xs transition-colors cursor-pointer ${
                signatureMode === 'type'
                  ? 'bg-white dark:bg-slate-900 text-emerald-800 dark:text-emerald-400 shadow-2xs font-bold'
                  : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              Type
            </button>
          </div>
        </div>

        {signatureMode === 'saved' && savedSignatureUrl ? (
          <div className="p-4 bg-white dark:bg-slate-950 border-2 border-emerald-500/80 rounded-xl space-y-2">
            <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-700 dark:text-emerald-400">
              <CheckCircle2 className="w-4 h-4" />
              <span>{tKyc('uploadSuccess')}</span>
            </div>
            <div className="relative w-full h-24 max-w-sm flex items-center justify-center p-2 bg-slate-50/60 dark:bg-slate-900 rounded-lg">
              <Image
                src={savedSignatureUrl}
                alt="Signature"
                fill
                unoptimized
                className="object-contain"
              />
            </div>
          </div>
        ) : signatureMode === 'draw' ? (
          <div className="space-y-2">
            <div className="relative border-2 border-dashed border-emerald-300 dark:border-emerald-800 rounded-xl bg-white dark:bg-slate-950 overflow-hidden shadow-2xs">
              <canvas
                ref={canvasRef}
                width={600}
                height={130}
                onMouseDown={startDrawing}
                onMouseUp={stopDrawing}
                onMouseMove={draw}
                onMouseLeave={stopDrawing}
                onTouchStart={startDrawing}
                onTouchEnd={stopDrawing}
                onTouchMove={draw}
                className="w-full h-32 cursor-crosshair touch-none bg-white dark:bg-slate-950"
              />
              {!hasDrawn && !signatureData && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none text-slate-400 text-xs font-medium gap-1.5">
                  <PenTool className="w-3.5 h-3.5 text-slate-400" />
                  <span>{tContracts('signNow')}</span>
                </div>
              )}
            </div>
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-1.5 text-[11px] text-slate-500 font-medium">
                {signatureData ? (
                  <>
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>{tKyc('uploadSuccess')}</span>
                  </>
                ) : (
                  <span>{tContracts('signNow')}</span>
                )}
              </div>
              <button
                type="button"
                onClick={clearCanvas}
                className="flex items-center gap-1 text-slate-500 hover:text-red-600 font-semibold cursor-pointer"
              >
                <RotateCcw className="w-3 h-3" />
                <span>{tActions('delete')}</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-2">
            <Input
              value={typedSignName}
              onChange={(e) => handleTypeSignature(e.target.value)}
              placeholder={tKyc('fullNameLabel')}
              className="h-10 text-sm bg-white dark:bg-slate-900 border-slate-300 font-serif italic text-emerald-800"
            />
          </div>
        )}
      </div>

      {/* Confirmation Checkbox */}
      <div className="pt-2 border-t border-emerald-200/70 dark:border-emerald-800">
        <label className="flex items-start gap-2.5 cursor-pointer">
          <input
            type="checkbox"
            checked={isAgreed}
            onChange={(e) => setIsAgreed(e.target.checked)}
            className="mt-0.5 w-4 h-4 text-emerald-600 rounded border-gray-300 focus:ring-emerald-500 cursor-pointer"
          />
          <span className="text-xs text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
            {tContracts('title')} ({tContracts('signedDate')})
          </span>
        </label>
      </div>
    </Card>
  );
};
