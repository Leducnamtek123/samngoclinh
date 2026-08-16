import { useState, useRef, useEffect } from 'react';
import { useEContractDetail, useSignEContract } from '@/hooks/queries/useEContract';

type UseEContractModalProps = {
  contractId: string | null;
};

export function useEContractModal({ contractId }: UseEContractModalProps) {
  const { data: contract, isLoading, isError } = useEContractDetail(contractId);
  const signMutation = useSignEContract();

  const [signatureType, setSignatureType] = useState<'draw' | 'type'>('draw');
  const [typedName, setTypedName] = useState('');
  const [isDrawing, setIsDrawing] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [hasCanvasDrawn, setHasCanvasDrawn] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    if (!contractId) return;
    const origOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = origOverflow;
    };
  }, [contractId]);

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
    if (signMutation.isPending || !contractId) return;
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
      setErrorMessage(err?.message || 'Có lỗi xảy ra khi ký hợp đồng. Vui lòng thử lại.');
    }
  };

  const isSigned = !!(
    contract?.status?.toLowerCase() === 'signed' ||
    contract?.signedAt ||
    contract?.signatureUrl ||
    (contract as any)?.userSignatureUrl
  );

  return {
    contract,
    isLoading,
    isError,
    signMutation,
    signatureType,
    setSignatureType,
    typedName,
    setTypedName,
    canvasRef,
    hasCanvasDrawn,
    errorMessage,
    startDrawing,
    stopDrawing,
    draw,
    clearCanvas,
    handleSign,
    isSigned,
  };
}
