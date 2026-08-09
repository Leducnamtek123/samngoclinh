import { useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchApiClient } from '@/lib/ApiClient';

export function useRequestEmailVerification() {
  return useMutation({
    mutationFn: () =>
      fetchApiClient('/v1/shared/user/verify-email/request', {
        method: 'POST',
      }),
  });
}

export function useConfirmEmailVerification() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (otp: string) =>
      fetchApiClient('/v1/shared/user/verify-email/confirm', {
        method: 'POST',
        body: JSON.stringify({ otp }),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile', 'me'] });
    },
  });
}
