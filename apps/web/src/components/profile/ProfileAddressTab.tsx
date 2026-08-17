'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/button';
import { AddressModal } from '@/components/address/AddressModal';
import { EmptyState } from '@/components/common/EmptyState';
import { MapPin } from 'lucide-react';
import type { AddressItem } from '@/types';

export interface ProfileAddressTabProps {
  safeAddresses: AddressItem[];
  isAddAddressOpen: boolean;
  setIsAddAddressOpen: (open: boolean) => void;
  onAddAddress: (data: any) => void;
  onSetDefaultAddress: (id: string) => void;
  onDeleteAddress: (id: string) => void;
}

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
      <div className="flex justify-between items-center border-b border-gray-100 pb-3">
        <div>
          <h3 className="text-lg font-bold text-gray-900">{t('addressTitle')}</h3>
          <p className="text-xs text-gray-400 font-medium">{t('subtitle')}</p>
        </div>
        <button
          type="button"
          onClick={() => setIsAddAddressOpen(true)}
          className="bg-primary hover:bg-primary-hover text-white font-bold px-4 py-2 rounded-xl text-xs transition-colors shadow-xs cursor-pointer"
        >
          {tAddr('addNewAddress')}
        </button>
      </div>

      <AddressModal
        isOpen={isAddAddressOpen}
        mode="add"
        onClose={() => setIsAddAddressOpen(false)}
        onSubmitSuccess={onAddAddress}
      />

      {safeAddresses.length === 0 ? (
        <EmptyState
          title={t('noAddress')}
          description={tAddr('emptyState.description')}
          icon={MapPin}
          actionLabel={tAddr('emptyState.addAddress')}
          onAction={() => setIsAddAddressOpen(true)}
        />
      ) : (
        <div className="space-y-3">
          {safeAddresses.map((addr) => (
            <div key={addr.id} className="border border-gray-200 rounded-xl p-4 flex justify-between items-center bg-white shadow-sm">
              <div className="space-y-1 text-xs">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-gray-900 text-sm">{addr.name || addr.recipient}</span>
                  <span className="text-gray-500 font-medium">({addr.phone})</span>
                  {addr.isDefault && (
                    <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full">
                      {t('defaultAddress')}
                    </span>
                  )}
                </div>
                <p className="text-gray-600">{addr.address || addr.detail}</p>
              </div>

              <div className="flex gap-2 text-xs font-bold">
                {!addr.isDefault && (
                  <Button type="button" variant="link" size="sm" onClick={() => onSetDefaultAddress(addr.id)} className="text-primary h-auto p-0 text-xs font-bold">
                    {t('defaultAddress')}
                  </Button>
                )}
                <Button type="button" variant="link" size="sm" onClick={() => onDeleteAddress(addr.id)} className="text-destructive h-auto p-0 text-xs font-bold">
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
