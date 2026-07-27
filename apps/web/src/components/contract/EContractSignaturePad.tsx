import { PenTool, AlertCircle } from 'lucide-react';

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
    <div className="border border-slate-200 rounded-2xl p-5 space-y-4 bg-slate-50/30">
      <div className="flex items-center justify-between">
        <h5 className="font-bold text-slate-900 text-sm flex items-center gap-2">
          <PenTool className="w-4 h-4 text-[#1C3F24]" />
          Ký số xác nhận hợp đồng
        </h5>
        <div className="flex items-center gap-2 bg-slate-200/80 p-1 rounded-xl text-xs font-semibold">
          <button
            type="button"
            onClick={() => setSignatureType('draw')}
            className={`px-3 py-1 rounded-lg transition-colors ${
              signatureType === 'draw' ? 'bg-white text-[#1C3F24] shadow-xs font-bold' : 'text-slate-600'
            }`}
          >
            Vẽ chữ ký
          </button>
          <button
            type="button"
            onClick={() => setSignatureType('type')}
            className={`px-3 py-1 rounded-lg transition-colors ${
              signatureType === 'type' ? 'bg-white text-[#1C3F24] shadow-xs font-bold' : 'text-slate-600'
            }`}
          >
            Nhập tên ký
          </button>
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
          <div className="relative border-2 border-dashed border-slate-300 rounded-2xl bg-white overflow-hidden">
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
            <button
              type="button"
              onClick={clearCanvas}
              className="text-xs text-slate-500 hover:text-red-600 underline font-semibold"
            >
              Xóa chữ ký
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-2">
          <label htmlFor="typedSignatureName" className="sr-only">Họ và tên chữ ký</label>
          <input
            id="typedSignatureName"
            type="text"
            value={typedName}
            onChange={(e) => setTypedName(e.target.value)}
            placeholder="Nhập họ và tên đầy đủ của bạn..."
            className="w-full border border-slate-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#1C3F24] bg-white font-semibold"
          />
          {typedName.trim() && (
            <div className="p-4 bg-white border border-slate-200 rounded-xl text-center">
              <span className="font-serif italic text-2xl text-[#1C3F24] font-bold">
                {typedName.trim()}
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
