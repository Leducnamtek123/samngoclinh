import type { Metadata } from 'next';
import Image from 'next/image';
import { setRequestLocale } from 'next-intl/server';
import { fetchApi } from '@/lib/Api';
import { Link } from '@/lib/I18nNavigation';
import { PageBannerSlider } from '@/components/PageBannerSlider';
import { Button } from '@/components/ui/button';

type NewsPageProps = {
  params: Promise<{ locale: string }>;
  searchParams?: Promise<{ category?: string; search?: string; page?: string }>;
};

export async function generateMetadata(props: NewsPageProps): Promise<Metadata> {
  const { locale } = await props.params;
  return {
    title: locale === 'en' ? 'News & Insights | Sâm Ngọc Linh' : 'Tin Tức & Kiến Thức | Rượu Sâm Ngọc Linh',
    description: locale === 'en'
      ? 'Latest updates on Ngoc Linh Ginseng and digital agriculture technology.'
      : 'Cập nhật những tin tức mới nhất về sâm Ngọc Linh và công nghệ nông nghiệp số.',
  };
}

async function getArticles() {
  try {
    const res = await fetchApi('/public/content/articles', {
      next: { revalidate: 60 },
    });
    if (!res.ok) {
      return [];
    }
    const json = await res.json();
    return json.data || [];
  } catch (error) {
    console.error('Error fetching articles:', error);
    return [];
  }
}

async function getNewsBanner(locale: string) {
  try {
    const res = await fetchApi('/public/banners/news', { next: { revalidate: 60 } });
    if (res.ok) {
      const json = await res.json();
      return Array.isArray(json.data) ? json.data : [json.data];
    }
  } catch (error) {
    console.error('Error fetching news banner:', error);
  }
  return [
    {
      id: 'news-default',
      pageKey: 'news',
      title: locale === 'en' ? 'Latest News & Events' : 'Thông tin mới nhất',
      subtitle: locale === 'en'
        ? 'Stay updated with our latest events, promotions, and agricultural insights.'
        : 'Cập nhật những thông tin mới nhất về các sự kiện, khuyến mãi và kiến thức chăm sóc cây trồng.',
      image: '/images/banners/news_banner.png',
      order: 0
    }
  ];
}

const getCategoryLabel = (category: string, locale: string) => {
  const labelsVi: Record<string, string> = {
    'news': 'Tin tức',
    'event': 'Sự kiện',
    'guide': 'Hướng dẫn sử dụng',
    'faq': 'Kiến thức'
  };
  const labelsEn: Record<string, string> = {
    'news': 'News',
    'event': 'Events',
    'guide': 'User Guide',
    'faq': 'Knowledge'
  };
  const map = locale === 'en' ? labelsEn : labelsVi;
  return map[category] || category || (locale === 'en' ? 'News' : 'Tin tức');
};

export default async function NewsPage(props: NewsPageProps) {
  const { locale } = await props.params;
  const searchParams = await props.searchParams;
  const selectedCategory = searchParams?.category || '';
  const searchQuery = searchParams?.search || '';
  const currentPage = parseInt(searchParams?.page || '1', 10);

  setRequestLocale(locale);

  const [allArticles, banner] = await Promise.all([
    getArticles(),
    getNewsBanner(locale),
  ]);

  // Filter articles by search query
  let filteredArticles = allArticles;
  if (searchQuery) {
    const q = searchQuery.toLowerCase();
    filteredArticles = filteredArticles.filter((article: any) => 
      article.title?.toLowerCase().includes(q) || 
      article.summary?.toLowerCase().includes(q)
    );
  }

  // Filter articles by category
  if (selectedCategory) {
    filteredArticles = filteredArticles.filter((article: any) => article.category === selectedCategory);
  }

  // Sorting and pagination
  const sortedArticles = [...filteredArticles].sort((a: any, b: any) => 
    new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  );

  const totalArticles = sortedArticles.length;
  const articlesPerPage = 6;
  const totalPages = Math.ceil(totalArticles / articlesPerPage);
  const page = Math.max(1, Math.min(currentPage, totalPages || 1));
  const displayedArticles = sortedArticles.slice((page - 1) * articlesPerPage, page * articlesPerPage);

  const newsImages = [
    '/images/news/news1.png',
    '/images/news/news2.png',
    '/images/news/news3.png',
    '/images/news/news4.png',
  ];

  return (
    <div className="w-full bg-gray-50 min-h-screen pb-16">
      {/* Hero Banner Section */}
      <PageBannerSlider banners={banner || []} />

      {/* Main Content Layout */}
      <section className="max-w-7xl mx-auto px-4 md:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column: Articles Grid & Pagination */}
          <div className="lg:col-span-12 space-y-8">
            {displayedArticles.length === 0 ? (
              <div className="text-center py-16 text-gray-400 font-medium bg-white rounded-3xl border border-gray-150 shadow-sm w-full">
                {locale === 'en' ? 'No articles found.' : 'Không tìm thấy bài viết nào phù hợp.'}
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {displayedArticles.map((article: any, idx: number) => (
                    <article key={article.id} className="bg-white border border-gray-100 rounded-3xl overflow-hidden hover:shadow-lg transition-shadow duration-300 flex flex-col justify-between">
                      <div>
                        <div className="h-52 overflow-hidden bg-gray-100 relative p-3">
                          <Link href={`/news/${article.slug}`}>
                            <Image
                              className="w-full h-full object-cover rounded-2xl cursor-pointer"
                              src={article.image || newsImages[idx % newsImages.length]}
                              alt={article.title}
                              fill
                              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                              unoptimized
                            />
                          </Link>
                          <span className="absolute top-6 left-6 bg-[#EAF5ED] text-[#2D7A4D] border border-emerald-100/50 text-[10px] font-bold px-3 py-1 rounded-full flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#2D7A4D]"></span>
                            {getCategoryLabel(article.category, locale)}
                          </span>
                        </div>
                        <div className="p-6 space-y-3">
                          <div className="flex items-center gap-1.5 text-[11px] text-gray-400 font-bold uppercase tracking-wider">
                            {article.publishedAt ? new Date(article.publishedAt).toLocaleDateString(locale === 'en' ? 'en-US' : 'vi-VN', { day: 'numeric', month: 'long', year: 'numeric' }) : ""}
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
                          <span>{article.author || 'Sâm Ngọc Linh'}</span>
                        </div>
                        <Link
                          href={`/news/${article.slug}`}
                          className="inline-flex items-center gap-1 text-xs font-bold text-secondary hover:text-secondary-hover pt-4 transition-colors group cursor-pointer"
                        >
                          <span>{locale === 'en' ? 'Read more' : 'Đọc thêm'}</span>
                          <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                          </svg>
                        </Link>
                      </div>
                    </article>
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-center gap-2 pt-8 border-t border-gray-200">
                    {/* Previous Page Link */}
                    {page > 1 ? (
                      <Link
                        href={`/news?${new URLSearchParams({
                          ...(selectedCategory ? { category: selectedCategory } : {}),
                          ...(searchQuery ? { search: searchQuery } : {}),
                          page: (page - 1).toString(),
                        }).toString()}`}
                        className="flex items-center gap-1 px-4 py-2 bg-white border border-gray-200 text-gray-600 rounded-xl text-xs font-bold hover:text-primary hover:border-primary transition-colors cursor-pointer"
                      >
                        <span>{locale === 'en' ? 'Previous' : 'Trang trước'}</span>
                      </Link>
                    ) : (
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        disabled
                        className="flex items-center gap-1 px-4 py-2 bg-gray-50 border border-gray-100 text-gray-400 rounded-xl text-xs font-bold cursor-not-allowed opacity-50"
                      >
                        <span>{locale === 'en' ? 'Previous' : 'Trang trước'}</span>
                      </Button>
                    )}

                    {/* Page Numbers */}
                    {Array.from({ length: totalPages }).map((_, i) => {
                      const pageNum = i + 1;
                      const isActive = pageNum === page;
                      return (
                        <Link
                          key={pageNum}
                          href={`/news?${new URLSearchParams({
                            ...(selectedCategory ? { category: selectedCategory } : {}),
                            ...(searchQuery ? { search: searchQuery } : {}),
                            page: pageNum.toString(),
                          }).toString()}`}
                          className={`w-9 h-9 flex items-center justify-center rounded-xl text-xs font-bold transition-colors ${
                            isActive
                              ? 'bg-primary text-white shadow-sm'
                              : 'bg-white border border-gray-200 text-gray-600 hover:text-primary hover:border-primary'
                          }`}
                        >
                          {pageNum}
                        </Link>
                      );
                    })}

                    {/* Next Page Link */}
                    {page < totalPages ? (
                      <Link
                        href={`/news?${new URLSearchParams({
                          ...(selectedCategory ? { category: selectedCategory } : {}),
                          ...(searchQuery ? { search: searchQuery } : {}),
                          page: (page + 1).toString(),
                        }).toString()}`}
                        className="flex items-center gap-1 px-4 py-2 bg-white border border-gray-200 text-gray-600 rounded-xl text-xs font-bold hover:text-primary hover:border-primary transition-colors cursor-pointer"
                      >
                        <span>{locale === 'en' ? 'Next' : 'Trang sau'}</span>
                      </Link>
                    ) : (
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        disabled
                        className="flex items-center gap-1 px-4 py-2 bg-gray-50 border border-gray-100 text-gray-400 rounded-xl text-xs font-bold cursor-not-allowed opacity-50"
                      >
                        <span>{locale === 'en' ? 'Next' : 'Trang sau'}</span>
                      </Button>
                    )}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
