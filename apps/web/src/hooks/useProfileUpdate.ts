'use client';

import { useTranslations } from 'next-intl';
import { fetchApiClient } from '@/lib/ApiClient';
import { userService } from '@/services/user.service';
import { useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

export type UpdateProfilePayload = {
  fullName: string;
  gender: string;
  birthDate?: string;
  phone?: string;
};

export function useProfileUpdate(profile?: any, refetchProfile?: () => void) {
  const t = useTranslations('profile');
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

      await userService.updateProfile(body as any);

      let phoneDigits = (updatedData.phone || '').replace(/\D/g, '');
      if (phoneDigits.startsWith('84') && phoneDigits.length === 11) {
        phoneDigits = `0${phoneDigits.slice(2)}`;
      }

      const existingPhone = profile?.mobileNumbers?.[0] || null;
      const phoneCode = profile?.country?.phoneCode?.[0] || '84';
      let updatedMobileNumber = existingPhone;

      if (phoneDigits && countryId) {
        if (!existingPhone) {
          try {
            const addRes = await fetchApiClient('/v1/shared/user/mobile-number/add', {
              method: 'POST',
              body: JSON.stringify({ countryId, phoneCode, number: phoneDigits }),
            });
            updatedMobileNumber = addRes?.data || { number: phoneDigits, phoneCode, countryId };
          } catch (phoneErr: any) {
            console.error('Failed to add mobile number:', phoneErr);
            throw new Error(
              phoneErr?.message || t('savedError')
            );
          }
        } else if (phoneDigits !== existingPhone.number) {
          try {
            const updateRes = await fetchApiClient(`/v1/shared/user/mobile-number/update/${existingPhone.id}`, {
              method: 'PUT',
              body: JSON.stringify({ countryId, phoneCode, number: phoneDigits }),
            });
            updatedMobileNumber = updateRes?.data || { ...existingPhone, number: phoneDigits, phoneCode, countryId };
          } catch (phoneErr: any) {
            console.error('Failed to update mobile number:', phoneErr);
            throw new Error(
              phoneErr?.message || 'Không thể cập nhật số điện thoại. Có thể số điện thoại này đã được sử dụng bởi tài khoản khác.'
            );
          }
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
          mobileNumbers: phoneDigits
            ? (updatedMobileNumber ? [updatedMobileNumber] : [{ number: phoneDigits, phoneCode, countryId }])
            : [],
        };
      });
      await queryClient.invalidateQueries({ queryKey: ['profile', 'me'] });

      toast.success(t('savedSuccess'));
      if (refetchProfile) {
        refetchProfile();
      }
      return true;
    } catch (err: any) {
      console.error('Error saving profile:', err);
      const errMsg = err?.message || t('savedError');
      toast.error(errMsg);
      return false;
    }
  };

  return { saveInlineProfile };
}
