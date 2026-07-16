import {
    Doc,
    DocAuth,
    DocGuard,
    DocResponse,
} from '@common/doc/decorators/doc.decorator';
import { applyDecorators } from '@nestjs/common';
import { WalletSummaryResponseDto } from '@modules/wallet/dtos/response/wallet.summary.response.dto';
import { WalletTransactionResponseDto } from '@modules/wallet/dtos/response/wallet.transaction.response.dto';

export function WalletUserSummaryDoc(): MethodDecorator {
    return applyDecorators(
        Doc({
            summary:
                'Get wallet summary (balance, trees owned, transactions count)',
        }),
        DocAuth({
            xApiKey: true,
            jwtAccessToken: true,
        }),
        DocGuard({ role: true }),
        DocResponse('wallet.summary', {
            dto: WalletSummaryResponseDto,
        })
    );
}

export function WalletUserTransactionsDoc(): MethodDecorator {
    return applyDecorators(
        Doc({
            summary: 'Get wallet transaction list',
        }),
        DocAuth({
            xApiKey: true,
            jwtAccessToken: true,
        }),
        DocGuard({ role: true }),
        DocResponse('wallet.transactions', {
            dto: WalletTransactionResponseDto,
        })
    );
}
