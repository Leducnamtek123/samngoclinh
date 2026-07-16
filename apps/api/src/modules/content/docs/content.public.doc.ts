import {
    Doc,
    DocAuth,
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
