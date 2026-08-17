import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { cultivationService } from '@/services/cultivation.service';
import { ordersService } from '@/services/orders.service';

export type PackageOption = {
  id: string;
  code?: string;
  name: string;
  price: number;
  description?: string;
  durationMonths?: number;
  [key: string]: unknown;
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
      const items = await cultivationService.getCarePackages();
      return items as unknown as PackageOption[];
    },
  });

  const protectionQuery = useQuery({
    queryKey: ['packages', 'protection'],
    queryFn: async () => {
      const items = await cultivationService.getProtectionPackages();
      return items as unknown as PackageOption[];
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
        deliveryType:
          payload.shippingAddress && payload.shippingAddress !== 'Nhận tại vườn'
            ? 'shipping'
            : 'pickup',
        shippingAddress: payload.shippingAddress || 'Nhận tại vườn',
        paymentMethod: 'online',
        items: payload.itemId ? [{ productId: payload.itemId, quantity: payload.quantity }] : [],
        note:
          payload.notes ||
          (payload.mode === 'plant'
            ? `Đăng ký trồng sâm (Gói chăm sóc: ${payload.carePackageId || 'default'}, Gói bảo hiểm: ${payload.protectionPackageId || 'default'})`
            : undefined),
      };

      return await ordersService.checkout(checkoutPayload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      queryClient.invalidateQueries({ queryKey: ['profile'] });
    },
  });
}
