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
  deliveryType?: 'shipping' | 'pickup';
  notes?: string;
  paymentMethod?: string;
};

const EMPTY_CARE_PACKAGES: PackageOption[] = [];
const EMPTY_PROTECTION_PACKAGES: PackageOption[] = [];

export function usePlantPackages() {
  const careQuery = useQuery({
    queryKey: ['packages', 'care'],
    queryFn: async () => {
      const res = await fetchApiClient('/user/packages/care');
      const data = res.data || res;
      return (Array.isArray(data) ? data : data?.items || []) as PackageOption[];
    },
  });

  const protectionQuery = useQuery({
    queryKey: ['packages', 'protection'],
    queryFn: async () => {
      const res = await fetchApiClient('/user/packages/protection');
      const data = res.data || res;
      return (Array.isArray(data) ? data : data?.items || []) as PackageOption[];
    },
  });

  return {
    carePackages: careQuery.data ?? EMPTY_CARE_PACKAGES,
    protectionPackages: protectionQuery.data ?? EMPTY_PROTECTION_PACKAGES,
    isLoading: careQuery.isLoading || protectionQuery.isLoading,
    isError: careQuery.isError || protectionQuery.isError,
  };
}

export function useCreateQuickOrder() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: CreateQuickOrderPayload) => {
      const checkoutPayload = {
        customerName: payload.recipientName || 'Khách hàng',
        customerPhone: payload.recipientPhone || '0901234567',
        deliveryType: payload.shippingAddress && payload.shippingAddress !== 'Nhận tại vườn' ? 'shipping' : 'pickup',
        shippingAddress: payload.shippingAddress || 'Nhận tại vườn',
        paymentMethod: 'online',
        items: payload.itemId ? [{ productId: payload.itemId, quantity: payload.quantity }] : [],
        note: payload.notes || (payload.mode === 'plant' ? `Đăng ký trồng sâm (Gói chăm sóc: ${payload.carePackageId || 'default'}, Gói bảo hiểm: ${payload.protectionPackageId || 'default'})` : undefined),
      };

      const res = await fetchApiClient('/user/orders/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(checkoutPayload),
      });

      return res.data || res;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      queryClient.invalidateQueries({ queryKey: ['profile'] });
    },
  });
}
