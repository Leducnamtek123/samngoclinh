import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { settingsService } from '@/services/content.service';
import { ordersService } from '@/services/orders.service';

export type CreateOrderPayload = {
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
  metadata?: Record<string, unknown>;
  items: { productId: string; quantity: number }[];
};

export function useShippingFee() {
  return useQuery({
    queryKey: ['shippingFee'],
    queryFn: async () => {
      try {
        const res = await settingsService.getShippingFee();
        const val = res?.value ?? res?.fixedFee;
        if (val != null) {
          const parsed = Number(val);
          if (!isNaN(parsed) && parsed >= 0) {
            return parsed;
          }
        }
        return 30_000;
      } catch {
        return 30_000;
      }
    },
    staleTime: 1000 * 60 * 10,
  });
}

export function useCreateOrderMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: CreateOrderPayload) => await ordersService.checkout(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      queryClient.invalidateQueries({ queryKey: ['cart'] });
    },
  });
}
