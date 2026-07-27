import { useQuery } from '@tanstack/react-query';
import { fetchApiClient } from '@/libs/ApiClient';

export function useMarketplaceListings(initialData?: any) {
  return useQuery({
    queryKey: ['marketplace', 'listings'],
    queryFn: () => fetchApiClient('/public/marketplace/listings').then((res) => res.data?.items),
    initialData,
    staleTime: 5 * 60 * 1000,
  });
}
