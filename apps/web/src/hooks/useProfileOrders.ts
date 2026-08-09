'use client';

import { useState, useEffect, useCallback } from 'react';
import { fetchApiClient } from '@/lib/ApiClient';
import type { OrderDetailData } from '@/components/orders/OrderDetailModal';

export function useProfileOrders(activeTab: string) {
  const [userOrders, setUserOrders] = useState<any[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [viewingOrderDetail, setViewingOrderDetail] = useState<OrderDetailData | null>(null);
  const [selectedOrderForPayment, setSelectedOrderForPayment] = useState<any>(null);

  const fetchOrders = useCallback(async () => {
    setOrdersLoading(true);
    try {
      const res = await fetchApiClient('/user/orders');
      const list = Array.isArray(res?.data)
        ? res.data
        : Array.isArray(res?.data?.items)
          ? res.data.items
          : [];
      setUserOrders(list);
    } catch {
      // Fallback empty list
    } finally {
      setOrdersLoading(false);
    }
  }, []);

  useEffect(() => {
    if (activeTab !== 'orders') return;
    fetchOrders();
  }, [activeTab, fetchOrders]);

  return {
    userOrders,
    ordersLoading,
    viewingOrderDetail,
    setViewingOrderDetail,
    selectedOrderForPayment,
    setSelectedOrderForPayment,
    refetchOrders: fetchOrders,
  };
}
