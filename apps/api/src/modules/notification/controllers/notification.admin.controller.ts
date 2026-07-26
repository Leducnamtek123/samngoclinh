import {
    Body,
    Controller,
    Post,
    VERSION_NEUTRAL,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Response } from '@common/response/decorators/response.decorator';
import { ApiKeyProtected } from '@modules/api-key/decorators/api-key.decorator';
import { AuthJwtAccessProtected, AuthJwtPayload } from '@modules/auth/decorators/auth.jwt.decorator';
import { RoleProtected } from '@modules/role/decorators/role.decorator';
import { UserProtected } from '@modules/user/decorators/user.decorator';
import { EnumRoleType } from '@generated/prisma-client';
import { NotificationService } from '@modules/notification/services/notification.service';
import { NotificationAdminSendDoc } from '@modules/notification/docs/notification.admin.doc';
import { IResponseReturn } from '@common/response/interfaces/response.interface';
import { INotificationAdminSendResult } from '@modules/notification/interfaces/notification.interface';
import { NotificationAdminSendRequestDto } from '@modules/notification/dtos/request/notification.admin-send.request.dto';

@ApiTags('modules.admin.notification')
@Controller({
    version: VERSION_NEUTRAL,
    path: '/notifications',
})
export class NotificationAdminController {
    constructor(private readonly notificationService: NotificationService) {}

    @NotificationAdminSendDoc()
    @Response('notification.list')
    @RoleProtected(EnumRoleType.superAdmin, EnumRoleType.admin)
    @UserProtected()
    @AuthJwtAccessProtected()
    @ApiKeyProtected()
    @Post('/send')
    async sendNotification(
        @Body() body: NotificationAdminSendRequestDto,
        @AuthJwtPayload('userId') creatorId: string
    ): Promise<IResponseReturn<INotificationAdminSendResult>> {
        return this.notificationService.adminSendNotification({
            userId: body.userId,
            title: body.title,
            body: body.body,
            priority: body.priority,
            createdBy: creatorId,
        });
    }
}
