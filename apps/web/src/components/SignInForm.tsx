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
    <div className="w-full min-h-[calc(100vh-120px)] bg-gray-50 flex items-center justify-center py-12 px-4">
      <div className="w-full max-w-md bg-white border border-gray-200 rounded-3xl shadow-xl p-8 space-y-6">
        <div className="space-y-3 text-center">
          <img
            src="/assets/images/logo_ruou_sam.png"
            alt="Rượu Sâm Ngọc Linh Logo"
            className="mx-auto h-16 w-16 rounded-full object-cover shadow-sm border border-gray-100"
          />
          <h1 className="text-2xl font-bold tracking-tight text-gray-900 font-display-lg">
            Đăng nhập tài khoản
          </h1>
          <p className="text-xs text-gray-500 font-medium">
            Tài khoản thử nghiệm: <code className="bg-gray-100 px-1 py-0.5 rounded font-mono text-[10px]">user@mail.com</code> / <code className="bg-gray-100 px-1 py-0.5 rounded font-mono text-[10px]">aaAA@123</code>
          </p>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-200">
          <button
            type="button"
            className="flex-1 pb-3 text-center border-b-2 border-primary text-xs font-bold text-primary transition-all"
          >
            Đăng nhập bằng Email
          </button>
          <button
            type="button"
            disabled
            className="flex-1 pb-3 text-center border-b-2 border-transparent text-xs font-medium text-gray-400 cursor-not-allowed"
          >
            Đăng nhập bằng SĐT (Bảo trì)
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-xs font-medium flex items-center gap-1.5">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-red-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <span>{error}</span>
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
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm bg-white"
              placeholder="nhap-email@ruousamngoclinh.vn"
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
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm bg-white"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <div className="flex items-center gap-2">
            <input
              id="remember"
              type="checkbox"
              className="rounded border-gray-300 text-primary focus:ring-primary w-4 h-4 cursor-pointer"
            />
            <label htmlFor="remember" className="text-xs text-gray-500 font-medium cursor-pointer">
              Tin tưởng thiết bị này 30 ngày
            </label>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#1C3F24] hover:bg-[#15301B] text-white font-bold py-3 rounded-xl shadow-md transition-all text-sm flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {loading ? (
              <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
            ) : (
              <span>Đăng nhập</span>
            )}
          </button>
        </form>

        <div className="pt-4 border-t border-gray-150 text-center">
          <p className="text-xs text-gray-500 mb-3 font-medium">Bạn chưa có tài khoản?</p>
          <a
            href="/sign-up"
            className="inline-block w-full bg-[#4CAF50] hover:bg-emerald-600 text-white font-bold py-3 rounded-xl text-sm shadow-sm transition-all text-center"
          >
            Tạo tài khoản mới
          </a>
        </div>
      </div>
    </div>
  );
}
