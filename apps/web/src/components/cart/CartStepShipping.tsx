import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslations } from 'next-intl';
import { MapPin, User, QrCode, ArrowLeft, Plus, Truck, Store, Phone, Check } from 'lucide-react';
import type { CartItem } from '@/utils/cart';
import {
  Form,
  FormInput,
  FormPhoneInput,
  FormAddressPicker,
  FormTextarea,
} from '@/components/ui/form';
import { Button, ButtonLoading } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useProfileMe } from '@/hooks/queries/useProfile';
import { AddAddressModal } from '@/components/account/AddAddressModal';
import { ChangeAddressModal } from '@/components/cart/ChangeAddressModal';
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
  t: (key: string) => string;
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
  t,
  onSubmit,
  onPrevStep,
}: CartStepShippingProps) => {
  const tShipping = useTranslations('cartStepShipping');
  const { data: profile, refetch: refetchProfile } = useProfileMe();
  const savedAddresses = profile?.addresses || [];

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isChangeModalOpen, setIsChangeModalOpen] = useState(false);
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

  // Auto select default address when savedAddresses are available
  useEffect(() => {
    if (savedAddresses.length > 0) {
      let targetAddr = savedAddresses.find((a: any) => a.id === selectedAddressId);
      if (!targetAddr) {
        targetAddr = savedAddresses.find((a: any) => a.isDefault) || savedAddresses[0];
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
  }, [savedAddresses, profile]);

  const handleSelectAddress = (addressId: string) => {
    setSelectedAddressId(addressId);
    const targetAddr = savedAddresses.find((a: any) => a.id === addressId);
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

    if (data.newId) {
      setSelectedAddressId(data.newId);
    }
    refetchProfile();
  };

  const selectedAddress = savedAddresses.find((a: any) => a.id === selectedAddressId) || savedAddresses[0];
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

          {/* CASE 1: USER HAS SAVED ADDRESSES & SHIPPING IS SELECTED */}
          {deliveryType === 'shipping' && savedAddresses.length > 0 && selectedAddress ? (
            <div className="space-y-4">
              <div className="bg-emerald-50/60 dark:bg-emerald-950/30 border border-emerald-200/80 dark:border-emerald-800/80 rounded-2xl p-5 space-y-3 shadow-2xs">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-extrabold text-sm text-gray-900 dark:text-gray-100">
                      {selectedAddress.recipient || selectedAddress.name || recipientName}
                    </span>
                    <span className="text-xs font-semibold text-gray-500">
                      · {selectedAddress.phone || recipientPhone}
                    </span>
                    {selectedAddress.isDefault && (
                      <Badge
                        variant="secondary"
                        className="bg-emerald-100 text-emerald-800 dark:bg-emerald-900/60 dark:text-emerald-300 font-extrabold text-[10px] border-none flex items-center gap-1"
                      >
                        <Check className="w-3 h-3 text-emerald-700 dark:text-emerald-400" />
                        <span>{tShipping('defaultBadge')}</span>
                      </Badge>
                    )}
                  </div>
                </div>

                <p className="text-xs font-semibold text-gray-700 dark:text-gray-300 leading-relaxed">
                  {selectedAddress.detail || selectedAddress.address || shippingAddress}
                </p>

                <div className="flex items-center gap-3 pt-3 border-t border-emerald-200/50 dark:border-emerald-800/50 flex-wrap">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setIsChangeModalOpen(true)}
                    className="text-xs font-bold text-emerald-800 dark:text-emerald-400 border-emerald-300 dark:border-emerald-800 hover:bg-emerald-100/60 cursor-pointer"
                  >
                    {tShipping('changeAddress')}
                  </Button>

                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsAddModalOpen(true)}
                    className="text-xs font-bold text-emerald-800 dark:text-emerald-400 hover:bg-emerald-100/40 flex items-center gap-1 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>{tShipping('addNewAddress')}</span>
                  </Button>
                </div>
              </div>
            </div>
          ) : deliveryType === 'shipping' ? (
            /* CASE 2: SHIPPING SELECTED & NO SAVED ADDRESSES -> RENDER DIRECT ADD FORM */
            <div className="space-y-4">
              <FormInput
                control={form.control}
                name="recipientName"
                label={t('recipientName')}
                required
                prefixIcon={<User className="w-4 h-4 text-emerald-700" />}
              />

              <FormPhoneInput
                control={form.control}
                name="recipientPhone"
                label={t('phoneNumber')}
                required
              />

              <FormAddressPicker
                control={form.control}
                name="shippingAddress"
                label={tShipping('addressDetailLabel')}
                required
                enableMapPicker={true}
              />
            </div>
          ) : (
            /* CASE 3: PICKUP SELECTED */
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

      {/* Change Address Modal */}
      <ChangeAddressModal
        isOpen={isChangeModalOpen}
        onClose={() => setIsChangeModalOpen(false)}
        savedAddresses={savedAddresses}
        selectedAddressId={selectedAddressId}
        onSelectAddress={handleSelectAddress}
        onOpenAddModal={() => setIsAddModalOpen(true)}
      />

      {/* Add Address Modal */}
      <AddAddressModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSubmitSuccess={handleModalAddSuccess}
      />
    </>
  );
};

