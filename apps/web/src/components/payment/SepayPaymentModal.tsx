'use client';

import { useEffect } from 'react';

export interface SepayPaymentInfo {
  qrUrl?: string;
  accountNumber?: string;
  accountName?: string;
  bankBrand?: string;
  amount?: number;
  orderCode: string;
}

interface SepayPaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  paymentInfo: SepayPaymentInfo;
  onPaymentSuccess?: () => void;
  checkStatusApiUrl?: string;
}

export const SepayPaymentModal = ({
  isOpen,
  paymentInfo,
}: SepayPaymentModalProps) => {
  const orderCodeToPay = paymentInfo?.orderCode || '';
  const payUrl = orderCodeToPay ? `/api/proxy/public/payment/sepay/pay/${orderCodeToPay}` : '';

  useEffect(() => {
    if (!isOpen || !payUrl) return;
    window.location.href = payUrl;
  }, [isOpen, payUrl]);

  return null;
};
