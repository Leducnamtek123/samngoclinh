import {
    Doc,
    DocAuth,
    DocGuard,
    DocResponse,
} from '@common/doc/decorators/doc.decorator';
import { applyDecorators } from '@nestjs/common';
import { CultivationTreeResponseDto } from '@modules/cultivation/dtos/response/cultivation.tree.response.dto';
import { CultivationGardenResponseDto } from '@modules/cultivation/dtos/response/cultivation.garden.response.dto';
import { CultivationBedResponseDto } from '@modules/cultivation/dtos/response/cultivation.bed.response.dto';

export function CultivationUserTreesDoc(): MethodDecorator {
    return applyDecorators(
        Doc({
            summary: 'Get user tree portfolio grouped by age',
        }),
        DocAuth({
            xApiKey: true,
            jwtAccessToken: true,
        }),
        DocGuard({ role: true }),
        DocResponse('cultivation.trees', {
            dto: CultivationTreeResponseDto,
        })
    );
}

export function CultivationUserGardensDoc(): MethodDecorator {
    return applyDecorators(
        Doc({
            summary: 'Get user garden summary',
        }),
        DocAuth({
            xApiKey: true,
            jwtAccessToken: true,
        }),
        DocGuard({ role: true }),
        DocResponse('cultivation.gardens', {
            dto: CultivationGardenResponseDto,
        })
    );
}

export function CultivationUserBedsDoc(): MethodDecorator {
    return applyDecorators(
        Doc({
            summary: 'Get user beds list',
        }),
        DocAuth({
            xApiKey: true,
            jwtAccessToken: true,
        }),
        DocGuard({ role: true }),
        DocResponse('cultivation.beds', {
            dto: CultivationBedResponseDto,
        })
    );
}
