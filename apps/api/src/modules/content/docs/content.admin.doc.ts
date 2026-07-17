import { applyDecorators } from '@nestjs/common';
import { Doc, DocAuth, DocGuard, DocRequest, DocResponse } from '@common/doc/decorators/doc.decorator';
import { EnumDocRequestBodyType } from '@common/doc/enums/doc.enum';
import { ContentArticleCreateDto, ContentArticleUpdateDto } from '../dtos/content.admin.dto';

export function ContentAdminCreateArticleDoc(): MethodDecorator {
    return applyDecorators(
        Doc({ summary: 'Create a new content article' }),
        DocRequest({ bodyType: EnumDocRequestBodyType.json, dto: ContentArticleCreateDto }),
        DocAuth({ xApiKey: true, jwtAccessToken: true }),
        DocGuard({ role: true }),
        DocResponse('content.create')
    );
}

export function ContentAdminUpdateArticleDoc(): MethodDecorator {
    return applyDecorators(
        Doc({ summary: 'Update a content article' }),
        DocRequest({
            params: [{ name: 'id', description: 'Article ID', required: true, type: 'string' }],
            bodyType: EnumDocRequestBodyType.json,
            dto: ContentArticleUpdateDto,
        }),
        DocAuth({ xApiKey: true, jwtAccessToken: true }),
        DocGuard({ role: true }),
        DocResponse('content.update')
    );
}

export function ContentAdminDeleteArticleDoc(): MethodDecorator {
    return applyDecorators(
        Doc({ summary: 'Delete a content article' }),
        DocRequest({
            params: [{ name: 'id', description: 'Article ID', required: true, type: 'string' }],
        }),
        DocAuth({ xApiKey: true, jwtAccessToken: true }),
        DocGuard({ role: true }),
        DocResponse('content.delete')
    );
}
