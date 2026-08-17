import { EnumNotificationProcess } from '@modules/notification/enums/notification.enum';

/**
 * Map mỗi email process -> subject + file template .hbs (render cục bộ khi gửi qua SMTP).
 */
export const NotificationEmailTemplate: Record<
    string,
    { subject: string; file: string }
> = {
    [EnumNotificationProcess.changePassword]: {
        subject: '[Sâm Ngọc Linh] Đổi mật khẩu thành công',
        file: 'notification.change-password.template.hbs',
    },
    [EnumNotificationProcess.welcome]: {
        subject: '[Sâm Ngọc Linh] Chào mừng bạn',
        file: 'notification.welcome.template.hbs',
    },
    [EnumNotificationProcess.welcomeSocial]: {
        subject: '[Sâm Ngọc Linh] Chào mừng bạn',
        file: 'notification.welcome-social.template.hbs',
    },
    [EnumNotificationProcess.welcomeByAdmin]: {
        subject: '[Sâm Ngọc Linh] Tài khoản của bạn đã được tạo',
        file: 'notification.welcome-by-admin.template.hbs',
    },
    [EnumNotificationProcess.temporaryPasswordByAdmin]: {
        subject: '[Sâm Ngọc Linh] Mật khẩu tạm thời',
        file: 'notification.temporary-password-by-admin.template.hbs',
    },
    [EnumNotificationProcess.verificationEmail]: {
        subject: '[Sâm Ngọc Linh] Xác thực Email',
        file: 'notification.verification-email.template.hbs',
    },
    [EnumNotificationProcess.verifiedEmail]: {
        subject: '[Sâm Ngọc Linh] Xác thực Email thành công',
        file: 'notification.verified-email.template.hbs',
    },
    [EnumNotificationProcess.resetTwoFactorByAdmin]: {
        subject: '[Sâm Ngọc Linh] Đặt lại xác thực hai lớp',
        file: 'notification.reset-two-factor-by-admin.template.hbs',
    },
    [EnumNotificationProcess.newDeviceLogin]: {
        subject: '[Sâm Ngọc Linh] Đăng nhập từ thiết bị mới',
        file: 'notification.new-device-login.template.hbs',
    },
    [EnumNotificationProcess.publishTermPolicy]: {
        subject: '[Sâm Ngọc Linh] Cập nhật điều khoản & chính sách',
        file: 'notification.publish-term-policy.template.hbs',
    },
    [EnumNotificationProcess.orderSuccess]: {
        subject: '[Sâm Ngọc Linh] Xác nhận đơn hàng & thanh toán thành công',
        file: 'notification.order-success.template.hbs',
    },
    [EnumNotificationProcess.contractCreated]: {
        subject: '[Sâm Ngọc Linh] Khởi tạo hợp đồng điện tử',
        file: 'notification.contract-created.template.hbs',
    },
    [EnumNotificationProcess.contractSigned]: {
        subject: '[Sâm Ngọc Linh] Ký hợp đồng điện tử thành công',
        file: 'notification.contract-signed.template.hbs',
    },
};
