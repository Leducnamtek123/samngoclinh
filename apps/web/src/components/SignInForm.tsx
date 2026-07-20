'use client';

import React, { useState } from 'react';
import { useSearchParams } from 'next/navigation';

export default function SignInForm() {
  const searchParams = useSearchParams();
  const reason = searchParams?.get('reason');

  const [activeTab, setActiveTab] = useState<'email' | 'phone'>('email');
  const [showToast, setShowToast] = useState(!!reason);
  
  // Email states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Phone states
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [infoMessage, setInfoMessage] = useState('');

  const getReasonMessage = (resVal: string | null) => {
    switch (resVal) {
      case 'campaigns':
        return {
          title: 'Vui lòng đăng nhập',
          description: 'Bạn cần đăng nhập để nhận cây sâm 1 năm.',
        };
      case 'ginseng':
        return {
          title: 'Vui lòng đăng nhập',
          description: 'Bạn cần đăng nhập để truy cập tính năng Trồng sâm.',
        };
      case 'trading-floor':
        return {
          title: 'Vui lòng đăng nhập',
          description: 'Bạn cần đăng nhập để tham gia Sàn ký gửi.',
        };
      case 'cart':
        return {
          title: 'Vui lòng đăng nhập',
          description: 'Bạn cần đăng nhập để xem giỏ hàng của mình.',
        };
      default:
        return {
          title: 'Vui lòng đăng nhập',
          description: 'Bạn cần đăng nhập để tiếp tục truy cập trang này.',
        };
    }
  };

  const handleSendOtp = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (!phone) {
      setError('Vui lòng nhập số điện thoại.');
      return;
    }
    setLoading(true);
    setError('');
    setInfoMessage('');

    try {
      const res = await fetch('/api/auth/send-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ phone }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Gửi mã OTP thất bại');
      }

      setOtpSent(true);
      setInfoMessage(`Mã OTP đã được gửi. Sử dụng mã OTP thật vừa sinh: ${data.otp}`);
    } catch (err: any) {
      setError(err.message || 'Đã xảy ra lỗi khi gửi OTP');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setInfoMessage('');

    try {
      const payload = activeTab === 'email' 
        ? { email, password, type: 'email' }
        : { phone, otp, type: 'phone' };

      const res = await fetch('/api/auth/sign-in', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Đăng nhập thất bại');
      }

      // Redirect to homepage or admin panel based on role email
      if (data.email && (data.email === 'admin@mail.com' || data.email.includes('admin'))) {
        window.location.href = `http://localhost:3003/en?token=${data.token}&refreshToken=${data.refreshToken || ''}&expiresIn=${data.expiresIn || 3600}`;
      } else {
        window.location.href = '/';
      }
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
            src="/assets/images/logo_ruou_sam.png?v=2"
            alt="Rượu Sâm Ngọc Linh Logo"
            className="mx-auto h-16 w-16 object-contain"
          />
          <h1 className="text-2xl font-bold tracking-tight text-gray-900 font-display-lg">
            Đăng nhập tài khoản
          </h1>
          <p className="text-xs text-gray-500 font-medium">
            Tài khoản thử nghiệm: <code className="bg-gray-100 px-1 py-0.5 rounded font-mono text-[10px]">{activeTab === 'email' ? 'user@mail.com' : '0847234234'}</code> / <code className="bg-gray-100 px-1 py-0.5 rounded font-mono text-[10px]">{activeTab === 'email' ? 'aaAA@123' : 'OTP: 123456'}</code>
          </p>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-200">
          <button
            type="button"
            onClick={() => {
              setActiveTab('email');
              setError('');
              setInfoMessage('');
            }}
            className={`flex-1 pb-3 text-center border-b-2 text-xs font-bold transition-all ${
              activeTab === 'email' ? 'border-primary text-primary' : 'border-transparent text-gray-400'
            }`}
          >
            Đăng nhập bằng Email
          </button>
          <button
            type="button"
            onClick={() => {
              setActiveTab('phone');
              setError('');
              setInfoMessage('');
            }}
            className={`flex-1 pb-3 text-center border-b-2 text-xs font-bold transition-all ${
              activeTab === 'phone' ? 'border-primary text-primary' : 'border-transparent text-gray-400'
            }`}
          >
            Đăng nhập bằng SĐT
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

          {infoMessage && (
            <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 px-4 py-3 rounded-lg text-xs font-medium flex items-center gap-1.5">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-emerald-600 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>{infoMessage}</span>
            </div>
          )}

          {/* Email Tab Fields */}
          {activeTab === 'email' && (
            <>
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
            </>
          )}

          {/* Phone Tab Fields */}
          {activeTab === 'phone' && (
            <>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-gray-500" htmlFor="phone">
                  Số điện thoại
                </label>
                <div className="flex gap-2">
                  <input
                    id="phone"
                    type="tel"
                    required
                    disabled={otpSent}
                    className="flex-1 px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm bg-white disabled:bg-gray-50 disabled:text-gray-400"
                    placeholder="0847 234 234"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                  />
                  {!otpSent && (
                    <button
                      type="button"
                      disabled={loading}
                      onClick={handleSendOtp}
                      className="px-4 py-3 bg-[#1C3F24] hover:bg-[#15301B] text-white font-bold rounded-xl text-xs shadow-sm transition-all whitespace-nowrap"
                    >
                      Gửi mã OTP
                    </button>
                  )}
                </div>
              </div>

              {otpSent && (
                <div className="space-y-1.5">
                  <div className="flex justify-between items-center">
                    <label className="text-xs font-semibold uppercase tracking-wider text-gray-500" htmlFor="otp">
                      Mã xác thực OTP
                    </label>
                    <button
                      type="button"
                      onClick={() => {
                        setOtpSent(false);
                        setOtp('');
                        setInfoMessage('');
                      }}
                      className="text-xs font-semibold text-secondary hover:text-secondary-hover transition-colors"
                    >
                      Thay đổi SĐT
                    </button>
                  </div>
                  <input
                    id="otp"
                    type="text"
                    required
                    maxLength={6}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm bg-white tracking-widest text-center font-bold text-lg"
                    placeholder="••••••"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                  />
                </div>
              )}
            </>
          )}

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
            disabled={loading || (activeTab === 'phone' && !otpSent)}
            className="w-full bg-[#1C3F24] hover:bg-[#15301B] text-white font-bold py-3.5 rounded-xl shadow-md transition-all text-sm flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
            ) : (
              <span>{activeTab === 'email' ? 'Đăng nhập' : 'Xác nhận & Đăng nhập'}</span>
            )}
          </button>
        </form>

        <div className="pt-4 border-t border-gray-150 text-center">
          <p className="text-xs text-gray-500 mb-3 font-medium">Bạn chưa có tài khoản?</p>
          <a
            href="/sign-up"
            className="inline-block w-full bg-[#4CAF50] hover:bg-emerald-600 text-white font-bold py-3.5 rounded-xl text-sm shadow-sm transition-all text-center"
          >
            Tạo tài khoản mới
          </a>
        </div>
      </div>

      {/* Red Floating Toast at Bottom-Right */}
      {showToast && reason && (
        <div className="fixed bottom-6 right-6 z-50 max-w-sm w-full bg-[#EF4444] text-white rounded-2xl shadow-2xl p-4 flex gap-3.5 border border-red-400/20 animate-in fade-in slide-in-from-bottom-10 duration-300">
          <div className="bg-white/20 p-2 rounded-xl h-10 w-10 flex items-center justify-center shrink-0">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m0-10.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.75c0 5.592 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.57-.598-3.75h-.152c-3.196 0-6.1-1.249-8.25-3.286Zm0 13.036h.008v.008H12v-.008Z" />
            </svg>
          </div>
          <div className="flex-1 space-y-1">
            <h4 className="font-bold text-sm tracking-wide text-left">{getReasonMessage(reason).title}</h4>
            <p className="text-xs text-white/90 font-medium leading-relaxed text-left">{getReasonMessage(reason).description}</p>
          </div>
          <button 
            type="button" 
            onClick={() => setShowToast(false)} 
            className="text-white/70 hover:text-white transition-colors shrink-0 align-top self-start"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      )}
    </div>
  );
}
