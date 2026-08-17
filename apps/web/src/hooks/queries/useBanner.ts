import { useQuery } from '@tanstack/react-query';
import { contentService } from '@/services/content.service';

export function useBanner(pageKey: string, initialData?: any) {
  return useQuery({
    queryKey: ['banners', pageKey],
    queryFn: () =>
      contentService
        .getBanner(pageKey)
        .then((data) => (data !== undefined ? data : null))
        .catch(() => null),
    initialData,
    staleTime: 5 * 60 * 1000,
  });
}
