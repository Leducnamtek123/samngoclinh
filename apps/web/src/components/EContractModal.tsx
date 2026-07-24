'use client';

import { useState, useRef } from 'react';
import { useEContractDetail, useSignEContract } from '@/hooks/queries/useEContract';
import { FileText, CheckCircle2, AlertCircle, X, PenTool, ShieldCheck, Loader2 } from 'lucide-react';
import { EContractSignaturePad } from './contract/EContractSignaturePad';
import { EContractDocumentView } from './contract/EContractDocumentView';

type EContractModalProps = {
  contractId: string | null;
  onClose: () => void;
};

export const EContractModal = ({ contractId, onClose }: EContractModalProps) => {
  const { data: contract, isLoading, isError } = useEContractDetail(contractId);
  const signMutation = useSignEContract();

  const [signatureType, setSignatureType] = useState<'draw' | 'type'>('draw');
  const [typedName, setTypedName] = useState('');
  const [isDrawing, setIsDrawing] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [hasCanvasDrawn, setHasCanvasDrawn] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  if (!contractId) return null;

  // Canvas drawing handlers
  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    setIsDrawing(true);
    setHasCanvasDrawn(true);
    draw(e);
  };

  const stopDrawing = () => {
    setIsDrawing(false);
    if (canvasRef.current) {
      const ctx = canvasRef.current.getContext('2d');
      if (ctx) ctx.beginPath();
    }
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const touch = 'touches' in e && e.touches.length > 0 ? e.touches[0] : null;
    const clientX = touch ? touch.clientX : (e as React.MouseEvent).clientX;
    const clientY = touch ? touch.clientY : (e as React.MouseEvent).clientY;

    const x = clientX - rect.left;
    const y = clientY - rect.top;

    ctx.lineWidth = 2.5;
    ctx.lineCap = 'round';
    ctx.strokeStyle = '#1C3F24';

    ctx.lineTo(x, y);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  const clearCanvas = () => {
    if (canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
    }
    setHasCanvasDrawn(false);
  };

  const handleSign = async () => {
    if (signMutation.isPending) return;
    setErrorMessage('');
    let signatureData = '';

    if (signatureType === 'draw') {
      if (!hasCanvasDrawn || !canvasRef.current) {
        setErrorMessage('Vui lòng vẽ chữ ký của bạn trước khi xác nhận ký.');
        return;
      }
      signatureData = canvasRef.current.toDataURL('image/png');
    } else {
      if (!typedName.trim()) {
        setErrorMessage('Vui lòng nhập đầy đủ họ tên để làm chữ ký điện tử.');
        return;
      }
      // Create a typed signature canvas image
      const canvas = document.createElement('canvas');
      canvas.width = 400;
      canvas.height = 100;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, 400, 100);
        ctx.font = 'italic bold 28px cursive, sans-serif';
        ctx.fillStyle = '#1C3F24';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(typedName.trim(), 200, 50);
        signatureData = canvas.toDataURL('image/png');
      }
    }

    try {
      await signMutation.mutateAsync({
        contractId,
        signatureData,
      });
    } catch (err: any) {
      setErrorMessage(err.message || 'Có lỗi xảy ra khi ký hợp đồng. Vui lòng thử lại.');
    }
  };

  const isSigned = contract?.status === 'SIGNED' || contract?.signedAt || !!contract?.userSignatureUrl;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto animate-fade-in">
      <div className="bg-white rounded-3xl max-w-3xl w-full max-h-[90vh] flex flex-col overflow-hidden shadow-2xl border border-gray-100">
        
        {/* Header */}
        <div className="bg-slate-900 text-white px-6 py-5 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-[#1C3F24] rounded-xl text-emerald-400">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-base leading-snug">
                Hợp Đồng Điện Tử #{contract?.code || contractId.slice(0, 8)}
              </h3>
              <p className="text-xs text-slate-400 font-medium">
                Hợp đồng hợp tác đầu tư & ủy quyền chăm sóc Sâm Ngọc Linh
              </p>
            </div>
          </div>
          <button
            type="button"
            aria-label="Đóng modal hợp đồng"
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-full hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {isLoading ? (
            <div className="py-20 flex flex-col items-center justify-center space-y-3 text-slate-500">
              <Loader2 className="w-8 h-8 animate-spin text-[#1C3F24]" />
              <span className="text-sm font-medium">Đang tải nội dung hợp đồng...</span>
            </div>
          ) : isError || !contract ? (
            <div className="py-12 bg-red-50 text-red-700 p-6 rounded-2xl text-center font-medium space-y-2">
              <AlertCircle className="w-8 h-8 mx-auto text-red-500" />
              <p>Không thể tải thông tin hợp đồng. Vui lòng thử lại sau.</p>
            </div>
          ) : (
            <>
              {/* Contract Metadata Banner */}
              <div className="bg-emerald-50/80 border border-emerald-200/80 rounded-2xl p-4 flex flex-wrap items-center justify-between gap-4">
                <div className="space-y-1">
                  <span className="text-[11px] font-bold text-emerald-800 uppercase tracking-wider">Trạng thái hợp đồng</span>
                  <div className="flex items-center gap-2">
                    {isSigned ? (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-600 text-white rounded-full text-xs font-bold shadow-xs">
                        <CheckCircle2 className="w-4 h-4" /> Đã ký điện tử
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-500 text-white rounded-full text-xs font-bold shadow-xs">
                        <PenTool className="w-4 h-4" /> Vui lòng hoàn tất chữ ký
                      </span>
                    )}
                    <span className="text-xs text-slate-500 font-medium">
                      • Ngày tạo: {new Date(contract.createdAt).toLocaleDateString('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh' })}
                    </span>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-xs text-slate-500 font-semibold block">Giá trị hợp đồng</span>
                  <span className="text-lg font-black text-[#1C3F24]">
                    {(contract.totalAmount || contract.value || 0).toLocaleString('vi-VN')} VNĐ
                  </span>
                </div>
              </div>

              {/* Contract Document Text Container */}
              <EContractDocumentView contract={contract} />

              {/* Signature Section */}
              {isSigned ? (
                <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-5 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-emerald-600 text-white rounded-full flex items-center justify-center font-bold">
                      <ShieldCheck className="w-6 h-6" />
                    </div>
                    <div>
                      <h5 className="font-bold text-slate-900 text-sm">Hợp đồng đã có hiệu lực pháp lý</h5>
                      <p className="text-xs text-slate-500">
                        Thời gian ký: {contract.signedAt ? new Date(contract.signedAt).toLocaleString('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh' }) : 'Đã hoàn tất'}
                      </p>
                    </div>
                  </div>

                  {contract.userSignatureUrl && (
                    <div className="border border-slate-200 rounded-lg p-2 bg-white text-center">
                      <img src={contract.userSignatureUrl} alt="Chữ ký" className="h-12 object-contain mx-auto" />
                      <span className="text-[10px] text-slate-400 font-semibold block">Chữ ký điện tử</span>
                    </div>
                  )}
                </div>
              ) : (
                <EContractSignaturePad
                  signatureType={signatureType}
                  setSignatureType={setSignatureType}
                  typedName={typedName}
                  setTypedName={setTypedName}
                  errorMessage={errorMessage}
                  canvasRef={canvasRef}
                  hasCanvasDrawn={hasCanvasDrawn}
                  startDrawing={startDrawing}
                  stopDrawing={stopDrawing}
                  draw={draw}
                  clearCanvas={clearCanvas}
                />
              )}
            </>
          )}
        </div>

        {/* Footer Actions */}
        <div className="bg-slate-50 px-6 py-4 border-t border-slate-200 flex items-center justify-between gap-4">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 border border-slate-300 hover:bg-slate-100 text-slate-700 rounded-xl text-xs font-bold transition-colors cursor-pointer"
          >
            Đóng
          </button>

          {!isSigned && contract && (
            <button
              type="button"
              onClick={handleSign}
              disabled={signMutation.isPending}
              className="flex items-center justify-center gap-2 bg-[#1C3F24] hover:bg-[#15301B] active:bg-[#0f2414] text-white px-6 py-2.5 rounded-xl font-bold text-xs transition-colors shadow-md disabled:opacity-50 cursor-pointer"
            >
              {signMutation.isPending ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Đang xử lý chữ ký...
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  Xác nhận ký điện tử
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
