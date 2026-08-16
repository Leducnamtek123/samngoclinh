import { useQuery } from '@tanstack/react-query';
import { fetchApiClient } from '@/lib/ApiClient';

export function useBanner(pageKey: string, initialData?: any) {
  return useQuery({
    queryKey: ['banners', pageKey],
    queryFn: () =>
      fetchApiClient(`/public/banners/${pageKey}`)
        .then((res) => (res?.data !== undefined ? res.data : null))
        .catch(() => null),
    initialData,
    staleTime: 5 * 60 * 1000,
  });
}
