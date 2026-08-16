'use client';

import { useState, useEffect } from 'react';
import { fetchApiClient } from '@/lib/ApiClient';
import { toast } from 'sonner';
import type { AddressItem } from '@/types';

const ADDRESSES_STORAGE_KEY = 'user_addresses:v1';

export function useAddressBook(initialProfileAddresses?: AddressItem[]) {
  const [addresses, setAddresses] = useState<AddressItem[]>(() => {
    if (typeof window === 'undefined') return [];
    try {
      const saved = localStorage.getItem(ADDRESSES_STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    return [];
  });
  const [isAddAddressOpen, setIsAddAddressOpen] = useState(false);
  const [deletingAddressId, setDeletingAddressId] = useState<string | null>(null);
  const [isDeletingAddress, setIsDeletingAddress] = useState(false);

  // Sync with profile addresses if provided
  useEffect(() => {
    if (initialProfileAddresses && Array.isArray(initialProfileAddresses) && initialProfileAddresses.length > 0) {
      const apiAddresses: AddressItem[] = initialProfileAddresses.map((a: AddressItem) => ({
        id: a.id,
        name: a.recipient || a.name || a.label || 'Địa chỉ nhận hàng',
        phone: a.phone || '',
        address: a.detail || a.address || '',
        detail: a.detail || a.address || '',
        isDefault: !!a.isDefault,
      }));
      setAddresses(apiAddresses);
    }
  }, [initialProfileAddresses]);

  const saveToStorage = (items: AddressItem[]) => {
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(ADDRESSES_STORAGE_KEY, JSON.stringify(items));
      } catch {}
    }
  };

  const addAddress = async (data: { recipientName: string; recipientPhone: string; shippingAddress: string }) => {
    const newAddr: AddressItem = {
      id: Date.now().toString(),
      name: data.recipientName,
      phone: data.recipientPhone,
      address: data.shippingAddress,
      isDefault: addresses.length === 0,
    };
    try {
      const res = await fetchApiClient('/v1/shared/user/address/add', {
        method: 'POST',
        body: JSON.stringify({
          detail: data.shippingAddress,
          recipient: data.recipientName,
          phone: data.recipientPhone,
          isDefault: addresses.length === 0,
        }),
      });
      if (res?.data?.id) {
        newAddr.id = res.data.id;
      }
    } catch {}
    const updated = [...addresses, newAddr];
    setAddresses(updated);
    saveToStorage(updated);
    setIsAddAddressOpen(false);
    toast.success('Thêm địa chỉ giao hàng mới thành công!');
  };

  const setDefaultAddress = (id: string) => {
    const updated = addresses.map((a) => ({ ...a, isDefault: a.id === id }));
    setAddresses(updated);
    saveToStorage(updated);
  };

  const confirmDeleteAddress = async () => {
    if (!deletingAddressId) return;
    setIsDeletingAddress(true);
    try {
      await fetchApiClient(`/v1/shared/user/address/delete/${deletingAddressId}`, {
        method: 'DELETE',
      });
      toast.success('Đã xóa địa chỉ giao hàng thành công!');
    } catch {
    } finally {
      const updated = addresses.filter((a) => a.id !== deletingAddressId);
      setAddresses(updated);
      saveToStorage(updated);
      setIsDeletingAddress(false);
      setDeletingAddressId(null);
    }
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
