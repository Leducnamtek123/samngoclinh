'use client';

import { useState, useEffect } from 'react';

type ProfileInfoTabProps = {
  fullName: string;
  email: string;
  rank: string;
  referralCode: string;
  profile: any;
  business: any;
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

function formatBirthDate(dateStr?: string) {
  if (!dateStr) return 'Chưa cập nhật';
  const d = new Date(dateStr);
  if (Number.isNaN(d.getTime())) return dateStr;
  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const year = d.getFullYear();
  return `${day}/${month}/${year}`;
}

function formatInputDate(dateStr?: string) {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  if (Number.isNaN(d.getTime())) {
    if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) return dateStr;
    return '';
  }
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function formatGenderLabel(gender?: string) {
  if (!gender) return 'Chưa cập nhật';
  if (gender === 'male' || gender === 'Nam') return 'Nam';
  if (gender === 'female' || gender === 'Nữ') return 'Nữ';
  return gender;
}

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
  const [nameInput, setNameInput] = useState(fullName || profile?.name || '');
  const [genderInput, setGenderInput] = useState(profile?.gender || 'male');
  const [birthDateInput, setBirthDateInput] = useState(formatInputDate(profile?.birthDate));
  const [phoneInput, setPhoneInput] = useState(
    profile?.mobileNumbers?.[0]?.number || business?.phone || editPhone || ''
  );
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (!isEditing) {
      setNameInput(fullName || profile?.name || '');
      setGenderInput(profile?.gender || 'male');
      setBirthDateInput(formatInputDate(profile?.birthDate));
      setPhoneInput(
        profile?.mobileNumbers?.[0]?.number || business?.phone || editPhone || ''
      );
    }
  }, [fullName, profile, business, editPhone, isEditing]);

  const handleStartEdit = () => {
    setNameInput(fullName || profile?.name || '');
    setGenderInput(profile?.gender || 'male');
    setBirthDateInput(formatInputDate(profile?.birthDate));
    setPhoneInput(
      profile?.mobileNumbers?.[0]?.number || business?.phone || editPhone || ''
    );
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
  };

  const handleSave = async () => {
    if (onSaveProfile) {
      setIsSaving(true);
      const ok = await onSaveProfile({
        fullName: nameInput,
        gender: genderInput,
        birthDate: birthDateInput,
        phone: phoneInput,
      });
      setIsSaving(false);
      if (ok) {
        setIsEditing(false);
      }
    } else {
      setIsEditing(false);
    }
  };

  const currentPhone = profile?.mobileNumbers?.[0]?.number || business?.phone || editPhone;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center border-b border-gray-100 pb-4">
        <div>
          <h3 className="text-xl font-extrabold text-gray-900 font-display-lg">Thông tin cá nhân</h3>
          <p className="text-xs text-gray-400 font-medium">
            {isEditing ? 'Đang ở chế độ chỉnh sửa thông tin trực tiếp' : 'Quản lý hồ sơ và chi tiết tài khoản của bạn'}
          </p>
        </div>
        <div className="flex items-center gap-2">
          {isEditing ? (
            <>
              <button
                type="button"
                onClick={handleCancelEdit}
                disabled={isSaving}
                className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold px-4 py-2 rounded-lg text-xs transition-colors cursor-pointer disabled:opacity-50"
              >
                Hủy
              </button>
              <button
                type="button"
                onClick={handleSave}
                disabled={isSaving}
                className="bg-emerald-800 hover:bg-emerald-900 text-white font-bold px-5 py-2 rounded-lg text-xs shadow-sm transition-colors cursor-pointer flex items-center gap-1.5 disabled:opacity-50"
              >
                {isSaving ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-1 h-3.5 w-3.5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>Đang lưu...</span>
                  </>
                ) : (
                  <span>Lưu thay đổi</span>
                )}
              </button>
            </>
          ) : (
            <button
              type="button"
              onClick={handleStartEdit}
              className="bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 font-bold px-4 py-2 rounded-lg text-xs shadow-sm transition-colors cursor-pointer flex items-center gap-1.5"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
              </svg>
              <span>Chỉnh sửa</span>
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
        {/* Họ và tên */}
        <div className="space-y-1">
          <span className="text-xs text-gray-400 font-bold uppercase tracking-wider">Họ và tên</span>
          {isEditing ? (
            <input
              type="text"
              required
              value={nameInput}
              onChange={(e) => setNameInput(e.target.value)}
              placeholder="Nhập họ và tên"
              className="w-full px-3 py-2 border border-emerald-600 rounded-lg text-sm font-semibold text-gray-800 focus:outline-none focus:ring-2 focus:ring-emerald-800/30 bg-emerald-50/20"
            />
          ) : (
            <p className="text-sm font-semibold text-gray-800">{fullName}</p>
          )}
        </div>

        {/* Địa chỉ Email */}
        <div className="space-y-1">
          <span className="text-xs text-gray-400 font-bold uppercase tracking-wider">Địa chỉ Email</span>
          <div className="flex items-center gap-2">
            <p className="text-sm font-semibold text-gray-800">{email}</p>
            {isEmailVerified ? (
              <span className="bg-emerald-100 text-emerald-700 text-[10px] font-bold px-2 py-0.5 rounded-full inline-flex items-center gap-1">
                ✓ Đã xác thực
              </span>
            ) : (
              <button
                type="button"
                onClick={onVerifyEmailClick}
                className="bg-amber-100 hover:bg-amber-200 text-amber-800 text-[10px] font-bold px-2 py-0.5 rounded-full transition-colors cursor-pointer"
              >
                Xác thực ngay
              </button>
            )}
          </div>
          {isEditing && (
            <p className="text-[11px] text-gray-400 font-medium italic">Email không thể thay đổi</p>
          )}
        </div>

        {/* Giới tính */}
        <div className="space-y-1">
          <span className="text-xs text-gray-400 font-bold uppercase tracking-wider">Giới tính</span>
          {isEditing ? (
            <div className="flex gap-4 items-center pt-1.5">
              <label className="inline-flex items-center gap-1.5 cursor-pointer text-xs font-semibold text-gray-700">
                <input
                  type="radio"
                  name="gender"
                  value="male"
                  checked={genderInput === 'male'}
                  onChange={() => setGenderInput('male')}
                  className="w-4 h-4 text-emerald-800 focus:ring-emerald-800 cursor-pointer"
                />
                <span>Nam</span>
              </label>
              <label className="inline-flex items-center gap-1.5 cursor-pointer text-xs font-semibold text-gray-700">
                <input
                  type="radio"
                  name="gender"
                  value="female"
                  checked={genderInput === 'female'}
                  onChange={() => setGenderInput('female')}
                  className="w-4 h-4 text-emerald-800 focus:ring-emerald-800 cursor-pointer"
                />
                <span>Nữ</span>
              </label>
            </div>
          ) : (
            <p className="text-sm font-semibold text-gray-800">{formatGenderLabel(profile?.gender)}</p>
          )}
        </div>

        {/* Ngày sinh */}
        <div className="space-y-1">
          <span className="text-xs text-gray-400 font-bold uppercase tracking-wider">Ngày sinh</span>
          {isEditing ? (
            <input
              type="date"
              value={birthDateInput}
              onChange={(e) => setBirthDateInput(e.target.value)}
              className="w-full px-3 py-2 border border-emerald-600 rounded-lg text-sm font-semibold text-gray-800 focus:outline-none focus:ring-2 focus:ring-emerald-800/30 bg-emerald-50/20"
            />
          ) : (
            <p className="text-sm font-semibold text-gray-800">{formatBirthDate(profile?.birthDate)}</p>
          )}
        </div>

        {/* Số điện thoại liên kết */}
        <div className="space-y-1">
          <span className="text-xs text-gray-400 font-bold uppercase tracking-wider">Số điện thoại liên kết</span>
          {isEditing ? (
            <input
              type="tel"
              value={phoneInput}
              onChange={(e) => setPhoneInput(e.target.value)}
              placeholder="Nhập số điện thoại"
              className="w-full px-3 py-2 border border-emerald-600 rounded-lg text-sm font-semibold text-gray-800 focus:outline-none focus:ring-2 focus:ring-emerald-800/30 bg-emerald-50/20"
            />
          ) : (
            <p className="text-sm font-semibold text-gray-800">{currentPhone || 'Chưa liên kết'}</p>
          )}
        </div>

        {/* Hạng tài khoản */}
        <div className="space-y-1">
          <span className="text-xs text-gray-400 font-bold uppercase tracking-wider">Hạng tài khoản</span>
          <p className="text-sm font-semibold text-secondary">Hạng {rank}</p>
        </div>

        {/* Mã giới thiệu */}
        <div className="space-y-1">
          <span className="text-xs text-gray-400 font-bold uppercase tracking-wider">Mã giới thiệu</span>
          <button
            type="button"
            onClick={() => onCopyText(referralCode, 'Mã giới thiệu')}
            className="text-xs font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 px-3 py-1 rounded-full transition-colors inline-flex items-center gap-1.5 mt-0.5 cursor-pointer"
          >
            <span>{referralCode}</span>
            <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
          </button>
        </div>

        {/* Xác minh danh tính (KYC) */}
        <div className="space-y-1">
          <span className="text-xs text-gray-400 font-bold uppercase tracking-wider">Xác minh danh tính (KYC)</span>
          <div className="text-sm font-semibold text-emerald-600 flex items-center gap-1 mt-0.5">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
            <span>{profile?.verified ? 'Đã xác minh' : 'Hoạt động'}</span>
          </div>
        </div>
      </div>
    </div>
  );
};


