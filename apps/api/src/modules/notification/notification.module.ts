import { DeviceModule } from '@modules/device/device.module';
import { NotificationRepository } from '@modules/notification/repositories/notification.repository';
import { NotificationEmailProcessorService } from '@modules/notification/services/notification.email.processor.service';
import { NotificationProcessorService } from '@modules/notification/services/notification.processor.service';
import { NotificationPushProcessorService } from '@modules/notification/services/notification.push.processor.service';
import { NotificationService } from '@modules/notification/services/notification.service';
import { NotificationSmtpService } from '@modules/notification/services/notification.smtp.service';
import { NotificationEmailUtil } from '@modules/notification/utils/notification.email.util';
import { NotificationPushUtil } from '@modules/notification/utils/notification.push.util';
import { NotificationUtil } from '@modules/notification/utils/notification.util';
import { UserModule } from '@modules/user/user.module';
import { Global, Module } from '@nestjs/common';

@Global()
@Module({
    imports: [UserModule, DeviceModule],
    exports: [
        NotificationService,
        NotificationProcessorService,
        NotificationEmailProcessorService,
        NotificationPushProcessorService,
        NotificationRepository,
        NotificationUtil,
        NotificationEmailUtil,
        NotificationPushUtil,
    ],
    providers: [
        NotificationService,
        NotificationSmtpService,
        NotificationProcessorService,
        NotificationEmailProcessorService,
        NotificationPushProcessorService,
        NotificationRepository,
        NotificationUtil,
        NotificationEmailUtil,
        NotificationPushUtil,
    ],
    controllers: [],
})
export class NotificationModule {}
