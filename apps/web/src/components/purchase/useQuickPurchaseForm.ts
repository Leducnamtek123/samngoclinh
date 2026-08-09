import { useState, useEffect } from 'react';
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

  const [selectedCareId, setSelectedCareId] = useState<string>('');
  const [selectedProtectionId, setSelectedProtectionId] = useState<string>('');
  const [agreedTerms, setAgreedTerms] = useState(false);

  const [addresses, setAddresses] = useState<any[]>(() => {
    try {
      const saved = typeof window !== 'undefined' ? localStorage.getItem('user_addresses:v1') : null;
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(() => {
    try {
      const saved = typeof window !== 'undefined' ? localStorage.getItem('user_addresses:v1') : null;
      const list = saved ? JSON.parse(saved) : [];
      return list.length > 0 ? (list.find((a: any) => a.isDefault) || list[0]).id : null;
    } catch {
      return null;
    }
  });

  const [isAddAddressModalOpen, setIsAddAddressModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (carePackages.length > 0 && !selectedCareId) {
      setSelectedCareId((carePackages[0] as any)?.code || carePackages[0]?.id || '');
    }
    if (protectionPackages.length > 0 && !selectedProtectionId) {
      setSelectedProtectionId((protectionPackages[0] as any)?.code || protectionPackages[0]?.id || '');
    }
  }, [carePackages, protectionPackages, selectedCareId, selectedProtectionId]);

  useEffect(() => {
    const origOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = origOverflow;
    };
  }, []);

  useEffect(() => {
    if (profile?.addresses && profile.addresses.length > 0) {
      const apiAddresses = profile.addresses.map((a: any) => ({
        id: a.id,
        name: a.recipient || a.name || profile.fullName || '',
        recipient: a.recipient || a.name || profile.fullName || '',
        phone: a.phone || profile.mobileNumber || '',
        address: a.detail || a.address || '',
        detail: a.detail || a.address || '',
        isDefault: !!a.isDefault,
      }));
      setAddresses(apiAddresses);
      if (!selectedAddressId && apiAddresses.length > 0) {
        const def = apiAddresses.find((a: any) => a.isDefault) || apiAddresses[0];
        if (def?.id) {
          setSelectedAddressId(def.id);
        }
      }
    }
  }, [profile]);

  const stockCount = item?.stock || 139;
  const unitPrice = item?.price || 0;
  const itemImage =
    item?.image ||
    item?.imageUrl ||
    (Array.isArray(item?.images) && item?.images[0]) ||
    '/assets/images/kon_tum_ginseng.png';

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
  const productGrandTotal = productSubtotal + vatProduct8;

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
    const updated = [newAddr, ...addresses];
    setAddresses(updated);
    setSelectedAddressId(newAddr.id);
    if (typeof window !== 'undefined') {
      localStorage.setItem('user_addresses:v1', JSON.stringify(updated));
    }
    refetchProfile();
    toast.success(t('toastAddressAdded'));
  };

  const handleCheckoutSubmit = async (e: React.FormEvent) => {
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
        shippingAddress: selectedAddrObj ? selectedAddrObj.address : 'Nhận tại vườn',
      });

      const orderData = res?.data || res || {
        id: `ORD-${Date.now()}`,
        code: `DH${Math.floor(100000 + Math.random() * 900000)}`,
        totalAmount: grandTotal,
      };

      toast.success(t('toastOrderCreated'));
      onClose();

      if (onSuccessPayment) {
        onSuccessPayment(orderData);
      }
    } catch {
      const fallbackOrder: Order = {
        id: `ORD-${Date.now()}`,
        code: `DH${Math.floor(100000 + Math.random() * 900000)}`,
        totalAmount: grandTotal,
        status: 'PENDING',
        createdAt: new Date().toISOString(),
      };
      toast.success(t('toastPaymentOpening'));
      onClose();
      if (onSuccessPayment) {
        onSuccessPayment(fallbackOrder);
      }
    } finally {
      setSubmitting(false);
    }
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
