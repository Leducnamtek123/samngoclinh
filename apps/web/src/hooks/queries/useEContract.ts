import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { fetchApiClient } from '@/lib/ApiClient';

export type EContractSignPayload = {
  contractId: string;
  signatureData: string;
  otpCode?: string;
};

export function useEContracts(initialData?: any) {
  return useQuery({
    queryKey: ['contracts', 'list'],
    queryFn: () =>
      fetchApiClient('/user/contracts')
        .then((res) => res?.data || [])
        .catch(() => []),
    initialData,
  });
}

export function useEContractDetail(id: string | null) {
  return useQuery({
    queryKey: ['contracts', 'detail', id],
    queryFn: () =>
      fetchApiClient(`/user/contracts/${id}`)
        .then((res) => (res?.data !== undefined ? res.data : null))
        .catch(() => null),
    enabled: !!id,
  });
}

export function useSignEContract() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ contractId, signatureData, otpCode }: EContractSignPayload) =>
      fetchApiClient(`/user/contracts/${contractId}/sign`, {
        method: 'POST',
        body: JSON.stringify({ signatureData, otpCode }),
      }),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['contracts', 'list'] });
      queryClient.invalidateQueries({ queryKey: ['contracts', 'detail', variables.contractId] });
    },
  });
}

export function useUpdateUserSignature() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (signatureData: string) => {
      const res = await fetchApiClient('/v1/shared/user/signature', {
        method: 'PUT',
        body: JSON.stringify({ signatureData }),
      });
      return res.data || res;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile'] });
    },
  });
}

