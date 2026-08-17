import { useQuery } from '@tanstack/react-query';
import { contentService } from '@/services/content.service';
import type { Banner } from '@/types';

export function useBanner(pageKey: string, initialData?: Banner[] | Banner | null) {
  const safeInitialData: Banner[] | undefined = Array.isArray(initialData)
    ? initialData
    : initialData
      ? [initialData]
      : undefined;

  return useQuery({
    queryKey: ['banners', pageKey],
    queryFn: async (): Promise<Banner[]> => {
      try {
        const data = await contentService.getBanner(pageKey);
        return Array.isArray(data) ? data : data ? [data] : [];
      } catch {
        return [];
      }
    },
    initialData: safeInitialData,
    staleTime: 5 * 60 * 1000,
  });
}
