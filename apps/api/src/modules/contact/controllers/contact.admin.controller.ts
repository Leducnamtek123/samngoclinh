import {
    Controller,
    Get,
    Param,
    VERSION_NEUTRAL,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Response } from '@common/response/decorators/response.decorator';
import { ApiKeyProtected } from '@modules/api-key/decorators/api-key.decorator';
import { AuthJwtAccessProtected } from '@modules/auth/decorators/auth.jwt.decorator';
import { RoleProtected } from '@modules/role/decorators/role.decorator';
import { UserProtected } from '@modules/user/decorators/user.decorator';
import { EnumRoleType } from '@generated/prisma-client';
import { ContactService } from '@modules/contact/services/contact.service';
import {
    ContactAdminGetDetailDoc,
    ContactAdminListDoc,
} from '@modules/contact/docs/contact.admin.doc';
import { IResponseReturn } from '@common/response/interfaces/response.interface';
import { ContactRequest } from '@generated/prisma-client';

@ApiTags('modules.admin.contact')
@Controller({
    version: VERSION_NEUTRAL,
    path: '/contacts',
})
export class ContactAdminController {
    constructor(private readonly contactService: ContactService) {}

    @ContactAdminListDoc()
    @Response('contact.list')
    @RoleProtected(EnumRoleType.superAdmin, EnumRoleType.admin)
    @UserProtected()
    @AuthJwtAccessProtected()
    @ApiKeyProtected()
    @Get('/')
    async list(): Promise<IResponseReturn<{ items: ContactRequest[] }>> {
        return this.contactService.adminList();
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
