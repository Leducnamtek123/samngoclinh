'use client';

import { MapPin, Phone, Mail } from 'lucide-react';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { useState } from 'react';
import { MiniCartDrawer } from '@/components/cart/MiniCartDrawer';
import { Link } from '@/lib/I18nNavigation';

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
    <div className="flex min-h-screen w-full flex-col overflow-x-hidden bg-brand-bg font-sans text-gray-800 antialiased">
      {/* Top Navbar */}
      <header className="fixed top-0 right-0 left-0 z-50 w-full border-b border-gray-200/80 bg-white/95 shadow-xs backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-3 px-0 sm:h-20">
          {/* Left: Brand Logo & Mobile Toggle */}
          <div className="flex flex-shrink-0 items-center gap-2 sm:gap-3">
            {/* Hamburger button for Mobile */}
            <button
              type="button"
              onClick={() => {
                setIsMobileMenuOpen(!isMobileMenuOpen);
              }}
              className="rounded-lg p-2 text-gray-600 transition-colors hover:bg-gray-100 hover:text-primary focus:outline-none md:hidden"
              aria-label={t('main_navigation_label')}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2"
              >
                {isMobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>

            {/* Brand Logo */}
            <Link href="/" className="group inline-flex h-8 flex-shrink-0 items-center gap-2">
              <Image
                src="/assets/images/logo_ruou_sam.png?v=2"
                alt="Logo"
                width={32}
                height={32}
                unoptimized
                className="h-7 w-7 flex-shrink-0 object-contain sm:h-8 sm:w-8"
              />
              <span className="font-display-lg inline-flex items-center text-base leading-none font-bold tracking-tight whitespace-nowrap text-primary sm:text-lg md:text-xl lg:text-[22px]">
                {t('description')}
              </span>
            </Link>
          </div>

          {/* Center: Desktop Menu Links */}
          <nav className="mx-2 hidden min-w-0 flex-1 items-center justify-center md:flex lg:mx-4">
            <ul className="flex items-center gap-4 font-semibold text-gray-600 lg:gap-6 xl:gap-8">
              {props.leftNav}
            </ul>
          </nav>

          {/* Right Action Buttons */}
          <div className="flex flex-shrink-0 items-center gap-3 sm:gap-4">
            <ul className="flex items-center gap-3 text-sm font-semibold sm:gap-4">
              {props.rightNav}
            </ul>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {isMobileMenuOpen && (
          <div className="fixed inset-0 z-50 flex md:hidden">
            {/* Backdrop Overlay */}
            <button
              type="button"
              aria-label={t('main_navigation_label')}
              className="fixed inset-0 h-full w-full cursor-pointer border-0 bg-black/40 text-left backdrop-blur-xs transition-colors"
              onClick={() => {
                setIsMobileMenuOpen(false);
              }}
            />

            {/* Slide-out Drawer Content */}
            <div className="animate-in slide-in-from-left relative z-10 flex h-full w-4/5 max-w-xs flex-col overflow-y-auto bg-white px-5 py-6 shadow-2xl transition-transform duration-200">
              <div className="mb-4 flex items-center justify-between border-b border-gray-100 pb-4">
                <Link
                  href="/"
                  className="flex items-center gap-2"
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                  }}
                >
                  <Image
                    src="/assets/images/logo_ruou_sam.png?v=2"
                    alt="Logo"
                    width={28}
                    height={28}
                    unoptimized
                    className="h-7 w-7 object-contain"
                  />
                  <span className="font-display-lg text-base font-bold text-primary">
                    {t('description')}
                  </span>
                </Link>
                <button
                  type="button"
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                  }}
                  aria-label={t('main_navigation_label')}
                  className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-700"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
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
      <main className="w-full flex-grow pt-16 sm:pt-20">{props.children}</main>

      {/* Footer */}
      <footer className="w-full border-t border-gray-800 bg-primary text-gray-300">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-16 lg:px-8">
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-4 md:gap-10 lg:grid-cols-5">
            {/* Cột 1: Thông tin thương hiệu & Logo Bộ Công Thương */}
            <div className="space-y-4 sm:col-span-2 sm:space-y-5 lg:col-span-2">
              <div className="flex items-center gap-2.5">
                <Image
                  src="/assets/images/logo_ruou_sam.png?v=2"
                  alt="Logo"
                  width={36}
                  height={36}
                  unoptimized
                  className="h-9 w-9 object-contain"
                />
                <span className="font-display-lg block text-xl font-bold tracking-wider text-white sm:text-2xl">
                  {t('company_name')}
                </span>
              </div>
              <p className="max-w-md text-xs leading-relaxed text-gray-300/90 sm:text-sm">
                {t('footer_text', { year: new Date().getFullYear(), name: t('company_name') })}{' '}
                {t('certified_origin')}
              </p>
              <div className="space-y-2 text-xs text-gray-400 sm:text-sm">
                <p className="flex items-start gap-2">
                  <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-secondary" />
                  <span>{t('company_address')}</span>
                </p>
                <p className="flex items-center gap-2">
                  <Phone className="h-4 w-4 shrink-0 text-secondary" />
                  <span>{t('company_hotline')}</span>
                </p>
                <p className="flex items-center gap-2">
                  <Mail className="h-4 w-4 shrink-0 text-secondary" />
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
              <h5 className="border-b border-gray-700/60 pb-2 text-sm font-bold tracking-wide text-white uppercase">
                {tNav('shop')}
              </h5>
              <ul className="space-y-2 text-xs text-gray-400 sm:text-sm">
                <li>
                  <Link className="transition-colors hover:text-secondary" href="/ginseng">
                    {tNav('planting')}
                  </Link>
                </li>
                <li>
                  <Link className="transition-colors hover:text-secondary" href="/products">
                    {tNav('shop')}
                  </Link>
                </li>
                <li>
                  <Link
                    className="transition-colors hover:text-secondary"
                    href="/contracts/hop-dong-mua-ban-ky-gui-cham-soc-sam-ngoc-linh"
                  >
                    {tNav('contracts')}
                  </Link>
                </li>
              </ul>
            </div>

            {/* Cột 3: Chính sách và Điều khoản */}
            <div className="space-y-3 sm:space-y-4">
              <h5 className="border-b border-gray-700/60 pb-2 text-sm font-bold tracking-wide text-white uppercase">
                {t('legal_policies')}
              </h5>
              <ul className="space-y-2 text-xs text-gray-400 sm:text-sm">
                <li>
                  <Link
                    className="transition-colors hover:text-secondary"
                    href="/terms/privacy-policy"
                  >
                    {t('privacy_policy')}
                  </Link>
                </li>
                <li>
                  <Link
                    className="transition-colors hover:text-secondary"
                    href="/terms/shipping-policy"
                  >
                    {t('shipping_policy')}
                  </Link>
                </li>
                <li>
                  <Link
                    className="transition-colors hover:text-secondary"
                    href="/terms/inspection-policy"
                  >
                    {t('terms_of_service')}
                  </Link>
                </li>
                <li>
                  <Link
                    className="transition-colors hover:text-secondary"
                    href="/terms/return-policy"
                  >
                    {t('return_policy')}
                  </Link>
                </li>
              </ul>
            </div>

            {/* Cột 4: Hỗ trợ & Về chúng tôi */}
            <div className="space-y-3 sm:space-y-4">
              <h5 className="border-b border-gray-700/60 pb-2 text-sm font-bold tracking-wide text-white uppercase">
                {t('customer_support')}
              </h5>
              <ul className="space-y-2 text-xs text-gray-400 sm:text-sm">
                <li>
                  <Link className="transition-colors hover:text-secondary" href="/about">
                    {tNav('about')}
                  </Link>
                </li>
                <li>
                  <Link className="transition-colors hover:text-secondary" href="/news">
                    {tCat('news')}
                  </Link>
                </li>
                <li>
                  <Link className="transition-colors hover:text-secondary" href="/terms">
                    {tNav('terms')}
                  </Link>
                </li>
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
