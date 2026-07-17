import { Controller, Get, Param, VERSION_NEUTRAL } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Response } from '@common/response/decorators/response.decorator';
import { ApiKeyProtected } from '@modules/api-key/decorators/api-key.decorator';
import { ContentService } from '@modules/content/services/content.service';
import {
    ContentPublicGetArticleDoc,
    ContentPublicListArticlesDoc,
} from '@modules/content/docs/content.public.doc';
import { IResponseReturn } from '@common/response/interfaces/response.interface';
import { ContentArticleResponseDto } from '@modules/content/dtos/response/content.article.response.dto';
import { ContentArticle } from '@generated/prisma-client';

@ApiTags('modules.public.content')
@Controller({
    version: VERSION_NEUTRAL,
    path: '/content',
})
export class ContentPublicController {
    constructor(private readonly contentService: ContentService) {}

    @ContentPublicListArticlesDoc()
    @Response('content.listArticles')
    @ApiKeyProtected()
    @Get('/articles')
    async listArticles(): Promise<
        IResponseReturn<{ items: ContentArticleResponseDto[] }>
    > {
        return this.contentService.listArticles();
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
