import { Sprout, Info, BadgePercent } from 'lucide-react';
import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { cookies } from 'next/headers';
import { FreeTreeOfferGrid } from '@/components/campaigns/FreeTreeOfferGrid';
import { PageBannerSlider } from '@/components/PageBannerSlider';
import { fetchApi } from '@/lib/Api';

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
      next: { revalidate: 10 },
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
      title:
        locale === 'en' ? 'Free 1-Year Ginseng Tree Program' : 'Chương trình Tặng cây sâm 1 năm',
      subtitle:
        locale === 'en'
          ? 'Select eligible 1-year tree, complete care package and receive special promotion for qualified accounts.'
          : 'Chọn cây sâm 1 năm phù hợp, hoàn tất gói chăm sóc và bảo vệ cây để nhận ưu đãi dành riêng cho tài khoản đủ điều kiện.',
      image: '/images/banners/campaigns_banner.png',
      order: 0,
    },
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
      <div className="animate-fade-in min-h-screen w-full bg-slate-50 pb-16">
        <PageBannerSlider banners={banner || []} />
        <div className="mx-auto max-w-4xl space-y-4 px-4 py-16 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-amber-100 text-amber-600 shadow-inner">
            <Info className="h-8 w-8" />
          </div>
          <h3 className="text-xl font-bold text-slate-800">
            {locale === 'en' ? 'Campaign currently not active' : 'Chương trình hiện chưa kích hoạt'}
          </h3>
          <p className="mx-auto max-w-md font-medium text-slate-500">
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
      <div className="min-h-screen w-full bg-slate-50 pb-16">
        <PageBannerSlider banners={banner || []} />
        <div className="mx-auto max-w-4xl space-y-4 px-4 py-16 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-amber-100 text-amber-600 shadow-inner">
            <Sprout className="h-8 w-8" />
          </div>
          <h3 className="text-xl font-bold text-slate-800">
            {locale === 'en' ? 'Updating tree list' : 'Đang cập nhật danh sách'}
          </h3>
          <p className="mx-auto max-w-md font-medium text-slate-500">
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
    id: `${primaryItem.id}-${i}`,
  }));

  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-slate-50 via-emerald-50/20 to-slate-50 pb-20">
      {/* Hero Banner Section */}
      <PageBannerSlider banners={banner || []} />

      <main className="mx-auto max-w-7xl space-y-8 px-4 py-10 sm:px-6 lg:px-8">
        {/* Grid Title */}
        <div className="flex flex-col justify-between gap-4 border-b border-slate-200/70 pb-4 sm:flex-row sm:items-end">
          <div>
            <div className="mb-2 inline-flex items-center gap-1.5 rounded-full bg-emerald-100/70 px-3 py-1 text-xs font-bold tracking-wider text-emerald-700 uppercase">
              <BadgePercent className="h-3.5 w-3.5" />
              <span>{t('badge')}</span>
            </div>
            <h2 className="text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">
              {t('title')}
            </h2>
          </div>
          <p className="max-w-md text-xs font-medium text-slate-500 sm:text-sm">{t('subtitle')}</p>
        </div>

        {/* Grid of Plant Offer Cards with Claim Modal */}
        <FreeTreeOfferGrid slots={slots} token={token} />
      </main>
    </div>
  );
}
