import { useState, useEffect, type FormEvent } from 'react';
import { toast } from 'sonner';
import { useProfileMe } from '@/hooks/queries/useProfile';
import { usePlantPackages, useCreateQuickOrder } from '@/hooks/queries/useQuickPurchase';
import type { ShippingAddressFormValues } from '@/lib/validation/schemas';
import type { Order } from '@/types';
import type { QuickPurchaseItem } from './QuickPurchaseModal';

type UseQuickPurchaseFormProps = {
  item: QuickPurchaseItem | null;
  mode: 'plant' | 'product';
  locale: string;
  isLoggedIn?: boolean;
  onClose: () => void;
  onSuccessPayment?: (orderData: Order) => void;
  t: (key: string) => string;
};

export function useQuickPurchaseForm({
  item,
  mode,
  locale,
  isLoggedIn = false,
  onClose,
  onSuccessPayment,
  t,
}: UseQuickPurchaseFormProps) {
  const [quantity, setQuantity] = useState(1);
  const { data: profile, refetch: refetchProfile } = useProfileMe();
  const { carePackages, protectionPackages } = usePlantPackages();
  const createQuickOrderMutation = useCreateQuickOrder();

  const [userSelectedCareId, setUserSelectedCareId] = useState<string | null>(null);
  const [userSelectedProtectionId, setUserSelectedProtectionId] = useState<string | null>(null);
  const [agreedTerms, setAgreedTerms] = useState(false);

  const [localAddresses, setLocalAddresses] = useState<any[]>(() => {
    try {
      const saved = typeof window !== 'undefined' ? localStorage.getItem('user_addresses:v1') : null;
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const profileAddresses = (profile?.addresses && Array.isArray(profile.addresses))
    ? profile.addresses.map((a: any) => ({
        id: a.id,
        name: a.recipient || a.name || profile.fullName || '',
        recipient: a.recipient || a.name || profile.fullName || '',
        phone: a.phone || profile.mobileNumber || '',
        address: a.detail || a.address || '',
        detail: a.detail || a.address || '',
        isDefault: !!a.isDefault,
      }))
    : [];

  const addresses = Array.from(new Map([...profileAddresses, ...localAddresses].map((a) => [a.id, a])).values());

  const [userSelectedAddressId, setUserSelectedAddressId] = useState<string | null>(null);
  const defaultAddr = addresses.find((a: any) => a.isDefault) || addresses[0];
  const selectedAddressId = userSelectedAddressId ?? defaultAddr?.id ?? null;
  const setSelectedAddressId = (id: string | null) => setUserSelectedAddressId(id);

  const selectedCareId = userSelectedCareId ?? (carePackages[0] as any)?.code ?? carePackages[0]?.id ?? '';
  const setSelectedCareId = (id: string) => setUserSelectedCareId(id);

  const selectedProtectionId = userSelectedProtectionId ?? (protectionPackages[0] as any)?.code ?? protectionPackages[0]?.id ?? '';
  const setSelectedProtectionId = (id: string) => setUserSelectedProtectionId(id);

  const [deliveryType, setDeliveryType] = useState<'shipping' | 'pickup'>('shipping');
  const [isAddAddressModalOpen, setIsAddAddressModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const origOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = origOverflow;
    };
  }, []);

  const stockCount = item?.stock ?? 0;
  const unitPrice = item?.price || 0;
  const itemImage =
    item?.image ||
    item?.imageUrl ||
    (Array.isArray(item?.images) && item?.images[0]) ||
    '/images/kon_tum_ginseng.png';

  const selectedCareObj =
    carePackages.find((c: any) => c.code === selectedCareId || c.id === selectedCareId) ||
    carePackages[0];
  const careUnitPrice = selectedCareObj ? Number((selectedCareObj as any).price || 0) : 0;

  const selectedProtectionObj =
    protectionPackages.find((p: any) => p.code === selectedProtectionId || p.id === selectedProtectionId) ||
    protectionPackages[0];
  const protectionUnitPrice = selectedProtectionObj ? Number((selectedProtectionObj as any).price || 0) : 0;

  const treeBasePrice = unitPrice * quantity;
  const vatTree = Math.round(treeBasePrice * 0.05);

  const totalCareFee = careUnitPrice * quantity;
  const vatCare = Math.round(totalCareFee * 0.1);

  const totalProtectionFee = protectionUnitPrice * quantity;
  const vatProtection = Math.round(totalProtectionFee * 0.1);

  const plantGrandTotal =
    treeBasePrice + vatTree + totalCareFee + vatCare + totalProtectionFee + vatProtection;

  const productSubtotal = unitPrice * quantity;
  const vatProduct8 = Math.round(productSubtotal * 0.08);
  const shippingFee = deliveryType === 'shipping' ? 30000 : 0;
  const productGrandTotal = productSubtotal + vatProduct8 + shippingFee;

  const grandTotal = mode === 'plant' ? plantGrandTotal : productGrandTotal;

  const handleAddAddressSuccess = (data: ShippingAddressFormValues & { newId?: string }) => {
    const newAddr = {
      id: data.newId || Date.now().toString(),
      name: data.recipientName,
      recipient: data.recipientName,
      phone: data.recipientPhone,
      address: data.shippingAddress,
      detail: data.shippingAddress,
      isDefault: addresses.length === 0,
    };
    const updated = [newAddr, ...localAddresses];
    setLocalAddresses(updated);
    setUserSelectedAddressId(newAddr.id);
    if (typeof window !== 'undefined') {
      localStorage.setItem('user_addresses:v1', JSON.stringify(updated));
    }
    refetchProfile();
    toast.success(t('toastAddressAdded'));
  };

  const handleCheckoutSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!isLoggedIn) {
      toast.warning(t('toastLoginRequired'));
      window.location.href = `/${locale}/sign-in?reason=quick_purchase`;
      return;
    }

    if (mode === 'plant' && !agreedTerms) {
      toast.warning(t('toastAgreeTermsRequired'));
      return;
    }

    if (mode === 'product' && !selectedAddressId) {
      toast.warning(t('toastAddressRequired'));
      return;
    }

    setSubmitting(true);

    const selectedAddrObj = addresses.find((a) => a.id === selectedAddressId);

    try {
      const res: any = await createQuickOrderMutation.mutateAsync({
        mode,
        itemId: item?.id || '',
        quantity,
        carePackageId: mode === 'plant' ? selectedCareId : undefined,
        protectionPackageId: mode === 'plant' ? selectedProtectionId : undefined,
        recipientName: selectedAddrObj?.name || profile?.fullName || 'Khách hàng',
        recipientPhone: selectedAddrObj?.phone || profile?.mobileNumber || '',
        shippingAddress: deliveryType === 'shipping' ? (selectedAddrObj ? selectedAddrObj.address : 'Giao hàng tận nơi') : 'Nhận tại vườn',
        deliveryType,
      });

      const orderData = res?.data || res;
      if (!orderData?.id && !orderData?.code) {
        toast.error('Máy chủ không trả về thông tin đơn hàng hợp lệ.');
      } else {
        toast.success(t('toastOrderCreated'));
        onClose();

        if (onSuccessPayment) {
          onSuccessPayment(orderData);
        }
      }
    } catch (err: any) {
      const serverMsg = err?.response?.data?.message || err?.message || 'Không thể tạo đơn hàng. Vui lòng đăng nhập hoặc thử lại sau!';
      toast.error(typeof serverMsg === 'string' ? serverMsg : 'Không thể tạo đơn hàng. Vui lòng thử lại sau!');
    }
    setSubmitting(false);
  };

  return {
    quantity,
    setQuantity,
    carePackages,
    protectionPackages,
    selectedCareId,
    setSelectedCareId,
    selectedProtectionId,
    setSelectedProtectionId,
    agreedTerms,
    setAgreedTerms,
    addresses,
    selectedAddressId,
    setSelectedAddressId,
    deliveryType,
    setDeliveryType,
    shippingFee,
    isAddAddressModalOpen,
    setIsAddAddressModalOpen,
    submitting,
    stockCount,
    unitPrice,
    itemImage,
    selectedCareObj,
    selectedProtectionObj,
    treeBasePrice,
    vatTree,
    totalCareFee,
    vatCare,
    totalProtectionFee,
    vatProtection,
    productSubtotal,
    vatProduct8,
    grandTotal,
    handleAddAddressSuccess,
    handleCheckoutSubmit,
  };
}
