import { EnumNotificationProcess } from '@modules/notification/enums/notification.enum';

/**
 * Map mỗi email process -> subject + file template .hbs (render cục bộ khi gửi qua SMTP).
 */
export const NotificationEmailTemplate: Record<
    string,
    { subject: string; file: string }
> = {
    [EnumNotificationProcess.changePassword]: {
        subject: 'Change Password',
        file: 'notification.change-password.template.hbs',
    },
    [EnumNotificationProcess.welcome]: {
        subject: 'Welcome',
        file: 'notification.welcome.template.hbs',
    },
    [EnumNotificationProcess.welcomeSocial]: {
        subject: 'Welcome Social',
        file: 'notification.welcome-social.template.hbs',
    },
    [EnumNotificationProcess.welcomeByAdmin]: {
        subject: 'Welcome By Admin',
        file: 'notification.welcome-by-admin.template.hbs',
    },
    [EnumNotificationProcess.temporaryPasswordByAdmin]: {
        subject: 'Temporary Password By Admin',
        file: 'notification.temporary-password-by-admin.template.hbs',
    },
    [EnumNotificationProcess.resetPassword]: {
        subject: 'Reset Password',
        file: 'notification.reset-password.template.hbs',
    },
    [EnumNotificationProcess.forgotPassword]: {
        subject: 'Forgot Password',
        file: 'notification.forgot-password.template.hbs',
    },
    [EnumNotificationProcess.verificationEmail]: {
        subject: 'Email Verification',
        file: 'notification.verification-email.template.hbs',
    },
    [EnumNotificationProcess.verifiedEmail]: {
        subject: 'Email Verified',
        file: 'notification.verified-email.template.hbs',
    },
    [EnumNotificationProcess.verifiedMobileNumber]: {
        subject: 'MobileNumber Verified',
        file: 'notification.verified-mobile-number.template.hbs',
    },
    [EnumNotificationProcess.resetTwoFactorByAdmin]: {
        subject: 'Reset Two Factor By Admin',
        file: 'notification.reset-two-factor-by-admin.template.hbs',
    },
    [EnumNotificationProcess.newDeviceLogin]: {
        subject: 'Device Login',
        file: 'notification.new-device-login.template.hbs',
    },
    [EnumNotificationProcess.publishTermPolicy]: {
        subject: 'Publish Term Policy',
        file: 'notification.publish-term-policy.template.hbs',
    },
};
