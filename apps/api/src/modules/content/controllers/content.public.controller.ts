import { Controller, Get, Param, VERSION_NEUTRAL } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Response, ResponsePaging } from '@common/response/decorators/response.decorator';
import { ApiKeyProtected } from '@modules/api-key/decorators/api-key.decorator';
import { ContentService } from '@modules/content/services/content.service';
import {
    ContentPublicGetArticleDoc,
    ContentPublicListArticlesDoc,
} from '@modules/content/docs/content.public.doc';
import { IResponseReturn, IResponsePagingReturn } from '@common/response/interfaces/response.interface';
import { ContentArticle, Prisma } from '@generated/prisma-client';
import { PaginationOffsetQuery, PaginationQueryFilterEqualString } from '@common/pagination/decorators/pagination.decorator';
import { IPaginationEqual, IPaginationQueryOffsetParams } from '@common/pagination/interfaces/pagination.interface';

@ApiTags('modules.public.content')
@Controller({
    version: VERSION_NEUTRAL,
    path: '/content',
})
export class ContentPublicController {
    constructor(private readonly contentService: ContentService) {}

    @ContentPublicListArticlesDoc()
    @ResponsePaging('content.listArticles')
    @ApiKeyProtected()
    @Get('/articles')
    async listArticles(
        @PaginationOffsetQuery({
            availableSearch: ['title', 'summary'],
            availableOrderBy: ['createdAt', 'sortOrder'],
            defaultPerPage: 10,
        })
        pagination: IPaginationQueryOffsetParams<
            Prisma.ContentArticleSelect,
            Prisma.ContentArticleWhereInput
        >,
        @PaginationQueryFilterEqualString('status')
        status?: Record<string, IPaginationEqual>,
        @PaginationQueryFilterEqualString('category')
        category?: Record<string, IPaginationEqual>
    ): Promise<IResponsePagingReturn<ContentArticle>> {
        return this.contentService.listArticlesPaginated(pagination, {
            ...status,
            ...category,
        });
    }

    @ContentPublicGetArticleDoc()
    @Response('content.listArticles')
    @ApiKeyProtected()
    @Get('/articles/:idOrSlug')
    async getArticleDetail(
        @Param('idOrSlug') idOrSlug: string
    ): Promise<IResponseReturn<ContentArticle>> {
        return this.contentService.getArticleDetail(idOrSlug);
    }
}
