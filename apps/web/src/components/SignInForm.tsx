'use client';

import React, { useState } from 'react';

export default function SignInForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/auth/sign-in', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Đăng nhập thất bại');
      }

      // Redirect to homepage
      window.location.href = '/';
    } catch (err: any) {
      setError(err.message || 'Đã xảy ra lỗi kết nối');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md bg-white border border-gray-200 rounded-2xl shadow-xl p-8 space-y-6">
      <div className="space-y-2 text-center">
        <img
          src="/assets/images/logo_ruou_sam.png"
          alt="Rượu Sâm Ngọc Linh Logo"
          className="mx-auto h-12 w-12 rounded-full object-cover shadow-sm border border-gray-100"
        />
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">
          Đăng nhập Rượu Sâm Ngọc Linh
        </h1>
        <p className="text-sm text-gray-500">
          Nhập thông tin tài khoản của bạn để tiếp tục
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm font-medium">
            ⚠️ {error}
          </div>
        )}

        <div className="space-y-1.5">
          <label className="text-xs font-semibold uppercase tracking-wider text-gray-500" htmlFor="email">
            Địa chỉ Email
          </label>
          <input
            id="email"
            type="email"
            required
            className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm"
            placeholder="vi-du@ruousamngoclinh.vn"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className="space-y-1.5">
          <div className="flex justify-between items-center">
            <label className="text-xs font-semibold uppercase tracking-wider text-gray-500" htmlFor="password">
              Mật khẩu
            </label>
            <a href="#" className="text-xs font-semibold text-secondary hover:text-secondary-hover transition-colors">
              Quên mật khẩu?
            </a>
          </div>
          <input
            id="password"
            type="password"
            required
            className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-primary text-white hover:bg-primary-hover active:bg-primary-dark font-semibold py-3 rounded-lg shadow-md shadow-primary/10 transition-all focus:outline-none focus:ring-2 focus:ring-primary/50 disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center gap-2 mt-2 text-sm"
        >
          {loading ? (
            <>
              <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              Đang xử lý...
            </>
          ) : (
            'Đăng nhập'
          )}
        </button>
      </form>

      <div className="text-center text-xs text-gray-500 pt-2 border-t border-gray-100">
        Bạn chưa có tài khoản?{' '}
        <a href="/sign-up" className="font-semibold text-secondary hover:text-secondary-hover transition-colors">
          Đăng ký ngay
        </a>
      </div>
    </div>
  );
}
