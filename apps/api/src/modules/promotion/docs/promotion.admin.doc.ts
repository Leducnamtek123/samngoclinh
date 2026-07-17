import {
    Doc,
    DocAuth,
    DocGuard,
    DocRequest,
    DocResponse,
} from '@common/doc/decorators/doc.decorator';
import { applyDecorators } from '@nestjs/common';
import { PromotionAdminCreateRequestDto } from '@modules/promotion/dtos/request/promotion.admin-create.request.dto';
import { PromotionAdminUpdateRequestDto } from '@modules/promotion/dtos/request/promotion.admin-update.request.dto';
import { EnumDocRequestBodyType } from '@common/doc/enums/doc.enum';

export function PromotionAdminListDoc(): MethodDecorator {
    return applyDecorators(
        Doc({
            summary: 'List all promotion campaigns (Admin)',
        }),
        DocAuth({
            xApiKey: true,
            jwtAccessToken: true,
        }),
        DocGuard({ role: true }),
        DocResponse('promotion.freeTree')
    );
}

export function PromotionAdminCreateDoc(): MethodDecorator {
    return applyDecorators(
        Doc({
            summary: 'Create a new promotion campaign (Admin)',
        }),
        DocRequest({
            bodyType: EnumDocRequestBodyType.json,
            dto: PromotionAdminCreateRequestDto,
        }),
        DocAuth({
            xApiKey: true,
            jwtAccessToken: true,
        }),
        DocGuard({ role: true }),
        DocResponse('promotion.freeTree')
    );
}

export function PromotionAdminUpdateDoc(): MethodDecorator {
    return applyDecorators(
        Doc({
            summary: 'Update an existing promotion campaign (Admin)',
        }),
        DocRequest({
            params: [
                {
                    name: 'id',
                    description: 'Campaign ID',
                    required: true,
                    type: 'string',
                },
            ],
            bodyType: EnumDocRequestBodyType.json,
            dto: PromotionAdminUpdateRequestDto,
        }),
        DocAuth({
            xApiKey: true,
            jwtAccessToken: true,
        }),
        DocGuard({ role: true }),
        DocResponse('promotion.freeTree')
    );
}

export function PromotionAdminDeleteDoc(): MethodDecorator {
    return applyDecorators(
        Doc({
            summary: 'Delete a promotion campaign (Admin)',
        }),
        DocRequest({
            params: [
                {
                    name: 'id',
                    description: 'Campaign ID',
                    required: true,
                    type: 'string',
                },
            ],
        }),
        DocAuth({
            xApiKey: true,
            jwtAccessToken: true,
        }),
        DocGuard({ role: true }),
        DocResponse('promotion.freeTree')
    );
}
