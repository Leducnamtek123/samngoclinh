import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
import { fetchApi } from '@/libs/Api';
import { Link } from '@/libs/I18nNavigation';
import { cookies } from 'next/headers';
import { PageBannerSlider } from '@/components/PageBannerSlider';
import { 
  Gift, 
  Sprout, 
  ShieldCheck, 
  Sparkles, 
  CheckCircle2, 
  ArrowRight, 
  Info, 
  Award, 
  UserCheck, 
  HeartHandshake, 
  Zap, 
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
        <PageBannerSlider 
          banners={banner || []} 
          badgeText="Khuyến mãi & Ưu đãi" 
          badgeIcon={<Gift className="w-4 h-4 text-amber-400" />}
        />
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

  const note = campaignData.note || "Tài khoản cần được xác nhận ID trước khi nhận cây sâm 1 năm.";
  const items = campaignData.items || [];
  const primaryItem = items[0];

  if (!primaryItem) {
    return (
      <div className="w-full bg-slate-50 min-h-screen pb-16">
        <PageBannerSlider 
          banners={banner || []} 
          badgeText="Khuyến mãi & Ưu đãi" 
          badgeIcon={<Gift className="w-4 h-4 text-amber-400" />}
        />
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

  const imageUrl = "https://lh3.googleusercontent.com/aida-public/AB6AXuD0gUrpDrfeFU_Yv52ojl__qDMu2iJBO5s34hrrsjYkLHK6Bhkz9mXaPsd4VPh7xDjttnsKtxie18TWAQSN-a44V3A3J9nHUQ15fnz3b8q9I_jGsiyWBzQoJcFp_LxW2lLvdKKOkoavmo-dncTVg7pAmy5QugtUYr9GgiW25eWHkOaLN8OkMDTpDqT1KRBXZjmHNuWHC9b20wnUhbHEHn9I_7KyjAWxOoh3g2MxGyF4yMbVilr4Z-Q8";

  return (
    <div className="w-full bg-gradient-to-b from-slate-50 via-emerald-50/20 to-slate-50 min-h-screen pb-20">
      {/* Hero Banner Section */}
      <PageBannerSlider 
        banners={banner || []} 
        badgeText="Chương trình Tặng cây sâm 1 năm" 
        badgeIcon={<Sparkles className="w-4 h-4 text-amber-300" />}
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
        
        {/* Campaign Info & Status Header Bar */}
        <div className="bg-white/90 backdrop-blur-md border border-amber-200/80 shadow-md rounded-2xl p-5 md:p-6 transition-all hover:shadow-lg">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5">
            {/* Note text */}
            <div className="flex items-start sm:items-center gap-3">
              <div className="p-2.5 bg-amber-100/80 text-amber-700 rounded-xl flex-shrink-0 shadow-xs">
                <Info className="w-5 h-5" />
              </div>
              <div className="space-y-0.5">
                <span className="text-xs font-bold text-amber-700 uppercase tracking-wider block">Thông báo điều kiện</span>
                <p className="text-sm font-semibold text-slate-800 leading-snug">{note}</p>
              </div>
            </div>

            {/* Campaign Pills */}
            <div className="flex flex-wrap items-center gap-2.5 pt-2 lg:pt-0 border-t lg:border-t-0 border-slate-100">
              <div className="inline-flex items-center gap-2 bg-emerald-50 border border-emerald-200/80 text-emerald-800 px-3.5 py-2 rounded-xl text-xs font-bold shadow-2xs">
                <Sprout className="w-4 h-4 text-emerald-600" />
                <span>Cây sâm 1 năm tuổi</span>
              </div>
              <div className="inline-flex items-center gap-2 bg-amber-50 border border-amber-200/80 text-amber-800 px-3.5 py-2 rounded-xl text-xs font-bold shadow-2xs">
                <ShieldCheck className="w-4 h-4 text-amber-600" />
                <span>Còn {primaryItem.remainingSlots ?? 24} suất</span>
              </div>
              <div className="inline-flex items-center gap-2 bg-blue-50 border border-blue-200/80 text-blue-800 px-3.5 py-2 rounded-xl text-xs font-bold shadow-2xs">
                <Gift className="w-4 h-4 text-blue-600" />
                <span>Gói chăm sóc 0đ</span>
              </div>
            </div>
          </div>
        </div>

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

        {/* Grid of Plant Offer Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {slots.map((slot) => (
            <div
              key={slot.id}
              className="group bg-white border border-slate-200/80 rounded-3xl overflow-hidden shadow-xs hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between"
            >
              {/* Plant Image Container */}
              <div className="relative h-64 bg-slate-100 overflow-hidden">
                <img
                  src={imageUrl}
                  alt={slot.plantCatalog?.name || "Sâm Ngọc Linh"}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                />
                
                {/* Top Overlay Gradients */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />

                {/* Floating Badges */}
                <div className="absolute top-3 left-3 flex items-center gap-1.5 bg-white/90 backdrop-blur-md text-slate-800 text-[11px] font-bold px-2.5 py-1 rounded-full shadow-md">
                  <Award className="w-3.5 h-3.5 text-amber-500" />
                  <span>Chuẩn Kon Tum</span>
                </div>

                <div className="absolute top-3 right-3 flex items-center gap-1.5 bg-[#1C3F24]/90 backdrop-blur-md text-white text-[11px] font-bold px-3 py-1 rounded-full shadow-md">
                  <Sprout className="w-3.5 h-3.5 text-emerald-400" />
                  <span>{slot.plantCatalog?.ageYear || 1} Năm Tuổi</span>
                </div>

                {/* Bottom Image Tag */}
                <div className="absolute bottom-3 left-3 right-3 text-white text-xs font-semibold drop-shadow-sm flex items-center justify-between">
                  <span className="bg-black/40 backdrop-blur-xs px-2.5 py-1 rounded-lg">Mã số: SNG-{slot.id.slice(0, 4).toUpperCase()}</span>
                  <span className="bg-emerald-600/90 text-white px-2.5 py-1 rounded-lg text-[11px] font-bold uppercase tracking-wider">Hợp lệ</span>
                </div>
              </div>

              {/* Plant Details */}
              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <h3 className="font-extrabold text-slate-900 text-lg group-hover:text-emerald-800 transition-colors line-clamp-1">
                    {slot.plantCatalog?.name || "Sâm Ngọc Linh"}
                  </h3>
                  <p className="text-slate-500 text-xs line-clamp-2 leading-relaxed font-normal">
                    {slot.plantCatalog?.description || "Gói sở hữu cây sâm thật được chăm sóc trực tiếp tại vườn sâm chuẩn nguồn gốc Kon Tum."}
                  </p>
                </div>

                {/* Benefits List */}
                <div className="space-y-2 pt-2 border-t border-slate-100">
                  <div className="flex items-center gap-2 text-xs text-slate-600 font-medium">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                    <span>Chăm sóc chuẩn sinh học tại vườn</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-slate-600 font-medium">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                    <span>Cập nhật nhật ký tăng trưởng định kỳ</span>
                  </div>
                </div>

                {/* Pricing Block */}
                <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-xs text-slate-500 font-semibold">
                    <Gift className="w-4 h-4 text-amber-600" />
                    <span>Gói chăm sóc</span>
                  </div>
                  <div className="text-right">
                    <span className="text-[#D97706] font-black text-base uppercase tracking-tight block">Miễn phí</span>
                    <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded-md">Ưu đãi 100%</span>
                  </div>
                </div>

                {/* Action CTA Button */}
                <div className="pt-1">
                  <Link
                    href={token ? `/${locale}/portfolio` : `/${locale}/sign-in?reason=campaign`}
                    className="group/btn flex items-center justify-center gap-2 w-full py-3 bg-[#1C3F24] hover:bg-[#15301B] active:bg-[#0f2414] text-white rounded-2xl font-bold text-xs transition-all duration-200 shadow-md hover:shadow-lg"
                  >
                    <span>{token ? "Nhận cây ngay" : "Đăng nhập để nhận"}</span>
                    <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Step-by-Step Workflow Section */}
        <section className="bg-white border border-slate-200/80 rounded-3xl p-6 sm:p-10 shadow-xs space-y-8">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-emerald-800 bg-emerald-100/70 px-3 py-1 rounded-full">
              <Zap className="w-3.5 h-3.5" />
              <span>Hướng dẫn đơn giản</span>
            </div>
            <h3 className="text-2xl font-extrabold text-slate-900">3 Bước Để Nhận Cây Sâm Ưu Đãi</h3>
            <p className="text-slate-500 text-xs sm:text-sm">Chỉ mất 2 phút để hoàn tất quy trình nhận gói chăm sóc sâm miễn phí.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative">
            {/* Step 1 */}
            <div className="bg-slate-50 border border-slate-100 rounded-2xl p-6 relative flex flex-col items-start space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-emerald-600 text-white flex items-center justify-center font-black text-lg shadow-md">
                <UserCheck className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider">Bước 01</span>
                <h4 className="font-bold text-slate-900 text-base">Đăng Nhập & Xác Minh</h4>
                <p className="text-slate-500 text-xs leading-relaxed">
                  Đăng nhập tài khoản cá nhân và hoàn tất xác thực thông tin chính chủ trên hệ thống.
                </p>
              </div>
            </div>

            {/* Step 2 */}
            <div className="bg-slate-50 border border-slate-100 rounded-2xl p-6 relative flex flex-col items-start space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-emerald-700 text-white flex items-center justify-center font-black text-lg shadow-md">
                <Sprout className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider">Bước 02</span>
                <h4 className="font-bold text-slate-900 text-base">Chọn Cây Sâm 1 Năm</h4>
                <p className="text-slate-500 text-xs leading-relaxed">
                  Lựa chọn cây sâm khả dụng trong danh sách quà tặng và bấm đăng ký nhận cây.
                </p>
              </div>
            </div>

            {/* Step 3 */}
            <div className="bg-slate-50 border border-slate-100 rounded-2xl p-6 relative flex flex-col items-start space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-amber-600 text-white flex items-center justify-center font-black text-lg shadow-md">
                <Gift className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <span className="text-xs font-bold text-amber-700 uppercase tracking-wider">Bước 03</span>
                <h4 className="font-bold text-slate-900 text-base">Theo Dõi Tăng Trưởng</h4>
                <p className="text-slate-500 text-xs leading-relaxed">
                  Cây sâm được chăm sóc tại vườn Kon Tum, cập nhật nhật ký và hình ảnh liên tục cho bạn.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Guarantees / Trust Badges */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-emerald-950 text-white rounded-3xl p-6 flex items-start gap-4 shadow-md">
            <div className="p-3 bg-emerald-800/60 rounded-2xl text-emerald-300 flex-shrink-0">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <h5 className="font-bold text-sm text-emerald-100">100% Nguồn Gốc Kon Tum</h5>
              <p className="text-slate-300 text-xs leading-relaxed">Cây sâm giống chuẩn chủng loại Sâm Ngọc Linh Kon Tum thuần chủng.</p>
            </div>
          </div>

          <div className="bg-emerald-950 text-white rounded-3xl p-6 flex items-start gap-4 shadow-md">
            <div className="p-3 bg-emerald-800/60 rounded-2xl text-emerald-300 flex-shrink-0">
              <Award className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <h5 className="font-bold text-sm text-emerald-100">Quy Trình Chuẩn Kỹ Thuật</h5>
              <p className="text-slate-300 text-xs leading-relaxed">Chăm sóc hữu cơ dưới mái che sinh thái theo điều kiện tự nhiên tối ưu.</p>
            </div>
          </div>

          <div className="bg-emerald-950 text-white rounded-3xl p-6 flex items-start gap-4 shadow-md">
            <div className="p-3 bg-emerald-800/60 rounded-2xl text-emerald-300 flex-shrink-0">
              <HeartHandshake className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <h5 className="font-bold text-sm text-emerald-100">Đồng Hành & Minh Bạch</h5>
              <p className="text-slate-300 text-xs leading-relaxed">Nhật ký vườn sâm cập nhật thường xuyên trên hồ sơ tài khoản của bạn.</p>
            </div>
          </div>
        </section>

      </main>
    </div>
  );
}

