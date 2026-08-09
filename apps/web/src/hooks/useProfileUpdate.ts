'use client';

import { fetchApiClient } from '@/lib/ApiClient';
import { toast } from 'sonner';

export type UpdateProfilePayload = {
  fullName: string;
  gender: string;
  birthDate: string;
  phone: string;
};

export function useProfileUpdate(profile?: any, refetchProfile?: () => void) {
  const saveInlineProfile = async (updatedData: UpdateProfilePayload): Promise<boolean> => {
    try {
      const body: Record<string, any> = {
        name: updatedData.fullName,
        gender: updatedData.gender || 'male',
        countryId: profile?.countryId || profile?.country?.id,
      };
      if (updatedData.birthDate) {
        body.birthDate = updatedData.birthDate;
      }

      await fetchApiClient('/v1/shared/user/profile/update', {
        method: 'PUT',
        body: JSON.stringify(body),
      });

      const phoneDigits = updatedData.phone.replace(/\D/g, '');
      const existingPhone = profile?.mobileNumbers?.[0] || null;
      const countryId = profile?.countryId || profile?.country?.id;
      const phoneCode = profile?.country?.phoneCode?.[0] || '84';

      if (phoneDigits) {
        if (!existingPhone) {
          await fetchApiClient('/v1/shared/user/mobile-number/add', {
            method: 'POST',
            body: JSON.stringify({ countryId, phoneCode, number: phoneDigits }),
          }).catch(() => {});
        } else if (phoneDigits !== existingPhone.number) {
          await fetchApiClient(`/v1/shared/user/mobile-number/update/${existingPhone.id}`, {
            method: 'PUT',
            body: JSON.stringify({ countryId, phoneCode, number: phoneDigits }),
          }).catch(() => {});
        }
      }

      toast.success('Cập nhật thông tin cá nhân thành công!');
      if (refetchProfile) refetchProfile();
      return true;
    } catch {
      toast.error('Có lỗi xảy ra khi lưu thông tin. Vui lòng thử lại.');
      return false;
    }
  };

  return { saveInlineProfile };
}
