import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchApiClient } from '@/lib/ApiClient';
import type { OrderItem } from '@/types';

export function useOrderDetail(orderId: string | null) {
  return useQuery({
    queryKey: ['order', orderId],
    queryFn: async () => {
      if (!orderId) return null;
      const res = await fetchApiClient(`/user/orders/${orderId}`);
      return (res.data || res) as OrderItem;
    },
    enabled: Boolean(orderId),
  });
}

export function useCancelOrder() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (orderId: string) => {
      const res = await fetchApiClient(`/user/orders/${orderId}/cancel`, {
        method: 'PATCH',
      });
      return res.data || res;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      queryClient.invalidateQueries({ queryKey: ['profile'] });
    },
  });
}
