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

  // Fetch backend cart when profile is loaded
  useEffect(() => {
    if (profile) {
      fetchApiClient('/user/cart')
        .then((res) => {
          if (res.data?.items && Array.isArray(res.data.items)) {
            const apiItems: CartItem[] = res.data.items.map((it: any) => ({
              id: it.productId || it.id,
              name: it.productName || it.name || 'Sản phẩm Sâm Ngọc Linh',
              price: Number(it.price) || 0,
              quantity: Number(it.quantity) || 1,
              image: it.imageUrl || it.image,
            }));
            if (apiItems.length > 0) {
              setItems(apiItems);
              localStorage.setItem('cart_items:v1', JSON.stringify(apiItems));
            }
          }
        })
        .catch(() => {});
    }
  }, [profile]);

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
    const fallbackCode = `DH${Math.floor(100000 + Math.random() * 900000)}`;

    fetchApiClient('/user/orders/checkout', {
      method: 'POST',
      body: JSON.stringify({
        customerName: recipientName.trim(),
        customerPhone: recipientPhone.trim(),
        customerEmail: profile?.email || undefined,
        deliveryType: 'shipping',
        shippingAddress: shippingAddress.trim(),
        paymentMethod: 'online',
        note: notes.trim() || undefined,
      }),
    })
      .then((res) => {
        const orderData = res.data || res;
        const orderId = orderData?.id || `ORD-${Date.now()}`;
        const finalCode = orderData?.code || fallbackCode;
        const finalAmount = orderData?.total || totalAmount;
        const qrUrl =
          orderData?.paymentQr ||
          `https://qr.sepay.vn/img?acc=104875953046&bank=VietinBank&amount=${finalAmount}&des=${finalCode}`;

        setOrderInfo({
          orderId,
          orderCode: finalCode,
          amount: finalAmount,
          qrUrl,
          accountNo: '104875953046',
          accountName: 'CONG TY CP SAM NGOC LINH',
          bankName: 'VietinBank (Ngân hàng TMCP Công Thương Việt Nam)',
        });

        setCurrentStep(3);
      })
      .catch(() => {
        // Fallback order info for guest or offline mode
        const orderId = `ORD-${Date.now()}`;
        setOrderInfo({
          orderId,
          orderCode: fallbackCode,
          amount: totalAmount,
          qrUrl: `https://qr.sepay.vn/img?acc=104875953046&bank=VietinBank&amount=${totalAmount}&des=${fallbackCode}`,
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
