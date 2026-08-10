import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslations } from 'next-intl';
import { MapPin, QrCode, ArrowLeft, Truck, Store, Phone } from 'lucide-react';
import type { CartItem } from '@/utils/cart';
import { Form, FormTextarea } from '@/components/ui/form';
import { Button, ButtonLoading } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useProfileMe } from '@/hooks/queries/useProfile';
import { AddressSelector } from '@/components/address/AddressSelector';
import { AddressModal } from '@/components/address/AddressModal';
import {
  shippingAddressSchema,
  type ShippingAddressFormValues,
} from '@/lib/validation/schemas';

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
  onSubmit: (data?: (ShippingAddressFormValues & { deliveryType?: 'shipping' | 'pickup' }) | React.FormEvent) => void;
  onPrevStep: () => void;
};

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
  shippingFee = 30000,
  loading,
  onSubmit,
  onPrevStep,
}: CartStepShippingProps) => {
  const tShipping = useTranslations('cartStepShipping');
  const { data: profile, refetch: refetchProfile } = useProfileMe();

  const [localAddresses, setLocalAddresses] = useState<any[]>(() => {
    try {
      const saved = typeof window !== 'undefined' ? localStorage.getItem('user_addresses:v1') : null;
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const apiAddresses = (profile?.addresses || []).map((a: any) => ({
    id: a.id,
    name: a.recipient || a.name || profile?.fullName || '',
    recipient: a.recipient || a.name || profile?.fullName || '',
    phone: a.phone || profile?.mobileNumber || '',
    address: a.detail || a.address || '',
    detail: a.detail || a.address || '',
    isDefault: !!a.isDefault,
  }));

  const allAddresses = Array.from(
    new Map([...apiAddresses, ...localAddresses].map((a) => [a.id, a])).values()
  );

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedAddressId, setSelectedAddressId] = useState<string>('');

  const form = useForm<ShippingAddressFormValues>({
    resolver: zodResolver(shippingAddressSchema),
    defaultValues: {
      recipientName: recipientName || '',
      recipientPhone: recipientPhone || '',
      shippingAddress: shippingAddress || '',
      notes: notes || '',
    },
  });

  // Auto select default or first address when available
  useEffect(() => {
    if (allAddresses.length > 0) {
      let targetAddr = allAddresses.find((a: any) => a.id === selectedAddressId);
      if (!targetAddr) {
        targetAddr = allAddresses.find((a: any) => a.isDefault) || allAddresses[0];
      }

      if (targetAddr) {
        setSelectedAddressId(targetAddr.id);
        const name = targetAddr.recipient || targetAddr.name || profile?.fullName || '';
        const phone = targetAddr.phone || profile?.mobileNumber || '';
        const detail = targetAddr.detail || targetAddr.address || '';

        form.setValue('recipientName', name, { shouldValidate: true });
        form.setValue('recipientPhone', phone, { shouldValidate: true });
        form.setValue('shippingAddress', detail, { shouldValidate: true });

        setRecipientName(name);
        setRecipientPhone(phone);
        setShippingAddress(detail);
      }
    }
  }, [allAddresses.length, profile]);

  const handleSelectAddress = (addressId: string) => {
    setSelectedAddressId(addressId);
    const targetAddr = allAddresses.find((a: any) => a.id === addressId);
    if (targetAddr) {
      const name = targetAddr.recipient || targetAddr.name || profile?.fullName || '';
      const phone = targetAddr.phone || profile?.mobileNumber || '';
      const detail = targetAddr.detail || targetAddr.address || '';

      form.setValue('recipientName', name, { shouldValidate: true, shouldDirty: true });
      form.setValue('recipientPhone', phone, { shouldValidate: true, shouldDirty: true });
      form.setValue('shippingAddress', detail, { shouldValidate: true, shouldDirty: true });

      setRecipientName(name);
      setRecipientPhone(phone);
      setShippingAddress(detail);
    }
  };

  const handleValidSubmit = (data: ShippingAddressFormValues) => {
    setRecipientName(data.recipientName);
    setRecipientPhone(data.recipientPhone);
    setShippingAddress(data.shippingAddress);
    setNotes(data.notes || '');
    onSubmit({ ...data, deliveryType });
  };

  const handleModalAddSuccess = (data: ShippingAddressFormValues & { newId?: string }) => {
    const newAddr = {
      id: data.newId || Date.now().toString(),
      name: data.recipientName,
      recipient: data.recipientName,
      phone: data.recipientPhone,
      address: data.shippingAddress,
      detail: data.shippingAddress,
      isDefault: allAddresses.length === 0,
    };
    const updated = [newAddr, ...localAddresses];
    setLocalAddresses(updated);
    if (typeof window !== 'undefined') {
      localStorage.setItem('user_addresses:v1', JSON.stringify(updated));
    }

    form.setValue('recipientName', data.recipientName, { shouldValidate: true });
    form.setValue('recipientPhone', data.recipientPhone, { shouldValidate: true });
    form.setValue('shippingAddress', data.shippingAddress, { shouldValidate: true });

    setRecipientName(data.recipientName);
    setRecipientPhone(data.recipientPhone);
    setShippingAddress(data.shippingAddress);
    if (data.notes) {
      form.setValue('notes', data.notes);
      setNotes(data.notes);
    }

    setSelectedAddressId(newAddr.id);
    refetchProfile();
  };

  const calculatedShippingFee = deliveryType === 'shipping' ? shippingFee : 0;
  const calculatedGrandTotal = totalAmount + calculatedShippingFee;

  return (
    <>
      <Form
        form={form}
        onSubmit={form.handleSubmit(handleValidSubmit)}
        className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start"
      >
        {/* Shipping Section - LEFT COLUMN */}
        <Card className="lg:col-span-7 p-6 space-y-6 shadow-sm border-gray-200 dark:border-gray-800">
          
          {/* Delivery Type Option Selection */}
          <div className="space-y-3 border-b border-gray-100 dark:border-gray-800 pb-5">
            <h3 className="font-extrabold text-gray-900 dark:text-gray-100 text-base flex items-center gap-2">
              <MapPin className="w-5 h-5 text-emerald-700" />
              <span>{tShipping('deliveryMethodTitle')}</span>
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <button
                type="button"
                onClick={() => setDeliveryType?.('shipping')}
                className={`p-4 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between space-y-2 ${
                  deliveryType === 'shipping'
                    ? 'border-emerald-600 bg-emerald-50/60 dark:bg-emerald-950/40 ring-2 ring-emerald-500/20'
                    : 'border-gray-200 dark:border-gray-800 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-extrabold text-xs text-gray-900 dark:text-gray-100 flex items-center gap-1.5">
                    <Truck className="w-4 h-4 text-emerald-700 dark:text-emerald-400" />
                    <span>{tShipping('deliveryShipping')}</span>
                  </span>
                  <span className="text-xs font-black text-emerald-700 dark:text-emerald-400">
                    {shippingFee.toLocaleString('vi-VN')} đ
                  </span>
                </div>
                <p className="text-[11px] text-gray-500 font-medium leading-relaxed">
                  {tShipping('deliveryShippingDesc')}
                </p>
              </button>

              <button
                type="button"
                onClick={() => setDeliveryType?.('pickup')}
                className={`p-4 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between space-y-2 ${
                  deliveryType === 'pickup'
                    ? 'border-emerald-600 bg-emerald-50/60 dark:bg-emerald-950/40 ring-2 ring-emerald-500/20'
                    : 'border-gray-200 dark:border-gray-800 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-extrabold text-xs text-gray-900 dark:text-gray-100 flex items-center gap-1.5">
                    <Store className="w-4 h-4 text-emerald-700 dark:text-emerald-400" />
                    <span>{tShipping('deliveryPickup')}</span>
                  </span>
                  <span className="text-xs font-black text-emerald-700 dark:text-emerald-400">
                    {tShipping('free')}
                  </span>
                </div>
                <p className="text-[11px] text-gray-500 font-medium leading-relaxed">
                  {tShipping('deliveryPickupDesc')}
                </p>
              </button>
            </div>
          </div>

          {/* SHIPPING SELECTED -> RENDER ADDRESS SELECTOR */}
          {deliveryType === 'shipping' && (
            <AddressSelector
              addresses={allAddresses}
              selectedAddressId={selectedAddressId}
              setSelectedAddressId={handleSelectAddress}
              onOpenAddAddressModal={() => setIsAddModalOpen(true)}
            />
          )}

          {/* PICKUP SELECTED */}
          {deliveryType === 'pickup' && (
            <div className="bg-gray-50 border border-gray-200 rounded-2xl p-5 space-y-3 text-xs">
              <p className="font-bold text-gray-900">{tShipping('pickupAddressTitle')}</p>
              <p className="text-gray-600 leading-relaxed font-medium flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                <span>{tShipping('pickupLocation')}</span>
              </p>
              <p className="text-gray-600 font-medium flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                <span>{tShipping('pickupHotline')}</span>
              </p>
            </div>
          )}

          {/* Order Notes Field */}
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

        {/* Order Confirmation Summary - RIGHT COLUMN */}
        <Card className="lg:col-span-5 p-6 space-y-6 shadow-sm border-gray-200 dark:border-gray-800">
          <h3 className="font-extrabold text-gray-900 dark:text-gray-100 text-base border-b border-gray-100 dark:border-gray-800 pb-3">
            {tShipping('orderSummaryTitle')}
          </h3>

          <div className="divide-y divide-gray-100 dark:divide-gray-800 max-h-64 sm:max-h-72 overflow-y-auto pr-1">
            {items.map((item) => (
              <div
                key={item.id}
                className="py-2.5 flex items-center justify-between text-xs"
              >
                <div className="space-y-0.5">
                  <p className="font-bold text-gray-800 dark:text-gray-200 line-clamp-1">
                    {item.name}
                  </p>
                  <p className="text-[10px] text-gray-400 font-semibold">
                    {item.quantity} x {item.price.toLocaleString('vi-VN')} đ
                  </p>
                </div>
                <span className="font-bold text-emerald-800 dark:text-emerald-400">
                  {(item.price * item.quantity).toLocaleString('vi-VN')} đ
                </span>
              </div>
            ))}
          </div>

          <div className="border-t border-gray-100 dark:border-gray-800 pt-4 space-y-2 text-xs">
            <div className="flex justify-between font-semibold text-gray-600 dark:text-gray-400">
              <span>{tShipping('subtotal')}</span>
              <span>{totalAmount.toLocaleString('vi-VN')} đ</span>
            </div>
            <div className="flex justify-between font-semibold text-gray-600 dark:text-gray-400">
              <span>{tShipping('shippingFee')}</span>
              <span className="text-emerald-700 font-bold">
                {deliveryType === 'shipping' ? `${shippingFee.toLocaleString('vi-VN')} đ` : tShipping('free')}
              </span>
            </div>
            <div className="flex justify-between text-base font-black text-gray-900 dark:text-gray-100 pt-3 border-t border-gray-100 dark:border-gray-800">
              <span>{tShipping('totalPayment')}</span>
              <span className="text-emerald-800 dark:text-emerald-400">
                {calculatedGrandTotal.toLocaleString('vi-VN')} đ
              </span>
            </div>
          </div>

          <div className="space-y-3 pt-2">
            <ButtonLoading
              type="submit"
              isLoading={loading}
              variant="emerald"
              className="w-full flex items-center justify-center gap-2 font-bold cursor-pointer"
            >
              <QrCode className="w-4 h-4" />
              <span>{tShipping('continueToPayment')}</span>
            </ButtonLoading>

            <Button
              type="button"
              variant="secondary"
              onClick={onPrevStep}
              className="w-full flex items-center justify-center gap-2 font-bold cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>{tShipping('backToCart')}</span>
            </Button>
          </div>
        </Card>
      </Form>

      {/* Add Address Modal */}
      <AddressModal
        isOpen={isAddModalOpen}
        mode="add"
        onClose={() => setIsAddModalOpen(false)}
        onSubmitSuccess={handleModalAddSuccess}
      />
    </>
  );
};

