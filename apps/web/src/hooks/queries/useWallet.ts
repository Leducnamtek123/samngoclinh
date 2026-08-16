import { useQuery } from '@tanstack/react-query';
import { fetchApiClient } from '@/lib/ApiClient';
import type { WalletSummary } from '@/types';

export function useWalletSummary(initialData?: WalletSummary) {
  return useQuery<WalletSummary | null>({
    queryKey: ['wallet', 'summary'],
    queryFn: () =>
      fetchApiClient('/user/wallet/summary')
        .then((res) => (res?.data !== undefined ? res.data : null))
        .catch(() => null),
    initialData: initialData ?? null,
  });
}
