'use client';

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslations } from 'next-intl';
import { MapPin, User, X, Check, Loader2, Plus } from 'lucide-react';
import {
  Form,
  FormInput,
  FormPhoneInput,
} from '@/components/ui/form';
import { FormAddressPicker } from '@/components/address/FormAddressPicker';
import { Button } from '@/components/ui/button';
import { fetchApiClient } from '@/lib/ApiClient';
import { toast } from 'sonner';
import {
  shippingAddressSchema,
  type ShippingAddressFormValues,
} from '@/lib/validation/schemas';
import { AddressCardItem } from './AddressCardItem';
import type { AddressItem } from '@/types';

export interface AddressModalProps {
  isOpen: boolean;
  mode?: 'add' | 'select';
  onClose: () => void;
  // Selection mode props
  savedAddresses?: AddressItem[];
  selectedAddressId?: string | null;
  onSelectAddress?: (id: string) => void;
  onOpenAddModal?: () => void;
  // Add mode props
  onSubmitSuccess?: (data: ShippingAddressFormValues & { newId?: string }) => void;
  initialValues?: Partial<ShippingAddressFormValues>;
}

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
    if (!isOpen) return;
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
    setIsSubmitting(true);
    let createdId = Date.now().toString();
    try {
      const res: any = await fetchApiClient('/v1/shared/user/address/add', {
        method: 'POST',
        body: JSON.stringify({
          detail: data.shippingAddress,
          recipient: data.recipientName,
          phone: data.recipientPhone,
          isDefault: false,
        }),
      });
      if (res?.data?.id) {
        createdId = res.data.id;
      }
      toast.success(tAdd('savedSuccess'));
    } catch {
      // Local fallback
    } finally {
      setIsSubmitting(false);
      onSubmitSuccess?.({ ...data, newId: createdId });
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div data-lenis-prevent className="fixed inset-0 z-[9999] flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200 overflow-y-auto">
      <div data-lenis-prevent className="bg-white dark:bg-slate-900 bg-card text-card-foreground border border-border w-full max-w-lg rounded-2xl shadow-xl overflow-hidden flex flex-col max-h-[88vh] shrink-0">
        {/* Sticky Header */}
        <div className="px-6 py-4 border-b border-border flex items-center justify-between bg-white dark:bg-slate-900 bg-card z-10 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-emerald-50 dark:bg-emerald-950/60 text-primary dark:text-emerald-400 rounded-xl border border-emerald-200/60 dark:border-emerald-800/60">
              <MapPin className="w-5 h-5" />
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
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-800 text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        {mode === 'select' ? (
          <>
            <div data-lenis-prevent className="p-6 space-y-3 flex-1 overflow-y-auto overscroll-contain min-h-0">
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
            <div className="p-4 border-t border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-slate-900/50 flex items-center justify-between z-10 rounded-b-[20px] shrink-0">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => {
                  onClose();
                  onOpenAddModal?.();
                }}
                className="text-xs font-bold text-emerald-800 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800 flex items-center gap-1.5"
              >
                <Plus className="w-4 h-4" />
                <span>{tChange('addNewAddress')}</span>
              </Button>

              <Button
                type="button"
                variant="secondary"
                size="sm"
                onClick={onClose}
                className="text-xs font-bold px-4"
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
            className="flex-1 flex flex-col min-h-0 overflow-hidden"
          >
            <div data-lenis-prevent className="p-6 space-y-4 flex-1 overflow-y-auto overscroll-contain min-h-0">
              <FormInput
                control={form.control}
                name="recipientName"
                label={tAdd('recipientNameLabel')}
                required
                placeholder={tAdd('recipientNamePlaceholder')}
                prefixIcon={<User className="w-4 h-4 text-primary" />}
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
            <div className="px-6 py-4 flex items-center justify-end gap-3 border-t border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-slate-900/50 shrink-0 z-10 rounded-b-[20px]">
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
                className="px-6 py-2 text-xs font-bold flex items-center gap-1.5"
              >
                {isSubmitting ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Check className="w-4 h-4" />
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
