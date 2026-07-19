import { IResponseReturn, IResponsePagingReturn } from '@common/response/interfaces/response.interface';
import { Injectable, NotFoundException } from '@nestjs/common';
import { IContentArticleItem } from '@modules/content/interfaces/content.interface';
import { ContentRepository } from '@modules/content/repositories/content.repository';
import { ContentArticle, Prisma } from '@generated/prisma-client';
import { ContentArticleCreateDto, ContentArticleUpdateDto } from '../dtos/content.admin.dto';
import { IPaginationEqual, IPaginationQueryOffsetParams } from '@common/pagination/interfaces/pagination.interface';

@Injectable()
export class ContentService {
    constructor(private readonly contentRepository: ContentRepository) {}

    async listArticles(): Promise<
        IResponseReturn<{ items: IContentArticleItem[] }>
    > {
        return {
            data: {
                items: await this.contentRepository.listArticles(),
            },
        };
    }

    async listArticlesPaginated(
        pagination: IPaginationQueryOffsetParams<
            Prisma.ContentArticleSelect,
            Prisma.ContentArticleWhereInput
        >,
        status?: Record<string, IPaginationEqual>
    ): Promise<IResponsePagingReturn<ContentArticle>> {
        return this.contentRepository.listArticlesPaginated(pagination, status);
    }

    async createArticle(data: ContentArticleCreateDto): Promise<IResponseReturn<ContentArticle>> {
        const item = await this.contentRepository.createArticle(data);
        return { data: item };
    }

    async updateArticle(id: string, data: ContentArticleUpdateDto): Promise<IResponseReturn<ContentArticle>> {
        const item = await this.contentRepository.updateArticle(id, data);
        return { data: item };
    }

    async deleteArticle(id: string): Promise<IResponseReturn<void>> {
        await this.contentRepository.deleteArticle(id);
        return { data: undefined };
    }

    async getArticleDetail(idOrSlug: string): Promise<IResponseReturn<ContentArticle>> {
        const item = await this.contentRepository.getArticleDetail(idOrSlug);
        if (!item) {
            throw new NotFoundException('Article not found');
        }
        return { data: item };
    }
}
