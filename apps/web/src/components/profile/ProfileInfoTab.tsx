import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Edit2, User, Award, Copy } from 'lucide-react';
import { Button, ButtonLoading } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { FormDatePicker } from '@/components/ui/form/FormDatePicker';
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

  const cleanName = (fullName === '—' ? '' : fullName) || profile?.name || '';
  const currentPhone = profile?.mobileNumbers?.[0]?.number || business?.phone || editPhone || '';
  const initialGender = profile?.gender === 'female' || profile?.gender === 'Nữ' ? 'female' : 'male';

  const form = useForm<ProfileInfoFormValues>({
    resolver: zodResolver(profileInfoSchema),
    defaultValues: {
      fullName: cleanName,
      gender: initialGender,
      birthDate: formatInputDate(profile?.birthDate),
      phone: currentPhone,
    },
  });

  useEffect(() => {
    if (!isEditing) {
      form.reset({
        fullName: cleanName,
        gender: profile?.gender === 'female' || profile?.gender === 'Nữ' ? 'female' : 'male',
        birthDate: formatInputDate(profile?.birthDate),
        phone: currentPhone,
      });
    }
  }, [cleanName, profile, isEditing, currentPhone, form]);

  const handleStartEdit = () => {
    form.reset({
      fullName: cleanName,
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
      {/* Tab Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gray-100 dark:border-gray-800 pb-4">
        <div>
          <h3 className="text-xl font-extrabold text-gray-900 dark:text-gray-100 flex items-center gap-2">
            <User className="w-5 h-5 text-emerald-700" />
            <span>Thông tin cá nhân</span>
          </h3>
          <p className="text-xs text-gray-400 font-medium mt-0.5">
            {isEditing ? 'Đang ở chế độ chỉnh sửa thông tin cá nhân' : 'Quản lý thông tin tài khoản và thông tin liên hệ'}
          </p>
        </div>

        <div className="flex items-center gap-2">
          {isEditing ? (
            <>
              <Button
                variant="outline"
                size="sm"
                onClick={handleCancelEdit}
                disabled={isSaving}
                className="cursor-pointer text-xs"
              >
                Hủy
              </Button>
              <ButtonLoading
                variant="default"
                size="sm"
                isLoading={isSaving}
                onClick={form.handleSubmit(onValidSave)}
                className="bg-emerald-800 hover:bg-emerald-900 text-white cursor-pointer text-xs"
              >
                Lưu thay đổi
              </ButtonLoading>
            </>
          ) : (
            <Button
              variant="outline"
              size="sm"
              onClick={handleStartEdit}
              className="flex items-center gap-1.5 cursor-pointer text-xs border-gray-300 hover:border-emerald-600 hover:text-emerald-700"
            >
              <Edit2 className="w-3.5 h-3.5" />
              <span>Chỉnh sửa</span>
            </Button>
          )}
        </div>
      </div>

      {isEditing ? (
        /* Edit Mode Form */
        <form onSubmit={form.handleSubmit(onValidSave)} className="space-y-5 pt-1">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Họ và tên */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase text-gray-600 dark:text-gray-400 block">
                Họ và tên <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                {...form.register('fullName')}
                placeholder="Nhập họ và tên đầy đủ..."
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-slate-800 text-sm font-semibold text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
              />
              {form.formState.errors.fullName && (
                <p className="text-xs font-semibold text-red-500">{form.formState.errors.fullName.message}</p>
              )}
            </div>

            {/* Email (Read only) */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase text-gray-600 dark:text-gray-400 block">
                Địa chỉ Email
              </label>
              <div className="px-3.5 py-2.5 rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-slate-900/50 text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center justify-between">
                <span>{email || '—'}</span>
                <span className="text-[10px] text-gray-400 font-normal italic">Không thể thay đổi</span>
              </div>
            </div>

            {/* Giới tính */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase text-gray-600 dark:text-gray-400 block">
                Giới tính <span className="text-red-500">*</span>
              </label>
              <div className="flex items-center gap-6 pt-1">
                <label className="inline-flex items-center gap-2 cursor-pointer text-sm font-semibold text-gray-800 dark:text-gray-200">
                  <input
                    type="radio"
                    value="male"
                    {...form.register('gender')}
                    className="w-4 h-4 text-emerald-600 focus:ring-emerald-500 accent-emerald-600 cursor-pointer"
                  />
                  <span>Nam</span>
                </label>
                <label className="inline-flex items-center gap-2 cursor-pointer text-sm font-semibold text-gray-800 dark:text-gray-200">
                  <input
                    type="radio"
                    value="female"
                    {...form.register('gender')}
                    className="w-4 h-4 text-emerald-600 focus:ring-emerald-500 accent-emerald-600 cursor-pointer"
                  />
                  <span>Nữ</span>
                </label>
              </div>
              {form.formState.errors.gender && (
                <p className="text-xs font-semibold text-red-500">{form.formState.errors.gender.message}</p>
              )}
            </div>

            {/* Ngày sinh */}
            <FormDatePicker
              control={form.control}
              name="birthDate"
              label="Ngày sinh"
              placeholder="Chọn ngày sinh (dd/mm/yyyy)..."
            />

            {/* Số điện thoại */}
            <div className="space-y-1.5 md:col-span-2">
              <label className="text-xs font-bold uppercase text-gray-600 dark:text-gray-400 block">
                Số điện thoại liên kết <span className="text-red-500">*</span>
              </label>
              <input
                type="tel"
                {...form.register('phone')}
                placeholder="VD: 0912345678"
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-slate-800 text-sm font-semibold text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
              />
              {form.formState.errors.phone && (
                <p className="text-xs font-semibold text-red-500">{form.formState.errors.phone.message}</p>
              )}
            </div>
          </div>
        </form>
      ) : (
        /* View Mode Grid */
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-1">
          {/* Họ và tên */}
          <div className="p-4 rounded-2xl bg-gray-50/80 dark:bg-slate-900/50 border border-gray-100 dark:border-gray-800 space-y-1">
            <span className="text-[11px] text-gray-400 font-bold uppercase tracking-wider block">Họ và tên</span>
            <p className="text-sm font-bold text-gray-900 dark:text-gray-100">
              {cleanName || <span className="text-gray-400 font-normal italic">Chưa cập nhật</span>}
            </p>
          </div>

          {/* Email */}
          <div className="p-4 rounded-2xl bg-gray-50/80 dark:bg-slate-900/50 border border-gray-100 dark:border-gray-800 space-y-1">
            <span className="text-[11px] text-gray-400 font-bold uppercase tracking-wider block">Địa chỉ Email</span>
            <div className="flex items-center justify-between gap-2">
              <p className="text-sm font-bold text-gray-900 dark:text-gray-100 truncate">{email || '—'}</p>
              {isEmailVerified ? (
                <Badge variant="secondary" className="bg-emerald-50 text-emerald-700 border-emerald-200 text-[10px] shrink-0 font-bold">
                  Đã xác thực
                </Badge>
              ) : (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onVerifyEmailClick}
                  className="h-6 text-[10px] bg-amber-50 text-amber-800 hover:bg-amber-100 border border-amber-200 shrink-0 font-bold cursor-pointer"
                >
                  Xác thực ngay
                </Button>
              )}
            </div>
          </div>

          {/* Giới tính */}
          <div className="p-4 rounded-2xl bg-gray-50/80 dark:bg-slate-900/50 border border-gray-100 dark:border-gray-800 space-y-1">
            <span className="text-[11px] text-gray-400 font-bold uppercase tracking-wider block">Giới tính</span>
            <p className="text-sm font-bold text-gray-900 dark:text-gray-100">
              {formatGenderLabel(profile?.gender) || 'Nam'}
            </p>
          </div>

          {/* Ngày sinh */}
          <div className="p-4 rounded-2xl bg-gray-50/80 dark:bg-slate-900/50 border border-gray-100 dark:border-gray-800 space-y-1">
            <span className="text-[11px] text-gray-400 font-bold uppercase tracking-wider block">Ngày sinh</span>
            <p className="text-sm font-bold text-gray-900 dark:text-gray-100">
              {formatBirthDate(profile?.birthDate) || <span className="text-gray-400 font-normal italic">Chưa cập nhật</span>}
            </p>
          </div>

          {/* Số điện thoại */}
          <div className="p-4 rounded-2xl bg-gray-50/80 dark:bg-slate-900/50 border border-gray-100 dark:border-gray-800 space-y-1 md:col-span-2">
            <span className="text-[11px] text-gray-400 font-bold uppercase tracking-wider block">Số điện thoại liên kết</span>
            <p className="text-sm font-bold text-gray-900 dark:text-gray-100">
              {currentPhone || <span className="text-gray-400 font-normal italic">Chưa cập nhật</span>}
            </p>
          </div>
        </div>
      )}

      {/* Referral Info Card */}
      <div className="p-5 rounded-2xl bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-950/30 dark:to-teal-950/20 border border-emerald-200/80 dark:border-emerald-800/40 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-2xs">
        <div className="space-y-0.5">
          <span className="text-xs font-black uppercase tracking-wider text-emerald-800 dark:text-emerald-300 flex items-center gap-1.5">
            <Award className="w-4 h-4 text-emerald-600" />
            Mã Giới Thiệu Của Bạn
          </span>
          <p className="text-xs text-gray-600 dark:text-gray-400">
            Chia sẻ mã giới thiệu cho bạn bè để nhận thêm Điểm Sâm thưởng và ưu đãi đơn hàng.
          </p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <div className="px-4 py-2 bg-white dark:bg-slate-900 rounded-xl font-mono font-black text-emerald-800 dark:text-emerald-300 text-sm border border-emerald-300 shadow-xs">
            {referralCode}
          </div>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => onCopyText(referralCode, 'Mã giới thiệu')}
            className="flex items-center gap-1 bg-white hover:bg-emerald-50 text-emerald-800 border-emerald-300 cursor-pointer"
          >
            <Copy className="w-3.5 h-3.5" />
            <span>Sao chép</span>
          </Button>
        </div>
      </div>
    </div>
  );
};
