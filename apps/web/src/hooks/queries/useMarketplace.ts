import { useQuery } from '@tanstack/react-query';
import { fetchApiClient } from '@/libs/ApiClient';

export function useMarketplaceListings() {
  return useQuery({
    queryKey: ['marketplace', 'listings'],
    queryFn: () => fetchApiClient('/public/marketplace/listings').then((res) => res.data?.items || []),
  });
}
