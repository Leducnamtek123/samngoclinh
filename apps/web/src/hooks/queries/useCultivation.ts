import { useQuery } from '@tanstack/react-query';
import { fetchApiClient } from '@/lib/ApiClient';

export function useCultivationTrees(initialData?: any, enabled: boolean = true) {
  return useQuery({
    queryKey: ['cultivation', 'trees'],
    queryFn: () => fetchApiClient('/user/cultivation/trees').then((res) => res.data || []).catch(() => []),
    initialData,
    enabled,
    retry: false,
  });
}

export function usePublicCultivationBeds(ageYear?: number | string, initialData?: any) {
  const query = ageYear !== undefined && ageYear !== null ? `?ageYear=${encodeURIComponent(String(ageYear))}` : '';
  return useQuery({
    queryKey: ['public-cultivation-beds', ageYear],
    queryFn: () =>
      fetchApiClient(`/public/cultivation/beds${query}`)
        .then((res) => res.data || [])
        .catch(() => []),
    initialData,
  });
}

export function usePublicCultivationBedDetail(code: string, enabled: boolean = true) {
  return useQuery({
    queryKey: ['public-cultivation-bed-detail', code],
    queryFn: () =>
      fetchApiClient(`/public/cultivation/beds/${encodeURIComponent(code)}`)
        .then((res) => res.data || null)
        .catch(() => null),
    enabled: enabled && !!code,
  });
}

