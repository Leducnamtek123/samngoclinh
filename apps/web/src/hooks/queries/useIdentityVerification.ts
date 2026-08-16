import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { fetchApiClient } from '@/lib/ApiClient';

export type IdentityDocumentType = 'cccd' | 'driver_license' | 'passport';

export type UserIdentityDocument = {
  id?: string;
  userId?: string;
  documentType?: IdentityDocumentType | string;
  frontImageUrl?: string;
  backImageUrl?: string;
  front?: string;
  back?: string;
  status?: 'PENDING' | 'APPROVED' | 'REJECTED' | 'UNVERIFIED' | string;
  rejectionReason?: string;
  idCardNumber?: string;
  fullName?: string;
  reviewedAt?: string;
  reviewedBy?: string;
  createdAt?: string;
  updatedAt?: string;
};

export type UserIdentityHistoryItem = {
  id: string;
  userId: string;
  documentType?: IdentityDocumentType | string;
  frontImageUrl: string;
  backImageUrl?: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | string;
  rejectionReason?: string;
  idCardNumber?: string;
  fullName?: string;
  reviewedAt?: string;
  reviewedBy?: string;
  createdAt: string;
};

export type SaveIdentityDocumentPayload = {
  documentType?: IdentityDocumentType | string;
  front?: File | null;
  back?: File | null;
  frontBase64?: string;
  backBase64?: string;
  idCardNumber?: string;
  fullName?: string;
};

export function useIdentityVerificationStatus(initialData?: any) {
  return useQuery({
    queryKey: ['identity-document'],
    queryFn: () =>
      fetchApiClient('/v1/shared/user/identity-document')
        .then((res) => (res?.data !== undefined ? res.data : null))
        .catch(() => null),
    initialData,
  });
}

export function useIdentityVerificationHistory(initialData?: any) {
  return useQuery({
    queryKey: ['identity-document-history'],
    queryFn: () =>
      fetchApiClient('/v1/shared/user/identity-document/history')
        .then((res) => (Array.isArray(res?.data) ? res.data : []))
        .catch(() => []),
    initialData,
  });
}

export function useSubmitIdentityVerification() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: SaveIdentityDocumentPayload) => {
      if (payload.frontBase64) {
        return fetchApiClient('/v1/shared/user/identity-document', {
          method: 'PUT',
          body: JSON.stringify({
            documentType: payload.documentType || 'cccd',
            frontBase64: payload.frontBase64,
            backBase64: payload.backBase64,
            idCardNumber: payload.idCardNumber,
            fullName: payload.fullName,
          }),
        });
      }

      const formData = new FormData();
      if (payload.documentType) formData.append('documentType', payload.documentType);
      if (payload.front) formData.append('front', payload.front);
      if (payload.back) formData.append('back', payload.back);
      if (payload.idCardNumber) formData.append('idCardNumber', payload.idCardNumber);
      if (payload.fullName) formData.append('fullName', payload.fullName);

      return fetchApiClient('/v1/shared/user/identity-document', {
        method: 'PUT',
        body: formData,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['identity-document'] });
      queryClient.invalidateQueries({ queryKey: ['identity-document-history'] });
      queryClient.invalidateQueries({ queryKey: ['profile', 'me'] });
    },
  });
}
