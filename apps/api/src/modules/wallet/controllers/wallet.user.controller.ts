import { Controller, Get, VERSION_NEUTRAL } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Response } from '@common/response/decorators/response.decorator';
import { ApiKeyProtected } from '@modules/api-key/decorators/api-key.decorator';
import {
    AuthJwtAccessProtected,
    AuthJwtPayload,
} from '@modules/auth/decorators/auth.jwt.decorator';
import { RoleProtected } from '@modules/role/decorators/role.decorator';
import { UserProtected } from '@modules/user/decorators/user.decorator';
import { EnumRoleType } from '@generated/prisma-client';
import { WalletService } from '@modules/wallet/services/wallet.service';
import {
    WalletUserSummaryDoc,
    WalletUserTransactionsDoc,
} from '@modules/wallet/docs/wallet.user.doc';
import { IResponseReturn } from '@common/response/interfaces/response.interface';
import { WalletSummaryResponseDto } from '@modules/wallet/dtos/response/wallet.summary.response.dto';
import { WalletTransactionResponseDto } from '@modules/wallet/dtos/response/wallet.transaction.response.dto';

@ApiTags('modules.user.wallet')
@Controller({
    version: VERSION_NEUTRAL,
    path: '/wallet',
})
export class WalletUserController {
    constructor(private readonly walletService: WalletService) {}

    @WalletUserSummaryDoc()
    @Response('wallet.summary')
    @RoleProtected(EnumRoleType.user)
    @UserProtected()
    @AuthJwtAccessProtected()
    @ApiKeyProtected()
    @Get('/summary')
    async summary(
        @AuthJwtPayload('userId') userId: string
    ): Promise<IResponseReturn<WalletSummaryResponseDto>> {
        return this.walletService.summary(userId);
    }

    @WalletUserTransactionsDoc()
    @Response('wallet.transactions')
    @RoleProtected(EnumRoleType.user)
    @UserProtected()
    @AuthJwtAccessProtected()
    @ApiKeyProtected()
    @Get('/transactions')
    async transactions(
        @AuthJwtPayload('userId') userId: string
    ): Promise<IResponseReturn<{ items: WalletTransactionResponseDto[] }>> {
        return this.walletService.transactions(userId);
    }
}
