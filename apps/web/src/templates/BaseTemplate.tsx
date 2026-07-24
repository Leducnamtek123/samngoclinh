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
      <header className="sticky top-0 z-50 w-full bg-white/90 border-b border-gray-200/80 backdrop-blur-md">
        <div className="mx-auto max-w-7xl px-3 sm:px-6 lg:px-8 h-16 sm:h-20 flex justify-between items-center">
          {/* Logo & Navigation */}
          <div className="flex items-center gap-3 sm:gap-6 md:gap-12 min-w-0">
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
            <a href="/" className="flex items-center gap-2 group min-w-0 flex-shrink-0">
              <img
                src="/assets/images/logo_ruou_sam.png?v=2"
                alt="Rượu Sâm Ngọc Linh Logo"
                className="w-8 h-8 sm:w-10 sm:h-10 object-contain flex-shrink-0"
              />
              <span className="font-bold text-sm sm:text-lg md:text-[22px] tracking-tight text-primary font-display-lg truncate max-w-[150px] sm:max-w-none">
                Rượu Sâm Ngọc Linh
              </span>
            </a>

            {/* Desktop Menu Links */}
            <nav className="hidden md:block">
              <ul className="flex items-center gap-5 lg:gap-6 text-sm font-semibold text-gray-600">
                {props.leftNav}
              </ul>
            </nav>
          </div>

          {/* Right Action Buttons */}
          <div className="flex items-center gap-2 sm:gap-4 flex-shrink-0">
            <ul className="flex items-center gap-2 sm:gap-4 text-sm font-semibold">
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
      <main className="flex-grow w-full">
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
