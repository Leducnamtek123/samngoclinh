'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
// @ts-expect-error react-dom type declaration
import { createPortal } from 'react-dom';
import { useTranslations } from 'next-intl';
import { toast } from 'sonner';
import { fetchApiClient } from '@/lib/ApiClient';
import { useProfileMe } from '@/hooks/queries/useProfile';
import { AddAddressModal } from '@/components/account/AddAddressModal';
import type { ShippingAddressFormValues } from '@/lib/validation/schemas';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { PlantPackageSelector } from './PlantPackageSelector';
import { AddressSelector } from './AddressSelector';

export type QuickPurchaseItem = {
  id: string;
  name: string;
  price: number;
  stock?: number;
  image?: string;
  images?: string[];
  imageUrl?: string;
  category?: string;
  code?: string;
  ageYear?: number;
};

type QuickPurchaseModalProps = {
  item: QuickPurchaseItem | null;
  mode: 'plant' | 'product';
  locale: string;
  isLoggedIn?: boolean;
  onClose: () => void;
  onSuccessPayment?: (orderData: any) => void;
};

// react-doctor-disable-next-line react-doctor/no-giant-component, react-doctor/prefer-useReducer
export const QuickPurchaseModal = ({
  item,
  mode,
  locale,
  isLoggedIn = false,
  onClose,
  onSuccessPayment,
  // react-doctor-disable-next-line react-doctor/prefer-useReducer
}: QuickPurchaseModalProps) => {
  const t = useTranslations('quickPurchase');
  const [quantity, setQuantity] = useState(1);
  const { data: profile, refetch: refetchProfile } = useProfileMe();

  // Backend packages list & selected state
  const [carePackagesList, setCarePackagesList] = useState<any[]>([]);
  const [protectionPackagesList, setProtectionPackagesList] = useState<any[]>([]);

  const [selectedCareId, setSelectedCareId] = useState<string>('');
  const [selectedProtectionId, setSelectedProtectionId] = useState<string>('');

  // Terms & Conditions checkboxes & accordions state
  // react-doctor-disable-next-line react-doctor/prefer-useReducer
  const [agreedTerms, setAgreedTerms] = useState(false);
  const [openTermsAccordion, setOpenTermsAccordion] = useState(false);
  const [openContractAccordion, setOpenContractAccordion] = useState(false);

  // Saved user addresses state for physical products
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

  // Processing state
  const [submitting, setSubmitting] = useState(false);

  // Lock body scroll while modal is open
  useEffect(() => {
    const origOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = origOverflow;
    };
  }, []);

  // Sync profile addresses if available
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

  useEffect(() => {
    fetchApiClient('/user/packages/care')
      .then((res) => {
        const items = res?.data?.items || res?.data || [];
        if (Array.isArray(items) && items.length > 0) {
          setCarePackagesList(items);
          setSelectedCareId(items[0].code || items[0].id);
        }
      })
      .catch((err) => {
        console.error('Failed to load care packages from backend:', err);
      });

    fetchApiClient('/user/packages/protection')
      .then((res) => {
        const items = res?.data?.items || res?.data || [];
        if (Array.isArray(items) && items.length > 0) {
          setProtectionPackagesList(items);
          setSelectedProtectionId(items[0].code || items[0].id);
        }
      })
      .catch((err) => {
        console.error('Failed to load protection packages from backend:', err);
      });
  }, []);

  if (!item) return null;

  const stockCount = item.stock || 139;
  const unitPrice = item.price || 0;
  const itemImage =
    item.image ||
    item.imageUrl ||
    (Array.isArray(item.images) && item.images[0]) ||
    '/assets/images/kon_tum_ginseng.png';

  const selectedCareObj =
    carePackagesList.find((c) => c.code === selectedCareId || c.id === selectedCareId) ||
    carePackagesList[0];
  const careUnitPrice = selectedCareObj ? Number(selectedCareObj.price || 0) : 0;

  const selectedProtectionObj =
    protectionPackagesList.find((p) => p.code === selectedProtectionId || p.id === selectedProtectionId) ||
    protectionPackagesList[0];
  const protectionUnitPrice = selectedProtectionObj ? Number(selectedProtectionObj.price || 0) : 0;

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

    const payload = {
      type: mode === 'plant' ? 'CULTIVATION_PLANT' : 'STORE_PRODUCT',
      items: [
        {
          id: item.id,
          name: item.name,
          price: item.price,
          quantity,
        },
      ],
      carePackageCode: mode === 'plant' ? selectedCareId : undefined,
      protectionPackageCode: mode === 'plant' ? selectedProtectionId : undefined,
      shippingAddress: selectedAddrObj
        ? `${selectedAddrObj.name} - ${selectedAddrObj.phone}: ${selectedAddrObj.address}`
        : undefined,
      totalAmount: grandTotal,
    };

    fetchApiClient('/user/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
      .then((res) => {
        const orderData = res?.data || {
          id: `ORD-${Date.now()}`,
          code: `DH${Math.floor(100000 + Math.random() * 900000)}`,
          totalAmount: grandTotal,
        };

        toast.success(t('toastOrderCreated'));
        onClose();

        if (onSuccessPayment) {
          onSuccessPayment(orderData);
        }
      })
      .catch(() => {
        const fallbackOrder = {
          id: `ORD-${Date.now()}`,
          code: `DH${Math.floor(100000 + Math.random() * 900000)}`,
          totalAmount: grandTotal,
        };
        toast.success(t('toastPaymentOpening'));
        onClose();
        if (onSuccessPayment) {
          onSuccessPayment(fallbackOrder);
        }
      })
      .finally(() => {
        setSubmitting(false);
      });
  };

  const modalContent = (
    <div data-lenis-prevent className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 transition-opacity duration-200 animate-in fade-in">
      <div data-lenis-prevent className="bg-white rounded-[20px] max-w-2xl w-full max-h-[min(88vh,820px)] flex flex-col overflow-hidden relative shadow-2xl transition-[opacity,transform] duration-200 animate-in zoom-in-95 border border-gray-100 my-auto">
        
        {/* Sticky Header */}
        <div className="flex-shrink-0 px-5 sm:px-7 py-4 border-b border-gray-100 flex items-center justify-between bg-white z-10 rounded-t-[20px] shadow-2xs">
          <div>
            <h3 className="text-base sm:text-lg font-extrabold text-gray-900 leading-tight">
              {mode === 'plant' ? t('badgePlant') : t('badgeProduct')}
            </h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 font-medium mt-0.5">
              {t('modalTitle')}
            </p>
          </div>
          <button
            type="button"
            aria-label={t('closeAriaLabel')}
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-500 flex items-center justify-center transition-colors font-bold cursor-pointer"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleCheckoutSubmit} className="flex-1 flex flex-col min-h-0">
          {/* Inner Scroll Content Area */}
          <div data-lenis-prevent className="flex-1 modal-content p-5 sm:p-7 space-y-6">
            {/* Product Header Row */}
            <div className="flex items-center gap-4 bg-gray-50/80 p-3.5 rounded-2xl border border-gray-200/80">
              <div className="relative w-16 h-16 rounded-xl bg-white p-1 border border-gray-200 flex-shrink-0 overflow-hidden">
                <Image src={itemImage} alt={item.name} fill sizes="64px" unoptimized className="object-contain" />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-bold text-gray-900 text-sm truncate">{item.name}</h4>
                <p className="text-xs font-black text-[#1C3F24]">{unitPrice.toLocaleString('vi-VN')} đ <span className="text-[10px] text-gray-400 font-normal">{t('perTree')}</span></p>
                <span className="text-[10px] text-gray-500 font-medium block">{t('availableStock', { count: stockCount })}</span>
              </div>
            </div>

            {/* Quantity Selector */}
            <div className="space-y-1.5">
              <label htmlFor="quick-purchase-quantity" className="text-xs font-bold text-gray-800 uppercase tracking-wider block">
                {t('quantityLabel')}
              </label>
              <div className="flex items-center gap-3">
                <div className="flex items-center border border-gray-300 rounded-xl p-1 bg-white">
                  <button
                    type="button"
                    aria-label={t('decreaseAriaLabel')}
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    className="w-8 h-8 rounded-lg bg-gray-100 text-gray-700 font-bold hover:bg-gray-200 flex items-center justify-center transition-colors text-sm cursor-pointer"
                  >
                    -
                  </button>
                  <Input
                    id="quick-purchase-quantity"
                    type="number"
                    aria-label={t('quantityAriaLabel')}
                    min={1}
                    max={stockCount}
                    value={quantity}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setQuantity(Math.max(1, Math.min(stockCount, Number(e.target.value) || 1)))}
                    className="w-16 text-center font-extrabold text-sm h-8"
                  />
                  <button
                    type="button"
                    aria-label={t('increaseAriaLabel')}
                    onClick={() => setQuantity((q) => Math.min(stockCount, q + 1))}
                    className="w-8 h-8 rounded-lg bg-gray-100 text-gray-700 font-bold hover:bg-gray-200 flex items-center justify-center transition-colors text-sm cursor-pointer"
                  >
                    +
                  </button>
                </div>
                <span className="text-xs text-gray-500 font-medium">{t('maxLimitNote', { count: stockCount })}</span>
              </div>
            </div>

            {/* Plant Mode Packages or Product Mode Address */}
            {mode === 'plant' ? (
              <PlantPackageSelector
                carePackagesList={carePackagesList}
                protectionPackagesList={protectionPackagesList}
                selectedCareId={selectedCareId}
                setSelectedCareId={setSelectedCareId}
                selectedProtectionId={selectedProtectionId}
                setSelectedProtectionId={setSelectedProtectionId}
              />
            ) : (
              <AddressSelector
                addresses={addresses}
                selectedAddressId={selectedAddressId}
                setSelectedAddressId={setSelectedAddressId}
                onOpenAddAddressModal={() => setIsAddAddressModalOpen(true)}
              />
            )}

            {/* Terms & Conditions (Plant Mode) */}
            {mode === 'plant' && (
              <div className="space-y-3 border-t border-gray-150 pt-5">
                <div
                  role="button"
                  tabIndex={0}
                  onClick={() => setAgreedTerms(!agreedTerms)}
                  onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && setAgreedTerms(!agreedTerms)}
                  className="flex items-start gap-2.5 cursor-pointer"
                >
                  <Checkbox
                    id="agreeTermsCheckbox"
                    checked={agreedTerms}
                    onCheckedChange={(checked: boolean | 'indeterminate') => setAgreedTerms(!!checked)}
                  />
                  <span className="text-xs text-gray-700 font-semibold leading-relaxed">
                    {t('agreeTermsText')}
                  </span>
                </div>

                {/* Accordions */}
                <div className="space-y-2 text-xs">
                  <div className="border border-gray-200 rounded-xl overflow-hidden">
                    <button
                      type="button"
                      onClick={() => setOpenTermsAccordion(!openTermsAccordion)}
                      className="w-full px-4 py-2.5 bg-gray-50 flex items-center justify-between font-bold text-gray-700 hover:bg-gray-100 transition-colors text-left cursor-pointer"
                    >
                      <span>{t('careTermsTitle')}</span>
                      <span>{openTermsAccordion ? '▲' : '▼'}</span>
                    </button>
                    {openTermsAccordion && (
                      <div className="p-4 text-[11px] text-gray-600 space-y-1.5 leading-relaxed bg-white border-t border-gray-200">
                        <p>{t('careTermsItem1')}</p>
                        <p>{t('careTermsItem2')}</p>
                        <p>{t('careTermsItem3')}</p>
                      </div>
                    )}
                  </div>

                  <div className="border border-gray-200 rounded-xl overflow-hidden">
                    <button
                      type="button"
                      onClick={() => setOpenContractAccordion(!openContractAccordion)}
                      className="w-full px-4 py-2.5 bg-gray-50 flex items-center justify-between font-bold text-gray-700 hover:bg-gray-100 transition-colors text-left cursor-pointer"
                    >
                      <span>{t('contractSampleTitle')}</span>
                      <span>{openContractAccordion ? '▲' : '▼'}</span>
                    </button>
                    {openContractAccordion && (
                      <div className="p-4 text-[11px] text-gray-600 space-y-2 leading-relaxed bg-white border-t border-gray-200 font-mono">
                        <p className="font-bold text-gray-900">{t('contractSampleLine1')}</p>
                        <p className="font-bold text-[#1C3F24]">{t('contractSampleLine2')}</p>
                        <p>{t('contractSampleLine3')}</p>
                        <p>{t('contractSampleLine4')}</p>
                        <p>{t('contractSampleLine5')}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Pricing Breakdown Summary */}
            <div className="bg-emerald-50/60 border border-emerald-200/80 rounded-2xl p-4 space-y-2.5 text-xs">
              <h4 className="font-extrabold text-[#1C3F24] text-xs uppercase tracking-wider border-b border-emerald-200/60 pb-2">
                {t('breakdownTitle')}
              </h4>

              {mode === 'plant' ? (
                <>
                  <div className="flex justify-between font-semibold text-gray-700">
                    <span>{t('plantPriceLabel', { quantity, price: unitPrice.toLocaleString('vi-VN') })}</span>
                    <span>{treeBasePrice.toLocaleString('vi-VN')} đ</span>
                  </div>
                  <div className="flex justify-between text-gray-500 text-[11px]">
                    <span>{t('vatTreeLabel')}</span>
                    <span>+{vatTree.toLocaleString('vi-VN')} đ</span>
                  </div>
                  <div className="flex justify-between font-semibold text-gray-700 pt-1 border-t border-emerald-100">
                    <span>{t('careFeeLabel', { name: selectedCareObj?.name || t('defaultPackage') })}</span>
                    <span>+{totalCareFee.toLocaleString('vi-VN')} đ</span>
                  </div>
                  <div className="flex justify-between text-gray-500 text-[11px]">
                    <span>{t('vatCareLabel')}</span>
                    <span>+{vatCare.toLocaleString('vi-VN')} đ</span>
                  </div>
                  <div className="flex justify-between font-semibold text-gray-700 pt-1 border-t border-emerald-100">
                    <span>{t('protectionFeeLabel', { name: selectedProtectionObj?.name || t('defaultPackage') })}</span>
                    <span>+{totalProtectionFee.toLocaleString('vi-VN')} đ</span>
                  </div>
                  <div className="flex justify-between text-gray-500 text-[11px]">
                    <span>{t('vatProtectionLabel')}</span>
                    <span>+{vatProtection.toLocaleString('vi-VN')} đ</span>
                  </div>
                </>
              ) : (
                <>
                  <div className="flex justify-between font-semibold text-gray-700">
                    <span>{t('subtotalLabel', { quantity })}</span>
                    <span>{productSubtotal.toLocaleString('vi-VN')} đ</span>
                  </div>
                  <div className="flex justify-between text-gray-500 text-[11px]">
                    <span>{t('vatProduct8Label')}</span>
                    <span>+{vatProduct8.toLocaleString('vi-VN')} đ</span>
                  </div>
                </>
              )}

              <div className="flex justify-between items-center text-sm font-black text-[#1C3F24] pt-2 border-t border-emerald-200">
                <span>{t('grandTotalLabel')}</span>
                <span className="text-base sm:text-lg text-emerald-900 font-extrabold">{grandTotal.toLocaleString('vi-VN')} VNĐ</span>
              </div>
            </div>
          </div>

          {/* Sticky Footer Submit Actions */}
          <div className="flex-shrink-0 px-5 sm:px-7 py-4 border-t border-gray-100 bg-white flex gap-3 z-10 rounded-b-[20px] shadow-[0_-4px_12px_rgba(0,0,0,0.03)]">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-3 border border-gray-300 hover:bg-gray-100 text-gray-700 font-bold rounded-xl text-xs transition-colors cursor-pointer"
            >
              {t('cancel')}
            </button>

            <button
              type="submit"
              disabled={submitting}
              className="flex-1 bg-[#1C3F24] hover:bg-emerald-900 active:bg-emerald-950 text-white font-extrabold py-3.5 rounded-xl text-xs transition-colors shadow-md shadow-emerald-900/20 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {submitting ? (
                <span>{t('submitInitializing')}</span>
              ) : (
                <span>{t('submitConfirm')}</span>
              )}
            </button>
          </div>
        </form>

        <AddAddressModal
          isOpen={isAddAddressModalOpen}
          onClose={() => setIsAddAddressModalOpen(false)}
          onSubmitSuccess={handleAddAddressSuccess}
        />
      </div>
    </div>
  );

  if (typeof window === 'undefined') return null;
  return createPortal(modalContent, document.body);
};

