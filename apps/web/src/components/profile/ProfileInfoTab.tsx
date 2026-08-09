'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Edit2, Copy, CheckCircle2, User } from 'lucide-react';
import {
  Form,
  FormPhoneInput,
  FormRadioGroup,
  FormDatePicker,
  FormFloatingInput,
} from '@/components/ui/form';
import { Button, ButtonLoading } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { DigitalSignatureCard } from './DigitalSignatureCard';
import {
  profileInfoSchema,
  type ProfileInfoFormValues,
} from '@/lib/validation/schemas';
import type { UserProfile, UserBusiness } from '@/types';
import { formatBirthDate, formatInputDate, formatGenderLabel } from '@/utils/formatters';

type ProfileInfoTabProps = {
  fullName: string;
  email: string;
  rank: string;
  referralCode: string;
  profile?: UserProfile | null;
  business?: UserBusiness | null;
  editPhone: string;
  onEditClick?: () => void;
  onCopyText: (text: string, label: string) => void;
  onVerifyEmailClick?: () => void;
  onSaveProfile?: (updated: {
    fullName: string;
    gender: string;
    birthDate: string;
    phone: string;
  }) => Promise<boolean>;
};

export const ProfileInfoTab = ({
  fullName,
  email,
  rank,
  referralCode,
  profile,
  business,
  editPhone,
  onCopyText,
  onVerifyEmailClick,
  onSaveProfile,
}: ProfileInfoTabProps) => {
  const isEmailVerified = !!(profile?.isEmailVerified || profile?.emailVerified);

  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const currentPhone = profile?.mobileNumbers?.[0]?.number || business?.phone || editPhone || '';
  const initialGender = profile?.gender === 'female' || profile?.gender === 'Nữ' ? 'female' : 'male';

  const form = useForm<ProfileInfoFormValues>({
    resolver: zodResolver(profileInfoSchema),
    defaultValues: {
      fullName: fullName || profile?.name || '',
      gender: initialGender,
      birthDate: formatInputDate(profile?.birthDate),
      phone: currentPhone,
    },
  });

  useEffect(() => {
    if (!isEditing) {
      form.reset({
        fullName: fullName || profile?.name || '',
        gender: profile?.gender === 'female' || profile?.gender === 'Nữ' ? 'female' : 'male',
        birthDate: formatInputDate(profile?.birthDate),
        phone: currentPhone,
      });
    }
  }, [fullName, profile, business, editPhone, isEditing, currentPhone, form]);

  const handleStartEdit = () => {
    form.reset({
      fullName: fullName || profile?.name || '',
      gender: profile?.gender === 'female' || profile?.gender === 'Nữ' ? 'female' : 'male',
      birthDate: formatInputDate(profile?.birthDate),
      phone: currentPhone,
    });
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
  };

  const onValidSave = async (values: ProfileInfoFormValues) => {
    if (onSaveProfile) {
      setIsSaving(true);
      const ok = await onSaveProfile({
        fullName: values.fullName,
        gender: values.gender,
        birthDate: values.birthDate,
        phone: values.phone,
      });
      setIsSaving(false);
      if (ok) {
        setIsEditing(false);
      }
    } else {
      setIsEditing(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center border-b border-gray-100 dark:border-gray-800 pb-4">
        <div>
          <h3 className="text-xl font-extrabold text-gray-900 dark:text-gray-100">Thông tin cá nhân</h3>
          <p className="text-xs text-gray-400 font-medium">
            {isEditing ? 'Đang ở chế độ chỉnh sửa thông tin trực tiếp' : 'Quản lý hồ sơ và chi tiết tài khoản của bạn'}
          </p>
        </div>
        <div className="flex items-center gap-2">
          {isEditing ? (
            <>
              <Button
                variant="secondary"
                size="sm"
                onClick={handleCancelEdit}
                disabled={isSaving}
              >
                Hủy
              </Button>
              <ButtonLoading
                variant="default"
                size="sm"
                isLoading={isSaving}
                onClick={form.handleSubmit(onValidSave)}
              >
                Lưu thay đổi
              </ButtonLoading>
            </>
          ) : (
            <Button
              variant="outline"
              size="sm"
              onClick={handleStartEdit}
              className="flex items-center gap-1.5"
            >
              <Edit2 className="w-3.5 h-3.5" />
              <span>Chỉnh sửa</span>
            </Button>
          )}
        </div>
      </div>

      {isEditing ? (
        <Form form={form} onSubmit={form.handleSubmit(onValidSave)} className="space-y-4 pt-2">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormFloatingInput
              control={form.control}
              name="fullName"
              label="Họ và tên"
              required
              prefixIcon={<User className="w-4 h-4" />}
            />

            <div className="space-y-1">
              <span className="text-xs text-gray-400 font-bold uppercase tracking-wider block">Địa chỉ Email</span>
              <p className="text-sm font-semibold text-gray-800 dark:text-gray-200 pt-3">{email}</p>
              <p className="text-[11px] text-gray-400 font-medium italic">Email không thể thay đổi</p>
            </div>

            <FormRadioGroup
              control={form.control}
              name="gender"
              label="Giới tính"
              options={[
                { value: 'male', label: 'Nam' },
                { value: 'female', label: 'Nữ' },
              ]}
              required
            />

            <FormDatePicker
              control={form.control}
              name="birthDate"
              label="Ngày sinh"
              required
            />

            <FormPhoneInput
              control={form.control}
              name="phone"
              label="Số điện thoại liên kết"
              required
            />

            <div className="space-y-1">
              <span className="text-xs text-gray-400 font-bold uppercase tracking-wider block">Hạng tài khoản</span>
              <p className="text-sm font-semibold text-primary pt-3">Hạng {rank}</p>
            </div>
          </div>
        </Form>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
          {/* Họ và tên */}
          <div className="space-y-1">
            <span className="text-xs text-gray-400 font-bold uppercase tracking-wider">Họ và tên</span>
            <p className="text-sm font-semibold text-gray-800 dark:text-gray-200">{fullName}</p>
          </div>

          {/* Địa chỉ Email */}
          <div className="space-y-1">
            <span className="text-xs text-gray-400 font-bold uppercase tracking-wider">Địa chỉ Email</span>
            <div className="flex items-center gap-2">
              <p className="text-sm font-semibold text-gray-800 dark:text-gray-200">{email}</p>
              {isEmailVerified ? (
                <Badge variant="secondary">✓ Đã xác thực</Badge>
              ) : (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onVerifyEmailClick}
                  className="h-6 text-[10px] bg-amber-100 text-amber-800 hover:bg-amber-200"
                >
                  Xác thực ngay
                </Button>
              )}
            </div>
          </div>

          {/* Giới tính */}
          <div className="space-y-1">
            <span className="text-xs text-gray-400 font-bold uppercase tracking-wider">Giới tính</span>
            <p className="text-sm font-semibold text-gray-800 dark:text-gray-200">{formatGenderLabel(profile?.gender)}</p>
          </div>

          {/* Ngày sinh */}
          <div className="space-y-1">
            <span className="text-xs text-gray-400 font-bold uppercase tracking-wider">Ngày sinh</span>
            <p className="text-sm font-semibold text-gray-800 dark:text-gray-200">{formatBirthDate(profile?.birthDate)}</p>
          </div>

          {/* Số điện thoại liên kết */}
          <div className="space-y-1">
            <span className="text-xs text-gray-400 font-bold uppercase tracking-wider">Số điện thoại liên kết</span>
            <p className="text-sm font-semibold text-gray-800 dark:text-gray-200">{currentPhone || 'Chưa liên kết'}</p>
          </div>

          {/* Hạng tài khoản */}
          <div className="space-y-1">
            <span className="text-xs text-gray-400 font-bold uppercase tracking-wider">Hạng tài khoản</span>
            <p className="text-sm font-semibold text-primary">Hạng {rank}</p>
          </div>

          {/* Mã giới thiệu */}
          <div className="space-y-1">
            <span className="text-xs text-gray-400 font-bold uppercase tracking-wider">Mã giới thiệu</span>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => onCopyText(referralCode, 'Mã giới thiệu')}
              className="h-7 text-xs flex items-center gap-1.5 mt-0.5 rounded-full"
            >
              <span>{referralCode}</span>
              <Copy className="w-3.5 h-3.5 text-gray-500" />
            </Button>
          </div>

          {/* Xác minh danh tính (KYC) */}
          <div className="space-y-1">
            <span className="text-xs text-gray-400 font-bold uppercase tracking-wider">Xác minh danh tính (KYC)</span>
            <div className="text-sm font-semibold text-emerald-600 flex items-center gap-1 mt-0.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>{profile?.verified ? 'Đã xác minh' : 'Hoạt động'}</span>
            </div>
          </div>
        </div>
      )}

      {/* Electronic Signature Section */}
      <div className="pt-6 border-t border-gray-100 dark:border-gray-800">
        <DigitalSignatureCard />
      </div>
    </div>
  );
};
