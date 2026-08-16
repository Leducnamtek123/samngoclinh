import { useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchApiClient } from '@/lib/ApiClient';

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
