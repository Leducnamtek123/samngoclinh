import { useQuery } from '@tanstack/react-query';
import { fetchApiClient } from '@/libs/ApiClient';

export function useProfileMe(initialData?: any) {
  return useQuery({
    queryKey: ['profile', 'me'],
    queryFn: () => fetchApiClient('/user/profile/me').then((res) => res.data).catch(() => null),
    initialData,
    retry: false,
  });
}

export function useProfileBusiness(initialData?: any) {
  return useQuery({
    queryKey: ['profile', 'business'],
    queryFn: () => fetchApiClient('/user/profile/business').then((res) => res.data).catch(() => null),
    initialData,
    retry: false,
  });
}
