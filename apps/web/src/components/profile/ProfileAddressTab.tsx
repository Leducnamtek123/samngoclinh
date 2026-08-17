'use client';

import { MapPin } from 'lucide-react';
import { useTranslations } from 'next-intl';
import React from 'react';
import { AddressModal } from '@/components/address/AddressModal';
import { EmptyState } from '@/components/common/EmptyState';
import { Button } from '@/components/ui/button';
import type { AddressItem } from '@/types';

export type ProfileAddressTabProps = {
  safeAddresses: AddressItem[];
  isAddAddressOpen: boolean;
  setIsAddAddressOpen: (open: boolean) => void;
  onAddAddress: (
    data:
      | ({
          recipientName: string;
          recipientPhone: string;
          shippingAddress: string;
          notes?: string;
        } & {
          newId?: string;
        })
      | Partial<AddressItem>,
  ) => void;
  onSetDefaultAddress: (id: string) => void;
  onDeleteAddress: (id: string) => void;
};

export const ProfileAddressTab: React.FC<ProfileAddressTabProps> = ({
  safeAddresses,
  isAddAddressOpen,
  setIsAddAddressOpen,
  onAddAddress,
  onSetDefaultAddress,
  onDeleteAddress,
}) => {
  const t = useTranslations('profile');
  const tAddr = useTranslations('addressSelector');
  const tActions = useTranslations('actions');

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between border-b border-gray-100 pb-3">
        <div>
          <h3 className="text-lg font-bold text-gray-900">{t('addressTitle')}</h3>
          <p className="text-xs font-medium text-gray-400">{t('subtitle')}</p>
        </div>
        <button
          type="button"
          onClick={() => {
            setIsAddAddressOpen(true);
          }}
          className="cursor-pointer rounded-xl bg-primary px-4 py-2 text-xs font-bold text-white shadow-xs transition-colors hover:bg-primary-hover"
        >
          {tAddr('addNewAddress')}
        </button>
      </div>

      <AddressModal
        isOpen={isAddAddressOpen}
        mode="add"
        onClose={() => {
          setIsAddAddressOpen(false);
        }}
        onSubmitSuccess={onAddAddress}
      />

      {safeAddresses.length === 0 ? (
        <EmptyState
          title={t('noAddress')}
          description={tAddr('emptyState.description')}
          icon={MapPin}
          actionLabel={tAddr('emptyState.addAddress')}
          onAction={() => {
            setIsAddAddressOpen(true);
          }}
        />
      ) : (
        <div className="space-y-3">
          {safeAddresses.map((addr) => (
            <div
              key={addr.id}
              className="flex items-center justify-between rounded-xl border border-gray-200 bg-white p-4 shadow-sm"
            >
              <div className="space-y-1 text-xs">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-gray-900">
                    {addr.name || addr.recipient}
                  </span>
                  <span className="font-medium text-gray-500">({addr.phone})</span>
                  {addr.isDefault && (
                    <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-800">
                      {t('defaultAddress')}
                    </span>
                  )}
                </div>
                <p className="text-gray-600">{addr.address || addr.detail}</p>
              </div>

              <div className="flex gap-2 text-xs font-bold">
                {!addr.isDefault && (
                  <Button
                    type="button"
                    variant="link"
                    size="sm"
                    onClick={() => {
                      onSetDefaultAddress(addr.id);
                    }}
                    className="h-auto p-0 text-xs font-bold text-primary"
                  >
                    {t('defaultAddress')}
                  </Button>
                )}
                <Button
                  type="button"
                  variant="link"
                  size="sm"
                  onClick={() => {
                    onDeleteAddress(addr.id);
                  }}
                  className="h-auto p-0 text-xs font-bold text-destructive"
                >
                  {tActions('delete')}
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
