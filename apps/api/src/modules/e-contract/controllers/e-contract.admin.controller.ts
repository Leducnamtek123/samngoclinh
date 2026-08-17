import { Body, Controller, Delete, Get, Logger, Param, Post, Put, VERSION_NEUTRAL } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Response, ResponsePaging } from '@common/response/decorators/response.decorator';
import { ApiKeyProtected } from '@modules/api-key/decorators/api-key.decorator';
import { AuthJwtAccessProtected } from '@modules/auth/decorators/auth.jwt.decorator';
import { RoleProtected } from '@modules/role/decorators/role.decorator';
import { UserProtected } from '@modules/user/decorators/user.decorator';
import { EContract, EnumRoleType, Prisma } from '@generated/prisma-client';
import { EContractService } from '@modules/e-contract/services/e-contract.service';
import { EContractTemplateService, IContractTemplateItem } from '@modules/e-contract/services/e-contract.template.service';
import { EContractCreateRequestDto } from '@modules/e-contract/dtos/request/e-contract.create.request.dto';
import { EContractUpdateRequestDto } from '@modules/e-contract/dtos/request/e-contract.update.request.dto';
import { ContractAmendmentCreateRequestDto } from '@modules/e-contract/dtos/request/contract-amendment.create.request.dto';
import {
    EContractAdminCheckExpiryDoc,
    EContractAdminCreateDoc,
    EContractAdminDeleteDoc,
    EContractAdminGetDoc,
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
    private readonly logger = new Logger(EContractAdminController.name);

    constructor(
        private readonly eContractService: EContractService,
        private readonly eContractTemplateService: EContractTemplateService
    ) {}

    // =========================================================================
    // TEMPLATE MANAGEMENT ENDPOINTS
    // =========================================================================

    @ApiOperation({ summary: 'Lấy danh sách các mẫu văn bản hợp đồng và điều khoản' })
    @Response('eContract.listTemplates')
    @RoleProtected(EnumRoleType.admin, EnumRoleType.superAdmin)
    @UserProtected()
    @AuthJwtAccessProtected()
    @ApiKeyProtected()
    @Get('/templates')
    async listTemplates(): Promise<IResponseReturn<IContractTemplateItem[]>> {
        const templates = await this.eContractTemplateService.listTemplates();
        return {
            data: templates,
        };
    }

    @ApiOperation({ summary: 'Lấy chi tiết mẫu văn bản theo slug' })
    @Response('eContract.getTemplate')
    @RoleProtected(EnumRoleType.admin, EnumRoleType.superAdmin)
    @UserProtected()
    @AuthJwtAccessProtected()
    @ApiKeyProtected()
    @Get('/templates/:slug')
    async getTemplate(
        @Param('slug') slug: string
    ): Promise<IResponseReturn<IContractTemplateItem>> {
        const template = await this.eContractTemplateService.getTemplate(slug);
        return {
            data: template,
        };
    }

    @ApiOperation({ summary: 'Cập nhật nội dung mẫu văn bản HTML' })
    @Response('eContract.updateTemplate')
    @RoleProtected(EnumRoleType.admin, EnumRoleType.superAdmin)
    @UserProtected()
    @AuthJwtAccessProtected()
    @ApiKeyProtected()
    @Put('/templates/:slug')
    async updateTemplate(
        @Param('slug') slug: string,
        @Body() body: { title?: string; version?: string; description?: string; contentHtml: string }
    ): Promise<IResponseReturn<IContractTemplateItem>> {
        const updated = await this.eContractTemplateService.updateTemplate(slug, body);
        return {
            data: updated,
        };
    }

    @ApiOperation({ summary: 'Import toàn bộ mã HTML mới cho mẫu văn bản' })
    @Response('eContract.importTemplateHtml')
    @RoleProtected(EnumRoleType.admin, EnumRoleType.superAdmin)
    @UserProtected()
    @AuthJwtAccessProtected()
    @ApiKeyProtected()
    @Post('/templates/:slug/import')
    async importTemplateHtml(
        @Param('slug') slug: string,
        @Body() body: { rawHtml: string }
    ): Promise<IResponseReturn<IContractTemplateItem>> {
        const imported = await this.eContractTemplateService.importHtml(slug, body.rawHtml || '');
        return {
            data: imported,
        };
    }

    // =========================================================================
    // CONTRACT INSTANCE MANAGEMENT
    // =========================================================================

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

    @EContractAdminGetDoc()
    @Response('eContract.get')
    @RoleProtected(EnumRoleType.superAdmin, EnumRoleType.admin)
    @UserProtected()
    @AuthJwtAccessProtected()
    @ApiKeyProtected()
    @Get(['/:id', '/detail/:id', '/get/:id'])
    async getContractDetail(
        @Param('id') id: string
    ): Promise<IResponseReturn<EContract>> {
        this.logger.log(`[getContractDetail] requested id: "${id}"`);
        return this.eContractService.getContract(id);
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

    @ApiOperation({ summary: 'Phát hành hợp đồng bản nháp và gửi thông báo cho khách hàng ký' })
    @Response('eContract.issue')
    @RoleProtected(EnumRoleType.admin, EnumRoleType.superAdmin)
    @UserProtected()
    @AuthJwtAccessProtected()
    @ApiKeyProtected()
    @Post('/:id/issue')
    async issueContract(
        @Param('id') id: string
    ): Promise<IResponseReturn<EContract>> {
        return this.eContractService.issueContract(id);
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

    @Response('eContract.getAmendments')
    @RoleProtected(EnumRoleType.admin, EnumRoleType.superAdmin)
    @UserProtected()
    @AuthJwtAccessProtected()
    @ApiKeyProtected()
    @Get('/:id/amendments')
    async listContractAmendments(
        @Param('id') id: string
    ): Promise<IResponseReturn<any>> {
        return this.eContractService.getAmendmentsByContractId(id);
    }

    @Response('eContract.createAmendment')
    @RoleProtected(EnumRoleType.admin, EnumRoleType.superAdmin)
    @UserProtected()
    @AuthJwtAccessProtected()
    @ApiKeyProtected()
    @Post('/:id/amendments')
    async createContractAmendment(
        @Param('id') id: string,
        @Body() body: ContractAmendmentCreateRequestDto
    ): Promise<IResponseReturn<any>> {
        return this.eContractService.createAmendment(id, body);
    }
}
