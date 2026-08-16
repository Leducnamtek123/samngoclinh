import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
import { fetchApi } from '@/lib/Api';
import { cookies } from 'next/headers';
import { PageBannerSlider } from '@/components/PageBannerSlider';
import { FreeTreeOfferGrid } from '@/components/campaigns/FreeTreeOfferGrid';
import { 
  Sprout, 
  Info, 
  BadgePercent
} from 'lucide-react';

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
    const res = await fetchApi('/public/banners/campaigns', { next: { revalidate: 60 } });
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
      title: 'Chương trình Tặng cây sâm 1 năm',
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
      <div className="w-full bg-slate-50 min-h-screen pb-16 animate-fade-in">
        <PageBannerSlider banners={banner || []} />
        <div className="max-w-4xl mx-auto px-4 py-16 text-center space-y-4">
          <div className="w-16 h-16 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
            <Info className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-bold text-slate-800">Chương trình hiện chưa kích hoạt</h3>
          <p className="text-slate-500 font-medium max-w-md mx-auto">
            Chương trình ưu đãi hiện tại đã kết thúc hoặc chưa được bật từ hệ thống quản trị. Vui lòng quay lại sau!
          </p>
        </div>
      </div>
    );
  }

  const items = campaignData.items || [];
  const primaryItem = items[0];

  if (!primaryItem) {
    return (
      <div className="w-full bg-slate-50 min-h-screen pb-16">
        <PageBannerSlider banners={banner || []} />
        <div className="max-w-4xl mx-auto px-4 py-16 text-center space-y-4">
          <div className="w-16 h-16 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
            <Sprout className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-bold text-slate-800">Đang cập nhật danh sách</h3>
          <p className="text-slate-500 font-medium max-w-md mx-auto">
            Hiện chưa có suất quà tặng hoặc cây sâm khả dụng trong chương trình.
          </p>
        </div>
      </div>
    );
  }

  // Render 4 slots to match the grid UI layout
  const slots = Array.from({ length: 4 }).map((_, i) => ({
    ...primaryItem,
    id: `${primaryItem.id}-${i}`
  }));

  return (
    <div className="w-full bg-gradient-to-b from-slate-50 via-emerald-50/20 to-slate-50 min-h-screen pb-20">
      {/* Hero Banner Section */}
      <PageBannerSlider banners={banner || []} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
        {/* Grid Title */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-slate-200/70 pb-4">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-100/70 px-3 py-1 rounded-full mb-2">
              <BadgePercent className="w-3.5 h-3.5" />
              <span>Danh sách quà tặng</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Cây Sâm Ưu Đãi 1 Năm Tuổi
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 font-medium max-w-md">
            Mỗi tài khoản đủ điều kiện được đăng ký 01 cây sâm kèm gói chăm sóc & bảo vệ tại Kon Tum.
          </p>
        </div>

        {/* Grid of Plant Offer Cards with Claim Modal */}
        <FreeTreeOfferGrid slots={slots} token={token} />
      </main>
    </div>
  );
}

