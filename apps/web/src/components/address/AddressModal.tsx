'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { MapPin, User, X, Check, Loader2, Plus } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { FormAddressPicker } from '@/components/address/FormAddressPicker';
import { Button } from '@/components/ui/button';
import { Form, FormInput, FormPhoneInput } from '@/components/ui/form';
import { shippingAddressSchema } from '@/lib/validation/schemas';
import type { ShippingAddressFormValues } from '@/lib/validation/schemas';
import { userService } from '@/services/user.service';
import type { AddressItem } from '@/types';
import { AddressCardItem } from './AddressCardItem';

export type AddressModalProps = {
  isOpen: boolean;
  mode?: 'add' | 'select';
  onClose: () => void;
  // Selection mode props
  savedAddresses?: AddressItem[];
  selectedAddressId?: string | null;
  onSelectAddress?: (id: string) => void;
  onOpenAddModal?: () => void;
  // Add mode props
  onSubmitSuccess?: (
    data: (ShippingAddressFormValues & { newId?: string }) | Partial<AddressItem>,
  ) => void;
  initialValues?: Partial<ShippingAddressFormValues>;
};

const generateLocalId = () => Date.now().toString();

export function AddressModal({
  isOpen,
  mode = 'add',
  onClose,
  savedAddresses = [],
  selectedAddressId = null,
  onSelectAddress,
  onOpenAddModal,
  onSubmitSuccess,
  initialValues,
}: AddressModalProps) {
  const tAdd = useTranslations('addAddressModal');
  const tChange = useTranslations('changeAddressModal');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      return;
    }
    const origOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = origOverflow;
    };
  }, [isOpen]);

  const form = useForm<ShippingAddressFormValues>({
    resolver: zodResolver(shippingAddressSchema),
    defaultValues: {
      recipientName: initialValues?.recipientName || '',
      recipientPhone: initialValues?.recipientPhone || '',
      shippingAddress: initialValues?.shippingAddress || '',
      notes: initialValues?.notes || '',
    },
  });

  const handleFormSubmit = async (data: ShippingAddressFormValues) => {
    if (isSubmitting) {
      return;
    }
    setIsSubmitting(true);
    let createdId = generateLocalId();
    try {
      const res = (await userService.addAddress({
        detail: data.shippingAddress,
        recipient: data.recipientName,
        phone: data.recipientPhone,
        isDefault: false,
      })) as { data?: { id?: string }; id?: string } | undefined;
      if (res?.data?.id || res?.id) {
        createdId = res.data?.id || res.id || createdId;
      }
      toast.success(tAdd('savedSuccess'));
    } catch {
      // Local fallback
    }
    setIsSubmitting(false);
    onSubmitSuccess?.({ ...data, newId: createdId });
    onClose();
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div
      data-lenis-prevent
      className="animate-in fade-in fixed inset-0 z-[9999] flex items-center justify-center overflow-y-auto bg-black/60 p-3 backdrop-blur-xs transition-opacity duration-200 sm:p-4"
    >
      <div
        data-lenis-prevent
        className="flex max-h-[88vh] w-full max-w-lg shrink-0 flex-col overflow-hidden rounded-2xl border border-border bg-card bg-white text-card-foreground shadow-xl dark:bg-slate-900"
      >
        {/* Sticky Header */}
        <div className="z-10 flex shrink-0 items-center justify-between border-border bg-card bg-white px-6 py-4 dark:bg-slate-900">
          <div className="flex items-center gap-2.5">
            <div className="rounded-xl border border-emerald-200/60 bg-emerald-50 p-2 text-primary dark:border-emerald-800/60 dark:bg-emerald-950/60 dark:text-emerald-400">
              <MapPin className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-gray-900 dark:text-gray-100">
                {mode === 'add' ? tAdd('title') : tChange('title')}
              </h3>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {mode === 'add' ? tAdd('subtitle') : tChange('subtitle')}
              </p>
            </div>
          </div>
          <button
            type="button"
            aria-label={tChange('close')}
            onClick={onClose}
            className="cursor-pointer rounded-lg p-1.5 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-700 dark:hover:bg-slate-800 dark:hover:text-gray-200"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Modal Body */}
        {mode === 'select' ? (
          <>
            <div
              data-lenis-prevent
              className="min-h-0 flex-1 space-y-3 overflow-y-auto overscroll-contain p-6"
            >
              {savedAddresses.map((addr) => (
                <AddressCardItem
                  key={addr.id}
                  address={addr}
                  isSelected={selectedAddressId === addr.id}
                  defaultBadgeLabel={tChange('defaultBadge')}
                  onSelect={(id) => {
                    onSelectAddress?.(id);
                    onClose();
                  }}
                />
              ))}
            </div>

            {/* Selection Footer */}
            <div className="z-10 flex shrink-0 items-center justify-between rounded-b-[20px] border-t border-gray-100 bg-gray-50/50 p-4 dark:border-gray-800 dark:bg-slate-900/50">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => {
                  onClose();
                  onOpenAddModal?.();
                }}
                className="flex items-center gap-1.5 border-emerald-200 text-xs font-bold text-emerald-800 dark:border-emerald-800 dark:text-emerald-400"
              >
                <Plus className="h-4 w-4" />
                <span>{tChange('addNewAddress')}</span>
              </Button>

              <Button
                type="button"
                variant="secondary"
                size="sm"
                onClick={onClose}
                className="px-4 text-xs font-bold"
              >
                {tChange('close')}
              </Button>
            </div>
          </>
        ) : (
          /* Add Form Mode */
          <Form
            form={form}
            onSubmit={form.handleSubmit(handleFormSubmit)}
            className="flex min-h-0 flex-1 flex-col overflow-hidden"
          >
            <div
              data-lenis-prevent
              className="min-h-0 flex-1 space-y-4 overflow-y-auto overscroll-contain p-6"
            >
              <FormInput
                control={form.control}
                name="recipientName"
                label={tAdd('recipientNameLabel')}
                required
                placeholder={tAdd('recipientNamePlaceholder')}
                prefixIcon={<User className="h-4 w-4 text-primary" />}
              />

              <FormPhoneInput
                control={form.control}
                name="recipientPhone"
                label={tAdd('phoneLabel')}
                required
                placeholder={tAdd('phonePlaceholder')}
              />

              <FormAddressPicker
                control={form.control}
                name="shippingAddress"
                label={tAdd('addressLabel')}
                required
                enableMapPicker={true}
                placeholder={tAdd('addressPlaceholder')}
              />
            </div>

            {/* Add Mode Footer */}
            <div className="z-10 flex shrink-0 items-center justify-end gap-3 rounded-b-[20px] border-t border-gray-100 bg-gray-50/50 px-6 py-4 dark:border-gray-800 dark:bg-slate-900/50">
              <Button
                type="button"
                variant="secondary"
                disabled={isSubmitting}
                onClick={onClose}
                className="px-5 py-2 text-xs font-bold"
              >
                {tAdd('cancel')}
              </Button>
              <Button
                type="submit"
                variant="emerald"
                disabled={isSubmitting}
                className="flex items-center gap-1.5 px-6 py-2 text-xs font-bold"
              >
                {isSubmitting ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Check className="h-4 w-4" />
                )}
                <span>{tAdd('saveAndUse')}</span>
              </Button>
            </div>
          </Form>
        )}
      </div>
    </div>
  );
}
