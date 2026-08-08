import { PenTool, AlertCircle } from 'lucide-react';
import { Input } from '../ui/input';
import { Button } from '../ui/button';

type EContractSignaturePadProps = {
  signatureType: 'draw' | 'type';
  setSignatureType: (type: 'draw' | 'type') => void;
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
      <div className="flex items-center justify-between">
        <h5 className="font-bold text-slate-900 dark:text-gray-100 text-sm flex items-center gap-2">
          <PenTool className="w-4 h-4 text-emerald-800 dark:text-emerald-400" />
          Ký số xác nhận hợp đồng
        </h5>
        <div className="flex items-center gap-2 bg-slate-200/80 dark:bg-gray-800 p-1 rounded-xl text-xs font-semibold">
          <Button
            type="button"
            variant={signatureType === 'draw' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setSignatureType('draw')}
            className="h-7 text-xs"
          >
            Vẽ chữ ký
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

      {signatureType === 'draw' ? (
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
