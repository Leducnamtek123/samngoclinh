import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { userService } from '@/services/user.service';

export function useUserSignature() {
  return useQuery({
    queryKey: ['user', 'signature'],
    queryFn: async () => {
      try {
        const res = await userService.getSignature();
        return res?.signatureUrl || null;
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
      const res = await userService.saveSignature(signatureData);
      return res?.data?.signatureUrl || signatureData;
    },
    onSuccess: (savedUrl) => {
      queryClient.setQueryData(['user', 'signature'], savedUrl);
      queryClient.invalidateQueries({ queryKey: ['user', 'signature'] });
      queryClient.invalidateQueries({ queryKey: ['profile', 'me'] });
    },
  });
}
