import { fetchApiClient } from '@/lib/ApiClient';
import type { OrderData } from '@/types/order';

export type CheckoutPayload = {
  recipientName?: string;
  customerName?: string;
  phoneNumber?: string;
  customerPhone?: string;
  customerEmail?: string;
  shippingAddress?: string;
  deliveryType?: 'shipping' | 'pickup' | string;
  paymentMethod?: 'sepay' | 'wallet' | 'cod' | 'online' | string;
  items: {
    productId: string;
    quantity: number;
  }[];
  notes?: string;
  note?: string;
  identityNumber?: string;
  legalName?: string;
  signatureData?: string;
  metadata?: Record<string, unknown>;
  [key: string]: unknown;
};

export type OrdersListResponse = {
  items: OrderData[];
  total?: number;
  page?: number;
  limit?: number;
};

export const ordersService = {
  async checkout(
    payload: CheckoutPayload,
  ): Promise<OrderData | { data: OrderData; [key: string]: unknown }> {
    return await fetchApiClient('/user/orders/checkout', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  async getMyOrders(
    params?: Record<string, string>,
  ): Promise<{ items: OrderData[]; total?: number; [key: string]: unknown }> {
    const query =
      params && Object.keys(params).length > 0 ? `?${new URLSearchParams(params).toString()}` : '';
    return await fetchApiClient(`/user/orders${query}`);
  },

  async getOrderDetail(orderId: string): Promise<OrderData> {
    const res = await fetchApiClient(`/user/orders/${orderId}`);
    return (res?.data || res) as OrderData;
  },

  async cancelOrder(
    orderId: string,
    reason?: string,
  ): Promise<{ success: boolean; message?: string; [key: string]: unknown }> {
    return await fetchApiClient(`/user/orders/${orderId}/cancel`, {
      method: 'PATCH',
      body: JSON.stringify({ reason }),
    });
  },
};
