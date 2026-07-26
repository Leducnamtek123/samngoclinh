import Image from 'next/image';
import { QrCode, RefreshCw, Check, Copy, CheckCircle2 } from 'lucide-react';

type OrderInfo = {
  orderId: string;
  orderCode: string;
  amount: number;
  qrUrl: string;
  accountNo: string;
  accountName: string;
  bankName: string;
};

type CartStepPaymentProps = {
  orderInfo: OrderInfo;
  copiedField: string | null;
  onCopy: (text: string, fieldName: string) => void;
  onCompletePayment: () => void;
};

export const CartStepPayment = ({
  orderInfo,
  copiedField,
  onCopy,
  onCompletePayment,
}: CartStepPaymentProps) => {
  return (
    <div className="bg-white border border-gray-200 rounded-3xl p-6 sm:p-10 shadow-sm max-w-2xl mx-auto space-y-8">
      <div className="text-center space-y-2 border-b border-gray-100 pb-6">
        <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-700 flex items-center justify-center mx-auto">
          <QrCode className="w-6 h-6" />
        </div>
        <h3 className="text-xl font-extrabold text-gray-900">Quét Mã VietQR Chuyển Khoản Tuỳ Chọn</h3>
        <p className="text-xs text-gray-500 font-medium">Đơn hàng <span className="font-bold text-emerald-800">#{orderInfo.orderCode}</span> đã được khởi tạo thành công.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 items-center">
        {/* VietQR Code Display */}
        <div className="bg-gray-50 border border-gray-200 rounded-2xl p-4 flex flex-col items-center space-y-3 shadow-xs">
          <div className="bg-white p-3 rounded-xl shadow-xs border border-gray-100">
            <Image src={orderInfo.qrUrl} alt="VietQR Payment Code" width={224} height={224} unoptimized className="w-56 h-56 object-contain rounded-lg" />
          </div>
          <div className="flex items-center gap-1.5 text-[11px] text-gray-500 font-semibold">
            <RefreshCw className="w-3.5 h-3.5 animate-spin text-emerald-600" />
            <span>Đang tự động kiểm tra giao dịch...</span>
          </div>
        </div>

        {/* Transfer Details List */}
        <div className="space-y-4 text-xs">
          <div className="bg-gray-50 rounded-xl p-3.5 space-y-1">
            <span className="text-[10px] text-gray-400 font-bold uppercase">Ngân hàng</span>
            <p className="font-bold text-gray-900">{orderInfo.bankName}</p>
          </div>

          <div className="bg-gray-50 rounded-xl p-3.5 flex justify-between items-center">
            <div>
              <span className="text-[10px] text-gray-400 font-bold uppercase block">Số tài khoản</span>
              <span className="font-extrabold text-gray-900 text-sm">{orderInfo.accountNo}</span>
            </div>
            <button
              type="button"
              onClick={() => onCopy(orderInfo.accountNo, 'stk')}
              className="p-2 text-emerald-700 hover:bg-emerald-100/50 rounded-lg transition-colors flex items-center gap-1 font-bold cursor-pointer"
            >
              {copiedField === 'stk' ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
              <span>{copiedField === 'stk' ? 'Đã chép' : 'Sao chép'}</span>
            </button>
          </div>

          <div className="bg-gray-50 rounded-xl p-3.5 flex justify-between items-center">
            <div>
              <span className="text-[10px] text-gray-400 font-bold uppercase block">Nội dung chuyển khoản</span>
              <span className="font-extrabold text-emerald-800 text-sm">{orderInfo.orderCode}</span>
            </div>
            <button
              type="button"
              onClick={() => onCopy(orderInfo.orderCode, 'code')}
              className="p-2 text-emerald-700 hover:bg-emerald-100/50 rounded-lg transition-colors flex items-center gap-1 font-bold cursor-pointer"
            >
              {copiedField === 'code' ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
              <span>{copiedField === 'code' ? 'Đã chép' : 'Sao chép'}</span>
            </button>
          </div>

          <div className="bg-emerald-50 border border-emerald-200/60 rounded-xl p-3.5 flex justify-between items-center">
            <div>
              <span className="text-[10px] text-emerald-700 font-bold uppercase block">Số tiền cần chuyển</span>
              <span className="font-black text-emerald-900 text-base">{orderInfo.amount.toLocaleString('vi-VN')} đ</span>
            </div>
            <button
              type="button"
              onClick={() => onCopy(orderInfo.amount.toString(), 'amount')}
              className="p-2 text-emerald-700 hover:bg-emerald-100 rounded-lg transition-colors flex items-center gap-1 font-bold cursor-pointer"
            >
              {copiedField === 'amount' ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
              <span>{copiedField === 'amount' ? 'Đã chép' : 'Sao chép'}</span>
            </button>
          </div>
        </div>
      </div>

      <div className="pt-4 border-t border-gray-100 flex flex-col sm:flex-row gap-3">
        <button
          type="button"
          onClick={onCompletePayment}
          className="flex-1 bg-emerald-700 hover:bg-emerald-800 text-white font-bold py-3.5 rounded-xl text-xs transition-colors shadow-md shadow-emerald-700/20 flex items-center justify-center gap-2 cursor-pointer"
        >
          <CheckCircle2 className="w-4 h-4" />
          <span>Tôi đã chuyển khoản thành công</span>
        </button>
      </div>
    </div>
  );
};
