import { useQuery } from '@tanstack/react-query';
import { fetchApiClient } from '@/lib/ApiClient';

export type PaymentStatusResponse = {
  status: string;
  isPaid?: boolean;
  orderId?: string;
  amount?: number;
};

export function useSepayPaymentStatus(checkStatusApiUrl: string | null, enabled: boolean) {
  return useQuery({
    queryKey: ['sepayPaymentStatus', checkStatusApiUrl],
    queryFn: async () => {
      if (!checkStatusApiUrl) return null;
      const res = await fetchApiClient(checkStatusApiUrl);
      return (res.data || res) as PaymentStatusResponse;
    },
    enabled: Boolean(checkStatusApiUrl && enabled),
    refetchInterval: (query) => {
      const data = query.state.data;
      if (data?.status === 'paid' || data?.isPaid) {
        return false; // Stop polling once paid
      }
      return 3000; // Poll every 3s
    },
    refetchIntervalInBackground: false,
  });
}
