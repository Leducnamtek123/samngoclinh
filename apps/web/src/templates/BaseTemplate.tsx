'use client';

import { useState } from 'react';

export const BaseTemplate = (props: {
  leftNav: React.ReactNode;
  rightNav?: React.ReactNode;
  children: React.ReactNode;
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="w-full text-gray-800 antialiased bg-brand-bg min-h-screen flex flex-col font-sans overflow-x-hidden">
      {/* Top Navbar */}
      <header className="fixed top-0 left-0 right-0 z-50 w-full bg-white/95 border-b border-gray-200/80 backdrop-blur-md shadow-xs">
        <div className="mx-auto max-w-7xl px-0 h-16 sm:h-20 flex items-center justify-between gap-3">
          {/* Left: Brand Logo & Mobile Toggle */}
          <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
            {/* Hamburger button for Mobile */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 text-gray-600 hover:text-primary focus:outline-none rounded-lg hover:bg-gray-100 transition-colors"
              aria-label="Toggle Navigation Menu"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                {isMobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>

            {/* Brand Logo */}
            <a href="/" className="h-8 inline-flex items-center gap-2 group flex-shrink-0">
              <img
                src="/assets/images/logo_ruou_sam.png?v=2"
                alt="Rượu Sâm Ngọc Linh Logo"
                className="w-7 h-7 sm:w-8 sm:h-8 object-contain flex-shrink-0"
              />
              <span className="font-bold text-base sm:text-lg md:text-xl lg:text-[22px] tracking-tight text-primary font-display-lg whitespace-nowrap leading-none inline-flex items-center">
                Rượu Sâm Ngọc Linh
              </span>
            </a>
          </div>

          {/* Center: Desktop Menu Links */}
          <nav className="hidden md:flex items-center justify-center flex-1 mx-2 lg:mx-4 min-w-0">
            <ul className="flex items-center gap-4 lg:gap-6 xl:gap-8 font-semibold text-gray-600">
              {props.leftNav}
            </ul>
          </nav>

          {/* Right Action Buttons */}
          <div className="flex items-center gap-3 sm:gap-4 flex-shrink-0">
            <ul className="flex items-center gap-3 sm:gap-4 text-sm font-semibold">
              {props.rightNav}
            </ul>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {isMobileMenuOpen && (
          <div className="md:hidden fixed inset-0 z-50 flex">
            {/* Backdrop Overlay */}
            <div
              className="fixed inset-0 bg-black/40 backdrop-blur-xs transition-opacity"
              onClick={() => setIsMobileMenuOpen(false)}
            />

            {/* Slide-out Drawer Content */}
            <div className="relative w-4/5 max-w-xs bg-white h-full shadow-2xl flex flex-col py-6 px-5 overflow-y-auto z-10 animate-in slide-in-from-left duration-200">
              <div className="flex items-center justify-between border-b border-gray-100 pb-4 mb-4">
                <a href="/" className="flex items-center gap-2" onClick={() => setIsMobileMenuOpen(false)}>
                  <img
                    src="/assets/images/logo_ruou_sam.png?v=2"
                    alt="Rượu Sâm Ngọc Linh Logo"
                    className="w-7 h-7 object-contain"
                  />
                  <span className="font-bold text-base text-primary font-display-lg">
                    Rượu Sâm Ngọc Linh
                  </span>
                </a>
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-1.5 text-gray-400 hover:text-gray-700 rounded-lg hover:bg-gray-100"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Navigation Links inside Drawer */}
              <nav className="flex-1">
                <ul className="flex flex-col gap-3 text-sm font-semibold text-gray-700" onClick={() => setIsMobileMenuOpen(false)}>
                  {props.leftNav}
                </ul>
              </nav>
            </div>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="flex-grow w-full pt-16 sm:pt-20">
        {props.children}
      </main>

      {/* Footer */}
      <footer className="w-full bg-primary text-gray-300 border-t border-gray-800">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
            <div className="sm:col-span-2 space-y-4 sm:space-y-6">
              <span className="font-bold text-xl sm:text-2xl text-white tracking-wider font-display-lg block">
                Rượu Sâm Ngọc Linh
              </span>
              <p className="text-xs sm:text-sm text-gray-400 max-w-sm leading-relaxed">
                © {new Date().getFullYear()} Rượu Sâm Ngọc Linh. Nền tảng số hóa và minh bạch chuỗi cung ứng rượu sâm Ngọc Linh cao cấp tại Việt Nam.
              </p>
              <div className="flex gap-4 text-secondary">
                <span className="text-xs text-gray-500 leading-relaxed">Trụ sở: 123 Đường Nam Trà My, Tỉnh Quảng Nam, Việt Nam. Hotline: 0847 234 234</span>
              </div>
            </div>
            <div className="space-y-3 sm:space-y-4">
              <h5 className="text-white font-bold text-sm">Sản phẩm</h5>
              <ul className="space-y-2 text-xs sm:text-sm text-gray-400">
                <li><a className="hover:text-secondary transition-colors" href="/trading-floor">Marketplace</a></li>
                <li><a className="hover:text-secondary transition-colors" href="/products">Vườn kỹ thuật số</a></li>
                <li><a className="hover:text-secondary transition-colors" href="/ginseng">Gói chăm sóc</a></li>
              </ul>
            </div>
            <div className="space-y-3 sm:space-y-4">
              <h5 className="text-white font-bold text-sm">Hỗ trợ</h5>
              <ul className="space-y-2 text-xs sm:text-sm text-gray-400">
                <li><a className="hover:text-secondary transition-colors" href="/about">Liên hệ</a></li>
                <li><a className="hover:text-secondary transition-colors" href="/news">Chính sách bảo mật</a></li>
                <li><a className="hover:text-secondary transition-colors" href="/news">Điều khoản sử dụng</a></li>
              </ul>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};
