import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
import { fetchApi } from '@/libs/Api';
import { Link } from '@/libs/I18nNavigation';
import { HomepageBannerSlider } from './HomepageBannerSlider';

type IndexPageProps = {
  params: Promise<{ locale: string }>;
};



const categoryLabels: Record<string, string> = {
  'news': 'Tin tức',
  'event': 'Sự kiện',
  'guide': 'Hướng dẫn sử dụng app',
  'faq': 'Kiến thức'
};

const getCategoryLabel = (category: string) => {
  return categoryLabels[category] || category || 'Tin tức';
};

async function getArticles() {
  try {
    const res = await fetchApi('/public/content/articles', {
      cache: 'no-store'
    });
    if (!res.ok) {
      console.error('Failed to fetch articles:', res.statusText);
      return [];
    }
    const json = await res.json();
    return json.data?.items || [];
  } catch (error) {
    console.error('Error fetching articles:', error);
    return [];
  }
}

async function getBannerImages() {
  const defaultImages = [
    '/images/banners/homepage_banner_1.png',
    '/images/banners/homepage_banner_2.png',
    '/images/banners/homepage_banner_3.png',
    '/images/banners/homepage_banner_4.png',
    '/images/banners/homepage_banner_5.png',
  ];
  try {
    const res = await fetchApi('/public/banners/home', { cache: 'no-store' });
    if (res.ok) {
      const json = await res.json();
      const list = json.data;
      if (Array.isArray(list) && list.length > 0) {
        return list.map((item: any) => item.image);
      }
    }
  } catch (error) {
    console.error('Error fetching home banners:', error);
  }
  return defaultImages;
}

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'Rượu Sâm Ngọc Linh | Số Hóa Chuỗi Giá Trị Sâm Ngọc Linh',
    description: 'Ứng dụng tiên phong mua, sở hữu và theo dõi quá trình sinh trưởng của sâm Ngọc Linh thật qua điện thoại.',
  };
}

export default async function Index(props: IndexPageProps) {
  const { locale } = await props.params;
  setRequestLocale(locale);

  const [articles, bannerImages] = await Promise.all([
    getArticles(),
    getBannerImages(),
  ]);

  const latestArticles = (articles || [])
    .sort((a: any, b: any) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
    .slice(0, 4);

  const newsImages = [
    '/images/news/news1.png',
    '/images/news/news2.png',
    '/images/news/news3.png',
    '/images/news/news4.png',
  ];

  return (
    <div className="w-full bg-brand-bg text-gray-800">
      {/* Hero Banner Section */}
      <section className="w-full bg-brand-bg py-6 sm:py-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <HomepageBannerSlider images={bannerImages} />
        </div>
      </section>

      {/* About Company Section */}
      <section className="py-20 bg-white relative overflow-hidden">
        {/* Style block for animations */}
        <style dangerouslySetInnerHTML={{ __html: `
          @keyframes fadeInUp {
            from {
              opacity: 0;
              transform: translateY(20px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
          @keyframes float {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-8px); }
          }
          @keyframes shine {
            0% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
            100% { background-position: 0% 50%; }
          }
          .animate-fade-in-up {
            animation: fadeInUp 1s cubic-bezier(0.16, 1, 0.3, 1) forwards;
          }
          .animate-float-1 {
            animation: float 6s ease-in-out infinite;
          }
          .animate-float-2 {
            animation: float 6s ease-in-out infinite 0.8s;
          }
          .animate-float-3 {
            animation: float 6s ease-in-out infinite 1.6s;
          }
          .animate-float-4 {
            animation: float 6s ease-in-out infinite 2.4s;
          }
          .animate-gradient-text {
            background-size: 200% auto;
            animation: shine 4s linear infinite;
          }
        `}} />

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            
            {/* Left Column: Portrait Image without Kon Tum overlay */}
            <div className="lg:col-span-3 relative group animate-fade-in-up">
              <div className="aspect-[3/4] rounded-3xl overflow-hidden shadow-lg border border-gray-100 bg-gray-50">
                <img 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
                  src="/images/kon_tum_ginseng.png" 
                  alt="Vùng trồng Sâm Ngọc Linh Kon Tum" 
                />
              </div>
            </div>

            {/* Middle Column: Text Information */}
            <div className="lg:col-span-4 space-y-6 text-left animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
              <span className="text-secondary font-bold tracking-widest uppercase text-xs block">
                VỀ CHÚNG TÔI
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-primary leading-tight font-display-lg">
                Hành trình gìn giữ <span className="text-transparent bg-clip-text bg-gradient-to-r from-secondary via-emerald-500 to-secondary animate-gradient-text">tinh hoa Việt</span>
              </h2>
              <p className="text-sm text-gray-600 leading-relaxed font-medium">
                Chúng tôi tâm huyết gìn giữ và phát huy giá trị của Sâm Ngọc Linh – báu vật của đại ngàn, kết hợp cùng bí quyết truyền thống để tạo ra những sản phẩm rượu sâm chất lượng, mang lại giá trị thật cho cộng đồng.
              </p>
              <div>
                <Link 
                  href="/about" 
                  className="inline-flex items-center gap-2 text-sm font-bold text-secondary hover:text-secondary-hover transition-colors group/link"
                >
                  <span>Tìm hiểu thêm</span>
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4 transition-transform group-hover/link:translate-x-1 duration-300">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                  </svg>
                </Link>
              </div>
            </div>

            {/* Right Column: 2x2 Grid of Stat Cards */}
            <div className="lg:col-span-5 grid grid-cols-1 sm:grid-cols-2 gap-4 animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
              
              {/* Stat Card 1: Experience */}
              <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow duration-300 flex items-center gap-4 animate-float-1">
                <div className="w-12 h-12 rounded-full bg-secondary/10 text-secondary flex items-center justify-center flex-shrink-0">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v17a2 2 0 01-2 2H8M12 3C7 3 3 7 3 12c0 2.5 1.5 5 4 6M12 3c5 0 9 4 9 9c0 2.5-1.5 5-4 6M12 10c-2-2-4-2-6 0M12 14c2-2 4-2 6 0" />
                  </svg>
                </div>
                <div>
                  <p className="text-2xl font-extrabold text-primary">10+</p>
                  <p className="text-xs text-gray-500 font-semibold mt-0.5 leading-snug">Năm kinh nghiệm</p>
                </div>
              </div>

              {/* Stat Card 2: Elevation */}
              <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow duration-300 flex items-center gap-4 animate-float-2">
                <div className="w-12 h-12 rounded-full bg-secondary/10 text-secondary flex items-center justify-center flex-shrink-0">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
                  </svg>
                </div>
                <div>
                  <p className="text-2xl font-extrabold text-primary">1500m+</p>
                  <p className="text-xs text-gray-500 font-semibold mt-0.5 leading-snug">Độ cao vùng trồng</p>
                </div>
              </div>

              {/* Stat Card 3: Customers */}
              <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow duration-300 flex items-center gap-4 animate-float-3">
                <div className="w-12 h-12 rounded-full bg-secondary/10 text-secondary flex items-center justify-center flex-shrink-0">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a6 6 0 00-3.44-5.32M15 7.25a3.25 3.25 0 11-6.5 0 3.25 3.25 0 016.5 0zM9 13.72A6.002 6.002 0 003 19.5h12m.002-5.78a6.002 6.002 0 016 5.78H15.002z" />
                  </svg>
                </div>
                <div>
                  <p className="text-2xl font-extrabold text-primary">5000+</p>
                  <p className="text-xs text-gray-500 font-semibold mt-0.5 leading-snug">Khách hàng tin dùng</p>
                </div>
              </div>

              {/* Stat Card 4: Bottles Supplied */}
              <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow duration-300 flex items-center gap-4 animate-float-4">
                <div className="w-12 h-12 rounded-full bg-secondary/10 text-secondary flex items-center justify-center flex-shrink-0">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 9V5.25m0 3.75a2.25 2.25 0 0 0 2.25 2.25h0A2.25 2.25 0 0 0 14.25 9V5.25m-4.5 0h4.5m-4.5 0V3h4.5v2.25m-4.5 3.75h4.5M9 11.25v8.25a2.25 2.25 0 0 0 2.25 2.25h5.5A2.25 2.25 0 0 0 19 19.5v-8.25A2.25 2.25 0 0 0 16.75 9h-5.5A2.25 2.25 0 0 0 9 11.25Z" />
                  </svg>
                </div>
                <div>
                  <p className="text-2xl font-extrabold text-primary">100.000+</p>
                  <p className="text-xs text-gray-500 font-semibold mt-0.5 leading-snug">Chai rượu cung cấp</p>
                </div>
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* Latest Information Section */}
      {latestArticles.length > 0 && (
        <section className="py-20 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 border-t border-gray-100">
          <div className="text-center mb-16 space-y-3">
            <h2 className="text-3xl font-extrabold text-primary font-display-lg">
              Thông tin mới nhất
            </h2>
            <p className="text-gray-500 text-sm max-w-2xl mx-auto font-medium">
              Cập nhật những thông tin mới nhất về các sự kiện, khuyến mãi và kiến thức chăm sóc cây trồng.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {latestArticles.slice(0, 3).map((article: any, idx: number) => (
              <article key={article.id} className="bg-white border border-gray-100 rounded-3xl overflow-hidden hover:shadow-lg transition-all flex flex-col justify-between">
                <div>
                  <div className="h-52 overflow-hidden bg-gray-100 relative p-3">
                    <Link href={`/news/${article.slug}`}>
                      <img
                        className="w-full h-full object-cover rounded-2xl cursor-pointer"
                        src={article.image || newsImages[idx % newsImages.length]}
                        alt={article.title}
                      />
                    </Link>
                    <span className="absolute top-6 left-6 bg-[#EAF5ED] text-[#2D7A4D] border border-emerald-100/50 text-[10px] font-bold px-3 py-1 rounded-full flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#2D7A4D]"></span>
                      {getCategoryLabel(article.category)}
                    </span>
                  </div>
                  <div className="p-6 space-y-3">
                    <div className="flex items-center gap-1.5 text-[11px] text-gray-400 font-bold uppercase tracking-wider">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-3.5 h-3.5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5m-9-6h.008v.008H12v-.008ZM12 15h.008v.008H12V15Zm0 2.25h.008v.008H12v-.008ZM9.75 15h.008v.008H9.75V15Zm0 2.25h.008v.008H9.75v-.008ZM7.5 15h.008v.008H7.5V15Zm0 2.25h.008v.008H7.5v-.008Zm6.75-4.5h.008v.008h-.008v-.008Zm0 2.25h.008v.008h-.008V15Zm0 2.25h.008v.008h-.008v-.008Zm2.25-4.5h.008v.008H16.5v-.008Zm0 2.25h.008v.008H16.5V15Z" />
                      </svg>
                      {article.publishedAt ? new Date(article.publishedAt).toLocaleDateString("vi-VN", { day: 'numeric', month: 'long', year: 'numeric' }) : ""}
                    </div>
                    <Link href={`/news/${article.slug}`}>
                      <h3 className="font-bold text-gray-900 text-base leading-snug line-clamp-2 hover:text-primary transition-colors min-h-[44px] cursor-pointer">
                        {article.title}
                      </h3>
                    </Link>
                    <p className="text-gray-500 text-xs line-clamp-3 leading-relaxed">
                      {article.summary}
                    </p>
                  </div>
                </div>
                <div className="p-6 pt-0 flex items-center justify-between border-t border-gray-50 mt-4">
                  <div className="flex items-center gap-1.5 pt-4 text-xs font-semibold text-gray-500">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4 text-gray-400">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
                    </svg>
                    <span>iWE FARM</span>
                  </div>
                  <Link
                    href={`/news/${article.slug}`}
                    className="inline-flex items-center gap-1 text-xs font-bold text-secondary hover:text-secondary-hover pt-4 transition-colors group cursor-pointer"
                  >
                    <span>Đọc thêm</span>
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                </div>
              </article>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link 
              href="/news" 
              className="inline-flex items-center gap-2 border border-gray-300 hover:border-secondary hover:text-secondary text-primary px-8 py-3 rounded-lg text-sm font-bold transition-all"
            >
              <span>Xem tất cả sự kiện</span>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
              </svg>
            </Link>
          </div>
        </section>
      )}

      {/* Contact Us Section */}
      <section className="py-20 bg-gray-50/50 border-t border-gray-100 relative overflow-hidden">
        {/* Background Floating Leaf SVGs */}
        <div className="absolute top-20 left-[5%] w-24 h-24 text-emerald-800/5 pointer-events-none blur-[1px] rotate-45 transform">
          <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full">
            <path d="M17 8C8 10 5 16 5 21C7 21 13 18 17 8ZM17 8C19 8 20 6 20 4C18 4 17 6 17 8Z" />
          </svg>
        </div>
        <div className="absolute top-12 right-[5%] w-20 h-20 text-emerald-800/5 pointer-events-none blur-[2px] -rotate-12 transform">
          <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full">
            <path d="M17 8C8 10 5 16 5 21C7 21 13 18 17 8ZM17 8C19 8 20 6 20 4C18 4 17 6 17 8Z" />
          </svg>
        </div>
        <div className="absolute bottom-12 left-[8%] w-16 h-16 text-emerald-800/5 pointer-events-none blur-[1px] rotate-[120deg] transform">
          <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full">
            <path d="M17 8C8 10 5 16 5 21C7 21 13 18 17 8ZM17 8C19 8 20 6 20 4C18 4 17 6 17 8Z" />
          </svg>
        </div>
        <div className="absolute bottom-20 right-[8%] w-24 h-24 text-emerald-800/5 pointer-events-none blur-[3px] -rotate-45 transform">
          <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full">
            <path d="M17 8C8 10 5 16 5 21C7 21 13 18 17 8ZM17 8C19 8 20 6 20 4C18 4 17 6 17 8Z" />
          </svg>
        </div>

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-16 space-y-2">
            <span className="text-emerald-700 font-extrabold tracking-widest text-[11px] uppercase flex items-center justify-center gap-1.5">
              <span>🍃</span> LIÊN HỆ VỚI CHÚNG TÔI <span>🍃</span>
            </span>
            <h2 className="text-4xl font-extrabold text-primary font-display-lg pt-1">
              Liên hệ với chúng tôi
            </h2>
            <p className="text-gray-500 text-sm max-w-2xl mx-auto font-medium">
              Hãy để chúng tôi hỗ trợ bạn tìm được những cây sâm ưng ý nhất
            </p>
          </div>

          <div className="max-w-4xl mx-auto bg-white border border-gray-100 rounded-[32px] pt-20 pb-8 px-6 sm:px-12 shadow-xl shadow-gray-900/[0.02] relative">
            {/* Overlapping logo container */}
            <div className="absolute -top-12 left-1/2 -translate-x-1/2 w-24 h-24 rounded-full bg-white border border-gray-100 shadow-md flex items-center justify-center p-3.5 z-20">
              <img 
                src="/assets/images/logo_ruou_sam.png?v=2" 
                alt="Rượu Sâm Ngọc Linh Logo" 
                className="w-full h-full object-contain"
              />
            </div>

            <div className="relative z-10">
              <div className="text-center">
                <h3 className="text-[17px] font-black tracking-wide text-emerald-800 uppercase font-display-md">
                  CÔNG TY CỔ PHẦN SÂM NGỌC LINH
                </h3>
                
                {/* Leaf separator */}
                <div className="flex items-center justify-center gap-3 py-3">
                  <div className="h-[1px] w-8 bg-emerald-600/10"></div>
                  <span className="text-emerald-600/30 text-xs">🍃</span>
                  <div className="h-[1px] w-8 bg-emerald-600/10"></div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                
                {/* Address */}
                <div className="bg-white border border-gray-100 rounded-2xl p-5 flex items-center gap-5 hover:border-emerald-600/20 hover:shadow-sm transition-all duration-300">
                  <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center flex-shrink-0 border border-emerald-100/30">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
                    </svg>
                  </div>
                  <div>
                    <span className="text-[11px] font-black text-emerald-700 uppercase tracking-wider block mb-1">
                      Địa chỉ
                    </span>
                    <p className="text-sm font-bold text-gray-700 leading-relaxed">
                      Showroom 156 Tây Thạnh, P. Tây Thạnh, TP. Hồ Chí Minh, Việt Nam
                    </p>
                  </div>
                </div>

                {/* Phone */}
                <div className="bg-white border border-gray-100 rounded-2xl p-5 flex items-center gap-5 hover:border-emerald-600/20 hover:shadow-sm transition-all duration-300">
                  <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center flex-shrink-0 border border-emerald-100/30">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 0 0 2.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-1.514 2.022a13.978 13.978 0 0 1-5.717-5.717l2.022-1.514c.361-.272.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 0 0-1.091-.852H4.5A2.25 2.25 0 0 0 2.25 4.5v2.25z" />
                    </svg>
                  </div>
                  <div>
                    <span className="text-[11px] font-black text-emerald-700 uppercase tracking-wider block mb-1">
                      Điện thoại
                    </span>
                    <p className="text-sm font-bold text-gray-700 leading-relaxed">
                      <a href="tel:0967234234" className="hover:text-secondary transition-colors">0967 234 234</a>
                    </p>
                  </div>
                </div>

                {/* Business License */}
                <div className="bg-white border border-gray-100 rounded-2xl p-5 flex items-center gap-5 hover:border-emerald-600/20 hover:shadow-sm transition-all duration-300">
                  <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center flex-shrink-0 border border-emerald-100/30">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5A3.375 3.375 0 0 0 10.125 2.25H9.75m0 18.75h4.5m-4.5 0H8.25m2.25 0V12m4.5 9V3M3.75 6h16.5M3.75 12h16.5m-16.5 6h16.5" />
                    </svg>
                  </div>
                  <div>
                    <span className="text-[11px] font-black text-emerald-700 uppercase tracking-wider block mb-1">
                      Giấy phép kinh doanh
                    </span>
                    <p className="text-sm font-bold text-gray-700 leading-relaxed">
                      Số 0316913632 cấp ngày 22/06/2021 tại Sở Kế hoạch và Đầu tư TP.HCM
                    </p>
                  </div>
                </div>

                {/* Email */}
                <div className="bg-white border border-gray-100 rounded-2xl p-5 flex items-center gap-5 hover:border-emerald-600/20 hover:shadow-sm transition-all duration-300">
                  <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center flex-shrink-0 border border-emerald-100/30">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" />
                    </svg>
                  </div>
                  <div>
                    <span className="text-[11px] font-black text-emerald-700 uppercase tracking-wider block mb-1">
                      Email
                    </span>
                    <p className="text-sm font-bold text-gray-700 leading-relaxed">
                      <a href="mailto:admin@wefarm.com.vn" className="hover:text-secondary transition-colors">admin@wefarm.com.vn</a>
                    </p>
                  </div>
                </div>

              </div>

              {/* Bottom horizontal banner */}
              <div className="bg-emerald-50/40 border border-emerald-600/5 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-center gap-4 mt-8 relative overflow-hidden">
                <div className="w-10 h-10 flex-shrink-0">
                  <img 
                    src="/assets/images/logo_ruou_sam.png?v=2" 
                    alt="Logo" 
                    className="w-full h-full object-contain"
                  />
                </div>
                <div className="text-center sm:text-left z-10">
                  <p className="text-[10px] sm:text-xs text-gray-500 font-semibold uppercase tracking-wider">
                    Chúng tôi luôn sẵn sàng hỗ trợ và đồng hành cùng bạn
                  </p>
                  <p className="text-xs sm:text-sm font-extrabold text-emerald-800 mt-0.5 font-display-md">
                    Rượu Sâm Ngọc Linh – Tinh hoa từ đại ngàn Kon Tum
                  </p>
                </div>

                {/* SVG Mountains on the right side */}
                <div className="hidden sm:block absolute right-0 bottom-0 opacity-15 pointer-events-none select-none">
                  <svg viewBox="0 0 200 60" className="w-48 h-12 text-emerald-800/30 fill-current">
                    <path d="M10 60 L40 20 L70 50 L90 30 L130 60 Z" />
                    <path d="M60 60 L90 10 L120 40 L150 15 L190 60 Z" opacity="0.5" />
                  </svg>
                </div>
              </div>

            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
