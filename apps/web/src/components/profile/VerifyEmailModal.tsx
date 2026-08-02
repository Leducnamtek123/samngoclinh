import React, { useState } from 'react';
import { toast } from 'sonner';
import { useRequestEmailVerification, useConfirmEmailVerification } from '@/hooks/queries/useVerifyEmail';

type VerifyEmailModalProps = {
  isOpen: boolean;
  onClose: () => void;
  userEmail?: string;
};

export const VerifyEmailModal = ({ isOpen, onClose, userEmail }: VerifyEmailModalProps) => {
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState<'request' | 'confirm'>('request');
  const [errorMsg, setErrorMsg] = useState('');

  const requestMutation = useRequestEmailVerification();
  const confirmMutation = useConfirmEmailVerification();

  if (!isOpen) return null;

  const handleSendOtp = async () => {
    setErrorMsg('');
    try {
      await requestMutation.mutateAsync();
      toast.success('Mã OTP đã được gửi tới email của bạn!');
      setStep('confirm');
    } catch (err: any) {
      setErrorMsg(err.message || 'Không thể gửi mã OTP. Vui lòng thử lại.');
    }
  };

  const handleConfirmOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otp || otp.trim().length < 4) {
      setErrorMsg('Vui lòng nhập đầy đủ mã OTP.');
      return;
    }
    setErrorMsg('');
    try {
      await confirmMutation.mutateAsync(otp.trim());
      toast.success('Xác thực email thành công!');
      onClose();
    } catch (err: any) {
      setErrorMsg(err.message || 'Mã OTP không hợp lệ hoặc đã hết hạn.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white rounded-2xl p-6 sm:p-8 max-w-md w-full space-y-6 shadow-xl relative animate-in fade-in zoom-in duration-200">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors p-1"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="space-y-2 text-center">
          <div className="w-12 h-12 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
          <h3 className="text-lg font-bold text-gray-900">Xác thực Email</h3>
          <p className="text-xs text-gray-500 font-medium">
            {userEmail ? `Email tài khoản: ${userEmail}` : 'Xác thực địa chỉ email để bảo vệ tài khoản của bạn'}
          </p>
        </div>

        {errorMsg && (
          <div className="bg-red-50 border border-red-200 text-red-700 text-xs p-3 rounded-xl font-medium">
            {errorMsg}
          </div>
        )}

        {step === 'request' ? (
          <div className="space-y-4 pt-2">
            <p className="text-xs text-gray-600 text-center leading-relaxed">
              Nhấn nút bên dưới để nhận mã OTP xác nhận gồm 6 chữ số gửi về hộp thư email của bạn.
            </p>
            <button
              onClick={handleSendOtp}
              disabled={requestMutation.isPending}
              className="w-full bg-[#1C3F24] hover:bg-emerald-900 text-white font-bold py-3 rounded-xl text-xs transition-colors shadow-md disabled:opacity-50 cursor-pointer"
            >
              {requestMutation.isPending ? 'Đang gửi mã OTP...' : 'Gửi mã xác thực OTP'}
            </button>
          </div>
        ) : (
          <form onSubmit={handleConfirmOtp} className="space-y-4 pt-2">
            <div className="space-y-1.5 text-center">
              <label htmlFor="otpCodeInput" className="text-xs font-bold text-gray-500 uppercase tracking-wider block">Nhập mã OTP</label>
              <input
                id="otpCodeInput"
                type="text"
                maxLength={6}
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                placeholder="------"
                className="w-full text-center tracking-[0.5em] text-xl font-bold border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-[#1C3F24] focus:outline-none"
              />
            </div>
            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={handleSendOtp}
                disabled={requestMutation.isPending}
                className="flex-1 border border-gray-300 text-gray-700 hover:bg-gray-50 font-bold py-2.5 rounded-xl text-xs transition-colors"
              >
                Gửi lại OTP
              </button>
              <button
                type="submit"
                disabled={confirmMutation.isPending}
                className="flex-1 bg-[#1C3F24] hover:bg-emerald-900 text-white font-bold py-2.5 rounded-xl text-xs transition-colors shadow-md disabled:opacity-50 cursor-pointer"
              >
                {confirmMutation.isPending ? 'Đang xác nhận...' : 'Xác nhận OTP'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
