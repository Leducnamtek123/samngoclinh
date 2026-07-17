import {
    Doc,
    DocAuth,
    DocRequest,
    DocResponse,
} from '@common/doc/decorators/doc.decorator';
import { applyDecorators } from '@nestjs/common';
import { ContentArticleResponseDto } from '@modules/content/dtos/response/content.article.response.dto';

export function ContentPublicListArticlesDoc(): MethodDecorator {
    return applyDecorators(
        Doc({
            summary: 'Get public content articles list',
        }),
        DocAuth({
            xApiKey: true,
        }),
        DocResponse('content.listArticles', {
            dto: ContentArticleResponseDto,
        })
    );
}

export function ContentPublicGetArticleDoc(): MethodDecorator {
    return applyDecorators(
        Doc({
            summary: 'Get details of a specific article by ID or Slug',
        }),
        DocRequest({
            params: [
                {
                    name: 'idOrSlug',
                    description: 'Article ID or Slug',
                    required: true,
                    type: 'string',
                },
            ],
        }),
        DocAuth({
            xApiKey: true,
        }),
        DocResponse('content.listArticles')
    );
}

