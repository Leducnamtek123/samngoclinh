'use client';

import { fetchApiClient } from '@/lib/ApiClient';
import { useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

export type UpdateProfilePayload = {
  fullName: string;
  gender: string;
  birthDate?: string;
  phone?: string;
};

export function useProfileUpdate(profile?: any, refetchProfile?: () => void) {
  const queryClient = useQueryClient();

  const saveInlineProfile = async (updatedData: UpdateProfilePayload): Promise<boolean> => {
    try {
      let countryId = profile?.countryId || profile?.country?.id;

      if (!countryId) {
        try {
          const countryRes = await fetchApiClient('/v1/public/country/list');
          const countries = countryRes?.data || [];
          const vn = countries.find((c: any) => c.alpha2Code === 'VN') || countries[0];
          if (vn?.id) {
            countryId = vn.id;
          }
        } catch {
          // fallback
        }
      }

      const body: Record<string, any> = {
        name: updatedData.fullName.trim(),
        gender: updatedData.gender === 'female' ? 'female' : 'male',
        countryId,
      };

      if (updatedData.birthDate) {
        body.birthDate = updatedData.birthDate;
      }

      await fetchApiClient('/v1/shared/user/profile/update', {
        method: 'PUT',
        body: JSON.stringify(body),
      });

      const phoneDigits = (updatedData.phone || '').replace(/\D/g, '');
      const existingPhone = profile?.mobileNumbers?.[0] || null;
      const phoneCode = profile?.country?.phoneCode?.[0] || '84';

      if (phoneDigits && countryId) {
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

      queryClient.setQueryData(['profile', 'me'], (old: any) => {
        if (!old) return old;
        return {
          ...old,
          name: updatedData.fullName.trim(),
          fullName: updatedData.fullName.trim(),
          gender: updatedData.gender === 'female' ? 'female' : 'male',
          birthDate: updatedData.birthDate || old.birthDate,
        };
      });
      await queryClient.invalidateQueries({ queryKey: ['profile', 'me'] });

      toast.success('Cập nhật hồ sơ cá nhân thành công!');
      if (refetchProfile) {
        refetchProfile();
      }
      return true;
    } catch (err: any) {
      console.error('Error saving profile:', err);
      const errMsg = err?.message || 'Có lỗi xảy ra khi lưu thông tin. Vui lòng thử lại.';
      toast.error(errMsg);
      return false;
    }
  };

  return { saveInlineProfile };
}
