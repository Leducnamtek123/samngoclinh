import { useMutation, useQueryClient } from '@tanstack/react-query';
import { ordersService } from '@/services/orders.service';

export function useCancelOrder() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (orderId: string) => await ordersService.cancelOrder(orderId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      queryClient.invalidateQueries({ queryKey: ['profile'] });
    },
  });
}
