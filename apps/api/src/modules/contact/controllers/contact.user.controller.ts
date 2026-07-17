import {
    Body,
    Controller,
    Post,
    VERSION_NEUTRAL,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Response } from '@common/response/decorators/response.decorator';
import { ApiKeyProtected } from '@modules/api-key/decorators/api-key.decorator';
import { ContactService } from '@modules/contact/services/contact.service';
import { ContactUserCreateDoc } from '@modules/contact/docs/contact.user.doc';
import { IResponseReturn } from '@common/response/interfaces/response.interface';
import { ContactUserCreateRequestDto } from '@modules/contact/dtos/request/contact.user-create.request.dto';
import { ContactRequest } from '@generated/prisma-client';

@ApiTags('modules.user.contact')
@Controller({
    version: VERSION_NEUTRAL,
    path: '/contact',
})
export class ContactUserController {
    constructor(private readonly contactService: ContactService) {}

    @ContactUserCreateDoc()
    @Response('contact.create')
    @ApiKeyProtected()
    @Post('/')
    async create(
        @Body() body: ContactUserCreateRequestDto
    ): Promise<IResponseReturn<ContactRequest>> {
        return this.contactService.create(body);
    }
}
