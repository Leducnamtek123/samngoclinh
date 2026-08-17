import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { userService } from '@/services/user.service';

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
    queryFn: () => userService.getIdentityDocument(),
    initialData,
  });
}

export function useIdentityVerificationHistory(initialData?: any) {
  return useQuery({
    queryKey: ['identity-document-history'],
    queryFn: () => userService.getIdentityDocumentHistories(),
    initialData,
  });
}

export function useSubmitIdentityVerification() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: SaveIdentityDocumentPayload | FormData) => {
      if (typeof FormData !== 'undefined' && payload instanceof FormData) {
        return userService.saveIdentityDocument(payload);
      }

      const pay = payload as SaveIdentityDocumentPayload;
      if (pay.frontBase64) {
        return userService.saveIdentityDocument({
          documentType: pay.documentType || 'cccd',
          frontBase64: pay.frontBase64,
          backBase64: pay.backBase64,
          idCardNumber: pay.idCardNumber,
          fullName: pay.fullName,
        });
      }

      const formData = new FormData();
      if (pay.documentType) formData.append('documentType', pay.documentType);
      if (pay.front) {
        formData.append('front', pay.front);
        formData.append('frontImage', pay.front);
      }
      if (pay.back) {
        formData.append('back', pay.back);
        formData.append('backImage', pay.back);
      }
      if (pay.idCardNumber) formData.append('idCardNumber', pay.idCardNumber);
      if (pay.fullName) formData.append('fullName', pay.fullName);

      return userService.saveIdentityDocument(formData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['identity-document'] });
      queryClient.invalidateQueries({ queryKey: ['identity-document-history'] });
      queryClient.invalidateQueries({ queryKey: ['profile', 'me'] });
    },
  });
}
