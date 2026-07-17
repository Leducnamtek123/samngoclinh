import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
import { fetchApi } from '@/libs/Api';
import { Link } from '@/libs/I18nNavigation';

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

export default async function FreeTreePage(props: FreeTreePageProps) {
  const { locale } = await props.params;
  setRequestLocale(locale);

  const campaignData = await getCampaignDetails();

  // Fallback if API fails or returns empty
  const note = campaignData?.note || "Tài khoản cần được xác nhận ID trước khi nhận cây sâm 1 năm.";
  const items = campaignData?.items && campaignData.items.length > 0 ? campaignData.items : [
    {
      id: "fallback-campaign",
      plantName: "Cây Sâm Ngọc Linh 2026",
      price: 84758,
      eligible: false,
      remainingSlots: 23
    }
  ];

  const primaryItem = items[0];

  // We render 4 slots to match the UI layout in the screenshot
  const slots = Array.from({ length: 4 }).map((_, i) => ({
    ...primaryItem,
    id: `${primaryItem.id}-${i}`
  }));

  const imageUrl = "https://lh3.googleusercontent.com/aida-public/AB6AXuD0gUrpDrfeFU_Yv52ojl__qDMu2iJBO5s34hrrsjYkLHK6Bhkz9mXaPsd4VPh7xDjttnsKtxie18TWAQSN-a44V3A3J9nHUQ15fnz3b8q9I_jGsiyWBzQoJcFp_LxW2lLvdKKOkoavmo-dncTVg7pAmy5QugtUYr9GgiW25eWHkOaLN8OkMDTpDqT1KRBXZjmHNuWHC9b20wnUhbHEHn9I_7KyjAWxOoh3g2MxGyF4yMbVilr4Z-Q8";

  return (
    <div className="w-full bg-gray-50 min-h-screen pb-16">
      {/* Hero Banner Section */}
      <section className="bg-primary text-white py-16 px-4 md:px-8 border-b border-gray-800">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Gift Icon */}
          <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center text-2xl shadow-inner">
            🎁
          </div>

          {/* Title & Description */}
          <div className="space-y-4">
            <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight font-display-lg leading-tight">
              Tặng cây sâm 1 năm
            </h1>
            <p className="text-gray-300 text-base sm:text-lg max-w-2xl leading-relaxed">
              Chọn cây sâm 1 năm phù hợp, hoàn tất gói chăm sóc và bảo vệ cây để nhận ưu đãi dành riêng cho tài khoản đủ điều kiện.
            </p>
          </div>

          {/* Warning / Note banner */}
          <div className="bg-white/5 border border-white/10 rounded-xl p-4 max-w-2xl text-sm text-gray-200">
            {note}
          </div>

          {/* Badges / Campaign Meta */}
          <div className="flex flex-wrap gap-4 text-xs font-semibold pt-2">
            <span className="flex items-center gap-1 bg-white/10 px-3 py-1.5 rounded-full text-white">
              🌱 Cây sâm 1 năm
            </span>
            <span className="flex items-center gap-1 bg-white/10 px-3 py-1.5 rounded-full text-white">
              🛡️ Cần gói chăm sóc và bảo vệ
            </span>
            <span className="flex items-center gap-1 bg-white/15 px-3 py-1.5 rounded-full text-secondary">
              ⚡ Còn {primaryItem.remainingSlots} suất
            </span>
          </div>
        </div>
      </section>

      {/* Grid of plants */}
      <section className="max-w-7xl mx-auto px-4 md:px-8 py-12">
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
                  alt={slot.plantName}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Plant info & Action */}
              <div className="p-5 space-y-4">
                <div className="space-y-1">
                  <h3 className="font-bold text-gray-900 text-lg">
                    {slot.plantName}
                  </h3>
                  <p className="text-xs text-gray-400 font-medium">
                    🌱 Cây sâm 1 năm
                  </p>
                </div>

                <div className="text-secondary font-bold text-base pt-1 border-t border-gray-100">
                  {slot.price.toLocaleString('vi-VN')} đ
                </div>

                <Link
                  href="/dashboard"
                  className="block w-full text-center bg-secondary hover:bg-secondary-hover text-white py-3 rounded-lg font-bold transition-colors text-sm shadow-sm"
                >
                  Xác thực để nhận
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
