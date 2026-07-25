import { Body, Controller, Delete, Get, Param, Post, Put, VERSION_NEUTRAL } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Response, ResponsePaging } from '@common/response/decorators/response.decorator';
import { ApiKeyProtected } from '@modules/api-key/decorators/api-key.decorator';
import { AuthJwtAccessProtected } from '@modules/auth/decorators/auth.jwt.decorator';
import { RoleProtected } from '@modules/role/decorators/role.decorator';
import { UserProtected } from '@modules/user/decorators/user.decorator';
import { EContract, EnumRoleType, Prisma } from '@generated/prisma-client';
import { EContractService } from '@modules/e-contract/services/e-contract.service';
import { EContractCreateRequestDto } from '@modules/e-contract/dtos/request/e-contract.create.request.dto';
import { EContractUpdateRequestDto } from '@modules/e-contract/dtos/request/e-contract.update.request.dto';
import {
    EContractAdminCheckExpiryDoc,
    EContractAdminCreateDoc,
    EContractAdminDeleteDoc,
    EContractAdminListDoc,
    EContractAdminUpdateDoc,
} from '@modules/e-contract/docs/e-contract.admin.doc';
import { IResponsePagingReturn, IResponseReturn } from '@common/response/interfaces/response.interface';
import { PaginationOffsetQuery, PaginationQueryFilterEqualString } from '@common/pagination/decorators/pagination.decorator';
import { IPaginationEqual, IPaginationQueryOffsetParams } from '@common/pagination/interfaces/pagination.interface';

@ApiTags('modules.admin.eContract')
@Controller({
    version: VERSION_NEUTRAL,
    path: '/contracts',
})
export class EContractAdminController {
    constructor(private readonly eContractService: EContractService) {}

    @EContractAdminListDoc()
    @ResponsePaging('eContract.list')
    @RoleProtected(EnumRoleType.admin, EnumRoleType.superAdmin)
    @UserProtected()
    @AuthJwtAccessProtected()
    @ApiKeyProtected()
    @Get('/')
    async listAllContracts(
        @PaginationOffsetQuery({
            availableSearch: ['title', 'code'],
            availableOrderBy: ['createdAt', 'title'],
            defaultPerPage: 10,
        })
        pagination: IPaginationQueryOffsetParams<
            Prisma.EContractSelect,
            Prisma.EContractWhereInput
        >,
        @PaginationQueryFilterEqualString('status')
        status?: Record<string, IPaginationEqual>
    ): Promise<IResponsePagingReturn<EContract>> {
        return this.eContractService.listContractsPaginated(pagination, status);
    }

    @EContractAdminCreateDoc()
    @Response('eContract.create')
    @RoleProtected(EnumRoleType.admin, EnumRoleType.superAdmin)
    @UserProtected()
    @AuthJwtAccessProtected()
    @ApiKeyProtected()
    @Post('/')
    async createContract(
        @Body() body: EContractCreateRequestDto
    ): Promise<IResponseReturn<EContract>> {
        return this.eContractService.createContract(body);
    }

    @EContractAdminUpdateDoc()
    @Response('eContract.update')
    @RoleProtected(EnumRoleType.admin, EnumRoleType.superAdmin)
    @UserProtected()
    @AuthJwtAccessProtected()
    @ApiKeyProtected()
    @Put('/:id')
    async updateContract(
        @Param('id') id: string,
        @Body() body: EContractUpdateRequestDto
    ): Promise<IResponseReturn<EContract>> {
        return this.eContractService.updateContract(id, body);
    }

    @EContractAdminDeleteDoc()
    @Response('eContract.delete')
    @RoleProtected(EnumRoleType.admin, EnumRoleType.superAdmin)
    @UserProtected()
    @AuthJwtAccessProtected()
    @ApiKeyProtected()
    @Delete('/:id')
    async deleteContract(
        @Param('id') id: string
    ): Promise<IResponseReturn<{ success: boolean }>> {
        return this.eContractService.deleteContract(id);
    }

    @EContractAdminCheckExpiryDoc()
    @Response('eContract.checkExpiry')
    @RoleProtected(EnumRoleType.admin, EnumRoleType.superAdmin)
    @UserProtected()
    @AuthJwtAccessProtected()
    @ApiKeyProtected()
    @Post('/check-expiry')
    async checkExpiry(): Promise<IResponseReturn<{ count: number; notified: string[] }>> {
        return this.eContractService.checkExpiringContracts();
    }
}
