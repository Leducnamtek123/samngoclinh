import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
import { fetchApi } from '@/libs/Api';
import { Link } from '@/libs/I18nNavigation';

type NewsPageProps = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'Tin Tức & Kiến Thức | Rượu Sâm Ngọc Linh',
    description: 'Cập nhật những tin tức mới nhất về sâm Ngọc Linh và công nghệ nông nghiệp số.',
  };
}

async function getArticles() {
  try {
    const res = await fetchApi('/public/content/articles', {
      cache: 'no-store'
    });
    if (!res.ok) {
      return [];
    }
    const json = await res.json();
    return json.data?.items || [];
  } catch (error) {
    console.error('Error fetching articles:', error);
    return [];
  }
}

export default async function NewsPage(props: NewsPageProps) {
  const { locale } = await props.params;
  setRequestLocale(locale);

  const articles = await getArticles();

  // Fallback articles if API is empty
  const displayArticles = articles.length > 0 ? articles : [
    {
      id: "fallback-art-1",
      title: "Rượu Sâm Ngọc Linh - Số hóa chuỗi giá trị nông sản Việt",
      summary: "Khám phá mô hình quản lý vườn sâm và sản xuất rượu sâm minh bạch thông qua định danh số hóa blockchain.",
      category: "Tin tức",
      publishedAt: "17/07/2026",
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuD0gUrpDrfeFU_Yv52ojl__qDMu2iJBO5s34hrrsjYkLHK6Bhkz9mXaPsd4VPh7xDjttnsKtxie18TWAQSN-a44V3A3J9nHUQ15fnz3b8q9I_jGsiyWBzQoJcFp_LxW2lLvdKKOkoavmo-dncTVg7pAmy5QugtUYr9GgiW25eWHkOaLN8OkMDTpDqT1KRBXZjmHNuWHC9b20wnUhbHEHn9I_7KyjAWxOoh3g2MxGyF4yMbVilr4Z-Q8",
    },
    {
      id: "fallback-art-2",
      title: "Công dụng tuyệt vời của 52 loại Saponin trong sâm Ngọc Linh",
      summary: "Sâm Ngọc Linh là loại sâm quý nhất thế giới với hàm lượng dưỡng chất saponin vượt trội hỗ trợ tăng cường sức đề kháng.",
      category: "Kiến thức",
      publishedAt: "16/07/2026",
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuD0gUrpDrfeFU_Yv52ojl__qDMu2iJBO5s34hrrsjYkLHK6Bhkz9mXaPsd4VPh7xDjttnsKtxie18TWAQSN-a44V3A3J9nHUQ15fnz3b8q9I_jGsiyWBzQoJcFp_LxW2lLvdKKOkoavmo-dncTVg7pAmy5QugtUYr9GgiW25eWHkOaLN8OkMDTpDqT1KRBXZjmHNuWHC9b20wnUhbHEHn9I_7KyjAWxOoh3g2MxGyF4yMbVilr4Z-Q8",
    },
    {
      id: "fallback-art-3",
      title: "Hướng dẫn cài đặt và sử dụng ứng dụng Rượu Sâm Ngọc Linh",
      summary: "Từng bước cài đặt app, liên kết ví điểm số, xác thực danh tính KYC và đăng ký nhận cây giống 1 năm.",
      category: "Hướng dẫn",
      publishedAt: "15/07/2026",
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuD0gUrpDrfeFU_Yv52ojl__qDMu2iJBO5s34hrrsjYkLHK6Bhkz9mXaPsd4VPh7xDjttnsKtxie18TWAQSN-a44V3A3J9nHUQ15fnz3b8q9I_jGsiyWBzQoJcFp_LxW2lLvdKKOkoavmo-dncTVg7pAmy5QugtUYr9GgiW25eWHkOaLN8OkMDTpDqT1KRBXZjmHNuWHC9b20wnUhbHEHn9I_7KyjAWxOoh3g2MxGyF4yMbVilr4Z-Q8",
    }
  ];

  return (
    <div className="w-full bg-gray-50 min-h-screen pb-16">
      {/* Hero Banner Section */}
      <section className="bg-gradient-to-r from-[#1C3F24] to-[#122B18] text-white py-16 px-4 md:px-8 border-b border-gray-800">
        <div className="max-w-7xl mx-auto text-center space-y-4">
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white leading-tight font-display-lg">
            Tin Tức &amp; Kiến Thức
          </h1>
          <p className="text-gray-300 text-sm sm:text-base max-w-xl mx-auto leading-relaxed">
            Cập nhật những tin tức mới nhất về sâm Ngọc Linh, công nghệ nông nghiệp số hóa và hướng dẫn sử dụng hệ sinh thái.
          </p>
        </div>
      </section>

      {/* Categories / Tabs Filter bar */}
      <section className="max-w-7xl mx-auto px-4 md:px-8 py-8 flex gap-3 border-b border-gray-200 overflow-x-auto scrollbar-none">
        <button className="bg-primary text-white px-5 py-1.5 rounded-full text-xs font-bold shadow-sm">Tất cả</button>
        <button className="bg-white border border-gray-200 text-gray-600 hover:text-primary px-5 py-1.5 rounded-full text-xs font-semibold transition-colors">Tin tức</button>
        <button className="bg-white border border-gray-200 text-gray-600 hover:text-primary px-5 py-1.5 rounded-full text-xs font-semibold transition-colors">Kiến thức</button>
        <button className="bg-white border border-gray-200 text-gray-600 hover:text-primary px-5 py-1.5 rounded-full text-xs font-semibold transition-colors">Hướng dẫn sử dụng app</button>
        <button className="bg-white border border-gray-200 text-gray-600 hover:text-primary px-5 py-1.5 rounded-full text-xs font-semibold transition-colors">Sự kiện</button>
      </section>

      {/* Articles Grid */}
      <section className="max-w-7xl mx-auto px-4 md:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {displayArticles.map((article: any) => (
            <article key={article.id} className="bg-white border border-gray-200 rounded-2xl overflow-hidden hover:shadow-lg transition-all flex flex-col justify-between">
              <div>
                <div className="h-52 overflow-hidden bg-gray-100 relative">
                  <img
                    className="w-full h-full object-cover"
                    src={article.image || "https://lh3.googleusercontent.com/aida-public/AB6AXuD0gUrpDrfeFU_Yv52ojl__qDMu2iJBO5s34hrrsjYkLHK6Bhkz9mXaPsd4VPh7xDjttnsKtxie18TWAQSN-a44V3A3J9nHUQ15fnz3b8q9I_jGsiyWBzQoJcFp_LxW2lLvdKKOkoavmo-dncTVg7pAmy5QugtUYr9GgiW25eWHkOaLN8OkMDTpDqT1KRBXZjmHNuWHC9b20wnUhbHEHn9I_7KyjAWxOoh3g2MxGyF4yMbVilr4Z-Q8"}
                    alt={article.title}
                  />
                  <span className="absolute top-3 left-3 bg-secondary text-white text-[9px] font-bold px-2.5 py-1 rounded">
                    {article.category || "Tin tức"}
                  </span>
                </div>
                <div className="p-6 space-y-3">
                  <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">{article.publishedAt}</span>
                  <h3 className="font-bold text-gray-900 text-base leading-snug line-clamp-2 min-h-[44px]">
                    {article.title}
                  </h3>
                  <p className="text-gray-500 text-xs line-clamp-3 leading-relaxed">
                    {article.summary}
                  </p>
                </div>
              </div>
              <div className="p-6 pt-0 border-t border-gray-50 mt-4">
                <Link
                  href="/news"
                  className="inline-flex items-center gap-1.5 text-primary text-xs font-bold hover:text-primary-hover pt-4 transition-colors"
                >
                  Đọc tiếp
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>
            </article>
          ))}
        </div>
      </section>

    </div>
  );
}
