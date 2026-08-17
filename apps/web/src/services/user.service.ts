import { fetchApiClient } from '@/lib/ApiClient';
import type { AddressItem, UserBusiness, UserProfile } from '@/types';

export type UserIdentityDocument = {
  id?: string;
  userId?: string;
  documentType?: string;
  frontImageUrl?: string;
  backImageUrl?: string;
  status?: string;
  rejectionReason?: string;
  idCardNumber?: string;
  fullName?: string;
  createdAt?: string;
  updatedAt?: string;
  [key: string]: unknown;
};

export const userService = {
  async getProfile(): Promise<UserProfile | null> {
    const res = await fetchApiClient('/v1/shared/user/profile');
    return res?.data || res || null;
  },

  async getBusiness(): Promise<UserBusiness | null> {
    const res = await fetchApiClient('/v1/shared/user/business');
    return res?.data || res || null;
  },

  async updateProfile(payload: Partial<UserProfile>): Promise<UserProfile> {
    const res = await fetchApiClient('/v1/shared/user/profile/update', {
      method: 'PUT',
      body: JSON.stringify(payload),
    });
    return res?.data || res;
  },

  async changePassword(payload: {
    currentPassword?: string;
    newPassword?: string;
  }): Promise<{ success: boolean; message?: string }> {
    const res = await fetchApiClient('/v1/shared/user/change-password', {
      method: 'PATCH',
      body: JSON.stringify(payload),
    });
    return res?.data || res;
  },

  async getIdentityDocument(): Promise<UserIdentityDocument | null> {
    const res = await fetchApiClient('/v1/shared/user/identity-document');
    return res?.data || res || null;
  },

  async getIdentityDocumentHistories(): Promise<UserIdentityDocument[]> {
    const res = await fetchApiClient('/v1/shared/user/identity-document/history');
    return (res?.data || res || []) as UserIdentityDocument[];
  },

  async saveIdentityDocument(
    payload: FormData | Record<string, unknown>,
  ): Promise<UserIdentityDocument> {
    const res = await fetchApiClient('/v1/shared/user/identity-document', {
      method: 'PUT',
      body:
        typeof payload === 'object' && !(payload instanceof FormData)
          ? JSON.stringify(payload)
          : payload,
    });
    return res?.data || res;
  },

  async getSignature(): Promise<{ signatureUrl: string | null }> {
    const res = await fetchApiClient('/v1/shared/user/signature');
    return res?.data || res || { signatureUrl: null };
  },

  async saveSignature(signatureData: string): Promise<{ signatureUrl: string }> {
    const res = await fetchApiClient('/v1/shared/user/signature', {
      method: 'PUT',
      body: JSON.stringify({ signatureData }),
    });
    return res?.data || res;
  },

  async addAddress(payload: {
    detail: string;
    label?: string;
    recipient?: string;
    phone?: string;
    isDefault?: boolean;
  }): Promise<AddressItem> {
    const res = await fetchApiClient('/v1/shared/user/address/add', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
    return res?.data || res;
  },

  async deleteAddress(addressId: string): Promise<{ success: boolean }> {
    const res = await fetchApiClient(`/v1/shared/user/address/delete/${addressId}`, {
      method: 'DELETE',
    });
    return res?.data || res;
  },

  async requestEmailVerification(): Promise<{ success: boolean; message?: string }> {
    const res = await fetchApiClient('/v1/shared/user/verify-email/request', {
      method: 'POST',
    });
    return res?.data || res;
  },

  async confirmEmailVerification(otp: string): Promise<{ success: boolean; message?: string }> {
    const res = await fetchApiClient('/v1/shared/user/verify-email/confirm', {
      method: 'POST',
      body: JSON.stringify({ otp }),
    });
    return res?.data || res;
  },
};
