import { useLocale } from 'next-intl';
import { useRouter } from 'next/navigation';
import { OrderDetailData } from '@/components/OrderDetailModal';
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

type NotificationPopoverProps = {
  isOpen: boolean;
  onClose: () => void;
  onSelectOrder: (order: OrderDetailData) => void;
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
    resetTwoFactorByAdmin: { title: 'Two-Factor Authentication Reset', body: 'Your two-factor authentication has been reset.' },
    temporaryPasswordByAdmin: { title: 'Temporary Password', body: 'A temporary password has been set for your account.' },
    resetPassword: { title: 'Password Reset', body: 'Your password has been reset successfully.' },
    userAcceptTermPolicy: { title: 'Term Policy Accepted', body: 'You have accepted the new term policy version.' },
  },
};

const formatNotificationString = (input: string, locale: string, type: 'title' | 'body'): string => {
  if (!input) return '';
  if (input.startsWith('notification.notify.')) {
    const parts = input.split('.'); // ['notification', 'notify', '<key>', 'title'|'body']
    const key = parts[2];
    const field = parts[3] as 'title' | 'body' || type;
    const langDict = NOTIFICATION_I18N[locale] || NOTIFICATION_I18N.vi;
    if (key && langDict && langDict[key]) {
      return langDict[key][field] || input;
    }
  }
  return input;
};

export const NotificationPopover = ({
  isOpen,
  onClose,
  onSelectOrder,
}: NotificationPopoverProps) => {
  const locale = useLocale();
  const router = useRouter();

  // Real API hooks
  const { data: apiNotifications } = useNotificationsList(isOpen);
  const markReadMutation = useMarkNotificationRead();
  const markAllReadMutation = useMarkAllNotificationsRead();

  if (!isOpen) return null;

  const rawItems = Array.isArray(apiNotifications) ? apiNotifications : [];
  const notifications: NotificationItem[] = rawItems.map((item: any) => ({
    id: item.id || item._id,
    type: item.type || 'system',
    title: formatNotificationString(item.title || item.titleKey || 'Thông báo hệ thống', locale, 'title'),
    message: formatNotificationString(item.message || item.body || item.content || item.description || '', locale, 'body'),
    read: !!item.read || !!item.isRead,
    timestamp: item.createdAt ? new Date(item.createdAt).toLocaleDateString(locale === 'en' ? 'en-US' : 'vi-VN') : 'Mới đây',
    details: item.details,
    orderPayload: item.orderPayload,
  }));

  const markAllAsRead = () => {
    markAllReadMutation.mutate();
  };

  const handleNotificationClick = (item: NotificationItem) => {
    if (!item.read) {
      markReadMutation.mutate(item.id);
    }
    onClose();

    if (item.type === 'order' && item.orderPayload) {
      onSelectOrder(item.orderPayload);
    } else if (item.type === 'tree') {
      router.push(`/${locale}/profile?tabs=assets`);
    } else if (item.type === 'contract') {
      router.push(`/${locale}/profile?tabs=contracts`);
    } else {
      router.push(`/${locale}/profile?tabs=info`);
    }
  };

  return (
    <div className="absolute right-0 mt-3 w-96 max-w-[calc(100vw-2rem)] bg-white rounded-2xl shadow-2xl border border-gray-200 z-50 overflow-hidden transition-[opacity,transform] duration-150 animate-in fade-in zoom-in-95">
      {/* Header Bar */}
      <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between bg-white">
        <h3 className="font-extrabold text-gray-900 text-base font-display-lg">
          Thông báo
        </h3>
        <button
          type="button"
          onClick={markAllAsRead}
          className="text-xs font-semibold text-gray-500 hover:text-emerald-700 transition-colors cursor-pointer"
        >
          Đọc tất cả
        </button>
      </div>

      {/* Notification List Body */}
      <div className="max-h-[460px] overflow-y-auto divide-y divide-gray-100">
        {notifications.length === 0 ? (
          <div className="p-8 text-center text-gray-400 text-xs font-medium">
            Không có thông báo nào.
          </div>
        ) : (
          notifications.map((item) => (
            <div
              key={item.id}
              role="button"
              tabIndex={0}
              onClick={() => handleNotificationClick(item)}
              onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && handleNotificationClick(item)}
              className={`p-4 transition-colors cursor-pointer space-y-2.5 ${
                item.read ? 'bg-white hover:bg-gray-50' : 'bg-[#F4F8F5] hover:bg-emerald-50/70'
              }`}
            >
              {/* Card Title & Icon */}
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-4 h-4 text-gray-600 flex-shrink-0"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                    />
                  </svg>
                  <h4 className="font-bold text-gray-900 text-xs leading-snug">
                    {item.title}
                  </h4>
                </div>

                {!item.read && (
                  <span className="w-2.5 h-2.5 bg-blue-600 rounded-full flex-shrink-0 mt-0.5"></span>
                )}
              </div>

              {/* Message Summary */}
              <p className="text-xs text-gray-600 leading-relaxed font-normal">
                {item.message}
              </p>

              {/* Key-Value Details Grid Box (For Order Notifications) */}
              {item.details && (
                <div className="bg-white/80 border border-gray-200/60 rounded-xl p-3 text-[11px] space-y-1.5 font-medium text-gray-700">
                  {item.details.orderCode && (
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400">Đơn hàng</span>
                      <span className="font-bold text-gray-900 font-mono">
                        {item.details.orderCode}
                      </span>
                    </div>
                  )}
                  {item.details.customerName && (
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400">Khách hàng</span>
                      <span className="font-semibold text-gray-800">
                        {item.details.customerName}
                      </span>
                    </div>
                  )}
                  {item.details.productSummary && (
                    <div className="flex justify-between items-center gap-2">
                      <span className="text-gray-400 flex-shrink-0">Sản phẩm</span>
                      <span className="font-semibold text-gray-800 truncate text-right">
                        {item.details.productSummary}
                      </span>
                    </div>
                  )}
                  {item.details.totalAmount && (
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400">Giá trị</span>
                      <span className="font-extrabold text-gray-900 underline">
                        {item.details.totalAmount}
                      </span>
                    </div>
                  )}
                </div>
              )}

              {/* Timestamp Footer */}
              <div className="flex items-center gap-1 text-[11px] text-gray-400 font-medium pt-0.5">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-3.5 h-3.5 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <span>{item.timestamp}</span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
