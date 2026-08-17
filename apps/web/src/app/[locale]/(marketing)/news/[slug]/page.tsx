import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
import Image from 'next/image';
import { notFound } from 'next/navigation';

export const dynamic = 'force-dynamic';
import { fetchApi } from '@/lib/Api';
import { Link } from '@/lib/I18nNavigation';
import { sanitizeHtml } from '@/utils/sanitize';

type ArticleDetailPageProps = {
  params: Promise<{ locale: string; slug: string }>;
};

async function getArticleDetail(slug: string) {
  try {
    const res = await fetchApi(`/public/content/articles/${slug}`, {
      next: { revalidate: 60 },
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

import type { Article } from '@/types';

async function getRelatedArticles(category: string, currentSlug: string): Promise<Article[]> {
  try {
    const res = await fetchApi('/public/content/articles', {
      next: { revalidate: 60 },
    });
    if (!res.ok) {
      return [];
    }
    const json = await res.json();
    const all: Article[] = json.data || [];
    return all.filter((a: Article) => a.category === category && a.slug !== currentSlug).slice(0, 3);
  } catch (error) {
    console.error('Error fetching related articles:', error);
    return [];
  }
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

export async function generateMetadata(props: ArticleDetailPageProps): Promise<Metadata> {
  const { slug } = await props.params;
  const article = await getArticleDetail(slug);
  if (!article) {
    return {
      title: 'Article Not Found',
    };
  }
  return {
    title: `${article.title} | Sâm Ngọc Linh`,
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
    <div className="min-h-screen w-full bg-gray-50 pb-20">
      {/* Article Detail Header Container */}
      <div className="mx-auto max-w-4xl px-4 pt-10 sm:px-6 lg:px-8">
        {/* Back Button */}
        <Link
          href="/news"
          className="group mb-6 inline-flex items-center gap-2 text-xs font-bold text-gray-500 transition-colors hover:text-primary"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={3}
            stroke="currentColor"
            className="h-3.5 w-3.5 transition-transform group-hover:-translate-x-0.5"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
          </svg>
          <span>{locale === 'en' ? 'Back to articles' : 'Quay lại danh sách'}</span>
        </Link>

        {/* Category & Date Info */}
        <div className="mb-4 flex items-center gap-3">
          <span className="flex items-center gap-1 rounded-full border border-emerald-100/50 bg-[#EAF5ED] px-3 py-1 text-[10px] font-bold text-[#2D7A4D]">
            <span className="h-1.5 w-1.5 rounded-full bg-[#2D7A4D]" />
            {getCategoryLabel(article.category, locale)}
          </span>
          <span className="text-[11px] font-bold tracking-wider text-gray-400 uppercase">
            {article.publishedAt
              ? new Date(article.publishedAt).toLocaleDateString(
                  locale === 'en' ? 'en-US' : 'vi-VN',
                  { day: 'numeric', month: 'long', year: 'numeric' },
                )
              : ''}
          </span>
        </div>

        {/* Article Title */}
        <h1 className="mb-6 text-2xl leading-tight font-extrabold text-gray-900 sm:text-3xl md:text-4xl">
          {article.title}
        </h1>

        {/* Author / Source */}
        <div className="border-gray-150 mb-10 flex items-center gap-2 border-b pb-8 text-xs font-semibold text-gray-500">
          <span>
            {locale === 'en' ? 'Author:' : 'Tác giả:'}{' '}
            {article.metadata?.authorName || 'Sâm Ngọc Linh'}
          </span>
        </div>

        {/* Article Body Content */}
        <article className="mb-16 rounded-[32px] border border-gray-100 bg-white p-6 shadow-sm sm:p-10">
          {/* Main Cover Image */}
          {article.coverImage && (
            <div className="relative mb-8 h-[400px] w-full overflow-hidden rounded-2xl">
              <Image
                src={article.coverImage}
                alt={article.title}
                fill
                sizes="100vw"
                unoptimized
                className="h-full w-full object-cover"
              />
            </div>
          )}

          {/* HTML rendered body content styled carefully */}
          <div
            className="prose prose-emerald max-w-none space-y-6 text-sm leading-relaxed text-gray-700 sm:text-base [&_h2]:mt-8 [&_h2]:mb-4 [&_h2]:text-xl [&_h2]:font-bold [&_h2]:text-gray-900 [&_h3]:mt-6 [&_h3]:mb-3 [&_h3]:text-lg [&_h3]:font-bold [&_h3]:text-gray-800 [&_img]:mx-auto [&_img]:my-6 [&_img]:max-w-full [&_img]:rounded-2xl [&_img]:shadow-sm [&_li]:text-gray-600 [&_ol]:mb-4 [&_ol]:list-decimal [&_ol]:space-y-2 [&_ol]:pl-6 [&_p]:mb-4 [&_p]:leading-relaxed [&_p]:text-gray-600 [&_strong]:font-bold [&_strong]:text-gray-900 [&_ul]:mb-4 [&_ul]:list-disc [&_ul]:space-y-2 [&_ul]:pl-6"
            dangerouslySetInnerHTML={{ __html: sanitizeHtml(article.body || article.summary) }}
          />
        </article>

        {/* Related Articles Section */}
        {relatedArticles.length > 0 && (
          <div className="border-t border-gray-200 pt-12">
            <h3 className="mb-8 text-center text-xl font-bold text-gray-900">
              {locale === 'en' ? 'Related Articles' : 'Bài viết liên quan'}
            </h3>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
              {relatedArticles.map((rel: Article, idx: number) => (
                <article
                  key={rel.id}
                  className="flex flex-col justify-between overflow-hidden rounded-3xl border border-gray-100 bg-white transition-shadow duration-300 hover:shadow-lg"
                >
                  <div>
                    <div className="relative h-44 overflow-hidden bg-gray-100 p-3">
                      <Link href={`/news/${rel.slug}`}>
                        <Image
                          className="h-full w-full cursor-pointer rounded-2xl object-cover"
                          src={rel.image || newsImages[idx % newsImages.length] || '/images/default_plant.png'}
                          alt={rel.title}
                          fill
                          sizes="(max-width: 768px) 100vw, 33vw"
                          unoptimized
                        />
                      </Link>
                      <span className="absolute top-6 left-6 flex items-center gap-1 rounded-full border border-emerald-100/50 bg-[#EAF5ED] px-3 py-1 text-[10px] font-bold text-[#2D7A4D]">
                        <span className="h-1.5 w-1.5 rounded-full bg-[#2D7A4D]" />
                        {getCategoryLabel(rel.category || '', locale)}
                      </span>
                    </div>
                    <div className="space-y-2.5 p-5">
                      <div className="flex items-center gap-1.5 text-[10px] font-bold tracking-wider text-gray-400 uppercase">
                        {rel.publishedAt
                          ? new Date(rel.publishedAt).toLocaleDateString(
                              locale === 'en' ? 'en-US' : 'vi-VN',
                              { day: 'numeric', month: 'long', year: 'numeric' },
                            )
                          : ''}
                      </div>
                      <Link href={`/news/${rel.slug}`}>
                        <h4 className="line-clamp-2 min-h-[36px] cursor-pointer text-sm leading-snug font-bold text-gray-900 transition-colors hover:text-primary">
                          {rel.title}
                        </h4>
                      </Link>
                    </div>
                  </div>
                  <div className="mt-2 flex items-center justify-between border-t border-gray-50 p-5 pt-0">
                    <div className="flex items-center gap-1.5 pt-3 text-[10px] font-semibold text-gray-500">
                      <span>{rel.author || 'Sâm Ngọc Linh'}</span>
                    </div>
                    <Link
                      href={`/news/${rel.slug}`}
                      className="group inline-flex cursor-pointer items-center gap-1 pt-3 text-[11px] font-bold text-secondary transition-colors hover:text-secondary-hover"
                    >
                      <span>{locale === 'en' ? 'Read more' : 'Đọc thêm'}</span>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-3 w-3 transition-transform group-hover:translate-x-0.5"
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
          </div>
        )}
      </div>
    </div>
  );
}
