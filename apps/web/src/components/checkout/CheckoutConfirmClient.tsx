'use client';

import { ShoppingBag, CheckCircle2, CreditCard, PackageCheck } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import { useState, useSyncExternalStore } from 'react';
import type { FormEvent } from 'react';
import { toast } from 'sonner';
import { CartStepProgress } from '@/components/cart/CartStepProgress';
import { CartStepShipping } from '@/components/cart/CartStepShipping';
import { useShippingFee, useCreateOrderMutation } from '@/hooks/queries/useCheckout';
import { useIdentityVerificationStatus } from '@/hooks/queries/useIdentityVerification';
import { useProfileMe } from '@/hooks/queries/useProfile';
import { getCartItems, clearCart } from '@/utils/cart';
import type { CartItem } from '@/utils/cart';

const emptyCheckoutSubscribe = () => () => {};
const useCheckoutMounted = () =>
  useSyncExternalStore(
    emptyCheckoutSubscribe,
    () => true,
    () => false,
  );

export function CheckoutConfirmClient({ locale }: { locale: string }) {
  const t = useTranslations('cart');
  const router = useRouter();
  const isClient = useCheckoutMounted();
  const [items] = useState<CartItem[]>(() => {
    if (typeof window === 'undefined') {
      return [];
    }
    try {
      const savedSelected = localStorage.getItem('checkout_selected_items:v1');
      if (savedSelected) {
        const parsed = JSON.parse(savedSelected);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch {}
    return getCartItems();
  });

  const { data: profile } = useProfileMe();
  const { data: kycStatusData } = useIdentityVerificationStatus();
  const { data: fetchedShippingFee = 30_000 } = useShippingFee();
  const createOrderMutation = useCreateOrderMutation();

  const [userRecipientName, setUserRecipientName] = useState<string | null>(null);
  const [userRecipientPhone, setUserRecipientPhone] = useState<string | null>(null);
  const recipientName = userRecipientName ?? profile?.fullName ?? '';
  const setRecipientName = (val: string) => {
    setUserRecipientName(val);
  };
  const recipientPhone = userRecipientPhone ?? profile?.mobileNumber ?? '';
  const setRecipientPhone = (val: string) => {
    setUserRecipientPhone(val);
  };
  const [shippingAddress, setShippingAddress] = useState('');
  const [notes, setNotes] = useState('');

  // Legal contract signing state for tree / plant orders
  const [legalName, setLegalName] = useState('');
  const [identityNumber, setIdentityNumber] = useState('');
  const [signatureData, setSignatureData] = useState('');
  const [isContractAgreed, setIsContractAgreed] = useState(false);

  const [deliveryType, setDeliveryType] = useState<'shipping' | 'pickup'>('shipping');

  const totalAmount = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const hasTrees = items.some(
    (it) =>
      it.category === 'plant' ||
      it.category === 'tree' ||
      it.category === 'package' ||
      it.name?.toLowerCase().includes('cây sâm') ||
      it.name?.toLowerCase().includes('gói trồng') ||
      it.name?.toLowerCase().includes('vườn sâm') ||
      it.name?.toLowerCase().includes('gói chăm sóc'),
  );

  const handleCreateOrder = async (
    formData?:
      | {
          recipientName?: string;
          recipientPhone?: string;
          shippingAddress?: string;
          notes?: string;
          deliveryType?: 'shipping' | 'pickup';
        }
      | FormEvent,
  ) => {
    if (formData && 'preventDefault' in formData) {
      formData.preventDefault();
    }
    if (items.length === 0) {
      return;
    }

    const isFormValues = formData && !('preventDefault' in formData);
    const finalName = (isFormValues ? formData.recipientName : recipientName) || recipientName;
    const finalPhone = (isFormValues ? formData.recipientPhone : recipientPhone) || recipientPhone;
    const finalAddress =
      (isFormValues ? formData.shippingAddress : shippingAddress) || shippingAddress;
    const finalNotes = isFormValues && formData.notes !== undefined ? formData.notes : notes;
    const finalDeliveryType =
      (isFormValues && formData.deliveryType ? formData.deliveryType : deliveryType) || 'shipping';

    const customerName = (finalName || '').trim();
    const customerPhone = (finalPhone || '').trim();
    const address = (finalAddress || '').trim();
    const noteVal = (finalNotes || '').trim();

    if (!customerName) {
      toast.error(t('recipientNameRequired'));
      return;
    }
    if (!customerPhone) {
      toast.error(t('recipientPhoneRequired'));
      return;
    }
    if (finalDeliveryType === 'shipping' && !address) {
      toast.error(t('addressRequired'));
      return;
    }

    if (hasTrees) {
      const finalLegalName = (legalName || customerName).trim();
      const finalIdNum = identityNumber.trim();

      if (!finalLegalName) {
        toast.error(t('recipientNameRequired'));
        return;
      }
      if (!finalIdNum || finalIdNum.length < 9) {
        toast.error(t('identityRequired'));
        return;
      }
      if (!signatureData) {
        toast.error(t('signatureRequired'));
        return;
      }
      if (!isContractAgreed) {
        toast.error(t('contractAgreedRequired'));
        return;
      }
    }

    try {
      const orderData = (await createOrderMutation.mutateAsync({
        customerName,
        customerPhone,
        customerEmail: profile?.email || undefined,
        deliveryType: finalDeliveryType,
        shippingAddress: finalDeliveryType === 'shipping' ? address : undefined,
        paymentMethod: 'online',
        note: noteVal || undefined,
        identityNumber: hasTrees ? identityNumber.trim() : undefined,
        legalName: hasTrees ? (legalName || customerName).trim() : undefined,
        signatureData: hasTrees ? signatureData : undefined,
        metadata: hasTrees
          ? {
              identityNumber: identityNumber.trim(),
              legalName: (legalName || customerName).trim(),
              signatureData,
              hasSignedContract: true,
            }
          : undefined,
        items: items.map((it) => ({ productId: it.id, quantity: it.quantity })),
      })) as { code?: string; id?: string };

      const orderId = orderData?.code || orderData?.id;

      clearCart();
      toast.success(t('orderSuccessRedirect'));
      window.location.assign(`/api/proxy/public/payment/sepay/pay/${orderId}`);
    } catch (error: unknown) {
      toast.error(error instanceof Error ? error.message : t('orderFailed'));
    }
  };

  const stepsList = [
    { step: 1, label: t('step1'), icon: ShoppingBag },
    { step: 2, label: t('step2'), icon: CheckCircle2 },
    { step: 3, label: t('step3'), icon: CreditCard },
    { step: 4, label: t('step4'), icon: PackageCheck },
  ];

  if (!isClient) {
    return null;
  }

  return (
    <div className="min-h-screen w-full bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl space-y-10">
        <CartStepProgress currentStep={2} stepsList={stepsList} />

        <CartStepShipping
          items={items}
          totalAmount={totalAmount}
          recipientName={recipientName}
          setRecipientName={setRecipientName}
          recipientPhone={recipientPhone}
          setRecipientPhone={setRecipientPhone}
          shippingAddress={shippingAddress}
          setShippingAddress={setShippingAddress}
          notes={notes}
          setNotes={setNotes}
          deliveryType={deliveryType}
          setDeliveryType={setDeliveryType}
          shippingFee={fetchedShippingFee}
          loading={createOrderMutation.isPending}
          t={t}
          onSubmit={handleCreateOrder}
          onPrevStep={() => {
            router.push(`/${locale}/cart`);
          }}
          legalName={legalName}
          setLegalName={setLegalName}
          identityNumber={identityNumber}
          setIdentityNumber={setIdentityNumber}
          signatureData={signatureData}
          setSignatureData={setSignatureData}
          isContractAgreed={isContractAgreed}
          setIsContractAgreed={setIsContractAgreed}
          kycStatusData={kycStatusData}
        />
      </div>
    </div>
  );
}
