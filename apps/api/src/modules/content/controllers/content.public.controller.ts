import { Controller, Get, VERSION_NEUTRAL } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Response } from '@common/response/decorators/response.decorator';
import { ApiKeyProtected } from '@modules/api-key/decorators/api-key.decorator';
import { ContentService } from '@modules/content/services/content.service';
import { ContentPublicListArticlesDoc } from '@modules/content/docs/content.public.doc';
import { IResponseReturn } from '@common/response/interfaces/response.interface';
import { ContentArticleResponseDto } from '@modules/content/dtos/response/content.article.response.dto';

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
    async listArticles(): Promise<IResponseReturn<{ items: ContentArticleResponseDto[] }>> {
        return this.contentService.listArticles();
    }
}
