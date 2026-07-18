export interface IContentArticleItem {
    id: string;
    slug: string;
    title: string;
    category: 'news' | 'event' | 'guide' | 'faq';
    publishedAt: string;
    summary: string;
    image?: string;
}
