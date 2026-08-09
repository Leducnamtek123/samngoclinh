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
  isVerifying?: boolean;
  onCopy: (text: string, fieldName: string) => void;
  onCompletePayment: () => void;
  onOpenSepayGateway?: () => void;
};

export const CartStepPayment = ({
  orderInfo,
  copiedField,
  isVerifying = false,
  onCopy,
  onCompletePayment,
  onOpenSepayGateway,
}: CartStepPaymentProps) => {
  return (
    <div className="bg-white border border-gray-200 rounded-3xl p-6 sm:p-10 shadow-sm max-w-2xl mx-auto space-y-8">
      <div className="text-center space-y-2 border-b border-gray-100 pb-6">
        <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-700 flex items-center justify-center mx-auto">
          <QrCode className="w-6 h-6" />
        </div>
        <h3 className="text-xl font-extrabold text-gray-900">Quét Mã QR Chuyển Khoản Tự Động</h3>
        <p className="text-xs text-gray-500 font-medium">Đơn hàng <span className="font-bold text-emerald-800">#{orderInfo.orderCode}</span> đã được khởi tạo thành công.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 items-center">
        {/* VietQR Code Display */}
        <div className="bg-gray-50 border border-gray-200 rounded-2xl p-4 flex flex-col items-center space-y-3 shadow-xs">
          <div className="bg-white p-3 rounded-xl shadow-xs border border-gray-100 relative group">
            <Image src={orderInfo.qrUrl} alt="Mã QR thanh toán" width={224} height={224} unoptimized className="w-56 h-56 object-contain rounded-lg" />
          </div>
          <div className="flex items-center gap-1.5 text-[11px] text-gray-500 font-semibold">
            <RefreshCw className="w-3.5 h-3.5 animate-spin text-emerald-600" />
            <span>Đang tự động kiểm tra giao dịch...</span>
          </div>
        </div>

        {/* Transfer Details List */}
        <div className="space-y-3 text-xs">
          <div className="bg-gray-50 rounded-xl p-3 space-y-0.5">
            <span className="text-[10px] text-gray-400 font-bold uppercase">Ngân hàng</span>
            <p className="font-bold text-gray-900 leading-tight">{orderInfo.bankName}</p>
          </div>

          <div className="bg-gray-50 rounded-xl p-3 flex justify-between items-center">
            <div className="min-w-0 pr-2">
              <span className="text-[10px] text-gray-400 font-bold uppercase block">Chủ tài khoản</span>
              <span className="font-extrabold text-gray-900 text-xs truncate block">{orderInfo.accountName}</span>
            </div>
            <button
              type="button"
              onClick={() => onCopy(orderInfo.accountName, 'accountName')}
              className="p-1.5 text-emerald-700 hover:bg-emerald-100/50 rounded-lg transition-colors flex items-center gap-1 font-bold cursor-pointer shrink-0"
            >
              {copiedField === 'accountName' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              <span className="text-[11px]">{copiedField === 'accountName' ? 'Đã chép' : 'Sao chép'}</span>
            </button>
          </div>

          <div className="bg-gray-50 rounded-xl p-3 flex justify-between items-center">
            <div>
              <span className="text-[10px] text-gray-400 font-bold uppercase block">Số tài khoản</span>
              <span className="font-extrabold text-gray-900 text-xs sm:text-sm">{orderInfo.accountNo}</span>
            </div>
            <button
              type="button"
              onClick={() => onCopy(orderInfo.accountNo, 'stk')}
              className="p-1.5 text-emerald-700 hover:bg-emerald-100/50 rounded-lg transition-colors flex items-center gap-1 font-bold cursor-pointer shrink-0"
            >
              {copiedField === 'stk' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              <span className="text-[11px]">{copiedField === 'stk' ? 'Đã chép' : 'Sao chép'}</span>
            </button>
          </div>

          <div className="bg-gray-50 rounded-xl p-3 flex justify-between items-center">
            <div>
              <span className="text-[10px] text-gray-400 font-bold uppercase block">Nội dung chuyển khoản</span>
              <span className="font-extrabold text-emerald-800 text-xs sm:text-sm">{orderInfo.orderCode}</span>
            </div>
            <button
              type="button"
              onClick={() => onCopy(orderInfo.orderCode, 'code')}
              className="p-1.5 text-emerald-700 hover:bg-emerald-100/50 rounded-lg transition-colors flex items-center gap-1 font-bold cursor-pointer shrink-0"
            >
              {copiedField === 'code' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              <span className="text-[11px]">{copiedField === 'code' ? 'Đã chép' : 'Sao chép'}</span>
            </button>
          </div>

          <div className="bg-emerald-50 border border-emerald-200/60 rounded-xl p-3 flex justify-between items-center">
            <div>
              <span className="text-[10px] text-emerald-700 font-bold uppercase block">Số tiền cần chuyển</span>
              <span className="font-black text-emerald-900 text-sm sm:text-base">{orderInfo.amount.toLocaleString('vi-VN')} đ</span>
            </div>
            <button
              type="button"
              onClick={() => onCopy(orderInfo.amount.toString(), 'amount')}
              className="p-1.5 text-emerald-700 hover:bg-emerald-100 rounded-lg transition-colors flex items-center gap-1 font-bold cursor-pointer shrink-0"
            >
              {copiedField === 'amount' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              <span className="text-[11px]">{copiedField === 'amount' ? 'Đã chép' : 'Sao chép'}</span>
            </button>
          </div>
        </div>
      </div>

      <div className="pt-4 border-t border-gray-100 flex flex-col sm:flex-row gap-3">
        <button
          type="button"
          disabled={isVerifying}
          onClick={onCompletePayment}
          className="flex-1 bg-emerald-700 hover:bg-emerald-800 disabled:opacity-75 text-white font-bold py-3.5 rounded-xl text-xs transition-colors shadow-md shadow-emerald-700/20 flex items-center justify-center gap-2 cursor-pointer"
        >
          {isVerifying ? (
            <RefreshCw className="w-4 h-4 animate-spin text-white" />
          ) : (
            <CheckCircle2 className="w-4 h-4" />
          )}
          <span>{isVerifying ? 'Đang kiểm tra với ngân hàng...' : 'Tôi đã chuyển khoản thành công'}</span>
        </button>

        {onOpenSepayGateway && (
          <button
            type="button"
            onClick={onOpenSepayGateway}
            className="bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold py-3.5 px-4 rounded-xl text-xs transition-colors flex items-center justify-center gap-2 cursor-pointer border border-gray-200"
          >
            <span>Mở Cổng Thanh Toán Trực Tuyến</span>
          </button>
        )}
      </div>
    </div>
  );
};
