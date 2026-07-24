import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
import { fetchApi } from '@/libs/Api';
import { Link } from '@/libs/I18nNavigation';
import { cookies } from 'next/headers';
import { PageBannerSlider } from '@/components/PageBannerSlider';

type FreeTreePageProps = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'Tặng Cây Sâm 1 Năm | Rượu Sâm Ngọc Linh',
    description: 'Chương trình ưu đãi sở hữu cây sâm 1 năm dành cho nhà đầu tư đủ điều kiện.',
  };
}

async function getCampaignDetails() {
  try {
    const res = await fetchApi('/public/promotion/free-tree', {
      next: { revalidate: 10 }
    });
    if (!res.ok) {
      return null;
    }
    const json = await res.json();
    return json.data;
  } catch (error) {
    console.error('Error fetching campaign details:', error);
    return null;
  }
}

async function getCampaignsBanner() {
  try {
    const res = await fetchApi('/public/banners/campaigns', { cache: 'no-store' });
    if (res.ok) {
      const json = await res.json();
      return Array.isArray(json.data) ? json.data : [json.data];
    }
  } catch (error) {
    console.error('Error fetching campaigns banner:', error);
  }
  return [
    {
      id: 'campaigns-default',
      pageKey: 'campaigns',
      title: 'Tặng cây sâm 1 năm',
      subtitle: 'Chọn cây sâm 1 năm phù hợp, hoàn tất gói chăm sóc và bảo vệ cây để nhận ưu đãi dành riêng cho tài khoản đủ điều kiện.',
      image: '/images/banners/campaigns_banner.png',
      order: 0
    }
  ];
}

export default async function FreeTreePage(props: FreeTreePageProps) {
  const { locale } = await props.params;
  setRequestLocale(locale);

  const cookieStore = await cookies();
  const token = cookieStore.get('user_session')?.value;

  const [campaignData, banner] = await Promise.all([
    getCampaignDetails(),
    getCampaignsBanner(),
  ]);

  if (!campaignData) {
    return (
      <div className="w-full bg-gray-50 min-h-screen pb-16 animate-fade-in">
        <PageBannerSlider 
          banners={banner || []} 
          badgeText="Khuyến mãi" 
          badgeIcon={
            <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5a2 2 0 10-2 2h2zm-2 4h4a2 2 0 012 2v6a2 2 0 01-2 2h-4a2 2 0 01-2-2v-6a2 2 0 012-2z" />
            </svg>
          }
        />
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-12 text-center text-slate-500 font-semibold">
          Chương trình hiện tại đã kết thúc hoặc chưa được kích hoạt từ trang quản trị. Vui lòng quay lại sau!
        </div>
      </div>
    );
  }

  const note = campaignData.note || "Tài khoản cần được xác nhận ID trước khi nhận cây sâm 1 năm.";
  const items = campaignData.items || [];
  const primaryItem = items[0];

  if (!primaryItem) {
    return (
      <div className="w-full bg-gray-50 min-h-screen pb-16">
        <PageBannerSlider 
          banners={banner || []} 
          badgeText="Khuyến mãi" 
          badgeIcon={
            <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5a2 2 0 10-2 2h2zm-2 4h4a2 2 0 012 2v6a2 2 0 01-2 2h-4a2 2 0 01-2-2v-6a2 2 0 012-2z" />
            </svg>
          }
        />
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-12 text-center text-slate-500 font-semibold">
          Không có suất quà tặng hoặc cây sâm nào khả dụng trong chương trình lúc này.
        </div>
      </div>
    );
  }

  // We render 4 slots to match the UI layout in the screenshot
  const slots = Array.from({ length: 4 }).map((_, i) => ({
    ...primaryItem,
    id: `${primaryItem.id}-${i}`
  }));

  const imageUrl = "https://lh3.googleusercontent.com/aida-public/AB6AXuD0gUrpDrfeFU_Yv52ojl__qDMu2iJBO5s34hrrsjYkLHK6Bhkz9mXaPsd4VPh7xDjttnsKtxie18TWAQSN-a44V3A3J9nHUQ15fnz3b8q9I_jGsiyWBzQoJcFp_LxW2lLvdKKOkoavmo-dncTVg7pAmy5QugtUYr9GgiW25eWHkOaLN8OkMDTpDqT1KRBXZjmHNuWHC9b20wnUhbHEHn9I_7KyjAWxOoh3g2MxGyF4yMbVilr4Z-Q8";

  return (
    <div className="w-full bg-gray-50 min-h-screen pb-16">
      {/* Hero Banner Section */}
      <PageBannerSlider 
        banners={banner || []} 
        badgeText="Chương trình Tặng cây sâm 1 năm" 
        badgeIcon={
          <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5a2 2 0 10-2 2h2zm-2 4h4a2 2 0 012 2v6a2 2 0 01-2 2h-4a2 2 0 01-2-2v-6a2 2 0 012-2z" />
          </svg>
        }
      />

      {/* Grid of plants */}
      <section className="max-w-7xl mx-auto px-4 md:px-8 py-12 space-y-8">
        
        {/* Warning / Note banner */}
        <div className="bg-amber-50 border border-amber-200 text-amber-900 rounded-2xl p-4 max-w-4xl flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="text-sm font-semibold flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-amber-600 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M11 5L6 9H2v6h4l5 4V5zM15.54 8.46a5 5 0 010 7.07" />
            </svg>
            <span>{note}</span>
          </div>
          <div className="flex flex-wrap gap-2 text-xs font-bold">
            <span className="flex items-center gap-1.5 bg-emerald-100 text-emerald-800 px-3 py-1.5 rounded-full">
              Cây sâm 1 năm
            </span>
            <span className="flex items-center gap-1.5 bg-blue-100 text-blue-800 px-3 py-1.5 rounded-full">
              Còn {primaryItem.remainingSlots} suất
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {slots.map((slot) => (
            <div
              key={slot.id}
              className="bg-white border border-gray-200 rounded-2xl overflow-hidden hover:shadow-lg transition-all flex flex-col justify-between"
            >
              {/* Plant Image */}
              <div className="relative h-60 bg-gray-100">
                <img
                  src={imageUrl}
                  alt={slot.plantCatalog?.name || "Sâm Ngọc Linh"}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-3 right-3 bg-[#1C3F24]/90 text-white text-xs font-bold px-2.5 py-1 rounded-lg">
                  {slot.plantCatalog?.ageYear || 1} Năm Tuổi
                </div>
              </div>

              {/* Plant Details */}
              <div className="p-5 flex-1 flex flex-col justify-between">
                <div className="space-y-2">
                  <h3 className="font-bold text-slate-800 text-lg line-clamp-1">
                    {slot.plantCatalog?.name || "Sâm Ngọc Linh"}
                  </h3>
                  <p className="text-slate-500 text-xs line-clamp-2 leading-relaxed">
                    {slot.plantCatalog?.description || "Gói sở hữu cây sâm thật được chăm sóc trực tiếp tại vườn sâm chuẩn nguồn gốc Kon Tum."}
                  </p>
                </div>

                <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between">
                  <div className="text-xs text-slate-400 font-semibold">Giá gói chăm sóc</div>
                  <div className="text-[#D97706] font-extrabold text-base">Miễn phí</div>
                </div>

                <div className="pt-3">
                  <Link
                    href={token ? `/${locale}/portfolio` : `/${locale}/sign-in?reason=campaign`}
                    className="block w-full py-2.5 text-center bg-[#1C3F24] hover:bg-[#15301B] text-white rounded-xl font-bold text-xs transition-colors shadow-sm"
                  >
                    {token ? "Nhận cây ngay" : "Đăng nhập để nhận"}
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
