import { useQuery } from '@tanstack/react-query';
import { fetchApiClient } from '@/libs/ApiClient';

export function useBanner(pageKey: string, initialData?: any) {
  return useQuery({
    queryKey: ['banners', pageKey],
    queryFn: () => fetchApiClient(`/public/banners/${pageKey}`).then((res) => res.data),
    initialData,
  });
}
