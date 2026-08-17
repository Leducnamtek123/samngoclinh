import { zodResolver } from '@hookform/resolvers/zod';
import { MapPin, QrCode, ArrowLeft, Truck, Store, Phone } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import type { FormEvent } from 'react';
import { useForm } from 'react-hook-form';
import { AddressModal } from '@/components/address/AddressModal';
import { AddressSelector } from '@/components/address/AddressSelector';
import { CheckoutContractSigningCard } from '@/components/checkout/CheckoutContractSigningCard';
import { Button, ButtonLoading } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Form, FormTextarea } from '@/components/ui/form';
import { useProfileMe } from '@/hooks/queries/useProfile';
import { shippingAddressSchema } from '@/lib/validation/schemas';
import type { ShippingAddressFormValues } from '@/lib/validation/schemas';
import type { UserIdentityDocument } from '@/hooks/queries/useIdentityVerification';
import type { AddressItem, IdentityVerificationStatus } from '@/types';
import type { CartItem } from '@/utils/cart';
import { formatVNDPrice } from '@/utils/formatters';

type CartStepShippingProps = {
  items: CartItem[];
  totalAmount: number;
  recipientName: string;
  setRecipientName: (val: string) => void;
  recipientPhone: string;
  setRecipientPhone: (val: string) => void;
  shippingAddress: string;
  setShippingAddress: (val: string) => void;
  notes: string;
  setNotes: (val: string) => void;
  deliveryType?: 'shipping' | 'pickup';
  setDeliveryType?: (val: 'shipping' | 'pickup') => void;
  shippingFee?: number;
  loading: boolean;
  t?: (key: string) => string;
  onSubmit: (
    data?: (ShippingAddressFormValues & { deliveryType?: 'shipping' | 'pickup' }) | FormEvent,
  ) => void;
  onPrevStep: () => void;
  legalName?: string;
  setLegalName?: (val: string) => void;
  identityNumber?: string;
  setIdentityNumber?: (val: string) => void;
  signatureData?: string;
  setSignatureData?: (val: string) => void;
  isContractAgreed?: boolean;
  setIsContractAgreed?: (val: boolean) => void;
  kycStatusData?: IdentityVerificationStatus | UserIdentityDocument | null;
};

function DeliveryTypePicker({
  deliveryType,
  setDeliveryType,
  shippingFee,
  tShipping,
}: {
  deliveryType: 'shipping' | 'pickup';
  setDeliveryType?: (val: 'shipping' | 'pickup') => void;
  shippingFee: number;
  tShipping: (key: string) => string;
}) {
  return (
    <div className="space-y-3 border-b border-gray-100 pb-5 dark:border-gray-800">
      <h3 className="flex items-center gap-2 text-base font-extrabold text-gray-900 dark:text-gray-100">
        <MapPin className="h-5 w-5 text-emerald-700" />
        <span>{tShipping('deliveryMethodTitle')}</span>
      </h3>
      <div className="grid grid-cols-1 gap-3 pt-2 sm:grid-cols-2">
        <button
          type="button"
          onClick={() => setDeliveryType?.('shipping')}
          className={`flex cursor-pointer flex-col justify-between space-y-2 rounded-xl border p-4 text-left transition-[border-color,background-color,box-shadow] ${
            deliveryType === 'shipping'
              ? 'border-emerald-600 bg-emerald-50/60 ring-2 ring-emerald-500/20 dark:bg-emerald-950/40'
              : 'border-gray-200 hover:border-gray-300 dark:border-gray-800'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-1.5 text-xs font-extrabold text-gray-900 dark:text-gray-100">
              <Truck className="h-4 w-4 text-emerald-700 dark:text-emerald-400" />
              <span>{tShipping('deliveryShipping')}</span>
            </span>
            <span className="text-xs font-black text-emerald-700 dark:text-emerald-400">
              {formatVNDPrice(shippingFee)}
            </span>
          </div>
          <p className="text-[11px] leading-relaxed font-medium text-gray-500">
            {tShipping('deliveryShippingDesc')}
          </p>
        </button>

        <button
          type="button"
          onClick={() => setDeliveryType?.('pickup')}
          className={`flex cursor-pointer flex-col justify-between space-y-2 rounded-xl border p-4 text-left transition-[border-color,background-color,box-shadow] ${
            deliveryType === 'pickup'
              ? 'border-emerald-600 bg-emerald-50/60 ring-2 ring-emerald-500/20 dark:bg-emerald-950/40'
              : 'border-gray-200 hover:border-gray-300 dark:border-gray-800'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-1.5 text-xs font-extrabold text-gray-900 dark:text-gray-100">
              <Store className="h-4 w-4 text-emerald-700 dark:text-emerald-400" />
              <span>{tShipping('deliveryPickup')}</span>
            </span>
            <span className="text-xs font-black text-emerald-700 dark:text-emerald-400">
              {tShipping('free')}
            </span>
          </div>
          <p className="text-[11px] leading-relaxed font-medium text-gray-500">
            {tShipping('deliveryPickupDesc')}
          </p>
        </button>
      </div>
    </div>
  );
}

function PickupInfoCard({ tShipping }: { tShipping: (key: string) => string }) {
  return (
    <div className="space-y-3 rounded-2xl border border-gray-200 bg-gray-50 p-5 text-xs">
      <p className="font-bold text-gray-900">{tShipping('pickupAddressTitle')}</p>
      <p className="flex items-center gap-1.5 leading-relaxed font-medium text-gray-600">
        <MapPin className="h-3.5 w-3.5 shrink-0 text-emerald-700" />
        <span>{tShipping('pickupLocation')}</span>
      </p>
      <p className="flex items-center gap-1.5 font-medium text-gray-600">
        <Phone className="h-3.5 w-3.5 shrink-0 text-emerald-700" />
        <span>{tShipping('pickupHotline')}</span>
      </p>
    </div>
  );
}

function CartShippingOrderSummary({
  items,
  totalAmount,
  deliveryType,
  shippingFee,
  calculatedGrandTotal,
  loading,
  onPrevStep,
  tShipping,
}: {
  items: CartItem[];
  totalAmount: number;
  deliveryType: 'shipping' | 'pickup';
  shippingFee: number;
  calculatedGrandTotal: number;
  loading: boolean;
  onPrevStep: () => void;
  tShipping: (key: string) => string;
}) {
  return (
    <Card className="space-y-6 border-gray-200 p-6 shadow-sm lg:col-span-5 dark:border-gray-800">
      <h3 className="border-b border-gray-100 pb-3 text-base font-extrabold text-gray-900 dark:border-gray-800 dark:text-gray-100">
        {tShipping('orderSummaryTitle')}
      </h3>

      <div className="max-h-64 divide-y divide-gray-100 overflow-y-auto pr-1 sm:max-h-72 dark:divide-gray-800">
        {items.map((item) => (
          <div key={item.id} className="flex items-center justify-between py-2.5 text-xs">
            <div className="space-y-0.5">
              <p className="line-clamp-1 font-bold text-gray-800 dark:text-gray-200">{item.name}</p>
              <p className="text-[10px] font-semibold text-gray-400">
                {item.quantity} x {formatVNDPrice(item.price)}
              </p>
            </div>
            <span className="font-bold text-emerald-800 dark:text-emerald-400">
              {formatVNDPrice(item.price * item.quantity)}
            </span>
          </div>
        ))}
      </div>

      <div className="space-y-2 border-t border-gray-100 pt-4 text-xs dark:border-gray-800">
        <div className="flex justify-between font-semibold text-gray-600 dark:text-gray-400">
          <span>{tShipping('subtotal')}</span>
          <span>{formatVNDPrice(totalAmount)}</span>
        </div>
        <div className="flex justify-between font-semibold text-gray-600 dark:text-gray-400">
          <span>{tShipping('shippingFee')}</span>
          <span className="font-bold text-emerald-700">
            {deliveryType === 'shipping' ? formatVNDPrice(shippingFee) : tShipping('free')}
          </span>
        </div>
        <div className="flex justify-between border-t border-gray-100 pt-3 text-base font-black text-gray-900 dark:border-gray-800 dark:text-gray-100">
          <span>{tShipping('totalPayment')}</span>
          <span className="text-emerald-800 dark:text-emerald-400">
            {formatVNDPrice(calculatedGrandTotal)}
          </span>
        </div>
      </div>

      <div className="space-y-3 pt-2">
        <ButtonLoading
          type="submit"
          isLoading={loading}
          variant="emerald"
          className="flex w-full cursor-pointer items-center justify-center gap-2 font-bold"
        >
          <QrCode className="h-4 w-4" />
          <span>{tShipping('continueToPayment')}</span>
        </ButtonLoading>

        <Button
          type="button"
          variant="secondary"
          onClick={onPrevStep}
          className="flex w-full cursor-pointer items-center justify-center gap-2 font-bold"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>{tShipping('backToCart')}</span>
        </Button>
      </div>
    </Card>
  );
}

export const CartStepShipping = ({
  items,
  totalAmount,
  recipientName,
  setRecipientName,
  recipientPhone,
  setRecipientPhone,
  shippingAddress,
  setShippingAddress,
  notes,
  setNotes,
  deliveryType = 'shipping',
  setDeliveryType,
  shippingFee = 30_000,
  loading,
  onSubmit,
  onPrevStep,
  legalName,
  setLegalName,
  identityNumber,
  setIdentityNumber,
  signatureData,
  setSignatureData,
  isContractAgreed,
  setIsContractAgreed,
  kycStatusData,
}: CartStepShippingProps) => {
  const tShipping = useTranslations('cartStepShipping');
  const { data: profile, refetch: refetchProfile } = useProfileMe();

  const [localAddresses, setLocalAddresses] = useState<AddressItem[]>(() => {
    try {
      const saved =
        typeof window === 'undefined' ? null : localStorage.getItem('user_addresses:v1');
      return saved ? (JSON.parse(saved) as AddressItem[]) : [];
    } catch {
      return [];
    }
  });

  const apiAddresses: AddressItem[] = (profile?.addresses || []).map(
    (a: AddressItem | Record<string, unknown>) => ({
      id: String(a.id || ''),
      name: String(a.recipient || a.name || profile?.fullName || ''),
      recipient: String(a.recipient || a.name || profile?.fullName || ''),
      phone: String(a.phone || profile?.mobileNumber || ''),
      address: String(a.detail || a.address || ''),
      detail: String(a.detail || a.address || ''),
      isDefault: !!a.isDefault,
    }),
  );
  const allAddresses = [
    ...new Map([...apiAddresses, ...localAddresses].map((a) => [a.id, a])).values(),
  ];

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [userSelectedAddressId, setUserSelectedAddressId] = useState<string | null>(null);
  const defaultAddr = allAddresses.find((a) => a.isDefault) || allAddresses[0];
  const selectedAddressId = userSelectedAddressId ?? defaultAddr?.id ?? '';

  const form = useForm<ShippingAddressFormValues>({
    resolver: zodResolver(shippingAddressSchema),
    defaultValues: {
      recipientName:
        recipientName || defaultAddr?.recipient || defaultAddr?.name || profile?.fullName || '',
      recipientPhone: recipientPhone || defaultAddr?.phone || profile?.mobileNumber || '',
      shippingAddress: shippingAddress || defaultAddr?.detail || defaultAddr?.address || '',
      notes: notes || '',
    },
  });

  const handleSelectAddress = (id: string) => {
    setUserSelectedAddressId(id);
    const chosen = allAddresses.find((a) => a.id === id);
    if (chosen) {
      setRecipientName(chosen.recipient || chosen.name || '');
      setRecipientPhone(chosen.phone || '');
      setShippingAddress(chosen.detail || chosen.address || '');
      form.setValue('recipientName', chosen.recipient || chosen.name || '');
      form.setValue('recipientPhone', chosen.phone || '');
      form.setValue('shippingAddress', chosen.detail || chosen.address || '');
    }
  };

  const handleModalAddSuccess = (
    data: (ShippingAddressFormValues & { newId?: string }) | Partial<AddressItem>,
  ) => {
    const newAddr: AddressItem = {
      id:
        (data as AddressItem).id ||
        ('newId' in data ? data.newId : undefined) ||
        Date.now().toString(),
      name: (data as AddressItem).name || (data as ShippingAddressFormValues).recipientName || '',
      recipient:
        (data as AddressItem).recipient || (data as ShippingAddressFormValues).recipientName || '',
      phone: (data as AddressItem).phone || (data as ShippingAddressFormValues).recipientPhone || '',
      address:
        (data as AddressItem).address || (data as ShippingAddressFormValues).shippingAddress || '',
      detail:
        (data as AddressItem).detail || (data as ShippingAddressFormValues).shippingAddress || '',
      isDefault: (data as AddressItem).isDefault ?? (localAddresses.length === 0),
    };
    const updated = [newAddr, ...localAddresses];
    setLocalAddresses(updated);
    try {
      localStorage.setItem('user_addresses:v1', JSON.stringify(updated));
    } catch {
      // Ignore
    }
    setUserSelectedAddressId(newAddr.id);
    setRecipientName(newAddr.name || '');
    setRecipientPhone(newAddr.phone || '');
    setShippingAddress(newAddr.address || '');
    form.setValue('recipientName', newAddr.name || '');
    form.setValue('recipientPhone', newAddr.phone || '');
    form.setValue('shippingAddress', newAddr.address || '');
    setIsAddModalOpen(false);
    refetchProfile();
  };

  const handleFormSubmit = (data: ShippingAddressFormValues) => {
    setRecipientName(data.recipientName);
    setRecipientPhone(data.recipientPhone);
    setShippingAddress(data.shippingAddress);
    setNotes(data.notes || '');
    onSubmit({ ...data, deliveryType });
  };

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
  const totalPlants = items
    .filter(
      (it) =>
        it.category === 'plant' ||
        it.category === 'tree' ||
        it.category === 'package' ||
        it.name?.toLowerCase().includes('cây sâm') ||
        it.name?.toLowerCase().includes('gói trồng') ||
        it.name?.toLowerCase().includes('vườn sâm') ||
        it.name?.toLowerCase().includes('gói chăm sóc'),
    )
    .reduce((sum, it) => sum + (it.quantity || 1), 0);

  const calculatedGrandTotal = totalAmount + (deliveryType === 'shipping' ? shippingFee : 0);

  return (
    <>
      <Form
        form={form}
        onSubmit={form.handleSubmit(handleFormSubmit)}
        className="grid grid-cols-1 items-start gap-8 lg:grid-cols-12"
      >
        <Card className="space-y-6 border-gray-200 p-6 shadow-sm lg:col-span-7 dark:border-gray-800">
          <DeliveryTypePicker
            deliveryType={deliveryType}
            setDeliveryType={setDeliveryType}
            shippingFee={shippingFee}
            tShipping={tShipping}
          />

          {deliveryType === 'shipping' && (
            <AddressSelector
              addresses={allAddresses}
              selectedAddressId={selectedAddressId}
              setSelectedAddressId={handleSelectAddress}
              onOpenAddAddressModal={() => {
                setIsAddModalOpen(true);
              }}
            />
          )}

          {deliveryType === 'pickup' && <PickupInfoCard tShipping={tShipping} />}

          {hasTrees && (
            <CheckoutContractSigningCard
              profile={profile}
              kycStatusData={kycStatusData}
              legalName={legalName || recipientName || profile?.fullName || ''}
              setLegalName={setLegalName || (() => {})}
              identityNumber={identityNumber || ''}
              setIdentityNumber={setIdentityNumber || (() => {})}
              signatureData={signatureData || ''}
              setSignatureData={setSignatureData || (() => {})}
              isAgreed={Boolean(isContractAgreed)}
              setIsAgreed={setIsContractAgreed || (() => {})}
              totalPlants={totalPlants || 1}
              totalAmount={totalAmount}
            />
          )}

          <FormTextarea
            control={form.control}
            name="notes"
            label={tShipping('orderNotesLabel')}
            placeholder={tShipping('orderNotesPlaceholder')}
            rows={3}
            characterCounter
            maxLength={200}
          />
        </Card>

        <CartShippingOrderSummary
          items={items}
          totalAmount={totalAmount}
          deliveryType={deliveryType}
          shippingFee={shippingFee}
          calculatedGrandTotal={calculatedGrandTotal}
          loading={loading}
          onPrevStep={onPrevStep}
          tShipping={tShipping}
        />
      </Form>

      <AddressModal
        isOpen={isAddModalOpen}
        mode="add"
        onClose={() => {
          setIsAddModalOpen(false);
        }}
        onSubmitSuccess={handleModalAddSuccess}
      />
    </>
  );
};
