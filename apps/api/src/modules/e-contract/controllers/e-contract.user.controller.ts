import { Body, Controller, Get, Param, Post, Req, VERSION_NEUTRAL } from '@nestjs/common';
import { Request } from 'express';
import { getClientIp } from '@supercharge/request-ip';
import { ApiTags } from '@nestjs/swagger';
import { Response } from '@common/response/decorators/response.decorator';
import { ApiKeyProtected } from '@modules/api-key/decorators/api-key.decorator';
import {
    AuthJwtAccessProtected,
    AuthJwtPayload,
} from '@modules/auth/decorators/auth.jwt.decorator';
import { RoleProtected } from '@modules/role/decorators/role.decorator';
import { UserProtected } from '@modules/user/decorators/user.decorator';
import { EContract, EnumRoleType } from '@generated/prisma-client';
import { EContractService } from '@modules/e-contract/services/e-contract.service';
import { EContractSignRequestDto } from '@modules/e-contract/dtos/request/e-contract.sign.request.dto';
import { EContractRenewRequestDto } from '@modules/e-contract/dtos/request/e-contract.renew.request.dto';
import {
    EContractUserGetDoc,
    EContractUserListDoc,
    EContractUserRenewDoc,
    EContractUserSignDoc,
} from '@modules/e-contract/docs/e-contract.user.doc';
import { IResponseReturn } from '@common/response/interfaces/response.interface';

@ApiTags('modules.user.eContract')
@Controller({
    version: VERSION_NEUTRAL,
    path: ['/contracts', '/user/contracts', '/e-contract'],
})
export class EContractUserController {
    constructor(private readonly eContractService: EContractService) {}

    @EContractUserListDoc()
    @Response('eContract.list')
    @RoleProtected(
        EnumRoleType.user,
        EnumRoleType.admin,
        EnumRoleType.superAdmin,
        EnumRoleType.provider
    )
    @UserProtected()
    @AuthJwtAccessProtected()
    @ApiKeyProtected()
    @Get('/')
    async listMyContracts(
        @AuthJwtPayload('userId') userId: string
    ): Promise<IResponseReturn<EContract[]>> {
        return this.eContractService.listContracts(userId);
    }

    @EContractUserGetDoc()
    @Response('eContract.get')
    @RoleProtected(
        EnumRoleType.user,
        EnumRoleType.admin,
        EnumRoleType.superAdmin,
        EnumRoleType.provider
    )
    @UserProtected()
    @AuthJwtAccessProtected()
    @ApiKeyProtected()
    @Get('/:id')
    async getMyContract(
        @Param('id') id: string,
        @AuthJwtPayload('userId') userId: string
    ): Promise<IResponseReturn<EContract>> {
        return this.eContractService.getContract(id, userId);
    }

    @EContractUserSignDoc()
    @Response('eContract.sign')
    @RoleProtected(
        EnumRoleType.user,
        EnumRoleType.admin,
        EnumRoleType.superAdmin,
        EnumRoleType.provider
    )
    @UserProtected()
    @AuthJwtAccessProtected()
    @ApiKeyProtected()
    @Post('/:id/sign')
    async signMyContract(
        @Param('id') id: string,
        @AuthJwtPayload('userId') userId: string,
        @Body() body: EContractSignRequestDto,
        @Req() req: Request
    ): Promise<IResponseReturn<EContract>> {
        const clientIp = getClientIp(req) ?? undefined;
        return this.eContractService.signContract(id, userId, body, clientIp);
    }

    @EContractUserRenewDoc()
    @Response('eContract.renew')
    @RoleProtected(
        EnumRoleType.user,
        EnumRoleType.admin,
        EnumRoleType.superAdmin,
        EnumRoleType.provider
    )
    @UserProtected()
    @AuthJwtAccessProtected()
    @ApiKeyProtected()
    @Post('/:id/renew')
    async renewMyContract(
        @Param('id') id: string,
        @AuthJwtPayload('userId') userId: string,
        @Body() body: EContractRenewRequestDto,
        @Req() req: Request
    ): Promise<IResponseReturn<any>> {
        const clientIp = getClientIp(req) ?? undefined;
        return this.eContractService.renewContract(id, userId, body, clientIp);
    }

    @Response('eContract.getAmendments')
    @RoleProtected(
        EnumRoleType.user,
        EnumRoleType.admin,
        EnumRoleType.superAdmin,
        EnumRoleType.provider
    )
    @UserProtected()
    @AuthJwtAccessProtected()
    @ApiKeyProtected()
    @Get('/:id/amendments')
    async listMyContractAmendments(
        @Param('id') id: string,
        @AuthJwtPayload('userId') userId: string
    ): Promise<IResponseReturn<any>> {
        // Validate user owns contract
        await this.eContractService.getContract(id, userId);
        return this.eContractService.getAmendmentsByContractId(id);
    }

    @Response('eContract.signAmendment')
    @RoleProtected(
        EnumRoleType.user,
        EnumRoleType.admin,
        EnumRoleType.superAdmin,
        EnumRoleType.provider
    )
    @UserProtected()
    @AuthJwtAccessProtected()
    @ApiKeyProtected()
    @Post('/amendments/:amendmentId/sign')
    async signMyContractAmendment(
        @Param('amendmentId') amendmentId: string,
        @AuthJwtPayload('userId') userId: string,
        @Body() body: any,
        @Req() req: Request
    ): Promise<IResponseReturn<any>> {
        const clientIp = getClientIp(req) ?? undefined;
        return this.eContractService.signAmendment(amendmentId, userId, body, clientIp);
    }

    @Response('eContract.cancelAmendment')
    @RoleProtected(
        EnumRoleType.user,
        EnumRoleType.admin,
        EnumRoleType.superAdmin,
        EnumRoleType.provider
    )
    @UserProtected()
    @AuthJwtAccessProtected()
    @ApiKeyProtected()
    @Post('/amendments/:amendmentId/cancel')
    async cancelMyContractAmendment(
        @Param('amendmentId') amendmentId: string,
        @AuthJwtPayload('userId') userId: string
    ): Promise<IResponseReturn<any>> {
        return this.eContractService.cancelAmendment(amendmentId, userId);
    }
}
