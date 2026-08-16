import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { fetchApiClient } from '@/lib/ApiClient';

export function useUserSignature() {
  return useQuery({
    queryKey: ['user', 'signature'],
    queryFn: async () => {
      try {
        const res = await fetchApiClient('/v1/shared/user/signature', { method: 'GET' });
        return res?.data?.signatureUrl || null;
      } catch (err) {
        console.error('Failed to fetch user signature:', err);
        return null;
      }
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

export function useSaveUserSignature() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (signatureData: string) => {
      const res = await fetchApiClient('/v1/shared/user/signature', {
        method: 'PUT',
        body: JSON.stringify({ signatureData }),
      });
      return res?.data?.signatureUrl || signatureData;
    },
    onSuccess: (savedUrl) => {
      queryClient.setQueryData(['user', 'signature'], savedUrl);
      queryClient.invalidateQueries({ queryKey: ['user', 'signature'] });
      queryClient.invalidateQueries({ queryKey: ['profile', 'me'] });
    },
  });
}
