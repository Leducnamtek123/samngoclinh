import { Link } from '@/lib/I18nNavigation';
import { Sparkles } from 'lucide-react';

type OrderInfo = {
  orderId: string;
  orderCode: string;
  amount: number;
  qrUrl: string;
  accountNo: string;
  accountName: string;
  bankName: string;
};

type CartStepSuccessProps = {
  orderInfo: OrderInfo | null;
};

export const CartStepSuccess = ({ orderInfo }: CartStepSuccessProps) => {
  return (
    <div className="bg-white border border-gray-200 rounded-3xl p-10 sm:p-14 text-center max-w-2xl mx-auto space-y-6 shadow-sm">
      <div className="w-20 h-20 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto shadow-inner animate-bounce">
        <Sparkles className="w-10 h-10" />
      </div>
      
      <div className="space-y-2">
        <h2 className="text-2xl sm:text-3xl font-black text-gray-900">Đặt Hàng Thành Công!</h2>
        <p className="text-xs text-gray-500 font-medium leading-relaxed">
          Đơn hàng của bạn đã được tiếp nhận và đang được bộ phận vận chuyển chuẩn bị.
        </p>
      </div>

      {orderInfo && (
        <div className="bg-gray-50 border border-gray-200/80 rounded-2xl p-4 max-w-sm mx-auto space-y-2 text-xs">
          <div className="flex justify-between">
            <span className="text-gray-500 font-semibold">Mã đơn hàng:</span>
            <span className="font-bold text-gray-900">#{orderInfo.orderCode}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500 font-semibold">Thời gian dự kiến:</span>
            <span className="font-bold text-emerald-700">2 - 3 ngày làm việc</span>
          </div>
        </div>
      )}

      <div className="pt-4 flex flex-col sm:flex-row gap-4 justify-center">
        <Link
          href="/profile?tabs=orders"
          className="bg-emerald-700 hover:bg-emerald-800 text-white font-bold px-8 py-3.5 rounded-xl text-xs transition-colors shadow-md shadow-emerald-700/20"
        >
          Quản lý đơn hàng của tôi
        </Link>
        <Link
          href="/ginseng"
          className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold px-8 py-3.5 rounded-xl text-xs transition-colors"
        >
          Tiếp tục mua sắm
        </Link>
      </div>
    </div>
  );
};
