'use client';

import React, { useRef, useState, useEffect } from 'react';
import { PenTool, Upload, RotateCcw, Save, CheckCircle2 } from 'lucide-react';
import { ButtonLoading } from '@/components/ui/button';
import { fetchApiClient } from '@/lib/ApiClient';
import { useUpdateUserSignature } from '@/hooks/queries/useEContract';
import { toast } from 'sonner';

export const DigitalSignatureCard: React.FC = () => {
  const [mode, setMode] = useState<'draw' | 'upload'>('draw');
  const [savedSignatureUrl, setSavedSignatureUrl] = useState<string | null>(null);
  const [uploadedImageBase64, setUploadedImageBase64] = useState<string | null>(null);
  const [hasDrawn, setHasDrawn] = useState(false);

  const updateSignatureMutation = useUpdateUserSignature();

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const isDrawingRef = useRef(false);

  // Fetch current signature from API
  useEffect(() => {
    let isMounted = true;
    fetchApiClient('/v1/shared/user/signature', {
      method: 'GET',
    })
      .then((res: any) => {
        if (isMounted && res?.data?.signatureUrl) {
          setSavedSignatureUrl(res.data.signatureUrl);
        }
      })
      .catch(() => {
        // Silently fail if not setup yet
      });

    return () => {
      isMounted = false;
    };
  }, []);

  // Canvas drawing setup
  useEffect(() => {
    if (mode !== 'draw') return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set background to white for drawing
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }, [mode]);

  const getEventCoordinates = (
    e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>,
    canvas: HTMLCanvasElement
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
    e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>
  ) => {
    isDrawingRef.current = true;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const { x, y } = getEventCoordinates(e, canvas);

    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.strokeStyle = '#1C3F24';
    ctx.lineWidth = 2.5;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    setHasDrawn(true);
  };

  const draw = (
    e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>
  ) => {
    if (!isDrawingRef.current) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const { x, y } = getEventCoordinates(e, canvas);

    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    isDrawingRef.current = false;
  };

  const handleClear = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    setHasDrawn(false);
    setUploadedImageBase64(null);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('Vui lòng chọn định dạng file ảnh (PNG, JPG, WEBP).');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        setUploadedImageBase64(event.target.result as string);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSaveSignature = async () => {
    let signatureData = '';

    if (mode === 'draw') {
      const canvas = canvasRef.current;
      if (!canvas || !hasDrawn) {
        toast.error('Vui lòng vẽ chữ ký của bạn trước khi lưu.');
        return;
      }
      signatureData = canvas.toDataURL('image/png');
    } else {
      if (!uploadedImageBase64) {
        toast.error('Vui lòng chọn ảnh chữ ký trước khi lưu.');
        return;
      }
      signatureData = uploadedImageBase64;
    }

    try {
      const res: any = await updateSignatureMutation.mutateAsync(signatureData);
      if (res?.signatureUrl || res?.data?.signatureUrl) {
        setSavedSignatureUrl(res?.signatureUrl || res?.data?.signatureUrl);
        toast.success('Lưu chữ ký điện tử thành công!');
      }
    } catch (err: any) {
      toast.error(err?.message || 'Lưu chữ ký thất bại. Vui lòng thử lại.');
    }
  };

  return (
    <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl p-6 sm:p-7 shadow-xs space-y-5">
      {/* Header */}
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <PenTool className="w-5 h-5 text-emerald-800 dark:text-emerald-400 shrink-0" />
          <h3 className="font-bold text-gray-900 dark:text-gray-100 text-lg">Chữ ký điện tử</h3>
        </div>
        <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed font-normal">
          Chữ ký điện tử sẽ được tự động điền vào mục Bên B (Bên Mua & Sở Hữu) khi bạn ký kết các hợp đồng mua bán hoặc ủy quyền chăm sóc sâm.
        </p>
      </div>

      {/* Mode Switcher */}
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => setMode('draw')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            mode === 'draw'
              ? 'bg-primary text-white shadow-xs'
              : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200'
          }`}
        >
          <PenTool className="w-3.5 h-3.5" />
          <span>Vẽ tay</span>
        </button>

        <button
          type="button"
          onClick={() => setMode('upload')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            mode === 'upload'
              ? 'bg-primary text-white shadow-xs'
              : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200'
          }`}
        >
          <Upload className="w-3.5 h-3.5" />
          <span>Tải ảnh</span>
        </button>
      </div>

      {/* Editor Content Area */}
      {mode === 'draw' ? (
        <div className="space-y-3">
          <div className="border border-gray-200 dark:border-gray-700 rounded-2xl bg-white p-2 relative shadow-xs">
            <canvas
              ref={canvasRef}
              width={600}
              height={200}
              onMouseDown={startDrawing}
              onMouseMove={draw}
              onMouseUp={stopDrawing}
              onMouseLeave={stopDrawing}
              onTouchStart={startDrawing}
              onTouchMove={draw}
              onTouchEnd={stopDrawing}
              className="w-full h-48 rounded-xl touch-none cursor-crosshair bg-white"
            />
          </div>

          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={handleClear}
              className="flex items-center gap-1.5 text-xs text-gray-600 dark:text-gray-400 hover:text-red-600 font-semibold transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Xoá nét vẽ</span>
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          <div className="border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-2xl p-6 text-center hover:border-emerald-600 transition-colors bg-gray-50/50 dark:bg-gray-800/30">
            {uploadedImageBase64 ? (
              <div className="space-y-3">
                <img
                  src={uploadedImageBase64}
                  alt="Ảnh chữ ký đã chọn"
                  className="max-h-40 mx-auto rounded-lg object-contain bg-white p-2 border border-gray-200"
                />
                <label className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-800 dark:text-emerald-400 hover:underline cursor-pointer">
                  <Upload className="w-3.5 h-3.5" />
                  <span>Chọn ảnh khác</span>
                  <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
                </label>
              </div>
            ) : (
              <label className="flex flex-col items-center justify-center cursor-pointer py-4 space-y-2">
                <Upload className="w-8 h-8 text-gray-400" />
                <span className="text-xs font-bold text-gray-700 dark:text-gray-300">
                  Nhấp để tải lên ảnh chữ ký (PNG, JPG)
                </span>
                <span className="text-[11px] text-gray-400">Nên dùng ảnh nền trắng hoặc trong suốt</span>
                <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
              </label>
            )}
          </div>
        </div>
      )}

      {/* Save Button */}
      <div className="pt-2">
        <ButtonLoading
          onClick={handleSaveSignature}
          isLoading={updateSignatureMutation.isPending}
          disabled={updateSignatureMutation.isPending}
          className="bg-primary hover:bg-primary-hover text-white px-6 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 shadow-sm"
        >
          <Save className="w-4 h-4" />
          <span>Lưu chữ ký</span>
        </ButtonLoading>
      </div>

      {/* Saved Signature Preview Display */}
      {savedSignatureUrl && (
        <div className="pt-4 border-t border-gray-100 dark:border-gray-800 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-gray-700 dark:text-gray-300 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Chữ ký điện tử đã được lưu</span>
            </span>
          </div>
          <div className="p-3 bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-xl inline-block">
            <img
              src={
                savedSignatureUrl.startsWith('data:') ||
                savedSignatureUrl.startsWith('http://') ||
                savedSignatureUrl.startsWith('https://')
                  ? savedSignatureUrl
                  : `${(process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api').replace(/\/api\/?$/, '')}${savedSignatureUrl.startsWith('/') ? '' : '/'}${savedSignatureUrl}`
              }
              alt="Chữ ký điện tử hiện tại"
              className="max-h-24 object-contain bg-white dark:bg-gray-900 p-2 rounded-lg border border-gray-100 dark:border-gray-800"
              onError={(e) => {
                const target = e.currentTarget;
                target.style.display = 'none';
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
};
