export type OrderStatusInfo = {
  label: string;
  badgeClass: string;
  solidClass: string;
  canPay: boolean;
};

export const getOrderStatusInfo = (statusRaw?: string): OrderStatusInfo => {
  const status = (statusRaw || '').toLowerCase();
  switch (status) {
    case 'pending':
      return {
        label: 'Chờ thanh toán',
        badgeClass: 'bg-amber-100 text-amber-800 border border-amber-200',
        solidClass: 'bg-amber-500 text-white',
        canPay: true,
      };
    case 'pending_verification':
    case 'verifying':
    case 'checking':
      return {
        label: 'Chờ xác thực thanh toán',
        badgeClass: 'bg-amber-100 text-amber-900 border border-amber-300',
        solidClass: 'bg-amber-600 text-white',
        canPay: false,
      };
    case 'paid':
      return {
        label: 'Đã thanh toán',
        badgeClass: 'bg-emerald-100 text-emerald-800 border border-emerald-200',
        solidClass: 'bg-emerald-600 text-white',
        canPay: false,
      };
    case 'processing':
    case 'confirmed':
      return {
        label: 'Đã xác nhận / Đang chuẩn bị',
        badgeClass: 'bg-blue-100 text-blue-800 border border-blue-200',
        solidClass: 'bg-blue-600 text-white',
        canPay: false,
      };
    case 'shipping':
    case 'delivering':
      return {
        label: 'Đang giao hàng',
        badgeClass: 'bg-purple-100 text-purple-800 border border-purple-200',
        solidClass: 'bg-purple-600 text-white',
        canPay: false,
      };
    case 'completed':
    case 'delivered':
    case 'success':
      return {
        label: 'Đã giao / Hoàn thành',
        badgeClass: 'bg-teal-100 text-teal-800 border border-teal-200',
        solidClass: 'bg-teal-600 text-white',
        canPay: false,
      };
    case 'cancelled':
      return {
        label: 'Đã hủy đơn',
        badgeClass: 'bg-gray-100 text-gray-600 border border-gray-200',
        solidClass: 'bg-gray-400 text-white',
        canPay: false,
      };
    default:
      return {
        label: statusRaw || 'Không xác định',
        badgeClass: 'bg-gray-100 text-gray-700 border border-gray-200',
        solidClass: 'bg-gray-500 text-white',
        canPay: false,
      };
  }
};
