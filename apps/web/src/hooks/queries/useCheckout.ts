import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { ordersService } from '@/services/orders.service';
import { settingsService } from '@/services/content.service';

export interface CreateOrderPayload {
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  deliveryType: 'shipping' | 'pickup';
  shippingAddress?: string;
  paymentMethod: 'online';
  note?: string;
  identityNumber?: string;
  legalName?: string;
  signatureData?: string;
  metadata?: Record<string, any>;
  items: { productId: string; quantity: number }[];
}

export function useShippingFee() {
  return useQuery({
    queryKey: ['shippingFee'],
    queryFn: async () => {
      try {
        const res = await settingsService.getShippingFee();
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
      return ordersService.checkout(payload as any);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      queryClient.invalidateQueries({ queryKey: ['cart'] });
    },
  });
}
