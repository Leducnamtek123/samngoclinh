import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { setRequestLocale } from 'next-intl/server';
import { fetchApi } from '@/libs/Api';
import { Link } from '@/libs/I18nNavigation';

type ArticleDetailPageProps = {
  params: Promise<{ locale: string; slug: string }>;
};

async function getArticleDetail(slug: string) {
  try {
    const res = await fetchApi(`/public/content/articles/${slug}`, {
      cache: 'no-store',
    });
    if (!res.ok) {
      return null;
    }
    const json = await res.json();
    return json.data || null;
  } catch (error) {
    console.error('Error fetching article detail:', error);
    return null;
  }
}

async function getRelatedArticles(category: string, currentSlug: string) {
  try {
    const res = await fetchApi('/public/content/articles', {
      cache: 'no-store',
    });
    if (!res.ok) {
      return [];
    }
    const json = await res.json();
    const all = json.data?.items || [];
    return all
      .filter((a: any) => a.category === category && a.slug !== currentSlug)
      .slice(0, 3);
  } catch (error) {
    console.error('Error fetching related articles:', error);
    return [];
  }
}

const categoryLabels: Record<string, string> = {
  'news': 'Tin tức',
  'event': 'Sự kiện',
  'guide': 'Hướng dẫn sử dụng app',
  'faq': 'Kiến thức',
};

const getCategoryLabel = (category: string) => {
  return categoryLabels[category] || category || 'Tin tức';
};

export async function generateMetadata(props: ArticleDetailPageProps): Promise<Metadata> {
  const { slug } = await props.params;
  const article = await getArticleDetail(slug);
  if (!article) {
    return {
      title: 'Bài viết không tồn tại',
    };
  }
  return {
    title: `${article.title} | Rượu Sâm Ngọc Linh`,
    description: article.summary,
  };
}

export default async function ArticleDetailPage(props: ArticleDetailPageProps) {
  const { locale, slug } = await props.params;
  setRequestLocale(locale);

  const article = await getArticleDetail(slug);
  if (!article) {
    notFound();
  }

  const relatedArticles = await getRelatedArticles(article.category, slug);

  const newsImages = [
    '/images/news/news1.png',
    '/images/news/news2.png',
    '/images/news/news3.png',
    '/images/news/news4.png',
  ];

  return (
    <div className="w-full bg-gray-50 min-h-screen pb-20">
      {/* Article Detail Header Container */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-10">
        
        {/* Back Button */}
        <Link
          href="/news"
          className="inline-flex items-center gap-2 text-xs font-bold text-gray-500 hover:text-primary transition-colors mb-6 group"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
          </svg>
          <span>Quay lại danh sách</span>
        </Link>

        {/* Category & Date Info */}
        <div className="flex items-center gap-3 mb-4">
          <span className="bg-[#EAF5ED] text-[#2D7A4D] border border-emerald-100/50 text-[10px] font-bold px-3 py-1 rounded-full flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-[#2D7A4D]"></span>
            {getCategoryLabel(article.category)}
          </span>
          <span className="text-[11px] text-gray-400 font-bold uppercase tracking-wider">
            {article.publishedAt ? new Date(article.publishedAt).toLocaleDateString('vi-VN', { day: 'numeric', month: 'long', year: 'numeric' }) : ''}
          </span>
        </div>

        {/* Article Title */}
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-gray-900 leading-tight mb-6">
          {article.title}
        </h1>

        {/* Author / Source */}
        <div className="flex items-center gap-2 text-xs font-semibold text-gray-500 pb-8 border-b border-gray-150 mb-10">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4 text-gray-400">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
          </svg>
          <span>Tác giả: iWE FARM</span>
        </div>

        {/* Article Body Content */}
        <article className="bg-white border border-gray-100 rounded-[32px] p-6 sm:p-10 shadow-sm mb-16">
          {/* Main Cover Image */}
          {article.coverImage && (
            <div className="w-full rounded-2xl overflow-hidden mb-8 max-h-[480px]">
              <img
                src={article.coverImage}
                alt={article.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          {/* HTML rendered body content styled carefully */}
          <div
            className="prose prose-emerald max-w-none text-gray-700 leading-relaxed text-sm sm:text-base space-y-6 
              [&_p]:mb-4 [&_p]:text-gray-600 [&_p]:leading-relaxed
              [&_h2]:text-xl [&_h2]:font-bold [&_h2]:text-gray-900 [&_h2]:mt-8 [&_h2]:mb-4
              [&_h3]:text-lg [&_h3]:font-bold [&_h3]:text-gray-800 [&_h3]:mt-6 [&_h3]:mb-3
              [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:space-y-2 [&_ul]:mb-4
              [&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:space-y-2 [&_ol]:mb-4
              [&_li]:text-gray-600
              [&_img]:rounded-2xl [&_img]:mx-auto [&_img]:my-6 [&_img]:shadow-sm [&_img]:max-w-full
              [&_strong]:font-bold [&_strong]:text-gray-900"
            dangerouslySetInnerHTML={{ __html: article.body || article.summary }}
          />
        </article>

        {/* Related Articles Section */}
        {relatedArticles.length > 0 && (
          <div className="border-t border-gray-200 pt-12">
            <h3 className="text-xl font-bold text-gray-900 mb-8 text-center">
              Bài viết liên quan
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedArticles.map((rel: any, idx: number) => (
                <article
                  key={rel.id}
                  className="bg-white border border-gray-100 rounded-3xl overflow-hidden hover:shadow-lg transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="h-44 overflow-hidden bg-gray-100 relative p-3">
                      <Link href={`/news/${rel.slug}`}>
                        <img
                          className="w-full h-full object-cover rounded-2xl cursor-pointer"
                          src={rel.image || newsImages[idx % newsImages.length]}
                          alt={rel.title}
                        />
                      </Link>
                      <span className="absolute top-6 left-6 bg-[#EAF5ED] text-[#2D7A4D] border border-emerald-100/50 text-[10px] font-bold px-3 py-1 rounded-full flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#2D7A4D]"></span>
                        {getCategoryLabel(rel.category)}
                      </span>
                    </div>
                    <div className="p-5 space-y-2.5">
                      <div className="flex items-center gap-1.5 text-[10px] text-gray-400 font-bold uppercase tracking-wider">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-3 h-3">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5m-9-6h.008v.008H12v-.008ZM12 15h.008v.008H12V15Zm0 2.25h.008v.008H12v-.008ZM9.75 15h.008v.008H9.75V15Zm0 2.25h.008v.008H9.75v-.008ZM7.5 15h.008v.008H7.5V15Zm0 2.25h.008v.008H7.5v-.008Zm6.75-4.5h.008v.008h-.008v-.008Zm0 2.25h.008v.008h-.008V15Zm0 2.25h.008v.008h-.008v-.008Zm2.25-4.5h.008v.008H16.5v-.008Zm0 2.25h.008v.008H16.5V15Z" />
                        </svg>
                        {rel.publishedAt ? new Date(rel.publishedAt).toLocaleDateString("vi-VN", { day: 'numeric', month: 'long', year: 'numeric' }) : ""}
                      </div>
                      <Link href={`/news/${rel.slug}`}>
                        <h4 className="font-bold text-gray-900 text-sm leading-snug line-clamp-2 hover:text-primary transition-colors min-h-[36px] cursor-pointer">
                          {rel.title}
                        </h4>
                      </Link>
                    </div>
                  </div>
                  <div className="p-5 pt-0 flex items-center justify-between border-t border-gray-50 mt-2">
                    <div className="flex items-center gap-1.5 pt-3 text-[10px] font-semibold text-gray-500">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-3.5 h-3.5 text-gray-400">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
                      </svg>
                      <span>iWE FARM</span>
                    </div>
                    <Link
                      href={`/news/${rel.slug}`}
                      className="inline-flex items-center gap-1 text-[11px] font-bold text-secondary hover:text-secondary-hover pt-3 transition-colors group cursor-pointer"
                    >
                      <span>Đọc thêm</span>
                      <svg xmlns="http://www.w3.org/2000/svg" className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                      </svg>
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
