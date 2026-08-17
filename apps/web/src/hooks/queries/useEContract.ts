import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { econtractService } from '@/services/econtract.service';
import { userService } from '@/services/user.service';
import type { EContractData } from '@/types';

export type EContractSignPayload = {
  contractId: string;
  signatureData: string;
  otpCode?: string;
};

export function useEContracts(initialData?: EContractData[]) {
  return useQuery<EContractData[]>({
    queryKey: ['contracts', 'list'],
    queryFn: () => econtractService.getMyContracts(),
    initialData,
  });
}

export function useEContractDetail(id: string | null) {
  return useQuery<EContractData | null>({
    queryKey: ['contracts', 'detail', id],
    queryFn: () => (id ? econtractService.getContract(id) : Promise.resolve(null)),
    enabled: !!id,
  });
}

export function useSignEContract() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ contractId, signatureData, otpCode }: EContractSignPayload) =>
      econtractService.signContract(contractId, signatureData, otpCode),
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
      return userService.saveSignature(signatureData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile'] });
      queryClient.invalidateQueries({ queryKey: ['user-signature'] });
    },
  });
}

