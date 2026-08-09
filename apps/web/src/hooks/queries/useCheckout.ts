import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { fetchApiClient } from '@/lib/ApiClient';

export interface CreateOrderPayload {
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  deliveryType: 'shipping' | 'pickup';
  shippingAddress?: string;
  paymentMethod: 'online';
  note?: string;
  items: { productId: string; quantity: number }[];
}

export function useShippingFee() {
  return useQuery({
    queryKey: ['shippingFee'],
    queryFn: async () => {
      try {
        const res = await fetchApiClient('/settings/shipping_fee');
        const val = res?.data?.value || res?.value;
        if (val) {
          const parsed = parseInt(val, 10);
          if (!isNaN(parsed)) return parsed;
        }
        return 30000;
      } catch {
        return 30000;
      }
    },
    staleTime: 1000 * 60 * 10,
  });
}

export function useCreateOrderMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: CreateOrderPayload) => {
      const res = await fetchApiClient('/user/orders/checkout', {
        method: 'POST',
        body: JSON.stringify(payload),
      });
      return res?.data || res;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      queryClient.invalidateQueries({ queryKey: ['cart'] });
    },
  });
}
