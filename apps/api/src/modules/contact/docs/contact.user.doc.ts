import {
    Doc,
    DocAuth,
    DocRequest,
    DocResponse,
} from '@common/doc/decorators/doc.decorator';
import { applyDecorators } from '@nestjs/common';
import { ContactUserCreateRequestDto } from '@modules/contact/dtos/request/contact.user-create.request.dto';
import { EnumDocRequestBodyType } from '@common/doc/enums/doc.enum';

export function ContactUserCreateDoc(): MethodDecorator {
    return applyDecorators(
        Doc({
            summary: 'Submit a new support/contact request form',
        }),
        DocRequest({
            bodyType: EnumDocRequestBodyType.json,
            dto: ContactUserCreateRequestDto,
        }),
        DocAuth({
            xApiKey: true,
        }),
        DocResponse('contact.create')
    );
}
