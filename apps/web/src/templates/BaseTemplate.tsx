export const BaseTemplate = (props: {
  leftNav: React.ReactNode;
  rightNav?: React.ReactNode;
  children: React.ReactNode;
}) => {

  return (
    <div className="w-full text-gray-800 antialiased bg-brand-bg min-h-screen flex flex-col font-sans">
      {/* Top Navbar */}
      <header className="sticky top-0 z-50 w-full bg-white/90 border-b border-gray-200/80 backdrop-blur-md">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 h-20 flex justify-between items-center">
          {/* Logo & Navigation */}
          <div className="flex items-center gap-8 md:gap-12">
            <a href="/" className="flex items-center gap-2.5 group">
              <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white shadow-sm shadow-primary/20">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="w-5.5 h-5.5 text-secondary"
                >
                  <path d="m12 3-10 9h3v8a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-8h3L12 3z" />
                  <path d="M9 22V12h6v10" />
                </svg>
              </div>
              <span className="font-bold text-[22px] tracking-tight text-primary font-display-lg">
                iWE FARM
              </span>
            </a>

            {/* Menu Links */}
            <nav className="hidden md:block">
              <ul className="flex items-center gap-6 text-sm font-semibold text-gray-600">
                {props.leftNav}
              </ul>
            </nav>
          </div>

          {/* Right Action Buttons */}
          <div className="flex items-center gap-4">
            <ul className="flex items-center gap-4 text-sm font-semibold">
              {props.rightNav}
            </ul>
          </div>
        </div>
      </header>

      {/* Main Content (Allow full-width sections) */}
      <main className="flex-grow w-full">
        {props.children}
      </main>

      {/* Footer */}
      <footer className="w-full bg-primary text-gray-300 border-t border-gray-800">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
            <div className="md:col-span-2 space-y-6">
              <span className="font-bold text-2xl text-white tracking-wider font-display-lg block">
                iWE FARM
              </span>
              <p className="text-sm text-gray-400 max-w-sm leading-relaxed">
                © {new Date().getFullYear()} iWE FARM. Digital Asset Agriculture. Nền tảng tiên phong trong việc số hóa và minh bạch chuỗi cung ứng sâm Ngọc Linh tại Việt Nam.
              </p>
              <div className="flex gap-4 text-secondary">
                <span className="text-xs text-gray-500">Trụ sở: 123 Đường Nam Trà My, Tỉnh Quảng Nam, Việt Nam. Hotline: 0847 234 234</span>
              </div>
            </div>
            <div className="space-y-4">
              <h5 className="text-white font-bold text-sm">Sản phẩm</h5>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a className="hover:text-secondary transition-colors" href="#">Marketplace</a></li>
                <li><a className="hover:text-secondary transition-colors" href="#">Vườn kỹ thuật số</a></li>
                <li><a className="hover:text-secondary transition-colors" href="#">Gói chăm sóc</a></li>
              </ul>
            </div>
            <div className="space-y-4">
              <h5 className="text-white font-bold text-sm">Hỗ trợ</h5>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a className="hover:text-secondary transition-colors" href="#">Liên hệ</a></li>
                <li><a className="hover:text-secondary transition-colors" href="#">Chính sách bảo mật</a></li>
                <li><a className="hover:text-secondary transition-colors" href="#">Điều khoản sử dụng</a></li>
              </ul>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};
