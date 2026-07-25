import {
    Controller,
    Get,
    Param,
    VERSION_NEUTRAL,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Response, ResponsePaging } from '@common/response/decorators/response.decorator';
import { ApiKeyProtected } from '@modules/api-key/decorators/api-key.decorator';
import { AuthJwtAccessProtected } from '@modules/auth/decorators/auth.jwt.decorator';
import { RoleProtected } from '@modules/role/decorators/role.decorator';
import { UserProtected } from '@modules/user/decorators/user.decorator';
import { ContactRequest, EnumRoleType, Prisma } from '@generated/prisma-client';
import { ContactService } from '@modules/contact/services/contact.service';
import {
    ContactAdminGetDetailDoc,
    ContactAdminListDoc,
} from '@modules/contact/docs/contact.admin.doc';
import { IResponsePagingReturn, IResponseReturn } from '@common/response/interfaces/response.interface';
import { PaginationOffsetQuery, PaginationQueryFilterEqualString } from '@common/pagination/decorators/pagination.decorator';
import { IPaginationEqual, IPaginationQueryOffsetParams } from '@common/pagination/interfaces/pagination.interface';

@ApiTags('modules.admin.contact')
@Controller({
    version: VERSION_NEUTRAL,
    path: '/contacts',
})
export class ContactAdminController {
    constructor(private readonly contactService: ContactService) {}

    @ContactAdminListDoc()
    @ResponsePaging('contact.list')
    @RoleProtected(EnumRoleType.superAdmin, EnumRoleType.admin)
    @UserProtected()
    @AuthJwtAccessProtected()
    @ApiKeyProtected()
    @Get('/')
    async list(
        @PaginationOffsetQuery({
            availableSearch: ['fullName', 'email', 'subject'],
            availableOrderBy: ['createdAt', 'fullName'],
            defaultPerPage: 10,
        })
        pagination: IPaginationQueryOffsetParams<
            Prisma.ContactRequestSelect,
            Prisma.ContactRequestWhereInput
        >,
        @PaginationQueryFilterEqualString('isRead')
        isRead?: Record<string, IPaginationEqual>
    ): Promise<IResponsePagingReturn<ContactRequest>> {
        return this.contactService.adminListPaginated(pagination, isRead);
    }

    @ContactAdminGetDetailDoc()
    @Response('contact.detail')
    @RoleProtected(EnumRoleType.superAdmin, EnumRoleType.admin)
    @UserProtected()
    @AuthJwtAccessProtected()
    @ApiKeyProtected()
    @Get('/:id')
    async getDetail(
        @Param('id') id: string
    ): Promise<IResponseReturn<ContactRequest>> {
        return this.contactService.adminGetDetail(id);
    }
}
