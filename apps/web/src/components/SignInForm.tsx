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
      <div className="w-full max-w-5xl bg-white border border-gray-200 rounded-3xl shadow-xl overflow-hidden grid grid-cols-1 md:grid-cols-12 min-h-[500px]">
        {/* Left panel: Recent Logins */}
        <div className="md:col-span-5 bg-gray-50/50 p-8 flex flex-col justify-between border-r border-gray-100">
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <img
                src="/assets/images/logo_ruou_sam.png"
                alt="Logo"
                className="h-10 w-10 rounded-full object-cover shadow-sm border border-gray-200"
              />
              <span className="font-extrabold text-xl text-primary tracking-tight font-display-lg">Rượu Sâm Ngọc Linh</span>
            </div>

            <div className="space-y-2">
              <h2 className="text-xl font-bold text-gray-900 leading-tight">Đăng nhập gần đây</h2>
              <p className="text-xs text-gray-500">Nhấp vào ảnh của bạn hoặc thêm tài khoản.</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => {
                  setEmail('user@mail.com');
                  setPassword('aaAA@123');
                }}
                className="bg-white border border-gray-200 hover:border-primary rounded-2xl p-4 text-center space-y-3 shadow-sm hover:shadow transition-all group flex flex-col items-center justify-center"
              >
                <div className="w-16 h-16 rounded-2xl bg-primary/10 text-primary flex items-center justify-center font-bold text-xl uppercase group-hover:scale-105 transition-transform">
                  KH
                </div>
                <p className="text-xs font-bold text-gray-800 line-clamp-1">Khách Hàng</p>
              </button>

              <button
                onClick={() => {
                  setEmail('admin@mail.com');
                  setPassword('aaAA@123');
                }}
                className="bg-white border border-gray-200 hover:border-primary rounded-2xl p-4 text-center space-y-3 shadow-sm hover:shadow transition-all group flex flex-col items-center justify-center"
              >
                <div className="w-16 h-16 rounded-2xl bg-secondary/15 text-secondary flex items-center justify-center font-bold text-xl uppercase group-hover:scale-105 transition-transform">
                  AD
                </div>
                <p className="text-xs font-bold text-gray-800 line-clamp-1">Quản Trị Viên</p>
              </button>
            </div>
          </div>

          <div className="pt-6 text-[10px] text-gray-400 font-medium">
            © 2026 Rượu Sâm Ngọc Linh. Tất cả quyền được bảo lưu.
          </div>
        </div>

        {/* Right panel: Login Form */}
        <div className="md:col-span-7 p-8 md:p-12 flex flex-col justify-center">
          {/* Tabs */}
          <div className="flex border-b border-gray-200 mb-8">
            <button
              type="button"
              className="flex-1 pb-3 text-center border-b-2 border-primary text-sm font-bold text-primary transition-all"
            >
              📧 Đăng nhập bằng Email
            </button>
            <button
              type="button"
              disabled
              className="flex-1 pb-3 text-center border-b-2 border-transparent text-sm font-medium text-gray-400 cursor-not-allowed"
            >
              📞 Đăng nhập bằng SĐT (Bảo trì)
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm font-medium flex items-center gap-2">
                <span>⚠️</span>
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
                className="w-full px-4 py-3.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm bg-white"
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
                className="w-full px-4 py-3.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm bg-white"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#1C3F24] hover:bg-[#15301B] text-white font-bold py-3.5 rounded-xl shadow-md transition-all text-sm flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? (
                <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
              ) : (
                <span>Đăng nhập</span>
              )}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-gray-150 text-center">
            <p className="text-xs text-gray-500 mb-3 font-medium">Bạn chưa có tài khoản?</p>
            <a
              href="/sign-up"
              className="inline-block w-full sm:w-auto bg-[#4CAF50] hover:bg-emerald-600 text-white font-bold px-8 py-3 rounded-xl text-sm shadow-sm transition-all text-center"
            >
              Tạo tài khoản mới
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
