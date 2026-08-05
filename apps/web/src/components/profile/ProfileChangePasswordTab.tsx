'use client';

import React, { useState } from 'react';
import { Lock, KeyRound, ShieldCheck, Eye, EyeOff, Check, AlertCircle } from 'lucide-react';
import { fetchApiClient } from '@/libs/ApiClient';
import { toast } from 'sonner';

type ProfileChangePasswordTabProps = {
  locale?: string;
};

export const ProfileChangePasswordTab: React.FC<ProfileChangePasswordTabProps> = ({ locale = 'vi' }) => {
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [showOld, setShowOld] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [errorMsg, setErrorMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validatePassword = (pwd: string) => {
    return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/.test(pwd);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!oldPassword) {
      setErrorMsg('Vui lòng nhập mật khẩu hiện tại.');
      return;
    }

    if (!validatePassword(newPassword)) {
      setErrorMsg('Mật khẩu mới tối thiểu 8 ký tự, bao gồm chữ hoa, chữ thường và chữ số.');
      return;
    }

    if (newPassword === oldPassword) {
      setErrorMsg('Mật khẩu mới phải khác với mật khẩu hiện tại.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setErrorMsg('Mật khẩu xác nhận không trùng khớp.');
      return;
    }

    setIsSubmitting(true);
    try {
      await fetchApiClient('/v1/shared/user/change-password', {
        method: 'PATCH',
        body: JSON.stringify({
          oldPassword,
          newPassword,
        }),
      });

      toast.success('Đổi mật khẩu thành công! Vui lòng đăng nhập lại.');
      setOldPassword('');
      setNewPassword('');
      setConfirmPassword('');

      setTimeout(() => {
        window.location.href = `/${locale}/sign-in?reason=password_changed`;
      }, 1500);
    } catch (err: any) {
      setErrorMsg(err?.message || 'Đổi mật khẩu thất bại. Vui lòng kiểm tra lại mật khẩu hiện tại.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-lg animate-in fade-in duration-200">
      <div className="flex items-center gap-2.5 pb-2 border-b border-gray-100">
        <div className="p-2 rounded-lg bg-emerald-50 text-emerald-700">
          <KeyRound className="w-4 h-4" />
        </div>
        <div>
          <h3 className="font-bold text-gray-900 text-base">Đổi mật khẩu tài khoản</h3>
          <p className="text-xs text-gray-400 font-normal">Mật khẩu mới cần đáp ứng các tiêu chuẩn bảo mật hệ thống</p>
        </div>
      </div>

      {errorMsg && (
        <div className="p-3.5 bg-red-50 border border-red-200 text-red-700 rounded-xl text-xs font-semibold flex items-center gap-2">
          <AlertCircle className="w-4 h-4 flex-shrink-0 text-red-500" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* 1. Mật khẩu hiện tại */}
      <div className="space-y-1.5">
        <label htmlFor="oldPasswordInput" className="font-bold text-gray-700 text-xs block">Mật khẩu hiện tại *</label>
        <div className="relative">
          <input
            id="oldPasswordInput"
            type={showOld ? 'text' : 'password'}
            required
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
            placeholder="Nhập mật khẩu hiện tại"
            className="w-full px-3.5 py-2.5 pl-10 pr-10 border border-gray-300 rounded-xl text-xs font-semibold text-gray-800 focus:ring-1 focus:ring-emerald-800 focus:outline-none"
          />
          <Lock className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <button
            type="button"
            onClick={() => setShowOld(!showOld)}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer"
          >
            {showOld ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* 2. Mật khẩu mới */}
      <div className="space-y-1.5">
        <label htmlFor="newPasswordInput" className="font-bold text-gray-700 text-xs block">Mật khẩu mới *</label>
        <div className="relative">
          <input
            id="newPasswordInput"
            type={showNew ? 'text' : 'password'}
            required
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="Tối thiểu 8 ký tự, có chữ hoa, thường & số"
            className="w-full px-3.5 py-2.5 pl-10 pr-10 border border-gray-300 rounded-xl text-xs font-semibold text-gray-800 focus:ring-1 focus:ring-emerald-800 focus:outline-none"
          />
          <KeyRound className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <button
            type="button"
            onClick={() => setShowNew(!showNew)}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer"
          >
            {showNew ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        </div>

        {/* Requirements indicator */}
        <div className="pt-1.5 space-y-1 text-[11px]">
          <div className={`flex items-center gap-1.5 font-medium ${newPassword.length >= 8 ? 'text-emerald-700' : 'text-gray-400'}`}>
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Độ dài từ 8 ký tự trở lên</span>
          </div>
          <div className={`flex items-center gap-1.5 font-medium ${validatePassword(newPassword) ? 'text-emerald-700' : 'text-gray-400'}`}>
            <Check className="w-3.5 h-3.5" />
            <span>Bao gồm chữ hoa (A-Z), chữ thường (a-z) và chữ số (0-9)</span>
          </div>
        </div>
      </div>

      {/* 3. Xác nhận mật khẩu mới */}
      <div className="space-y-1.5">
        <label htmlFor="confirmPasswordInput" className="font-bold text-gray-700 text-xs block">Xác nhận mật khẩu mới *</label>
        <div className="relative">
          <input
            id="confirmPasswordInput"
            type={showConfirm ? 'text' : 'password'}
            required
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Nhập lại mật khẩu mới"
            className="w-full px-3.5 py-2.5 pl-10 pr-10 border border-gray-300 rounded-xl text-xs font-semibold text-gray-800 focus:ring-1 focus:ring-emerald-800 focus:outline-none"
          />
          <Lock className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <button
            type="button"
            onClick={() => setShowConfirm(!showConfirm)}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer"
          >
            {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Submit Button */}
      <div className="pt-3 border-t border-gray-100">
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-emerald-800 hover:bg-emerald-900 text-white font-bold py-3 rounded-xl text-xs shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
        >
          {isSubmitting ? (
            <span>Đang lưu...</span>
          ) : (
            <>
              <Check className="w-4 h-4" />
              <span>Cập nhật mật khẩu</span>
            </>
          )}
        </button>
      </div>
    </form>
  );
};
