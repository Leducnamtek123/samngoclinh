import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
import { fetchApi } from '@/libs/Api';

type ProductsPageProps = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'Cửa Hàng Cây Giống | Rượu Sâm Ngọc Linh',
    description: 'Sở hữu và bảo tồn cây sâm Ngọc Linh chuẩn nguồn gốc qua công nghệ số hóa.',
  };
}

async function getPlants() {
  try {
    const res = await fetchApi('/public/catalog/plants', {
      cache: 'no-store'
    });
    if (!res.ok) {
      return [];
    }
    const json = await res.json();
    return json.data?.items || [];
  } catch (error) {
    console.error('Error fetching plants:', error);
    return [];
  }
}

export default async function ProductsPage(props: ProductsPageProps) {
  const { locale } = await props.params;
  setRequestLocale(locale);

  const items = await getPlants();

  // Fallback plants if API is empty
  const displayItems = items.length > 0 ? items : [
    {
      id: "fallback-plant-1",
      name: "Cây Sâm Ngọc Linh 2026",
      code: "plant-1y",
      origin: "Nam Trà My",
      price: 84758,
      age: 1,
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuD0gUrpDrfeFU_Yv52ojl__qDMu2iJBO5s34hrrsjYkLHK6Bhkz9mXaPsd4VPh7xDjttnsKtxie18TWAQSN-a44V3A3J9nHUQ15fnz3b8q9I_jGsiyWBzQoJcFp_LxW2lLvdKKOkoavmo-dncTVg7pAmy5QugtUYr9GgiW25eWHkOaLN8OkMDTpDqT1KRBXZjmHNuWHC9b20wnUhbHEHn9I_7KyjAWxOoh3g2MxGyF4yMbVilr4Z-Q8",
    },
    {
      id: "fallback-plant-2",
      name: "Cây Sâm Ngọc Linh 2025",
      code: "plant-2y",
      origin: "Đắk Glei",
      price: 330103,
      age: 2,
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuD0gUrpDrfeFU_Yv52ojl__qDMu2iJBO5s34hrrsjYkLHK6Bhkz9mXaPsd4VPh7xDjttnsKtxie18TWAQSN-a44V3A3J9nHUQ15fnz3b8q9I_jGsiyWBzQoJcFp_LxW2lLvdKKOkoavmo-dncTVg7pAmy5QugtUYr9GgiW25eWHkOaLN8OkMDTpDqT1KRBXZjmHNuWHC9b20wnUhbHEHn9I_7KyjAWxOoh3g2MxGyF4yMbVilr4Z-Q8",
    },
    {
      id: "fallback-plant-3",
      name: "Cây Sâm Ngọc Linh 2024",
      code: "plant-3y",
      origin: "Hợp tác xã",
      price: 873547,
      age: 3,
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuD0gUrpDrfeFU_Yv52ojl__qDMu2iJBO5s34hrrsjYkLHK6Bhkz9mXaPsd4VPh7xDjttnsKtxie18TWAQSN-a44V3A3J9nHUQ15fnz3b8q9I_jGsiyWBzQoJcFp_LxW2lLvdKKOkoavmo-dncTVg7pAmy5QugtUYr9GgiW25eWHkOaLN8OkMDTpDqT1KRBXZjmHNuWHC9b20wnUhbHEHn9I_7KyjAWxOoh3g2MxGyF4yMbVilr4Z-Q8",
    }
  ];

  const filterAges = [
    { label: "1 năm", count: 17 },
    { label: "2 năm", count: 30 },
    { label: "3 năm", count: 57 },
    { label: "4 năm", count: 3 },
    { label: "5 năm", count: 2 },
    { label: "Trên 5 năm", count: 0 },
  ];

  return (
    <div className="w-full bg-gray-50 min-h-screen pb-16">
      {/* Hero Banner Section */}
      <section className="bg-[#1C3F24]/5 bg-[url('/assets/images/banner_bg.png')] bg-cover py-16 px-4 md:px-8 border-b border-gray-200">
        <div className="max-w-7xl mx-auto text-center space-y-4">
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary border border-primary/20 px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider">
            🛒 Cửa hàng cây giống
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-primary leading-tight font-display-lg">
            Cửa Hàng Cây Giống Digital
          </h1>
          <p className="text-gray-600 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
            Sở hữu và theo dõi quá trình sinh trưởng của cây sâm thật thông qua định danh số hóa.
          </p>
        </div>
      </section>

      {/* Main Catalog Layout */}
      <section className="max-w-7xl mx-auto px-4 md:px-8 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* Left Column Filters */}
          <div className="space-y-6 lg:col-span-1">
            <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm space-y-6">
              <div className="space-y-2">
                <h4 className="font-bold text-gray-900 text-sm">Tìm kiếm sản phẩm</h4>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Tìm kiếm cây trái, giống cây..."
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 pl-9 text-xs focus:outline-none focus:border-primary bg-white"
                  />
                  <div className="absolute left-3 top-3 text-gray-400">
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                </div>
              </div>

              <div className="space-y-3 pt-2 border-t border-gray-100">
                <h4 className="font-bold text-gray-900 text-sm">Lọc theo tuổi</h4>
                <div className="space-y-2">
                  {filterAges.map((age, idx) => (
                    <label key={idx} className="flex items-center gap-2.5 text-xs text-gray-600 cursor-pointer font-medium hover:text-primary">
                      <input
                        type="checkbox"
                        className="rounded border-gray-300 text-primary focus:ring-primary w-3.5 h-3.5"
                      />
                      <span>{age.label} <span className="text-gray-400">({age.count})</span></span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Right Column Catalog Grid */}
          <div className="lg:col-span-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {displayItems.map((item: any) => (
                <div
                  key={item.id}
                  className="bg-white border border-gray-200 rounded-2xl overflow-hidden hover:shadow-lg transition-all flex flex-col justify-between"
                >
                  {/* Plant Card Header */}
                  <div>
                    <div className="relative h-60 bg-gray-50 flex items-center justify-center p-3">
                      <img
                        src={item.image || "https://lh3.googleusercontent.com/aida-public/AB6AXuD0gUrpDrfeFU_Yv52ojl__qDMu2iJBO5s34hrrsjYkLHK6Bhkz9mXaPsd4VPh7xDjttnsKtxie18TWAQSN-a44V3A3J9nHUQ15fnz3b8q9I_jGsiyWBzQoJcFp_LxW2lLvdKKOkoavmo-dncTVg7pAmy5QugtUYr9GgiW25eWHkOaLN8OkMDTpDqT1KRBXZjmHNuWHC9b20wnUhbHEHn9I_7KyjAWxOoh3g2MxGyF4yMbVilr4Z-Q8"}
                        alt={item.name}
                        className="max-h-full max-w-full object-contain rounded-xl"
                      />
                      <span className="absolute top-3 left-3 bg-primary text-white text-[10px] font-bold px-2 py-0.5 rounded">
                        TUỔI: {item.age} NĂM
                      </span>
                    </div>

                    {/* Plant Details */}
                    <div className="p-5 space-y-3">
                      <h3 className="font-bold text-gray-900 text-sm leading-snug">
                        {item.name}
                      </h3>
                      <div className="flex justify-between items-center text-[10px] text-gray-500 font-medium">
                        <span>Mã số: {item.code}</span>
                        <span className="text-primary font-semibold">{item.origin}</span>
                      </div>
                    </div>
                  </div>

                  {/* Plant Card Action */}
                  <div className="p-5 pt-0">
                    <div className="flex items-center justify-between pt-3.5 border-t border-gray-100">
                      <div>
                        <p className="text-[9px] text-gray-400 uppercase font-semibold">Giá đầu tư</p>
                        <p className="font-bold text-secondary text-sm">{item.price.toLocaleString('vi-VN')} đ</p>
                      </div>
                      <button className="p-2 bg-[#4CAF50] hover:bg-emerald-600 text-white rounded-lg transition-colors flex items-center justify-center gap-1 px-4 py-2 text-xs font-bold shadow-sm">
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                        <span>Mua ngay</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
