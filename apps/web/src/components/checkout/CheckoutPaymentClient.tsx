'use client';

import { ShoppingBag, CheckCircle2, CreditCard, PackageCheck } from 'lucide-react';
import { useLocale, useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { CartStepPayment } from '@/components/cart/CartStepPayment';
import { CartStepProgress } from '@/components/cart/CartStepProgress';
import { LoadingState } from '@/components/common/LoadingState';
import { paymentService } from '@/services/content.service';
import { clearCart } from '@/utils/cart';

type CheckoutPaymentClientProps = {
  locale: string;
  orderId: string;
};

type SepayVerifyResult = {
  status?: string;
  total?: number;
  code?: string;
  qrUrl?: string;
  accountNumber?: string;
  accountName?: string;
  bankBrand?: string;
  data?: SepayVerifyResult;
};

type OrderPaymentInfo = {
  orderId: string;
  orderCode: string;
  amount: number;
  qrUrl: string;
  accountNo: string;
  accountName: string;
  bankName: string;
};

export function CheckoutPaymentClient({ orderId }: CheckoutPaymentClientProps) {
  const t = useTranslations('checkoutPayment');
  const locale = useLocale();
  const router = useRouter();

  const [orderInfo, setOrderInfo] = useState<OrderPaymentInfo | null>(null);
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [isVerifying, setIsVerifying] = useState(false);

  // Fetch backend order status on load & on refresh
  useEffect(() => {
    let isMounted = true;

    async function loadOrder() {
      try {
        const res = (await paymentService.verifySepayOrder(orderId)) as SepayVerifyResult;
        const data = res?.data || res;

        if (data?.status === 'paid' || data?.status === 'completed') {
          clearCart();
          toast.success(t('paymentSuccess'));
          // react-doctor-disable-next-line react-doctor/nextjs-no-client-side-redirect
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
      }
      if (isMounted) {
        setLoading(false);
      }
    }

    loadOrder();

    return () => {
      isMounted = false;
    };
  }, [orderId, locale, router, t]);

  // SePay Auto Polling & Window Focus listener
  useEffect(() => {
    if (!orderId) {
      return;
    }

    const checkPaymentStatus = async () => {
      try {
        const res = (await paymentService.verifySepayOrder(orderId)) as SepayVerifyResult;
        const data = res?.data || res;
        if (data?.status === 'paid' || data?.status === 'completed') {
          clearCart();
          toast.success(t('paymentSuccess'));
          // react-doctor-disable-next-line react-doctor/nextjs-no-client-side-redirect
          router.push(`/${locale}/checkout/result?order=${orderId}&status=success`);
        }
      } catch {}
    };

    const interval = setInterval(checkPaymentStatus, 3000);
    window.addEventListener('focus', checkPaymentStatus);

    return () => {
      clearInterval(interval);
      window.removeEventListener('focus', checkPaymentStatus);
    };
  }, [orderId, locale, router, t]);

  const handleCopy = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    toast.success(t('copied'));
    setTimeout(() => {
      setCopiedField(null);
    }, 2000);
  };

  const handleManualVerify = async () => {
    setIsVerifying(true);
    try {
      const res = (await paymentService.verifySepayOrder(orderId)) as SepayVerifyResult;
      const data = res?.data || res;
      if (data?.status === 'paid' || data?.status === 'completed') {
        clearCart();
        toast.success(t('paymentSuccess'));
        router.push(`/${locale}/checkout/result?order=${orderId}&status=success`);
      } else {
        toast.info(t('pendingPayment'));
      }
    } catch {
      toast.error(t('verifyFailed'));
    }
    setIsVerifying(false);
  };

  const stepsList = [
    { step: 1, label: t('step1'), icon: ShoppingBag },
    { step: 2, label: t('step2'), icon: CheckCircle2 },
    { step: 3, label: t('step3'), icon: CreditCard },
    { step: 4, label: t('step4'), icon: PackageCheck },
  ];

  if (loading) {
    return (
      <div className="flex min-h-[60vh] w-full items-center justify-center">
        <LoadingState variant="centered" message={t('loading')} />
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl space-y-10">
        <CartStepProgress currentStep={3} stepsList={stepsList} />

        {orderInfo && (
          <CartStepPayment
            orderInfo={orderInfo}
            copiedField={copiedField}
            onCopy={handleCopy}
            onCompletePayment={handleManualVerify}
            isVerifying={isVerifying}
          />
        )}
      </div>
    </div>
  );
}
