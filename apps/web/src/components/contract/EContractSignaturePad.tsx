import Image from 'next/image';
import { PenTool, AlertCircle, CheckCircle2, Sparkles } from 'lucide-react';
import { Input } from '../ui/input';
import { Button } from '../ui/button';

type EContractSignaturePadProps = {
  signatureType: 'saved' | 'draw' | 'type';
  setSignatureType: (type: 'saved' | 'draw' | 'type') => void;
  savedSignatureUrl?: string | null;
  typedName: string;
  setTypedName: (name: string) => void;
  errorMessage: string;
  canvasRef: React.RefObject<HTMLCanvasElement | null>;
  hasCanvasDrawn: boolean;
  startDrawing: (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => void;
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
  return (
    <div className="border border-slate-200 dark:border-gray-800 rounded-2xl p-5 space-y-4 bg-slate-50/30 dark:bg-gray-900">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <h5 className="font-bold text-slate-900 dark:text-gray-100 text-sm flex items-center gap-2">
          <PenTool className="w-4 h-4 text-emerald-800 dark:text-emerald-400" />
          Ký số xác nhận hợp đồng
        </h5>
        <div className="flex items-center gap-1.5 bg-slate-200/80 dark:bg-gray-800 p-1 rounded-xl text-xs font-semibold">
          {savedSignatureUrl && (
            <Button
              type="button"
              variant={signatureType === 'saved' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setSignatureType('saved')}
              className="h-7 text-xs flex items-center gap-1"
            >
              <Sparkles className="w-3 h-3 text-amber-400" />
              Chữ ký đã lưu
            </Button>
          )}
          <Button
            type="button"
            variant={signatureType === 'draw' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setSignatureType('draw')}
            className="h-7 text-xs"
          >
            Vẽ chữ ký mới
          </Button>
          <Button
            type="button"
            variant={signatureType === 'type' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setSignatureType('type')}
            className="h-7 text-xs"
          >
            Nhập tên ký
          </Button>
        </div>
      </div>

      {errorMessage && (
        <div className="bg-red-50 border border-red-200 text-red-700 text-xs p-3 rounded-xl flex items-center gap-2 font-medium">
          <AlertCircle className="w-4 h-4 flex-shrink-0 text-red-500" />
          <span>{errorMessage}</span>
        </div>
      )}

      {signatureType === 'saved' && savedSignatureUrl ? (
        <div className="space-y-3">
          <div className="p-4 bg-white dark:bg-gray-950 border-2 border-emerald-500/80 rounded-2xl flex flex-col items-center justify-center gap-2 shadow-xs">
            <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-700 dark:text-emerald-400">
              <CheckCircle2 className="w-4 h-4" />
              <span>Chữ ký số đã lưu trong hồ sơ của bạn</span>
            </div>
            <div className="relative w-full h-28 max-w-sm flex items-center justify-center p-2 bg-slate-50/50 dark:bg-gray-900 rounded-xl">
              <Image
                src={savedSignatureUrl}
                alt="Chữ ký đã lưu"
                fill
                unoptimized
                className="object-contain"
              />
            </div>
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 text-center font-medium">
            Hợp đồng sẽ được tự động đóng dấu chữ ký số trên của bạn khi bấm nút <strong>Xác nhận ký</strong>.
          </p>
        </div>
      ) : signatureType === 'draw' ? (
        <div className="space-y-2">
          <div className="relative border-2 border-dashed border-slate-300 dark:border-gray-700 rounded-2xl bg-white dark:bg-gray-950 overflow-hidden">
            <canvas
              ref={canvasRef}
              width={600}
              height={140}
              onMouseDown={startDrawing}
              onMouseUp={stopDrawing}
              onMouseMove={draw}
              onTouchStart={startDrawing}
              onTouchEnd={stopDrawing}
              onTouchMove={draw}
              className="w-full h-36 cursor-crosshair touch-none"
            />
            {!hasCanvasDrawn && (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none text-slate-400 text-xs font-medium">
                Dùng chuột hoặc ngón tay để vẽ chữ ký của bạn tại đây
              </div>
            )}
          </div>
          <div className="flex justify-end">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={clearCanvas}
              className="text-xs text-slate-500 hover:text-red-600 font-semibold"
            >
              Xóa chữ ký
            </Button>
          </div>
        </div>
      ) : (
        <div className="space-y-2">
          <label htmlFor="typedSignatureName" className="text-xs font-medium text-gray-700 dark:text-gray-300 block">Họ và tên chữ ký</label>
          <Input
            id="typedSignatureName"
            type="text"
            value={typedName}
            onChange={(e) => setTypedName(e.target.value)}
            className="h-11 font-semibold text-sm"
          />
          {typedName.trim() && (
            <div className="p-4 bg-white dark:bg-gray-950 border border-slate-200 dark:border-gray-800 rounded-xl text-center">
              <span className="font-serif italic text-2xl text-emerald-900 dark:text-emerald-300 font-bold">
                {typedName.trim()}
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
