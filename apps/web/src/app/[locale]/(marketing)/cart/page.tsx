import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
import { Link } from '@/libs/I18nNavigation';

type CartPageProps = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'Giỏ Hàng | Rượu Sâm Ngọc Linh',
    description: 'Quản lý giỏ hàng và tiến hành thanh toán sản phẩm sâm Ngọc Linh.',
  };
}

export default async function CartPage(props: CartPageProps) {
  const { locale } = await props.params;
  setRequestLocale(locale);

  const steps = [
    { label: "Giỏ hàng", active: true },
    { label: "Xác nhận", active: false },
    { label: "Thanh toán", active: false },
    { label: "Hoàn thành", active: false }
  ];

  return (
    <div className="w-full bg-gray-50 min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-10">
        
        {/* Step Progress Indicator */}
        <div className="flex items-center justify-between max-w-2xl mx-auto relative px-4">
          {/* Progress bar background line */}
          <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-0.5 bg-gray-200 z-0"></div>
          
          {steps.map((step, idx) => (
            <div key={idx} className="flex flex-col items-center relative z-10">
              <div className={`w-9 h-9 rounded-full flex items-center justify-center border-2 transition-all ${
                step.active
                  ? 'bg-primary border-primary text-white shadow-sm shadow-primary/20'
                  : 'bg-white border-gray-300 text-gray-400'
              }`}>
                {idx === 0 && (
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                )}
                {idx === 1 && (
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                )}
                {idx === 2 && (
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                  </svg>
                )}
                {idx === 3 && (
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  </svg>
                )}
              </div>
              <span className={`text-[10px] font-bold mt-2 uppercase tracking-wider ${
                step.active ? 'text-primary' : 'text-gray-400'
              }`}>
                {step.label}
              </span>
            </div>
          ))}
        </div>

        {/* Empty Cart Box */}
        <div className="bg-white border border-gray-200 rounded-3xl p-12 sm:p-16 text-center space-y-6 shadow-sm">
          
          <h2 className="text-2xl font-black text-gray-950 flex items-center justify-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            Giỏ hàng của bạn
          </h2>

          <div className="space-y-4 max-w-sm mx-auto">
            {/* Big Cart Icon */}
            <div className="w-20 h-20 rounded-full bg-gray-50 flex items-center justify-center text-gray-300 mx-auto">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            
            <div className="space-y-1">
              <p className="font-bold text-gray-900 text-sm">Giỏ hàng trống</p>
              <p className="text-xs text-gray-400 font-medium">Hãy thêm một số sản phẩm vào giỏ hàng của bạn</p>
            </div>
          </div>

          <Link href="/ginseng" className="inline-block bg-primary hover:bg-primary-hover text-white font-bold px-8 py-3 rounded-xl text-xs transition-colors shadow-md shadow-primary/10">
            Khám phá sản phẩm
          </Link>
        </div>

      </div>
    </div>
  );
}
