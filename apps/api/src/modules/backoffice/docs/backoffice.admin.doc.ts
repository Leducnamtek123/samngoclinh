import {
    Doc,
    DocAuth,
    DocGuard,
    DocResponse,
} from '@common/doc/decorators/doc.decorator';
import { applyDecorators } from '@nestjs/common';
import { BackofficeOverviewResponseDto } from '@modules/backoffice/dtos/response/backoffice.overview.response.dto';

export function BackofficeAdminOverviewDoc(): MethodDecorator {
    return applyDecorators(
        Doc({
            summary: 'Get admin backoffice overview metrics',
        }),
        DocAuth({
            xApiKey: true,
            jwtAccessToken: true,
        }),
        DocGuard({ role: true }),
        DocResponse('backoffice.overview', {
            dto: BackofficeOverviewResponseDto,
        })
    );
}
