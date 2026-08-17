'use client';

import { useQueryClient } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import { toast } from 'sonner';
import { fetchApiClient } from '@/lib/ApiClient';
import { userService } from '@/services/user.service';
import type { UserProfile } from '@/types';

export type UpdateProfilePayload = {
  fullName: string;
  gender: string;
  birthDate?: string;
  phone?: string;
};

export function useProfileUpdate(profile?: UserProfile | null, refetchProfile?: () => void) {
  const t = useTranslations('profile');
  const queryClient = useQueryClient();

  const saveInlineProfile = async (updatedData: UpdateProfilePayload): Promise<boolean> => {
    try {
      let countryId = profile?.countryId || profile?.country?.id;

      if (!countryId) {
        try {
          const countryRes = await fetchApiClient('/v1/public/country/list');
          const countries = (countryRes?.data || []) as { alpha2Code?: string; id?: string }[];
          const vn = countries.find((c) => c.alpha2Code === 'VN') || countries[0];
          if (vn?.id) {
            countryId = vn.id;
          }
        } catch {
          // fallback
        }
      }

      const body: Record<string, unknown> = {
        name: updatedData.fullName.trim(),
        gender: updatedData.gender === 'female' ? 'female' : 'male',
        countryId,
      };

      if (updatedData.birthDate) {
        body.birthDate = updatedData.birthDate;
      }

      await userService.updateProfile(body as Partial<UserProfile>);

      let phoneDigits = (updatedData.phone || '').replaceAll(/\D/g, '');
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
          } catch (error: unknown) {
            console.error('Failed to add mobile number:', error);
            const msg = error instanceof Error ? error.message : t('savedError');
            throw new Error(msg, { cause: error });
          }
        } else if (phoneDigits !== existingPhone.number) {
          try {
            const updateRes = await fetchApiClient(
              `/v1/shared/user/mobile-number/update/${existingPhone.id}`,
              {
                method: 'PUT',
                body: JSON.stringify({ countryId, phoneCode, number: phoneDigits }),
              },
            );
            updatedMobileNumber = updateRes?.data || {
              ...existingPhone,
              number: phoneDigits,
              phoneCode,
              countryId,
            };
          } catch (error: unknown) {
            console.error('Failed to update mobile number:', error);
            const msg =
              error instanceof Error
                ? error.message
                : 'Không thể cập nhật số điện thoại. Có thể số điện thoại này đã được sử dụng bởi tài khoản khác.';
            throw new Error(msg, { cause: error });
          }
        }
      }

      queryClient.setQueryData<UserProfile | undefined>(['profile', 'me'], (old) => {
        if (!old) {
          return old;
        }
        return {
          ...old,
          name: updatedData.fullName.trim(),
          fullName: updatedData.fullName.trim(),
          gender: updatedData.gender === 'female' ? 'female' : 'male',
          birthDate: updatedData.birthDate || old.birthDate,
          mobileNumbers: phoneDigits
            ? updatedMobileNumber
              ? [updatedMobileNumber]
              : [{ number: phoneDigits, phoneCode, countryId }]
            : [],
        };
      });
      await queryClient.invalidateQueries({ queryKey: ['profile', 'me'] });

      toast.success(t('savedSuccess'));
      if (refetchProfile) {
        refetchProfile();
      }
      return true;
    } catch (error: unknown) {
      console.error('Error saving profile:', error);
      const errMsg = error instanceof Error ? error.message : t('savedError');
      toast.error(errMsg);
      return false;
    }
  };

  return { saveInlineProfile };
}
