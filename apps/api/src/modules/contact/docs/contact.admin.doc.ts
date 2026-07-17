import {
    Doc,
    DocAuth,
    DocGuard,
    DocRequest,
    DocResponse,
} from '@common/doc/decorators/doc.decorator';
import { applyDecorators } from '@nestjs/common';

export function ContactAdminListDoc(): MethodDecorator {
    return applyDecorators(
        Doc({
            summary: 'List all support/contact requests (Admin)',
        }),
        DocAuth({
            xApiKey: true,
            jwtAccessToken: true,
        }),
        DocGuard({ role: true }),
        DocResponse('contact.list')
    );
}

export function ContactAdminGetDetailDoc(): MethodDecorator {
    return applyDecorators(
        Doc({
            summary: 'Get details of a specific contact request and mark it as read (Admin)',
        }),
        DocRequest({
            params: [
                {
                    name: 'id',
                    description: 'Contact Request ID',
                    required: true,
                    type: 'string',
                },
            ],
        }),
        DocAuth({
            xApiKey: true,
            jwtAccessToken: true,
        }),
        DocGuard({ role: true }),
        DocResponse('contact.detail')
    );
}
