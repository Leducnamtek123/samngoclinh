import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { fetchApiClient } from '@/lib/ApiClient';
import type { UserProfile, UserBusiness } from '@/types';

export function useProfileMe(initialData?: UserProfile) {
  return useQuery<UserProfile | null>({
    queryKey: ['profile', 'me'],
    queryFn: () =>
      fetchApiClient('/user/profile/me')
        .then((res) => res.data)
        .catch(() => null),
    initialData,
    retry: false,
  });
}

export function useProfileBusiness(initialData?: UserBusiness) {
  return useQuery<UserBusiness | null>({
    queryKey: ['profile', 'business'],
    queryFn: () =>
      fetchApiClient('/user/profile/business')
        .then((res) => res.data)
        .catch(() => null),
    initialData,
    retry: false,
  });
}

export function useUpdateProfile() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: Partial<UserProfile>) =>
      fetchApiClient('/v1/shared/user/profile/update', {
        method: 'PUT',
        body: JSON.stringify(payload),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile', 'me'] });
    },
  });
}

export function useAddAddress() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: { detail: string; label?: string; recipient?: string; phone?: string; isDefault?: boolean }) =>
      fetchApiClient('/v1/shared/user/address/add', {
        method: 'POST',
        body: JSON.stringify(payload),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile', 'me'] });
    },
  });
}

export function useDeleteAddress() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (addressId: string) =>
      fetchApiClient(`/v1/shared/user/address/delete/${addressId}`, {
        method: 'DELETE',
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile', 'me'] });
    },
  });
}

