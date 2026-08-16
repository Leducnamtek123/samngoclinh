import { useQuery } from '@tanstack/react-query';
import { fetchApiClient } from '@/lib/ApiClient';
import type { UserProfile, UserBusiness } from '@/types';

export function useProfileMe(initialData?: UserProfile) {
  return useQuery<UserProfile | null>({
    queryKey: ['profile', 'me'],
    queryFn: () =>
      fetchApiClient('/v1/shared/user/profile')
        .then((res) => (res?.data !== undefined ? res.data : res || null))
        .catch(() => null),
    initialData,
    retry: false,
  });
}

export function useProfileBusiness(initialData?: UserBusiness) {
  return useQuery<UserBusiness | null>({
    queryKey: ['profile', 'business'],
    queryFn: () =>
      fetchApiClient('/v1/shared/user/profile')
        .then((res) => (res?.data !== undefined ? res.data : null))
        .catch(() => null),
    initialData,
    retry: false,
  });
}

