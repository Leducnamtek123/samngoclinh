import { useQuery } from '@tanstack/react-query';
import { fetchApiClient } from '@/libs/ApiClient';

export function useProfileMe() {
  return useQuery({
    queryKey: ['profile', 'me'],
    queryFn: () => fetchApiClient('/user/profile/me').then((res) => res.data),
  });
}

export function useProfileBusiness() {
  return useQuery({
    queryKey: ['profile', 'business'],
    queryFn: () => fetchApiClient('/user/profile/business').then((res) => res.data),
  });
}
