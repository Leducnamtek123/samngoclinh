import { useQuery } from '@tanstack/react-query';
import { userService } from '@/services/user.service';
import type { UserProfile, UserBusiness } from '@/types';

export function useProfileMe(initialData?: UserProfile) {
  return useQuery<UserProfile | null>({
    queryKey: ['profile', 'me'],
    queryFn: async () => await userService.getProfile(),
    initialData,
    retry: false,
  });
}

export function useProfileBusiness(initialData?: UserBusiness) {
  return useQuery<UserBusiness | null>({
    queryKey: ['profile', 'business'],
    queryFn: async () => await userService.getBusiness(),
    initialData,
    retry: false,
  });
}
