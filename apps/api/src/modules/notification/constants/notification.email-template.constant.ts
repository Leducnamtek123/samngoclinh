import { EnumNotificationProcess } from '@modules/notification/enums/notification.enum';

/**
 * Map mỗi email process -> subject + file template .hbs (render cục bộ khi gửi qua SMTP).
 */
export const NotificationEmailTemplate: Record<
    string,
    { subject: string; file: string }
> = {
    [EnumNotificationProcess.changePassword]: {
        subject: '[Rượu Sâm Ngọc Linh] Cảnh Báo An Ninh: Mật Khẩu Đã Thay Đổi',
        file: 'notification.change-password.template.hbs',
    },
    [EnumNotificationProcess.welcome]: {
        subject: '[Rượu Sâm Ngọc Linh] Chào Mừng Quý Khách Gia Nhập Cộng Đồng',
        file: 'notification.welcome.template.hbs',
    },
    [EnumNotificationProcess.welcomeSocial]: {
        subject: '[Rượu Sâm Ngọc Linh] Chào Mừng Quý Khách Đến Với Sâm Ngọc Linh',
        file: 'notification.welcome-social.template.hbs',
    },
    [EnumNotificationProcess.welcomeByAdmin]: {
        subject: '[Rượu Sâm Ngọc Linh] Thông Tin Tài Khoản Thành Viên Được Cấp Mới',
        file: 'notification.welcome-by-admin.template.hbs',
    },
    [EnumNotificationProcess.temporaryPasswordByAdmin]: {
        subject: '[Rượu Sâm Ngọc Linh] Cấp Mật Khẩu Tạm Thời Cho Tài Khoản',
        file: 'notification.temporary-password-by-admin.template.hbs',
    },
    [EnumNotificationProcess.resetPassword]: {
        subject: '[Rượu Sâm Ngọc Linh] Mật Khẩu Đã Được Khôi Phục Thành Công',
        file: 'notification.reset-password.template.hbs',
    },
    [EnumNotificationProcess.forgotPassword]: {
        subject: '[Rượu Sâm Ngọc Linh] Mã OTP Khôi Phục Mật Khẩu Tài Khoản',
        file: 'notification.forgot-password.template.hbs',
    },
    [EnumNotificationProcess.verificationEmail]: {
        subject: '[Rượu Sâm Ngọc Linh] Mã OTP Xác Thực Địa Chỉ Email',
        file: 'notification.verification-email.template.hbs',
    },
    [EnumNotificationProcess.verifiedEmail]: {
        subject: '[Rượu Sâm Ngọc Linh] Xác Thực Địa Chỉ Email Thành Công',
        file: 'notification.verified-email.template.hbs',
    },
    [EnumNotificationProcess.verifiedMobileNumber]: {
        subject: '[Rượu Sâm Ngọc Linh] Xác Thực Số Điện Thoại Thành Công',
        file: 'notification.verified-mobile-number.template.hbs',
    },
    [EnumNotificationProcess.resetTwoFactorByAdmin]: {
        subject: '[Rượu Sâm Ngọc Linh] Đặt Lại Xác Thực Hai Lớp (2FA)',
        file: 'notification.reset-two-factor-by-admin.template.hbs',
    },
    [EnumNotificationProcess.newDeviceLogin]: {
        subject: '[Rượu Sâm Ngọc Linh] Cảnh Báo Đăng Nhập Trên Thiết Bị Mới',
        file: 'notification.new-device-login.template.hbs',
    },
    [EnumNotificationProcess.publishTermPolicy]: {
        subject: '[Rượu Sâm Ngọc Linh] Cập Nhật Chính Sách & Điều Khoản Sử Dụng Mới',
        file: 'notification.publish-term-policy.template.hbs',
    },
    [EnumNotificationProcess.orderSuccess]: {
        subject: '[Rượu Sâm Ngọc Linh] Xác Nhận Đơn Hàng & Hóa Đơn Thanh Toán Thành Công',
        file: 'notification.order-success.template.hbs',
    },
    [EnumNotificationProcess.contractCreated]: {
        subject: '[Rượu Sâm Ngọc Linh] Thông Báo Khởi Tạo Hợp Đồng Sở Hữu Cây Sâm',
        file: 'notification.contract-created.template.hbs',
    },
    [EnumNotificationProcess.contractSigned]: {
        subject: '[Rượu Sâm Ngọc Linh] Xác Nhận Ký Kết Hợp Đồng Điện Tử Thành Công',
        file: 'notification.contract-signed.template.hbs',
    },
};
