import {
    Doc,
    DocAuth,
    DocGuard,
    DocRequest,
    DocResponse,
} from '@common/doc/decorators/doc.decorator';
import { applyDecorators } from '@nestjs/common';
import { WalletAdminAdjustRequestDto } from '@modules/wallet/dtos/request/wallet.admin-adjust.request.dto';
import { EnumDocRequestBodyType } from '@common/doc/enums/doc.enum';

export function WalletAdminListTransactionsDoc(): MethodDecorator {
    return applyDecorators(
        Doc({
            summary: 'List all wallet transactions across all CTVs (Admin)',
        }),
        DocAuth({
            xApiKey: true,
            jwtAccessToken: true,
        }),
        DocGuard({ role: true }),
        DocResponse('wallet.transactions')
    );
}

export function WalletAdminAdjustDoc(): MethodDecorator {
    return applyDecorators(
        Doc({
            summary: 'Adjust (Credit/Debit) points to user wallet manually',
        }),
        DocRequest({
            bodyType: EnumDocRequestBodyType.json,
            dto: WalletAdminAdjustRequestDto,
        }),
        DocAuth({
            xApiKey: true,
            jwtAccessToken: true,
        }),
        DocGuard({ role: true }),
        DocResponse('wallet.summary')
    );
}
