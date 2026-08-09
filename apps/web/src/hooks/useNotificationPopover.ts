import { useLocale } from 'next-intl';
import { useRouter } from 'next/navigation';
import type { OrderDetailData } from '@/components/orders/OrderDetailModal';
import {
  useNotificationsList,
  useMarkNotificationRead,
  useMarkAllNotificationsRead,
} from '@/hooks/queries/useNotifications';

export type NotificationItem = {
  id: string;
  type: 'order' | 'tree' | 'contract' | 'system';
  title: string;
  message: string;
  read: boolean;
  timestamp: string;
  details?: {
    orderCode?: string;
    customerName?: string;
    productSummary?: string;
    totalAmount?: string;
  };
  orderPayload?: OrderDetailData;
};

const NOTIFICATION_I18N: Record<string, Record<string, { title: string; body: string }>> = {
  vi: {
    welcome: { title: 'Chào mừng', body: 'Chào mừng bạn. Rất vui khi có bạn đồng hành.' },
    welcomeByAdmin: { title: 'Chào mừng', body: 'Tài khoản của bạn đã được tạo thành công.' },
    welcomeSocial: { title: 'Chào mừng', body: 'Tài khoản của bạn đã sẵn sàng sử dụng.' },
    verificationEmail: { title: 'Xác thực email', body: 'Vui lòng xác thực địa chỉ email để kích hoạt tài khoản.' },
    verifiedEmail: { title: 'Đã xác thực email', body: 'Địa chỉ email của bạn đã được xác thực thành công.' },
    mobileNumberVerified: { title: 'Đã xác thực số điện thoại', body: 'Số điện thoại của bạn đã được xác thực thành công.' },
    changePassword: { title: 'Đã đổi mật khẩu', body: 'Mật khẩu của bạn đã được thay đổi thành công.' },
    forgotPassword: { title: 'Quên mật khẩu', body: 'Chúng tôi đã nhận được yêu cầu đặt lại mật khẩu của bạn.' },
    publishTermPolicy: { title: 'Cập nhật điều khoản chính sách', body: 'Điều khoản chính sách đã có bản cập nhật mới. Vui lòng xem lại.' },
    newDeviceLogin: { title: 'Đăng nhập thiết bị mới', body: 'Phát hiện một lượt đăng nhập mới vào tài khoản của bạn từ thiết bị mới.' },
    resetTwoFactorByAdmin: { title: 'Đặt lại xác thực hai lớp', body: 'Xác thực hai lớp của bạn đã được đặt lại.' },
    temporaryPasswordByAdmin: { title: 'Mật khẩu tạm thời', body: 'Một mật khẩu tạm thời đã được thiết lập cho tài khoản.' },
    resetPassword: { title: 'Đặt lại mật khẩu', body: 'Mật khẩu của bạn đã được đặt lại thành công.' },
    userAcceptTermPolicy: { title: 'Đã chấp nhận điều khoản chính sách', body: 'Bạn đã chấp nhận phiên bản mới của điều khoản chính sách.' },
  },
  en: {
    welcome: { title: 'Welcome', body: 'Welcome aboard. We are glad to have you.' },
    welcomeByAdmin: { title: 'Welcome', body: 'Your account has been created by admin.' },
    welcomeSocial: { title: 'Welcome', body: 'Your account is ready to use.' },
    verificationEmail: { title: 'Email Verification', body: 'Please verify your email address to activate your account.' },
    verifiedEmail: { title: 'Email Verified', body: 'Your email address has been verified successfully.' },
    mobileNumberVerified: { title: 'Mobile Number Verified', body: 'Your mobile number has been verified successfully.' },
    changePassword: { title: 'Password Changed', body: 'Your password has been changed successfully.' },
    forgotPassword: { title: 'Forgot Password', body: 'We received a request to reset your password.' },
    publishTermPolicy: { title: 'Term Policy Update', body: 'A new term policy version has been published.' },
    newDeviceLogin: { title: 'New Device Login', body: 'New device login detected on your account.' },
    resetTwoFactorByAdmin: { title: 'Reset Two-Factor Authentication', body: 'Your two-factor authentication has been reset.' },
    temporaryPasswordByAdmin: { title: 'Temporary Password', body: 'A temporary password has been set for your account.' },
    resetPassword: { title: 'Password Reset', body: 'Your password has been reset successfully.' },
    userAcceptTermPolicy: { title: 'Term Policy Accepted', body: 'You have accepted the new term policy version.' },
  },
};

const formatNotificationString = (input: string, locale: string, type: 'title' | 'body'): string => {
  if (!input) return '';
  if (input.startsWith('notification.notify.')) {
    const parts = input.split('.');
    const key = parts[2];
    const field = (parts[3] as 'title' | 'body') || type;
    const langDict = NOTIFICATION_I18N[locale] || NOTIFICATION_I18N.vi;
    if (key && langDict && langDict[key]) {
      return langDict[key][field] || input;
    }
  }
  return input;
};

export function useNotificationPopover(
  isOpen: boolean,
  onClose: () => void,
  onSelectOrder: (order: OrderDetailData) => void
) {
  const locale = useLocale();
  const router = useRouter();

  const { data: apiNotifications } = useNotificationsList(isOpen);
  const markReadMutation = useMarkNotificationRead();
  const markAllReadMutation = useMarkAllNotificationsRead();

  const rawItems = Array.isArray(apiNotifications) ? apiNotifications : [];
  const notifications: NotificationItem[] = rawItems.map((item: any) => ({
    id: item.id || item._id,
    type: item.type || 'system',
    title: formatNotificationString(item.title || item.titleKey || 'System Notification', locale, 'title'),
    message: formatNotificationString(item.message || item.bodyKey || item.body || '', locale, 'body'),
    read: !!(item.read || item.isRead),
    timestamp: item.timestamp || item.createdAt || new Date().toISOString(),
    details: item.details,
    orderPayload: item.orderPayload,
  }));

  const unreadCount = notifications.filter((n) => !n.read).length;

  const handleMarkAllRead = () => {
    markAllReadMutation.mutate();
  };

  const handleNotificationClick = (notif: NotificationItem) => {
    if (!notif.read) {
      markReadMutation.mutate(notif.id);
    }

    if (notif.orderPayload) {
      onSelectOrder(notif.orderPayload);
      onClose();
      return;
    }

    if (notif.type === 'contract') {
      router.push('/profile?tabs=contracts');
    } else if (notif.type === 'tree') {
      router.push('/profile?tabs=trees');
    } else if (notif.type === 'order') {
      router.push('/profile?tabs=orders');
    }

    onClose();
  };

  return {
    notifications,
    unreadCount,
    handleMarkAllRead,
    handleNotificationClick,
  };
}
