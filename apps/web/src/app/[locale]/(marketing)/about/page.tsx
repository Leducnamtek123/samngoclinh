import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
import { fetchApi } from '@/lib/Api';
import { PageBannerSlider } from '@/components/PageBannerSlider';

export const dynamic = 'force-dynamic';

type AboutPageProps = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'Giới Thiệu | Rượu Sâm Ngọc Linh',
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
    <div className="w-full bg-gray-50 min-h-screen pb-16">
      
      {/* Hero Header Section */}
      <PageBannerSlider banners={banners} />

      {/* Main Grid Content */}
      <section className="max-w-6xl mx-auto px-4 md:px-8 py-16 space-y-20">
        
        {/* Core Values Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white border border-gray-200 rounded-2xl p-8 space-y-4 hover:shadow-md transition-shadow">
            <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <h3 className="font-extrabold text-gray-900 text-lg">Cam kết Nguồn gốc</h3>
            <p className="text-gray-500 text-xs sm:text-sm leading-relaxed">
              100% củ sâm Ngọc Linh được khai thác từ vùng trồng chính gốc Nam Trà My, tỉnh Quảng Nam, kiểm định độ tuổi và chứng nhận DNA chuẩn chỉ.
            </p>
          </div>

          <div className="bg-white border border-gray-200 rounded-2xl p-8 space-y-4 hover:shadow-md transition-shadow">
            <div className="w-12 h-12 rounded-xl bg-secondary/10 text-secondary flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
            <h3 className="font-extrabold text-gray-900 text-lg">Nông nghiệp Số hóa</h3>
            <p className="text-gray-500 text-xs sm:text-sm leading-relaxed">
              Áp dụng công nghệ IoT và Blockchain để theo dõi chu trình sinh trưởng của từng gốc sâm, giúp nhà đầu tư dễ dàng giám sát tài sản số hóa từ xa.
            </p>
          </div>

          <div className="bg-white border border-gray-200 rounded-2xl p-8 space-y-4 hover:shadow-md transition-shadow">
            <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-emerald-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 className="font-extrabold text-gray-900 text-lg">Chưng cất Thượng hạng</h3>
            <p className="text-gray-500 text-xs sm:text-sm leading-relaxed">
              Sản phẩm rượu sâm được ngâm ủ tối thiểu 2 năm trong chum sành truyền thống, tách lọc độc tố Andehit, đảm bảo êm dịu, bổ dưỡng và an toàn tuyệt đối.
            </p>
          </div>
        </div>

        {/* Detailed Story Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <span className="text-xs font-bold text-primary uppercase tracking-wider">Hành trình phát triển</span>
            <h2 className="text-3xl font-black text-gray-950 leading-tight">
              Bảo Tồn Bản Sắc, Kiến Tạo Tương Lai Số
            </h2>
            <div className="space-y-4 text-gray-600 text-sm leading-relaxed">
              <p>
                Sâm Ngọc Linh được vinh danh là Quốc bảo Việt Nam - loại nhân sâm quý hiếm nhất thế giới chứa 52 hợp chất Saponin quý giá. Tuy nhiên, việc tiếp cận nguồn sâm thật và kiểm soát chất lượng luôn là bài toán thách thức đối với người tiêu dùng.
              </p>
              <p>
                Với sứ mệnh đưa sản phẩm sâm Ngọc Linh chuẩn nguồn gốc tới tay mọi nhà, chúng tôi xây dựng mô hình liên kết trực tiếp giữa các hộ trồng sâm địa phương tại Quảng Nam với nền tảng quản lý vườn sâm số hóa. Người tiêu dùng không chỉ mua sản phẩm mà còn có thể đồng hành, sở hữu và theo dõi sự phát triển của từng cây sâm thật trên hệ thống.
              </p>
            </div>
          </div>
          
          {/* Aesthetic Side Box */}
          <div className="bg-[#1C3F24] text-white p-8 sm:p-12 rounded-3xl space-y-6 relative overflow-hidden shadow-xl">
            <div className="absolute -right-16 -bottom-16 w-44 h-44 rounded-full bg-emerald-800/30"></div>
            <h4 className="font-bold text-xl sm:text-2xl text-secondary">Tầm nhìn chiến lược</h4>
            <p className="text-gray-300 text-xs sm:text-sm leading-relaxed">
              Trở thành hệ sinh thái số dẫn đầu trong việc bảo tồn, thương mại hóa minh bạch và nâng tầm giá trị các sản phẩm thảo dược quý hiếm của Việt Nam ra thị trường quốc tế.
            </p>
            <div className="border-t border-emerald-800 pt-6 flex gap-8">
              <div>
                <p className="text-2xl font-black text-white">52+</p>
                <p className="text-[10px] text-gray-400 font-medium">Hợp chất Saponin</p>
              </div>
              <div>
                <p className="text-2xl font-black text-white">100%</p>
                <p className="text-[10px] text-gray-400 font-medium">Sâm thật DNA kiểm định</p>
              </div>
            </div>
          </div>
        </div>

      </section>

    </div>
  );
}
