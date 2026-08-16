'use client';

import { useState, useSyncExternalStore, type FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { useProfileMe } from '@/hooks/queries/useProfile';
import { useShippingFee, useCreateOrderMutation } from '@/hooks/queries/useCheckout';
import { getCartItems, clearCart, type CartItem } from '@/utils/cart';
import { useTranslations } from 'next-intl';
import { toast } from 'sonner';
import { ShoppingBag, CheckCircle2, CreditCard, PackageCheck } from 'lucide-react';
import { CartStepProgress } from '@/components/cart/CartStepProgress';
import { CartStepShipping } from '@/components/cart/CartStepShipping';

const emptyCheckoutSubscribe = () => () => {};
const useCheckoutMounted = () =>
  useSyncExternalStore(emptyCheckoutSubscribe, () => true, () => false);

export function CheckoutConfirmClient({ locale }: { locale: string }) {
  const t = useTranslations('cart');
  const router = useRouter();
  const isClient = useCheckoutMounted();
  const [items] = useState<CartItem[]>(() => {
    if (typeof window === 'undefined') return [];
    try {
      const savedSelected = localStorage.getItem('checkout_selected_items:v1');
      if (savedSelected) {
        const parsed = JSON.parse(savedSelected);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {}
    return getCartItems();
  });

  const { data: profile } = useProfileMe();
  const { data: fetchedShippingFee = 30000 } = useShippingFee();
  const createOrderMutation = useCreateOrderMutation();

  const [userRecipientName, setUserRecipientName] = useState<string | null>(null);
  const [userRecipientPhone, setUserRecipientPhone] = useState<string | null>(null);
  const recipientName = userRecipientName ?? profile?.fullName ?? '';
  const setRecipientName = (val: string) => setUserRecipientName(val);
  const recipientPhone = userRecipientPhone ?? profile?.mobileNumber ?? '';
  const setRecipientPhone = (val: string) => setUserRecipientPhone(val);
  const [shippingAddress, setShippingAddress] = useState('');
  const [notes, setNotes] = useState('');

  const [deliveryType, setDeliveryType] = useState<'shipping' | 'pickup'>('shipping');

  const totalAmount = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handleCreateOrder = async (formData?: {
    recipientName?: string;
    recipientPhone?: string;
    shippingAddress?: string;
    notes?: string;
    deliveryType?: 'shipping' | 'pickup';
  } | FormEvent) => {
    if (formData && 'preventDefault' in formData) {
      formData.preventDefault();
    }
    if (items.length === 0) return;

    const isFormValues = formData && !('preventDefault' in formData);
    const finalName = (isFormValues ? formData.recipientName : recipientName) || recipientName;
    const finalPhone = (isFormValues ? formData.recipientPhone : recipientPhone) || recipientPhone;
    const finalAddress = (isFormValues ? formData.shippingAddress : shippingAddress) || shippingAddress;
    const finalNotes = isFormValues && formData.notes !== undefined ? formData.notes : notes;
    const finalDeliveryType = (isFormValues && formData.deliveryType ? formData.deliveryType : deliveryType) || 'shipping';

    const customerName = (finalName || '').trim();
    const customerPhone = (finalPhone || '').trim();
    const address = (finalAddress || '').trim();
    const noteVal = (finalNotes || '').trim();

    if (!customerName) {
      toast.error('Vui lòng nhập tên người nhận!');
      return;
    }
    if (!customerPhone) {
      toast.error('Vui lòng nhập số điện thoại người nhận!');
      return;
    }
    if (finalDeliveryType === 'shipping' && !address) {
      toast.error('Vui lòng nhập hoặc chọn địa chỉ giao hàng!');
      return;
    }

    try {
      const orderData: any = await createOrderMutation.mutateAsync({
        customerName,
        customerPhone,
        customerEmail: profile?.email || undefined,
        deliveryType: finalDeliveryType,
        shippingAddress: finalDeliveryType === 'shipping' ? address : undefined,
        paymentMethod: 'online',
        note: noteVal || undefined,
        items: items.map((it) => ({ productId: it.id, quantity: it.quantity })),
      });

      const orderId = orderData?.code || orderData?.id;

      clearCart();
      toast.success('Đã tạo đơn hàng thành công! Đang chuyển hướng sang trang thanh toán...');
      window.location.assign(`/api/proxy/public/payment/sepay/pay/${orderId}`);
    } catch (err: any) {
      toast.error(err?.message || 'Không thể tạo đơn hàng. Vui lòng kiểm tra lại thông tin!');
    }
  };

  const stepsList = [
    { step: 1, label: t('step1'), icon: ShoppingBag },
    { step: 2, label: t('step2'), icon: CheckCircle2 },
    { step: 3, label: t('step3'), icon: CreditCard },
    { step: 4, label: t('step4'), icon: PackageCheck },
  ];

  if (!isClient) return null;

  return (
    <div className="w-full bg-gray-50 min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-10">
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
          onPrevStep={() => router.push(`/${locale}/cart`)}
        />
      </div>
    </div>
  );
}
