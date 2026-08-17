import { Mail } from 'lucide-react';
import { useTranslations } from 'next-intl';
import React, { useState } from 'react';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  Input,
  Button,
} from '@/components/ui';
import {
  useRequestEmailVerification,
  useConfirmEmailVerification,
} from '@/hooks/queries/useVerifyEmail';

type VerifyEmailModalProps = {
  isOpen: boolean;
  onClose: () => void;
  userEmail?: string;
};

export const VerifyEmailModal = ({ isOpen, onClose, userEmail }: VerifyEmailModalProps) => {
  const t = useTranslations('verifyEmailModal');
  const tActions = useTranslations('actions');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState<'request' | 'confirm'>('request');
  const [errorMsg, setErrorMsg] = useState('');

  const requestMutation = useRequestEmailVerification();
  const confirmMutation = useConfirmEmailVerification();

  if (!isOpen) {
    return null;
  }

  const handleSendOtp = async () => {
    if (requestMutation.isPending) {
      return;
    }
    setErrorMsg('');
    try {
      await requestMutation.mutateAsync();
      toast.success(t('resendSuccess'));
      setStep('confirm');
    } catch (error: unknown) {
      setErrorMsg(error instanceof Error ? error.message : t('verifyError'));
    }
  };

  const handleConfirmOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (confirmMutation.isPending) {
      return;
    }
    if (!otp || otp.trim().length < 4) {
      setErrorMsg(t('otpLabel'));
      return;
    }
    setErrorMsg('');
    try {
      await confirmMutation.mutateAsync(otp.trim());
      toast.success(t('verifySuccess'));
      onClose();
    } catch (error: unknown) {
      setErrorMsg(error instanceof Error ? error.message : t('verifyError'));
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-md">
        <DialogHeader className="text-center">
          <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
            <Mail className="h-6 w-6" />
          </div>
          <DialogTitle>{t('title')}</DialogTitle>
          <DialogDescription>
            {userEmail ? `${t('subtitle')} ${userEmail}` : t('instruction')}
          </DialogDescription>
        </DialogHeader>

        {errorMsg && (
          <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-xs font-medium text-red-700">
            {errorMsg}
          </div>
        )}

        {step === 'request' ? (
          <div className="space-y-4 pt-2">
            <p className="text-center text-xs leading-relaxed text-gray-600 dark:text-gray-400">
              {t('instruction')}
            </p>
            <Button
              onClick={handleSendOtp}
              isLoading={requestMutation.isPending}
              variant="default"
              className="w-full"
            >
              {t('resendBtn')}
            </Button>
          </div>
        ) : (
          <form onSubmit={handleConfirmOtp} className="space-y-4 pt-2">
            <div className="space-y-1.5 text-center">
              <label
                htmlFor="otpCodeInput"
                className="block text-xs font-bold tracking-wider text-gray-500 uppercase"
              >
                {t('otpLabel')}
              </label>
              <Input
                id="otpCodeInput"
                type="text"
                maxLength={6}
                value={otp}
                placeholder={t('otpPlaceholder')}
                onChange={(e) => {
                  setOtp(e.target.value);
                }}
                className="h-12 text-center text-xl font-bold tracking-[0.5em]"
              />
            </div>
            <div className="flex gap-3 pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setStep('request');
                }}
                className="flex-1"
              >
                {tActions('cancel')}
              </Button>
              <Button
                type="submit"
                isLoading={confirmMutation.isPending}
                variant="default"
                className="flex-1"
              >
                {t('verifyBtn')}
              </Button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
};
