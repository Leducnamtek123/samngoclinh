import { Link } from '@/libs/I18nNavigation';

type ProfileOrdersTabProps = {
  ordersLoading: boolean;
  safeOrders: any[];
  onViewDetail: (ord: any) => void;
  onPayOrder: (ord: any) => void;
};

export const ProfileOrdersTab = ({
  ordersLoading,
  safeOrders,
  onViewDetail,
  onPayOrder,
}: ProfileOrdersTabProps) => {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-bold text-gray-900">Lịch sử đơn hàng</h3>
        <p className="text-xs text-gray-400 font-medium">Theo dõi và quản lý các đơn mua sâm Ngọc Linh và gói chăm sóc</p>
      </div>

      {ordersLoading ? (
        <div className="space-y-3 animate-pulse">
          <div className="h-16 bg-gray-100 rounded-xl"></div>
        </div>
      ) : safeOrders.length === 0 ? (
        <div className="bg-gray-50 border border-gray-200 border-dashed rounded-xl p-8 text-center space-y-3">
          <p className="text-sm text-gray-500">Bạn chưa thực hiện đơn hàng nào.</p>
          <Link href="/ginseng" className="inline-block bg-primary text-white hover:bg-primary-hover px-5 py-2 rounded-lg text-xs font-bold transition-colors shadow-sm">
            Ghé Cửa hàng ngay
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {safeOrders.map((ord) => {
            const safeItems = Array.isArray(ord?.items) ? ord.items : [];
            return (
              <div key={ord.id || ord.code} className="border border-gray-200 rounded-xl p-5 space-y-3 bg-gray-50/30">
                <div className="flex justify-between items-center border-b border-gray-100 pb-3">
                  <div>
                    <span className="font-bold text-gray-900 text-sm">Đơn hàng #{ord.code || ord.id}</span>
                    <span className="text-xs text-gray-400 block">{ord.createdAt}</span>
                  </div>
                  <span className={`text-xs font-bold px-3 py-1 rounded-full uppercase ${
                    ord.status === 'PAID' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                  }`}>
                    {ord.status === 'PAID' ? 'Đã thanh toán' : 'Chờ thanh toán VietQR'}
                  </span>
                </div>

                {safeItems.map((item: any) => (
                  <div key={item.id || item.productId || item.name} className="flex justify-between items-center text-xs font-medium text-gray-700">
                    <span>{item.name} (x{item.quantity})</span>
                    <span>{((item.price || 0) * (item.quantity || 1)).toLocaleString('vi-VN')} đ</span>
                  </div>
                ))}

                <div className="flex justify-between items-center pt-2 border-t border-gray-100">
                  <span className="text-xs font-bold text-gray-900">Tổng tiền: <strong className="text-secondary text-sm">{(ord.totalAmount || 0).toLocaleString('vi-VN')} đ</strong></span>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => onViewDetail(ord)}
                      className="text-xs font-bold text-emerald-700 hover:text-emerald-900 bg-emerald-50 hover:bg-emerald-100 px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
                    >
                      Chi tiết đơn hàng
                    </button>
                    {ord.status === 'PENDING' && (
                      <button
                        type="button"
                        onClick={() => onPayOrder(ord)}
                        className="bg-[#4CAF50] hover:bg-emerald-600 text-white font-bold px-4 py-1.5 rounded-lg text-xs transition-colors cursor-pointer"
                      >
                        Thanh toán VietQR
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
