import { useMutation, useQueryClient } from '@tanstack/react-query';
import { userService } from '@/services/user.service';

export function useRequestEmailVerification() {
  return useMutation({
    mutationFn: async () => await userService.requestEmailVerification(),
  });
}

export function useConfirmEmailVerification() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (otp: string) => await userService.confirmEmailVerification(otp),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile', 'me'] });
    },
  });
}
