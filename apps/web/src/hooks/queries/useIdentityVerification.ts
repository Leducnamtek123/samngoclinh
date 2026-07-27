import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { fetchApiClient } from '@/libs/ApiClient';

export type IdentityVerificationSubmitPayload = {
  fullName: string;
  identityNumber: string;
  frontImageUrl: string;
  backImageUrl: string;
  documentFiles?: string[];
};

export function useIdentityVerificationStatus(initialData?: any) {
  return useQuery({
    queryKey: ['identity-verification', 'status'],
    queryFn: () =>
      fetchApiClient('/user/identity-verification/status')
        .then((res) => res.data)
        .catch(() => null),
    initialData,
  });
}

export function useSubmitIdentityVerification() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: IdentityVerificationSubmitPayload) =>
      fetchApiClient('/user/identity-verification/submit', {
        method: 'POST',
        body: JSON.stringify(payload),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['identity-verification', 'status'] });
      queryClient.invalidateQueries({ queryKey: ['profile', 'me'] });
    },
  });
}
