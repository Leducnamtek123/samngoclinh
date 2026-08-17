import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
import Image from 'next/image';
import { PageBannerSlider } from '@/components/PageBannerSlider';
import { Button } from '@/components/ui/button';
import { fetchApi } from '@/lib/Api';
import { Link } from '@/lib/I18nNavigation';

import type { Article, Banner } from '@/types';

type NewsPageProps = {
  params: Promise<{ locale: string }>;
  searchParams?: Promise<{ category?: string; search?: string; page?: string }>;
};

export async function generateMetadata(props: NewsPageProps): Promise<Metadata> {
  const { locale } = await props.params;
  return {
    title:
      locale === 'en'
        ? 'News & Insights | Sâm Ngọc Linh'
        : 'Tin Tức & Kiến Thức | Rượu Sâm Ngọc Linh',
    description:
      locale === 'en'
        ? 'Latest updates on Ngoc Linh Ginseng and digital agriculture technology.'
        : 'Cập nhật những tin tức mới nhất về sâm Ngọc Linh và công nghệ nông nghiệp số.',
  };
}

async function getArticles(): Promise<Article[]> {
  try {
    const res = await fetchApi('/public/content/articles', {
      next: { revalidate: 60 },
    });
    if (res.ok) {
      const json = await res.json();
      return json.data || [];
    }
  } catch (error) {
    console.error('Error fetching articles:', error);
  }
  return [];
}

async function getNewsBanner(locale: string): Promise<Banner[]> {
  try {
    const res = await fetchApi('/public/banners/news', { next: { revalidate: 60 } });
    if (res.ok) {
      const json = await res.json();
      if (json.data && Array.isArray(json.data) && json.data.length > 0) {
        return json.data;
      }
    }
  } catch (error) {
    console.error('Error fetching news banner:', error);
  }
  return [
    {
      id: 'news-default',
      pageKey: 'news',
      title: locale === 'en' ? 'Latest News & Events' : 'Thông tin mới nhất',
      subtitle:
        locale === 'en'
          ? 'Stay updated with our latest events, promotions, and agricultural insights.'
          : 'Cập nhật những thông tin mới nhất về các sự kiện, khuyến mãi và kiến thức chăm sóc cây trồng.',
      image: '/images/banners/news_banner.png',
      order: 0,
    },
  ];
}

const getCategoryLabel = (category: string, locale: string) => {
  const labelsVi: Record<string, string> = {
    news: 'Tin tức',
    event: 'Sự kiện',
    guide: 'Hướng dẫn sử dụng',
    faq: 'Kiến thức',
  };
  const labelsEn: Record<string, string> = {
    news: 'News',
    event: 'Events',
    guide: 'User Guide',
    faq: 'Knowledge',
  };
  const map = locale === 'en' ? labelsEn : labelsVi;
  return map[category] || category || (locale === 'en' ? 'News' : 'Tin tức');
};

export default async function NewsPage(props: NewsPageProps) {
  const { locale } = await props.params;
  const searchParams = await props.searchParams;
  const selectedCategory = searchParams?.category || '';
  const searchQuery = searchParams?.search || '';
  const currentPage = Number.parseInt(searchParams?.page || '1', 10);

  setRequestLocale(locale);

  const [allArticles, banner] = await Promise.all([getArticles(), getNewsBanner(locale)]);

  // Filter articles by search query
  let filteredArticles = allArticles;
  if (searchQuery) {
    const q = searchQuery.toLowerCase();
    filteredArticles = filteredArticles.filter(
      (article: Article) =>
        article.title?.toLowerCase().includes(q) || article.summary?.toLowerCase().includes(q),
    );
  }

  // Filter articles by category
  if (selectedCategory) {
    filteredArticles = filteredArticles.filter(
      (article: Article) => article.category === selectedCategory,
    );
  }

  // Sorting and pagination
  const sortedArticles = [...filteredArticles].toSorted(
    (a: Article, b: Article) =>
      new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime(),
  );

  const totalArticles = sortedArticles.length;
  const articlesPerPage = 6;
  const totalPages = Math.ceil(totalArticles / articlesPerPage);
  const page = Math.max(1, Math.min(currentPage, totalPages || 1));
  const displayedArticles = sortedArticles.slice(
    (page - 1) * articlesPerPage,
    page * articlesPerPage,
  );

  const newsImages = [
    '/images/news/news1.png',
    '/images/news/news2.png',
    '/images/news/news3.png',
    '/images/news/news4.png',
  ];

  return (
    <div className="min-h-screen w-full bg-gray-50 pb-16">
      {/* Hero Banner Section */}
      <PageBannerSlider banners={banner} />

      {/* Main Content Layout */}
      <section className="mx-auto max-w-7xl px-4 py-12 md:px-8">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
          {/* Left Column: Articles Grid & Pagination */}
          <div className="space-y-8 lg:col-span-12">
            {displayedArticles.length === 0 ? (
              <div className="border-gray-150 w-full rounded-3xl border bg-white py-16 text-center font-medium text-gray-400 shadow-sm">
                {locale === 'en' ? 'No articles found.' : 'Không tìm thấy bài viết nào phù hợp.'}
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {displayedArticles.map((article: Article, idx: number) => (
                    <article
                      key={article.id}
                      className="flex flex-col justify-between overflow-hidden rounded-3xl border border-gray-100 bg-white transition-shadow duration-300 hover:shadow-lg"
                    >
                      <div>
                        <div className="relative h-52 overflow-hidden bg-gray-100 p-3">
                          <Link href={`/news/${article.slug}`}>
                            <Image
                              className="h-full w-full cursor-pointer rounded-2xl object-cover"
                              src={article.image || newsImages[idx % newsImages.length] || '/images/default_plant.png'}
                              alt={article.title}
                              fill
                              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                              unoptimized
                            />
                          </Link>
                          <span className="absolute top-6 left-6 flex items-center gap-1 rounded-full border border-emerald-100/50 bg-[#EAF5ED] px-3 py-1 text-[10px] font-bold text-[#2D7A4D]">
                            <span className="h-1.5 w-1.5 rounded-full bg-[#2D7A4D]" />
                            {getCategoryLabel(article.category || '', locale)}
                          </span>
                        </div>
                        <div className="space-y-3 p-6">
                          <div className="flex items-center gap-1.5 text-[11px] font-bold tracking-wider text-gray-400 uppercase">
                            {article.publishedAt
                              ? new Date(article.publishedAt).toLocaleDateString(
                                  locale === 'en' ? 'en-US' : 'vi-VN',
                                  { day: 'numeric', month: 'long', year: 'numeric' },
                                )
                              : ''}
                          </div>
                          <Link href={`/news/${article.slug}`}>
                            <h3 className="line-clamp-2 min-h-[44px] cursor-pointer text-base leading-snug font-bold text-gray-900 transition-colors hover:text-primary">
                              {article.title}
                            </h3>
                          </Link>
                          <p className="line-clamp-3 text-xs leading-relaxed text-gray-500">
                            {article.summary}
                          </p>
                        </div>
                      </div>
                      <div className="mt-4 flex items-center justify-between border-t border-gray-50 p-6 pt-0">
                        <div className="flex items-center gap-1.5 pt-4 text-xs font-semibold text-gray-500">
                          <span>{article.author || 'Sâm Ngọc Linh'}</span>
                        </div>
                        <Link
                          href={`/news/${article.slug}`}
                          className="group inline-flex cursor-pointer items-center gap-1 pt-4 text-xs font-bold text-secondary transition-colors hover:text-secondary-hover"
                        >
                          <span>{locale === 'en' ? 'Read more' : 'Đọc thêm'}</span>
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth="2.5"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                          </svg>
                        </Link>
                      </div>
                    </article>
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-center gap-2 border-t border-gray-200 pt-8">
                    {/* Previous Page Link */}
                    {page > 1 ? (
                      <Link
                        href={`/news?${new URLSearchParams({
                          ...(selectedCategory ? { category: selectedCategory } : {}),
                          ...(searchQuery ? { search: searchQuery } : {}),
                          page: (page - 1).toString(),
                        }).toString()}`}
                        className="flex cursor-pointer items-center gap-1 rounded-xl border border-gray-200 bg-white px-4 py-2 text-xs font-bold text-gray-600 transition-colors hover:border-primary hover:text-primary"
                      >
                        <span>{locale === 'en' ? 'Previous' : 'Trang trước'}</span>
                      </Link>
                    ) : (
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        disabled
                        className="flex cursor-not-allowed items-center gap-1 rounded-xl border border-gray-100 bg-gray-50 px-4 py-2 text-xs font-bold text-gray-400 opacity-50"
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
                          className={`flex h-9 w-9 items-center justify-center rounded-xl text-xs font-bold transition-colors ${
                            isActive
                              ? 'bg-primary text-white shadow-sm'
                              : 'border border-gray-200 bg-white text-gray-600 hover:border-primary hover:text-primary'
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
                        className="flex cursor-pointer items-center gap-1 rounded-xl border border-gray-200 bg-white px-4 py-2 text-xs font-bold text-gray-600 transition-colors hover:border-primary hover:text-primary"
                      >
                        <span>{locale === 'en' ? 'Next' : 'Trang sau'}</span>
                      </Link>
                    ) : (
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        disabled
                        className="flex cursor-not-allowed items-center gap-1 rounded-xl border border-gray-100 bg-gray-50 px-4 py-2 text-xs font-bold text-gray-400 opacity-50"
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
