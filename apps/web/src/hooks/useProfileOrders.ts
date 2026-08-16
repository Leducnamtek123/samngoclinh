'use client';

import { useState, useEffect, useCallback } from 'react';
import { fetchApiClient } from '@/lib/ApiClient';
import type { OrderDetailData } from '@/components/orders/OrderDetailModal';

export type StatusCounts = {
  all: number;
  pending: number;
  pending_verification?: number;
  paid: number;
  shipping: number;
  completed: number;
  cancelled: number;
};

export type PaginationMeta = {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
};

export function useProfileOrders(activeTab: string) {
  const [userOrders, setUserOrders] = useState<any[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [ordersError, setOrdersError] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [page, setPage] = useState<number>(1);
  const [perPage] = useState<number>(10);
  
  const [statusCounts, setStatusCounts] = useState<StatusCounts>({
    all: 0,
    pending: 0,
    pending_verification: 0,
    paid: 0,
    shipping: 0,
    completed: 0,
    cancelled: 0,
  });

  const [pagination, setPagination] = useState<PaginationMeta>({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 1,
  });

  const [viewingOrderDetail, setViewingOrderDetail] = useState<OrderDetailData | null>(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [selectedOrderForPayment, setSelectedOrderForPayment] = useState<any>(null);

  const fetchOrders = useCallback(async () => {
    setOrdersLoading(true);
    setOrdersError(null);
    try {
      const params = new URLSearchParams();
      params.set('page', String(page));
      params.set('perPage', String(perPage));
      if (statusFilter && statusFilter !== 'all') {
        params.set('status', statusFilter);
      }

      const res = await fetchApiClient(`/user/orders?${params.toString()}`);
      
      const list = Array.isArray(res?.data)
        ? res.data
        : Array.isArray(res?.items)
          ? res.items
          : [];

      if (page === 1) {
        setUserOrders(list);
      } else {
        setUserOrders((prev) => {
          const existingIds = new Set(prev.map((o) => o.id || o.code));
          const newUnique = list.filter((o: any) => !existingIds.has(o.id || o.code));
          return [...prev, ...newUnique];
        });
      }

      // Parse status counts metadata from API
      const rawCounts = res?.metadata?.statusCounts || res?.statusCounts || res?._metadata?.statusCounts || res?.pagination?.statusCounts;
      if (rawCounts) {
        setStatusCounts({
          all: Number(rawCounts.all) || 0,
          pending: Number(rawCounts.pending) || 0,
          pending_verification: Number(rawCounts.pending_verification) || 0,
          paid: Number(rawCounts.paid) || 0,
          shipping: Number(rawCounts.shipping) || 0,
          completed: Number(rawCounts.completed) || 0,
          cancelled: Number(rawCounts.cancelled) || 0,
        });
      }

      // Parse pagination metadata from API
      const meta = res?.metadata || res?.pagination || res?._metadata?.pagination;
      if (meta) {
        setPagination({
          page: Number(meta.page) || page,
          limit: Number(meta.perPage || meta.limit) || perPage,
          total: Number(meta.totalItems || meta.total) || list.length,
          totalPages: Number(meta.totalPages) || Math.ceil((meta.totalItems || list.length) / perPage) || 1,
        });
      } else {
        setPagination({
          page,
          limit: perPage,
          total: list.length,
          totalPages: 1,
        });
      }
    } catch (err: any) {
      setOrdersError(err?.message || 'Không thể tải lịch sử đơn hàng. Vui lòng thử lại.');
      if (page === 1) setUserOrders([]);
    }
    setOrdersLoading(false);
  }, [page, perPage, statusFilter]);

  useEffect(() => {
    if (activeTab !== 'orders') return;
    // react-doctor-disable-next-line react-hooks-js/set-state-in-effect
    fetchOrders();
  }, [activeTab, fetchOrders]);

  const handleStatusFilterChange = (newStatus: string) => {
    setStatusFilter(newStatus);
    setPage(1);
  };

  const handleViewOrderDetail = async (order: any) => {
    const orderId = order?.id || order?.code;
    if (!orderId) {
      setViewingOrderDetail(order);
      return;
    }
    setDetailLoading(true);
    try {
      const res = await fetchApiClient(`/user/orders/${orderId}`);
      const detailData = res?.data || res;
      setViewingOrderDetail(detailData);
    } catch {
      // Fallback to list order object if detail endpoint fails
      setViewingOrderDetail(order);
    }
    setDetailLoading(false);
  };

  const hasMore = page < pagination.totalPages;
  const loadMore = useCallback(() => {
    if (!ordersLoading && hasMore) {
      setPage((prev) => prev + 1);
    }
  }, [ordersLoading, hasMore]);

  return {
    userOrders,
    ordersLoading,
    ordersError,
    statusFilter,
    setStatusFilter: handleStatusFilterChange,
    page,
    setPage,
    perPage,
    hasMore,
    loadMore,
    statusCounts,
    pagination,
    viewingOrderDetail,
    setViewingOrderDetail,
    detailLoading,
    selectedOrderForPayment,
    setSelectedOrderForPayment,
    refetchOrders: fetchOrders,
    handleViewOrderDetail,
  };
}
