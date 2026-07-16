import { DatabaseService } from '@common/database/services/database.service';
import { Injectable } from '@nestjs/common';
import { IContentArticleItem } from '@modules/content/interfaces/content.interface';

@Injectable()
export class ContentRepository {
    constructor(private readonly databaseService: DatabaseService) {}

    async listArticles(): Promise<IContentArticleItem[]> {
        const items = await this.databaseService.contentArticle.findMany({
            orderBy: [{ sortOrder: 'asc' }, { createdAt: 'desc' }],
            select: {
                id: true,
                slug: true,
                title: true,
                category: true,
                summary: true,
                publishedAt: true,
                createdAt: true,
            },
        });

        return items.map(item => ({
            id: item.id,
            slug: item.slug,
            title: item.title,
            category: item.category as IContentArticleItem['category'],
            publishedAt: (item.publishedAt ?? item.createdAt).toISOString(),
            summary: item.summary,
        }));
    }
}
