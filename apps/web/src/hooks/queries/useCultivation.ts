import { useQuery } from '@tanstack/react-query';
import { fetchApiClient } from '@/libs/ApiClient';

export function useCultivationTrees(initialData?: any, enabled: boolean = true) {
  return useQuery({
    queryKey: ['cultivation', 'trees'],
    queryFn: () => fetchApiClient('/user/cultivation/trees').then((res) => res.data || []).catch(() => []),
    initialData,
    enabled,
    retry: false,
  });
}
