import {
    Doc,
    DocAuth,
    DocGuard,
    DocRequest,
    DocResponse,
} from '@common/doc/decorators/doc.decorator';
import { applyDecorators } from '@nestjs/common';
import { NotificationAdminSendRequestDto } from '@modules/notification/dtos/request/notification.admin-send.request.dto';
import { EnumDocRequestBodyType } from '@common/doc/enums/doc.enum';

export function NotificationAdminSendDoc(): MethodDecorator {
    return applyDecorators(
        Doc({
            summary: 'Send custom push notification to user(s) or broadcast to all (Admin)',
        }),
        DocRequest({
            bodyType: EnumDocRequestBodyType.json,
            dto: NotificationAdminSendRequestDto,
        }),
        DocAuth({
            xApiKey: true,
            jwtAccessToken: true,
        }),
        DocGuard({ role: true }),
        DocResponse('notification.list')
    );
}
