import { useState, useCallback, useEffect } from 'react';
import type { OrderDetailData } from '@/components/orders/OrderDetailModal';
import { ordersService } from '@/services/orders.service';
import type { OrderData } from '@/types';

export type StatusCounts = {
  all: number;
  pending: number;
  pending_verification: number;
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
  const [userOrders, setUserOrders] = useState<OrderData[]>([]);
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
  const [selectedOrderForPayment, setSelectedOrderForPayment] = useState<OrderData | null>(null);

  const fetchOrders = useCallback(async () => {
    setOrdersLoading(true);
    setOrdersError(null);
    try {
      const queryParams: Record<string, string> = {
        page: String(page),
        perPage: String(perPage),
      };
      if (statusFilter && statusFilter !== 'all') {
        queryParams.status = statusFilter;
      }

      const res = await ordersService.getMyOrders(queryParams);

      const rawItems = res as { data?: { items?: OrderData[] } | OrderData[]; items?: OrderData[] };
      const list: OrderData[] = Array.isArray(rawItems?.data)
        ? rawItems.data
        : Array.isArray((rawItems?.data as { items?: OrderData[] })?.items)
          ? (rawItems.data as { items?: OrderData[] }).items || []
          : Array.isArray(rawItems?.items)
            ? rawItems.items
            : [];

      if (page === 1) {
        setUserOrders(list);
      } else {
        setUserOrders((prev) => {
          const existingIds = new Set(prev.map((o) => o.id || o.code));
          const newUnique = list.filter((o: OrderData) => !existingIds.has(o.id || o.code));
          return [...prev, ...newUnique];
        });
      }

      // Parse status counts metadata from API
      const rawCounts =
        (res?.metadata as { statusCounts?: Partial<StatusCounts> })?.statusCounts ||
        (res?.data as { statusCounts?: Partial<StatusCounts> })?.statusCounts ||
        (res as { statusCounts?: Partial<StatusCounts> })?.statusCounts;

      if (rawCounts) {
        setStatusCounts({
          all: Number(rawCounts.all ?? list.length),
          pending: Number(rawCounts.pending ?? 0),
          pending_verification: Number(rawCounts.pending_verification ?? 0),
          paid: Number(rawCounts.paid ?? 0),
          shipping: Number(rawCounts.shipping ?? 0),
          completed: Number(rawCounts.completed ?? 0),
          cancelled: Number(rawCounts.cancelled ?? 0),
        });
      } else if (page === 1 && statusFilter === 'all') {
        const counts: StatusCounts = {
          all: list.length,
          pending: 0,
          pending_verification: 0,
          paid: 0,
          shipping: 0,
          completed: 0,
          cancelled: 0,
        };
        for (const order of list) {
          const s = (order.status || '').toLowerCase();
          if (s === 'pending') {
            counts.pending++;
          } else if (s === 'pending_verification') {
            counts.pending_verification++;
          } else if (s === 'paid') {
            counts.paid++;
          } else if (s === 'shipping' || s === 'delivering' || s === 'shipped') {
            counts.shipping++;
          } else if (s === 'completed' || s === 'delivered') {
            counts.completed++;
          } else if (s === 'cancelled' || s === 'failed') {
            counts.cancelled++;
          }
        }
        setStatusCounts(counts);
      }

      // Parse pagination metadata from API
      const rawMeta =
        (res?.metadata as Partial<PaginationMeta>) ||
        (res?.data as { pagination?: Partial<PaginationMeta> })?.pagination ||
        (res as { pagination?: Partial<PaginationMeta> })?.pagination;

      if (rawMeta) {
        setPagination({
          page: Number(rawMeta.page ?? page),
          limit: Number(rawMeta.limit ?? perPage),
          total: Number(rawMeta.total ?? list.length),
          totalPages: Number(
            rawMeta.totalPages ?? (Math.ceil((rawMeta.total || list.length) / perPage) || 1),
          ),
        });
      } else {
        setPagination({
          page,
          limit: perPage,
          total: list.length,
          totalPages: Math.max(1, Math.ceil(list.length / perPage)),
        });
      }
    } catch (error: unknown) {
      const msg =
        error instanceof Error
          ? error.message
          : 'Không thể tải lịch sử đơn hàng. Vui lòng thử lại.';
      setOrdersError(msg);
      if (page === 1) {
        setUserOrders([]);
      }
    }
    setOrdersLoading(false);
  }, [page, perPage, statusFilter]);

  useEffect(() => {
    if (activeTab !== 'orders') {
      return;
    }
    // react-doctor-disable-next-line react-hooks-js/set-state-in-effect
    fetchOrders();
  }, [activeTab, fetchOrders]);

  const handleStatusFilterChange = (newStatus: string) => {
    setStatusFilter(newStatus);
    setPage(1);
  };

  const handleViewOrderDetail = async (order: OrderData | OrderDetailData) => {
    const orderId = order?.id || order?.code;
    if (!orderId) {
      setViewingOrderDetail(order as OrderDetailData);
      return;
    }
    setDetailLoading(true);
    try {
      const res = await ordersService.getOrderDetail(orderId);
      const detailData = ((res as { data?: OrderDetailData })?.data || res) as OrderDetailData;
      setViewingOrderDetail(detailData);
    } catch {
      // Fallback to list order object if detail endpoint fails
      setViewingOrderDetail(order as OrderDetailData);
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
