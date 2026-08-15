'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { fetchApiClient } from '@/lib/ApiClient';
import { clearCart } from '@/utils/cart';
import { useTranslations } from 'next-intl';
import { toast } from 'sonner';
import { ShoppingBag, CheckCircle2, CreditCard, PackageCheck } from 'lucide-react';
import { CartStepProgress } from '@/components/cart/CartStepProgress';
import { CartStepPayment } from '@/components/cart/CartStepPayment';
import { LoadingState } from '@/components/common/LoadingState';

interface CheckoutPaymentClientProps {
  locale: string;
  orderId: string;
}

export function CheckoutPaymentClient({ locale, orderId }: CheckoutPaymentClientProps) {
  const t = useTranslations('cart');
  const router = useRouter();

  const [orderInfo, setOrderInfo] = useState<{
    orderId: string;
    orderCode: string;
    amount: number;
    qrUrl: string;
    accountNo: string;
    accountName: string;
    bankName: string;
  } | null>(null);

  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [isVerifying, setIsVerifying] = useState(false);

  // Fetch backend order status on load & on refresh
  useEffect(() => {
    let isMounted = true;

    async function loadOrder() {
      try {
        const res: any = await fetchApiClient(`/public/payment/sepay/verify/${orderId}`);
        const data = res?.data || res;

        if (data?.status === 'paid' || data?.status === 'completed') {
          clearCart();
          toast.success('Đơn hàng đã được thanh toán thành công!');
          router.push(`/${locale}/checkout/result?order=${orderId}&status=success`);
          return;
        }

        if (isMounted) {
          const amount = Number(data?.total) || 0;
          const code = data?.code || orderId;
          setOrderInfo({
            orderId,
            orderCode: code,
            amount,
            qrUrl: data?.qrUrl || '',
            accountNo: data?.accountNumber || '',
            accountName: data?.accountName || '',
            bankName: data?.bankBrand || '',
          });
        }
      } catch {
        if (isMounted) {
          setOrderInfo({
            orderId,
            orderCode: orderId,
            amount: 0,
            qrUrl: '',
            accountNo: '',
            accountName: '',
            bankName: '',
          });
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    loadOrder();

    return () => {
      isMounted = false;
    };
  }, [orderId, locale, router]);

  // SePay Auto Polling & Window Focus listener (Learned from Mobile App AppState listener)
  useEffect(() => {
    if (!orderId) return;

    const checkPaymentStatus = async () => {
      try {
        const res: any = await fetchApiClient(`/public/payment/sepay/verify/${orderId}`);
        const data = res?.data || res;
        if (data?.status === 'paid' || data?.status === 'completed') {
          clearCart();
          toast.success('Xác nhận thanh toán thành công!');
          router.push(`/${locale}/checkout/result?order=${orderId}&status=success`);
        }
      } catch {
        // Silent retry
      }
    };

    const interval = setInterval(checkPaymentStatus, 3000);
    window.addEventListener('focus', checkPaymentStatus);

    return () => {
      clearInterval(interval);
      window.removeEventListener('focus', checkPaymentStatus);
    };
  }, [orderId, locale, router]);

  const handleCopy = (text: string, fieldName: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(fieldName);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const handleManualComplete = async () => {
    setIsVerifying(true);
    try {
      const res: any = await fetchApiClient(`/public/payment/sepay/verify/${orderId}`);
      const data = res?.data || res;
      if (data?.status === 'paid' || data?.status === 'completed') {
        clearCart();
        toast.success('Xác nhận thanh toán thành công!');
        router.push(`/${locale}/checkout/result?order=${orderId}&status=success`);
      } else {
        toast.info('Hệ thống chưa ghi nhận giao dịch thành công. Vui lòng kiểm tra lại ứng dụng ngân hàng hoặc chờ trong giây lát.');
      }
    } catch {
      toast.info('Đang xác minh giao dịch với ngân hàng, vui lòng thử lại sau ít phút.');
    } finally {
      setIsVerifying(false);
    }
  };

  const handleOpenSepayGateway = () => {
    const code = orderInfo?.orderCode || orderId;
    window.location.href = `/api/proxy/public/payment/sepay/pay/${code}`;
  };

  const stepsList = [
    { step: 1, label: t('step1'), icon: ShoppingBag },
    { step: 2, label: t('step2'), icon: CheckCircle2 },
    { step: 3, label: t('step3'), icon: CreditCard },
    { step: 4, label: t('step4'), icon: PackageCheck },
  ];

  if (loading || !orderInfo) {
    return (
      <div className="w-full bg-gray-50 min-h-screen py-12 px-4 sm:px-6 lg:px-8 flex flex-col items-center justify-center">
        <LoadingState message="Đang tải thông tin thanh toán..." size="lg" />
      </div>
    );
  }

  return (
    <div className="w-full bg-gray-50 min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-10">
        <CartStepProgress currentStep={3} stepsList={stepsList} />

        <CartStepPayment
          orderInfo={orderInfo}
          copiedField={copiedField}
          isVerifying={isVerifying}
          onCopy={handleCopy}
          onCompletePayment={handleManualComplete}
          onOpenSepayGateway={handleOpenSepayGateway}
        />
      </div>
    </div>
  );
}
