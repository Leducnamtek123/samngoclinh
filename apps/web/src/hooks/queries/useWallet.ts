import { useQuery } from '@tanstack/react-query';
import { fetchApiClient } from '@/libs/ApiClient';

export function useWalletSummary() {
  return useQuery({
    queryKey: ['wallet', 'summary'],
    queryFn: () => fetchApiClient('/user/wallet/summary').then((res) => res.data),
  });
}
