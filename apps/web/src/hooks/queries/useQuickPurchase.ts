import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchApiClient } from '@/lib/ApiClient';

export type PackageOption = {
  id: string;
  name: string;
  price: number;
  description?: string;
  durationMonths?: number;
};

export type CreateQuickOrderPayload = {
  mode: 'plant' | 'product';
  itemId: string;
  quantity: number;
  carePackageId?: string;
  protectionPackageId?: string;
  recipientName: string;
  recipientPhone: string;
  shippingAddress: string;
  notes?: string;
  paymentMethod?: string;
};

export function usePlantPackages() {
  const careQuery = useQuery({
    queryKey: ['packages', 'care'],
    queryFn: async () => {
      const res = await fetchApiClient('/v1/shared/packages/care');
      return (res.data || res || []) as PackageOption[];
    },
  });

  const protectionQuery = useQuery({
    queryKey: ['packages', 'protection'],
    queryFn: async () => {
      const res = await fetchApiClient('/v1/shared/packages/protection');
      return (res.data || res || []) as PackageOption[];
    },
  });

  return {
    carePackages: careQuery.data || [],
    protectionPackages: protectionQuery.data || [],
    isLoading: careQuery.isLoading || protectionQuery.isLoading,
    isError: careQuery.isError || protectionQuery.isError,
  };
}

export function useCreateQuickOrder() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: CreateQuickOrderPayload) => {
      const endpoint = payload.mode === 'plant'
        ? '/v1/user/orders/quick-plant'
        : '/v1/user/orders/quick-product';

      const res = await fetchApiClient(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      return res.data || res;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      queryClient.invalidateQueries({ queryKey: ['profile'] });
    },
  });
}
