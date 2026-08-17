'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { MapPin, Phone, Mail } from 'lucide-react';
import { Link } from '@/lib/I18nNavigation';
import { MiniCartDrawer } from '@/components/cart/MiniCartDrawer';

export const BaseTemplate = (props: {
  leftNav: React.ReactNode;
  rightNav?: React.ReactNode;
  children: React.ReactNode;
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const t = useTranslations('BaseTemplate');
  const tNav = useTranslations('nav');
  const tCat = useTranslations('categories');

  return (
    <div className="w-full text-gray-800 antialiased bg-brand-bg min-h-screen flex flex-col font-sans overflow-x-hidden">
      {/* Top Navbar */}
      <header className="fixed top-0 left-0 right-0 z-50 w-full bg-white/95 border-b border-gray-200/80 backdrop-blur-md shadow-xs">
        <div className="mx-auto max-w-7xl px-0 h-16 sm:h-20 flex items-center justify-between gap-3">
          {/* Left: Brand Logo & Mobile Toggle */}
          <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
            {/* Hamburger button for Mobile */}
            <button
              type="button"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 text-gray-600 hover:text-primary focus:outline-none rounded-lg hover:bg-gray-100 transition-colors"
              aria-label={t('main_navigation_label')}
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
            <Link href="/" className="h-8 inline-flex items-center gap-2 group flex-shrink-0">
              <Image
                src="/assets/images/logo_ruou_sam.png?v=2"
                alt="Logo"
                width={32}
                height={32}
                unoptimized
                className="w-7 h-7 sm:w-8 sm:h-8 object-contain flex-shrink-0"
              />
              <span className="font-bold text-base sm:text-lg md:text-xl lg:text-[22px] tracking-tight text-primary font-display-lg whitespace-nowrap leading-none inline-flex items-center">
                {t('description')}
              </span>
            </Link>
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
            <button
              type="button"
              aria-label={t('main_navigation_label')}
              className="fixed inset-0 bg-black/40 backdrop-blur-xs transition-colors cursor-pointer border-0 w-full h-full text-left"
              onClick={() => setIsMobileMenuOpen(false)}
            />

            {/* Slide-out Drawer Content */}
            <div className="relative w-4/5 max-w-xs bg-white h-full shadow-2xl flex flex-col py-6 px-5 overflow-y-auto z-10 transition-transform duration-200 animate-in slide-in-from-left">
              <div className="flex items-center justify-between border-b border-gray-100 pb-4 mb-4">
                <Link href="/" className="flex items-center gap-2" onClick={() => setIsMobileMenuOpen(false)}>
                  <Image
                    src="/assets/images/logo_ruou_sam.png?v=2"
                    alt="Logo"
                    width={28}
                    height={28}
                    unoptimized
                    className="w-7 h-7 object-contain"
                  />
                  <span className="font-bold text-base text-primary font-display-lg">
                    {t('description')}
                  </span>
                </Link>
                <button
                  type="button"
                  onClick={() => setIsMobileMenuOpen(false)}
                  aria-label={t('main_navigation_label')}
                  className="p-1.5 text-gray-400 hover:text-gray-700 rounded-lg hover:bg-gray-100"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Navigation Links inside Drawer */}
              <nav className="flex-1">
                <ul className="flex flex-col gap-3 text-sm font-semibold text-gray-700">
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
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 md:gap-10">
            {/* Cột 1: Thông tin thương hiệu & Logo Bộ Công Thương */}
            <div className="sm:col-span-2 lg:col-span-2 space-y-4 sm:space-y-5">
              <div className="flex items-center gap-2.5">
                <Image
                  src="/assets/images/logo_ruou_sam.png?v=2"
                  alt="Logo"
                  width={36}
                  height={36}
                  unoptimized
                  className="w-9 h-9 object-contain"
                />
                <span className="font-bold text-xl sm:text-2xl text-white tracking-wider font-display-lg block">
                  {t('company_name')}
                </span>
              </div>
              <p className="text-xs sm:text-sm text-gray-300/90 max-w-md leading-relaxed">
                {t('footer_text', { year: new Date().getFullYear(), name: t('company_name') })} {t('certified_origin')}
              </p>
              <div className="space-y-2 text-xs sm:text-sm text-gray-400">
                <p className="flex items-start gap-2">
                  <MapPin className="w-4 h-4 text-secondary shrink-0 mt-0.5" />
                  <span>{t('company_address')}</span>
                </p>
                <p className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-secondary shrink-0" />
                  <span>{t('company_hotline')}</span>
                </p>
                <p className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-secondary shrink-0" />
                  <span>{t('company_email')}</span>
                </p>
              </div>

              {/* Logo Đã thông báo Bộ Công Thương */}
              <div className="pt-2">
                <a
                  href="http://online.gov.vn"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block transition-transform hover:scale-105"
                  title="Website E-commerce"
                >
                  <Image
                    src="/assets/images/logo-da-thong-bao-bo-cong-thuong-mau-xanh.png"
                    alt="Certification Badge"
                    width={160}
                    height={60}
                    className="h-12 w-auto object-contain drop-shadow-sm"
                  />
                </a>
              </div>
            </div>

            {/* Cột 2: Sản phẩm */}
            <div className="space-y-3 sm:space-y-4">
              <h5 className="text-white font-bold text-sm tracking-wide uppercase border-b border-gray-700/60 pb-2">
                {tNav('shop')}
              </h5>
              <ul className="space-y-2 text-xs sm:text-sm text-gray-400">
                <li><Link className="hover:text-secondary transition-colors" href="/ginseng">{tNav('planting')}</Link></li>
                <li><Link className="hover:text-secondary transition-colors" href="/products">{tNav('shop')}</Link></li>
                <li><Link className="hover:text-secondary transition-colors" href="/contracts/hop-dong-mua-ban-ky-gui-cham-soc-sam-ngoc-linh">{tNav('contracts')}</Link></li>
              </ul>
            </div>

            {/* Cột 3: Chính sách và Điều khoản */}
            <div className="space-y-3 sm:space-y-4">
              <h5 className="text-white font-bold text-sm tracking-wide uppercase border-b border-gray-700/60 pb-2">
                {t('legal_policies')}
              </h5>
              <ul className="space-y-2 text-xs sm:text-sm text-gray-400">
                <li><Link className="hover:text-secondary transition-colors" href="/terms/privacy-policy">{t('privacy_policy')}</Link></li>
                <li><Link className="hover:text-secondary transition-colors" href="/terms/shipping-policy">{t('shipping_policy')}</Link></li>
                <li><Link className="hover:text-secondary transition-colors" href="/terms/inspection-policy">{t('terms_of_service')}</Link></li>
                <li><Link className="hover:text-secondary transition-colors" href="/terms/return-policy">{t('return_policy')}</Link></li>
              </ul>
            </div>

            {/* Cột 4: Hỗ trợ & Về chúng tôi */}
            <div className="space-y-3 sm:space-y-4">
              <h5 className="text-white font-bold text-sm tracking-wide uppercase border-b border-gray-700/60 pb-2">
                {t('customer_support')}
              </h5>
              <ul className="space-y-2 text-xs sm:text-sm text-gray-400">
                <li><Link className="hover:text-secondary transition-colors" href="/about">{tNav('about')}</Link></li>
                <li><Link className="hover:text-secondary transition-colors" href="/news">{tCat('news')}</Link></li>
                <li><Link className="hover:text-secondary transition-colors" href="/terms">{tNav('terms')}</Link></li>
              </ul>
            </div>
          </div>
        </div>
      </footer>

      {/* Slide-over Mini Cart Drawer */}
      <MiniCartDrawer />
    </div>
  );
};
