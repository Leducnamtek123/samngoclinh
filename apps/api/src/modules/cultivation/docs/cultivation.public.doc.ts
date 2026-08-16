import {
    Doc,
    DocAuth,
    DocResponse,
} from '@common/doc/decorators/doc.decorator';
import { applyDecorators } from '@nestjs/common';
import { CultivationPublicBedResponseDto } from '@modules/cultivation/dtos/response/cultivation.public-bed.response.dto';
import { CultivationPublicBedDetailResponseDto } from '@modules/cultivation/dtos/response/cultivation.public-bed-detail.response.dto';
import { CultivationPublicGardenResponseDto } from '@modules/cultivation/dtos/response/cultivation.public-garden.response.dto';
import { CultivationPurchaseResponseDto } from '@modules/cultivation/dtos/response/cultivation.public-purchase.response.dto';

export function CultivationPublicGardenPurchaseDoc(): MethodDecorator {
    return applyDecorators(
        Doc({
            summary: 'Get purchase scopes (whole garden or per bed) with pricing',
        }),
        DocAuth({
            xApiKey: true,
        }),
        DocResponse('cultivation.publicGardenPurchase', {
            dto: CultivationPurchaseResponseDto,
        })
    );
}

export function CultivationPublicListGardensDoc(): MethodDecorator {
    return applyDecorators(
        Doc({
            summary: 'List public cultivation gardens',
        }),
        DocAuth({
            xApiKey: true,
        }),
        DocResponse('cultivation.publicGardens', {
            dto: CultivationPublicGardenResponseDto,
        })
    );
}

export function CultivationPublicListBedsDoc(): MethodDecorator {
    return applyDecorators(
        Doc({
            summary: 'List public cultivation beds by age year',
        }),
        DocAuth({
            xApiKey: true,
        }),
        DocResponse('cultivation.publicBeds', {
            dto: CultivationPublicBedResponseDto,
        })
    );
}

export function CultivationPublicBedDetailDoc(): MethodDecorator {
    return applyDecorators(
        Doc({
            summary: 'Get public cultivation bed detail with care logs',
        }),
        DocAuth({
            xApiKey: true,
        }),
        DocResponse('cultivation.publicBedDetail', {
            dto: CultivationPublicBedDetailResponseDto,
        })
    );
}
