import { DatabaseService } from '@common/database/services/database.service';
import { Injectable } from '@nestjs/common';
import { IContentArticleItem } from '@modules/content/interfaces/content.interface';
import { ContentArticle, Prisma } from '@prisma/client';
import { ContentArticleCreateDto, ContentArticleUpdateDto } from '../dtos/content.admin.dto';
import { PaginationService } from '@common/pagination/services/pagination.service';
import { IPaginationEqual, IPaginationQueryOffsetParams } from '@common/pagination/interfaces/pagination.interface';
import { IResponsePagingReturn } from '@common/response/interfaces/response.interface';

@Injectable()
export class ContentRepository {
    constructor(
        private readonly databaseService: DatabaseService,
        private readonly paginationService: PaginationService
    ) {}

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
                coverImage: true,
                metadata: true,
            },
        });

        return items.map(item => ({
            id: item.id,
            slug: item.slug,
            title: item.title,
            category: item.category as IContentArticleItem['category'],
            publishedAt: (item.publishedAt ?? item.createdAt).toISOString(),
            summary: item.summary,
            image: item.coverImage || undefined,
            author:
                (item.metadata as { authorName?: string } | null)
                    ?.authorName || 'Sâm Ngọc Linh',
        }));
    }

    async listArticlesPaginated(
        pagination: IPaginationQueryOffsetParams<
            Prisma.ContentArticleSelect,
            Prisma.ContentArticleWhereInput
        >,
        status?: Record<string, IPaginationEqual>
    ): Promise<IResponsePagingReturn<ContentArticle>> {
        const { where, ...params } = pagination;
        return this.paginationService.offset<
            ContentArticle,
            Prisma.ContentArticleSelect,
            Prisma.ContentArticleWhereInput
        >(this.databaseService.contentArticle, {
            ...params,
            where: {
                ...where,
                ...status,
            },
        });
    }

    async createArticle(data: ContentArticleCreateDto): Promise<ContentArticle> {
        return this.databaseService.contentArticle.create({
            data: {
                slug: data.slug,
                title: data.title,
                category: data.category,
                summary: data.summary,
                body: data.body ?? null,
                status: data.status,
                sortOrder: data.sortOrder ?? 0,
                coverImage: data.coverImage ?? null,
                metadata: data.metadata ? (data.metadata as Prisma.InputJsonValue) : undefined,
                publishedAt: data.status === 'published' ? new Date() : null,
            },
        });
    }

    async updateArticle(id: string, data: ContentArticleUpdateDto): Promise<ContentArticle> {
        return this.databaseService.contentArticle.update({
            where: { id },
            data: {
                slug: data.slug ?? undefined,
                title: data.title ?? undefined,
                category: data.category ?? undefined,
                summary: data.summary ?? undefined,
                body: data.body ?? undefined,
                status: data.status ?? undefined,
                sortOrder: data.sortOrder ?? undefined,
                coverImage: data.coverImage ?? undefined,
                metadata: data.metadata ? (data.metadata as Prisma.InputJsonValue) : undefined,
                publishedAt: data.status === 'published' ? new Date() : undefined,
            },
        });
    }

    async deleteArticle(id: string): Promise<ContentArticle> {
        return this.databaseService.contentArticle.delete({
            where: { id },
        });
    }

    async getArticleDetail(idOrSlug: string): Promise<ContentArticle | null> {
        const isUuid = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/.test(idOrSlug);
        if (isUuid) {
            return this.databaseService.contentArticle.findUnique({
                where: { id: idOrSlug },
            });
        }
        return this.databaseService.contentArticle.findUnique({
            where: { slug: idOrSlug },
        });
    }
}
