'use client';

import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { toast } from 'sonner';
import { userService } from '@/services/user.service';
import type { AddressItem } from '@/types';

const ADDRESSES_STORAGE_KEY = 'user_addresses:v1';

export function useAddressBook(initialProfileAddresses?: AddressItem[]) {
  const t = useTranslations('profile');
  const tAddAddress = useTranslations('addAddressModal');
  const [localAddresses, setLocalAddresses] = useState<AddressItem[]>(() => {
    if (typeof window === 'undefined') {
      return [];
    }
    try {
      const saved = localStorage.getItem(ADDRESSES_STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch {
      // fallback
    }
    return [];
  });
  const [isAddAddressOpen, setIsAddAddressOpen] = useState(false);
  const [deletingAddressId, setDeletingAddressId] = useState<string | null>(null);
  const [isDeletingAddress, setIsDeletingAddress] = useState(false);

  const apiAddresses: AddressItem[] =
    initialProfileAddresses && Array.isArray(initialProfileAddresses)
      ? initialProfileAddresses.map((a: AddressItem) => ({
          id: a.id,
          name: a.recipient || a.name || a.label || t('addressTitle'),
          phone: a.phone || '',
          address: a.detail || a.address || '',
          detail: a.detail || a.address || '',
          isDefault: !!a.isDefault,
        }))
      : [];

  const addresses = [
    ...new Map([...apiAddresses, ...localAddresses].map((a) => [a.id, a])).values(),
  ];

  const saveToStorage = (items: AddressItem[]) => {
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(ADDRESSES_STORAGE_KEY, JSON.stringify(items));
      } catch {}
    }
  };

  const addAddress = async (data: {
    recipientName?: string;
    recipientPhone?: string;
    shippingAddress?: string;
    name?: string;
    phone?: string;
    address?: string;
    detail?: string;
    [key: string]: unknown;
  }) => {
    const recipientName = String(data.recipientName || data.name || t('addressTitle'));
    const recipientPhone = String(data.recipientPhone || data.phone || '');
    const shippingAddress = String(data.shippingAddress || data.address || data.detail || '');

    const newAddr: AddressItem = {
      id: Date.now().toString(),
      name: recipientName,
      phone: recipientPhone,
      address: shippingAddress,
      isDefault: addresses.length === 0,
    };
    try {
      const res = await userService.addAddress({
        detail: shippingAddress,
        recipient: recipientName,
        phone: recipientPhone,
        isDefault: addresses.length === 0,
      });
      const resId = (res as { id?: string } | undefined)?.id;
      if (resId) {
        newAddr.id = resId;
      }
    } catch {}
    const updated = [...addresses, newAddr];
    setLocalAddresses(updated);
    saveToStorage(updated);
    setIsAddAddressOpen(false);
    toast.success(tAddAddress('savedSuccess'));
  };

  const setDefaultAddress = (id: string) => {
    const updated = addresses.map((a) => ({ ...a, isDefault: a.id === id }));
    setLocalAddresses(updated);
    saveToStorage(updated);
  };

  const confirmDeleteAddress = async () => {
    if (!deletingAddressId || isDeletingAddress) {
      return;
    }
    setIsDeletingAddress(true);
    try {
      await userService.deleteAddress(deletingAddressId);
      const updated = addresses.filter((a) => a.id !== deletingAddressId);
      setLocalAddresses(updated);
      saveToStorage(updated);
      toast.success(tAddAddress('deleteSuccess'));
    } catch {
      toast.error(tAddAddress('deleteError'));
    }
    setIsDeletingAddress(false);
    setDeletingAddressId(null);
  };

  return {
    addresses,
    isAddAddressOpen,
    setIsAddAddressOpen,
    deletingAddressId,
    setDeletingAddressId,
    isDeletingAddress,
    addAddress,
    setDefaultAddress,
    confirmDeleteAddress,
  };
}
