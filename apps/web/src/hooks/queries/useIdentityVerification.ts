import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { fetchApiClient } from '@/lib/ApiClient';

export type UserIdentityDocument = {
  id?: string;
  userId?: string;
  front?: string;
  back?: string;
  status?: string;
  createdAt?: string;
  updatedAt?: string;
};

export type SaveIdentityDocumentPayload = {
  front: File;
  back: File;
};

export function useIdentityVerificationStatus(initialData?: any) {
  return useQuery({
    queryKey: ['identity-document'],
    queryFn: () =>
      fetchApiClient('/v1/shared/user/identity-document')
        .then((res) => res.data)
        .catch(() => null),
    initialData,
  });
}

export function useSubmitIdentityVerification() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: SaveIdentityDocumentPayload) => {
      const formData = new FormData();
      if (payload.front) formData.append('front', payload.front);
      if (payload.back) formData.append('back', payload.back);

      return fetchApiClient('/v1/shared/user/identity-document', {
        method: 'PUT',
        body: formData,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['identity-document'] });
      queryClient.invalidateQueries({ queryKey: ['profile', 'me'] });
    },
  });
}

