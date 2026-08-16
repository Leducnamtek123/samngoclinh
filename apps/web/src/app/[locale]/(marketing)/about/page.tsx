import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
import { fetchApi } from '@/lib/Api';
import { PageBannerSlider } from '@/components/PageBannerSlider';
import { ShieldCheck, Cpu, Sparkles, CheckCircle2, Award, ArrowRight } from 'lucide-react';
import { ScrollReveal } from '@/components/animation';
import { Link } from '@/lib/I18nNavigation';

export const dynamic = 'force-dynamic';

type AboutPageProps = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'Giới Thiệu | Rượu Sâm Ngọc Linh Thượng Hạng',
    description: 'Hành trình bảo tồn di sản Quốc bảo Sâm Ngọc Linh kết hợp công nghệ số hóa minh bạch.',
  };
}

async function getAboutBanner() {
  try {
    const res = await fetchApi('/public/banners/about', { next: { revalidate: 60 } });
    if (res.ok) {
      const json = await res.json();
      return Array.isArray(json.data) ? json.data : [json.data];
    }
  } catch (error) {
    console.error('Error fetching about banner:', error);
  }
  return [
    {
      id: 'about-default',
      pageKey: 'about',
      title: 'Hành Trình Rượu Sâm Ngọc Linh',
      subtitle: 'Kết nối giá trị tự nhiên nguyên bản của Quốc bảo Sâm Ngọc Linh Quảng Nam với giải pháp công nghệ số minh bạch chuỗi cung ứng độc bản tại Việt Nam.',
      image: '/images/banners/about_banner.png',
      order: 0
    }
  ];
}

export default async function About(props: AboutPageProps) {
  const { locale } = await props.params;
  setRequestLocale(locale);

  const banners = await getAboutBanner();

  return (
    <div className="w-full bg-brand-bg min-h-screen pb-16">
      
      {/* Hero Header Section */}
      <PageBannerSlider banners={banners} />

      {/* Main Grid Content */}
      <section className="max-w-6xl mx-auto px-4 md:px-8 py-16 space-y-20">
        
        {/* Core Values Bento Grid (Asymmetric Layout) */}
        <div className="space-y-4">
          <ScrollReveal variant="fade-up">
            <div className="max-w-2xl space-y-2">
              <span className="text-xs font-bold text-emerald-800 uppercase tracking-widest block">
                GIÁ TRỊ CỐT LÕI
              </span>
              <h2 className="text-2xl sm:text-4xl font-extrabold text-primary font-display tracking-tight">
                Tôn Chỉ Chất Lượng & Di Sản Quốc Bảo
              </h2>
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pt-4">
            {/* Featured Master Card (7 Cols) */}
            <div className="lg:col-span-7 bg-white border border-gray-200/90 rounded-3xl p-8 sm:p-10 space-y-6 shadow-xs hover:shadow-xl transition-shadow duration-300 flex flex-col justify-between">
              <div className="space-y-4">
                <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-800 flex items-center justify-center border border-emerald-200/60 shadow-2xs">
                  <ShieldCheck className="w-7 h-7 text-emerald-700" />
                </div>
                <div className="space-y-2">
                  <span className="text-[11px] font-mono font-bold text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full inline-block">
                    GACP-WHO Standard
                  </span>
                  <h3 className="font-extrabold text-gray-900 text-xl font-display">
                    Cam Kết Nguồn Gốc & Giám Định DNA Thuần Chủng
                  </h3>
                  <p className="text-gray-600 text-xs sm:text-sm leading-relaxed font-normal">
                    100% củ sâm Ngọc Linh được khai thác từ vùng trồng chính gốc Nam Trà My (Quảng Nam) và Tu Mơ Rông (Kon Tum) ở độ cao trên 1.800m. Mọi cây giống đều được xét nghiệm định danh bộ gen di truyền DNA từ Viện Dược Liệu Quốc Gia.
                  </p>
                </div>
              </div>

              <div className="pt-6 border-t border-gray-100 flex items-center gap-6 text-xs text-gray-500 font-semibold">
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>52 Saponin Quý</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Award className="w-4 h-4 text-amber-600" />
                  <span>Chỉ Dẫn Địa Lý Số 00049</span>
                </div>
              </div>
            </div>

            {/* Right Stacked Column (5 Cols) */}
            <div className="lg:col-span-5 space-y-6 flex flex-col justify-between">
              {/* Stack 1: AgTech & IoT */}
              <div className="bg-white border border-gray-200/90 rounded-3xl p-6 sm:p-7 space-y-3 shadow-xs hover:shadow-lg transition-shadow duration-300">
                <div className="w-11 h-11 rounded-xl bg-slate-100 text-emerald-800 flex items-center justify-center">
                  <Cpu className="w-5 h-5 text-emerald-700" />
                </div>
                <h4 className="font-extrabold text-gray-900 text-base">
                  Nông Nghiệp Số Hóa & Giám Sát IoT
                </h4>
                <p className="text-gray-500 text-xs leading-relaxed">
                  Áp dụng cảm biến vi khí hậu và nhật ký số hóa để theo dõi chu trình sinh trưởng của từng gốc sâm theo thời gian thực.
                </p>
              </div>

              {/* Stack 2: Ancient Brewing */}
              <div className="bg-white border border-gray-200/90 rounded-3xl p-6 sm:p-7 space-y-3 shadow-xs hover:shadow-lg transition-shadow duration-300">
                <div className="w-11 h-11 rounded-xl bg-amber-50 text-amber-800 flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-amber-600" />
                </div>
                <h4 className="font-extrabold text-gray-900 text-base">
                  Hạ Thổ Chum Sành Men Lá Cổ Truyền
                </h4>
                <p className="text-gray-500 text-xs leading-relaxed">
                  Ngâm ủ thủ công tối thiểu 2 đến 5 năm trong chum sành không tráng men, khử Andehit hoàn toàn, hương vị êm dịu đằm thắm.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Detailed Story Section */}
        <ScrollReveal variant="fade-up">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            <div className="lg:col-span-7 space-y-5">
              <span className="text-xs font-bold text-emerald-800 uppercase tracking-widest">Hành trình phát triển</span>
              <h2 className="text-2xl sm:text-4xl font-extrabold text-gray-950 font-display leading-tight tracking-tight">
                Bảo Tồn Bản Sắc, Kiến Tạo Tương Lai Số
              </h2>
              <div className="space-y-4 text-gray-600 text-xs sm:text-sm leading-relaxed font-normal">
                <p>
                  Sâm Ngọc Linh được vinh danh là Quốc bảo Việt Nam - loại nhân sâm quý hiếm bậc nhất thế giới chứa 52 hợp chất Saponin quý giá. Tuy nhiên, việc tiếp cận nguồn sâm thật và kiểm soát chất lượng luôn là bài toán thách thức đối với người tiêu dùng.
                </p>
                <p>
                  Với sứ mệnh đưa sản phẩm sâm Ngọc Linh chuẩn nguồn gốc tới tay mọi nhà, chúng tôi xây dựng mô hình liên kết trực tiếp giữa các hộ đồng bào trồng sâm địa phương tại Quảng Nam với nền tảng quản lý vườn sâm số hóa.
                </p>
              </div>

              <div className="pt-2">
                <Link
                  href={`/${locale}/products`}
                  className="inline-flex items-center gap-2 text-xs font-bold text-emerald-800 hover:text-emerald-950 transition-colors"
                >
                  <span>Khám phá các sản phẩm tiêu biểu</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
            
            {/* Aesthetic Side Box */}
            <div className="lg:col-span-5 bg-gradient-to-br from-emerald-950 via-[#122B18] to-slate-950 text-white p-8 sm:p-10 rounded-3xl space-y-6 relative overflow-hidden shadow-2xl border border-emerald-800/40">
              <div className="absolute -right-16 -bottom-16 w-48 h-48 rounded-full bg-amber-400/10 blur-2xl pointer-events-none" />
              <h4 className="font-black text-xl sm:text-2xl text-amber-300 font-display">Tầm nhìn chiến lược</h4>
              <p className="text-emerald-100/90 text-xs sm:text-sm leading-relaxed font-normal">
                Trở thành hệ sinh thái số dẫn đầu trong việc bảo tồn, thương mại hóa minh bạch và nâng tầm giá trị các sản phẩm thảo dược quý hiếm của Việt Nam ra thị trường quốc tế.
              </p>
              <div className="border-t border-emerald-800/80 pt-6 grid grid-cols-2 gap-4">
                <div>
                  <p className="text-3xl font-black text-amber-400 font-display">52+</p>
                  <p className="text-[10px] text-emerald-300 uppercase font-bold tracking-wider mt-0.5">Saponin Dược Tính</p>
                </div>
                <div>
                  <p className="text-3xl font-black text-emerald-400 font-display">100%</p>
                  <p className="text-[10px] text-emerald-300 uppercase font-bold tracking-wider mt-0.5">DNA Chuẩn Nguồn Gốc</p>
                </div>
              </div>
            </div>
          </div>
        </ScrollReveal>

      </section>

    </div>
  );
}
