import { useQuery } from '@tanstack/react-query';
import { walletService } from '@/services/wallet.service';
import type { WalletSummary } from '@/types';

export function useWalletSummary(initialData?: WalletSummary) {
  return useQuery<WalletSummary | null>({
    queryKey: ['wallet', 'summary'],
    queryFn: () => walletService.getSummary() as Promise<WalletSummary | null>,
    initialData,
  });
}
