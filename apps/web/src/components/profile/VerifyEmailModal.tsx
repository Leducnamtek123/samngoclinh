import React, { useState } from 'react';
import { toast } from 'sonner';
import { Mail } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '../ui/dialog';
import { Input } from '../ui/input';
import { Button, ButtonLoading } from '../ui/button';
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
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-md">
        <DialogHeader className="text-center">
          <div className="w-12 h-12 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto mb-2">
            <Mail className="w-6 h-6" />
          </div>
          <DialogTitle>Xác thực Email</DialogTitle>
          <DialogDescription>
            {userEmail ? `Email tài khoản: ${userEmail}` : 'Xác thực địa chỉ email để bảo vệ tài khoản của bạn'}
          </DialogDescription>
        </DialogHeader>

        {errorMsg && (
          <div className="bg-red-50 border border-red-200 text-red-700 text-xs p-3 rounded-xl font-medium">
            {errorMsg}
          </div>
        )}

        {step === 'request' ? (
          <div className="space-y-4 pt-2">
            <p className="text-xs text-gray-600 dark:text-gray-400 text-center leading-relaxed">
              Nhấn nút bên dưới để nhận mã OTP xác nhận gồm 6 chữ số gửi về hộp thư email của bạn.
            </p>
            <ButtonLoading
              onClick={handleSendOtp}
              isLoading={requestMutation.isPending}
              variant="default"
              className="w-full"
            >
              Gửi mã xác thực OTP
            </ButtonLoading>
          </div>
        ) : (
          <form onSubmit={handleConfirmOtp} className="space-y-4 pt-2">
            <div className="space-y-1.5 text-center">
              <label htmlFor="otpCodeInput" className="text-xs font-bold text-gray-500 uppercase tracking-wider block">Nhập mã OTP</label>
              <Input
                id="otpCodeInput"
                type="text"
                maxLength={6}
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                className="text-center tracking-[0.5em] text-xl font-bold h-12"
              />
            </div>
            <div className="flex gap-3 pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={handleSendOtp}
                disabled={requestMutation.isPending}
                className="flex-1"
              >
                Gửi lại OTP
              </Button>
              <ButtonLoading
                type="submit"
                variant="default"
                isLoading={confirmMutation.isPending}
                className="flex-1"
              >
                Xác nhận OTP
              </ButtonLoading>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
};
