import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
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

export async function generateMetadata(props: FreeTreePageProps): Promise<Metadata> {
  const { locale } = await props.params;
  const t = await getTranslations({ locale, namespace: 'freeTreeCampaign' });
  return {
    title: `${t('title')} | Sâm Ngọc Linh`,
    description: t('subtitle'),
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

async function getCampaignsBanner(locale: string) {
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
      title: locale === 'en' ? 'Free 1-Year Ginseng Tree Program' : 'Chương trình Tặng cây sâm 1 năm',
      subtitle: locale === 'en'
        ? 'Select eligible 1-year tree, complete care package and receive special promotion for qualified accounts.'
        : 'Chọn cây sâm 1 năm phù hợp, hoàn tất gói chăm sóc và bảo vệ cây để nhận ưu đãi dành riêng cho tài khoản đủ điều kiện.',
      image: '/images/banners/campaigns_banner.png',
      order: 0
    }
  ];
}

export default async function FreeTreePage(props: FreeTreePageProps) {
  const { locale } = await props.params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: 'freeTreeCampaign' });

  const cookieStore = await cookies();
  const token = cookieStore.get('user_session')?.value;

  const [campaignData, banner] = await Promise.all([
    getCampaignDetails(),
    getCampaignsBanner(locale),
  ]);

  if (!campaignData) {
    return (
      <div className="w-full bg-slate-50 min-h-screen pb-16 animate-fade-in">
        <PageBannerSlider banners={banner || []} />
        <div className="max-w-4xl mx-auto px-4 py-16 text-center space-y-4">
          <div className="w-16 h-16 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
            <Info className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-bold text-slate-800">
            {locale === 'en' ? 'Campaign currently not active' : 'Chương trình hiện chưa kích hoạt'}
          </h3>
          <p className="text-slate-500 font-medium max-w-md mx-auto">
            {locale === 'en'
              ? 'This campaign has concluded or is not yet enabled. Please check back soon!'
              : 'Chương trình ưu đãi hiện tại đã kết thúc hoặc chưa được bật từ hệ thống quản trị. Vui lòng quay lại sau!'}
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
          <h3 className="text-xl font-bold text-slate-800">
            {locale === 'en' ? 'Updating tree list' : 'Đang cập nhật danh sách'}
          </h3>
          <p className="text-slate-500 font-medium max-w-md mx-auto">
            {locale === 'en'
              ? 'No promotional trees are currently available in this campaign.'
              : 'Hiện chưa có suất quà tặng hoặc cây sâm khả dụng trong chương trình.'}
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
              <span>{t('badge')}</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              {t('title')}
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 font-medium max-w-md">
            {t('subtitle')}
          </p>
        </div>

        {/* Grid of Plant Offer Cards with Claim Modal */}
        <FreeTreeOfferGrid slots={slots} token={token} />
      </main>
    </div>
  );
}
