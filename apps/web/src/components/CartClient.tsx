'use client';

import { useState, useEffect } from 'react';
import { fetchApiClient } from '@/libs/ApiClient';
import { useProfileMe } from '@/hooks/queries/useProfile';
import { getCartItems, updateCartQuantity, removeFromCart, clearCart, type CartItem } from '@/utils/cart';
import { useTranslations } from 'next-intl';
import { toast } from 'sonner';
import { ShoppingBag, CheckCircle2, CreditCard, PackageCheck } from 'lucide-react';
import { CartStepProgress } from './cart/CartStepProgress';
import { CartStepItems } from './cart/CartStepItems';
import { CartStepShipping } from './cart/CartStepShipping';
import { CartStepPayment } from './cart/CartStepPayment';
import { CartStepSuccess } from './cart/CartStepSuccess';

export const CartClient = ({ locale: _locale }: { locale: string }) => {
  const t = useTranslations('cart');
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3 | 4>(1);
  const [items, setItems] = useState<CartItem[]>(() => (typeof window !== 'undefined' ? getCartItems() : []));
  const [loading, setLoading] = useState(false);

  const { data: profile } = useProfileMe();
  const [prevProfileName, setPrevProfileName] = useState(profile?.fullName);

  // Shipping details form
  const [recipientName, setRecipientName] = useState('');
  const [recipientPhone, setRecipientPhone] = useState('');
  const [shippingAddress, setShippingAddress] = useState('');
  const [notes, setNotes] = useState('');

  if (profile?.fullName && profile.fullName !== prevProfileName) {
    setPrevProfileName(profile.fullName);
    if (!recipientName) setRecipientName(profile.fullName);
  }

  // Payment data
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

  useEffect(() => {
    const handleCartUpdate = () => {
      setItems(getCartItems());
    };

    window.addEventListener('cart_updated', handleCartUpdate);
    return () => window.removeEventListener('cart_updated', handleCartUpdate);
  }, []);

  const handleUpdateQuantity = (id: string, delta: number) => {
    const next = updateCartQuantity(id, delta);
    setItems(next);
  };

  const handleRemoveItem = (id: string) => {
    const next = removeFromCart(id);
    setItems(next);
  };

  const totalAmount = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  // Copy helper
  const handleCopy = (text: string, fieldName: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(fieldName);
    setTimeout(() => setCopiedField(null), 2000);
  };

  // Step 2 -> Step 3: Create Order & Show VietQR
  const handleCreateOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (items.length === 0) return;
    if (!recipientName || !recipientPhone || !shippingAddress) {
      toast.warning('Vui lòng điền đầy đủ thông tin người nhận!');
      return;
    }

    setLoading(true);
    const orderCode = `DH${Math.floor(100000 + Math.random() * 900000)}`;

    fetchApiClient('/user/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        items: items.map((i) => ({ productId: i.id, quantity: i.quantity, price: i.price })),
        totalAmount,
        recipientName,
        recipientPhone,
        shippingAddress,
        notes,
      }),
    })
      .then((res) => {
        const orderId = res.data?.id || `ORD-${Date.now()}`;
        const finalCode = res.data?.code || orderCode;

        setOrderInfo({
          orderId,
          orderCode: finalCode,
          amount: totalAmount,
          qrUrl: `https://qr.sepay.vn/img?acc=104875953046&bank=VietinBank&amount=${totalAmount}&des=${finalCode}`,
          accountNo: '104875953046',
          accountName: 'CONG TY CP SAM NGOC LINH',
          bankName: 'VietinBank (Ngân hàng TMCP Công Thương Việt Nam)',
        });

        setCurrentStep(3);
      })
      .catch(() => {
        // Fallback order info for guest or demo
        const orderId = `ORD-${Date.now()}`;
        setOrderInfo({
          orderId,
          orderCode,
          amount: totalAmount,
          qrUrl: `https://qr.sepay.vn/img?acc=104875953046&bank=VietinBank&amount=${totalAmount}&des=${orderCode}`,
          accountNo: '104875953046',
          accountName: 'CONG TY CP SAM NGOC LINH',
          bankName: 'VietinBank (Ngân hàng TMCP Công Thương Việt Nam)',
        });

        setCurrentStep(3);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const stepsList = [
    { step: 1, label: t('step1'), icon: ShoppingBag },
    { step: 2, label: t('step2'), icon: CheckCircle2 },
    { step: 3, label: t('step3'), icon: CreditCard },
    { step: 4, label: t('step4'), icon: PackageCheck },
  ];

  return (
    <div className="w-full bg-gray-50 min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-10">
        <CartStepProgress currentStep={currentStep} stepsList={stepsList} />

        {currentStep === 1 && (
          <CartStepItems
            items={items}
            totalAmount={totalAmount}
            t={t}
            onUpdateQuantity={handleUpdateQuantity}
            onRemoveItem={handleRemoveItem}
            onNextStep={() => setCurrentStep(2)}
          />
        )}

        {currentStep === 2 && (
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
            loading={loading}
            t={t}
            onSubmit={handleCreateOrder}
            onPrevStep={() => setCurrentStep(1)}
          />
        )}

        {currentStep === 3 && orderInfo && (
          <CartStepPayment
            orderInfo={orderInfo}
            copiedField={copiedField}
            onCopy={handleCopy}
            onCompletePayment={() => {
              clearCart();
              setCurrentStep(4);
            }}
          />
        )}

        {currentStep === 4 && <CartStepSuccess orderInfo={orderInfo} />}
      </div>
    </div>
  );
};
