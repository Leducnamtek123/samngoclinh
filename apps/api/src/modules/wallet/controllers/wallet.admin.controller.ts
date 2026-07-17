import {
    Body,
    Controller,
    Get,
    Patch,
    VERSION_NEUTRAL,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Response } from '@common/response/decorators/response.decorator';
import { ApiKeyProtected } from '@modules/api-key/decorators/api-key.decorator';
import { AuthJwtAccessProtected } from '@modules/auth/decorators/auth.jwt.decorator';
import { RoleProtected } from '@modules/role/decorators/role.decorator';
import { EnumRoleType } from '@generated/prisma-client';
import { WalletService } from '@modules/wallet/services/wallet.service';
import {
    WalletAdminAdjustDoc,
    WalletAdminListTransactionsDoc,
} from '@modules/wallet/docs/wallet.admin.doc';
import { IResponseReturn } from '@common/response/interfaces/response.interface';
import { WalletAdminAdjustRequestDto } from '@modules/wallet/dtos/request/wallet.admin-adjust.request.dto';

@ApiTags('modules.admin.wallet')
@Controller({
    version: VERSION_NEUTRAL,
    path: '/admin/wallet',
})
export class WalletAdminController {
    constructor(private readonly walletService: WalletService) {}

    @WalletAdminListTransactionsDoc()
    @Response('wallet.transactions')
    @RoleProtected(EnumRoleType.superAdmin, EnumRoleType.admin)
    @AuthJwtAccessProtected()
    @ApiKeyProtected()
    @Get('/transactions')
    async listTransactions(): Promise<IResponseReturn<{ items: any[] }>> {
        return this.walletService.adminListTransactions();
    }

    @WalletAdminAdjustDoc()
    @Response('wallet.summary')
    @RoleProtected(EnumRoleType.superAdmin, EnumRoleType.admin)
    @AuthJwtAccessProtected()
    @ApiKeyProtected()
    @Patch('/balance')
    async adjustBalance(
        @Body() body: WalletAdminAdjustRequestDto
    ): Promise<IResponseReturn<any>> {
        return this.walletService.adminAdjustBalance(body.userId, body.amount, body.title);
    }
}
