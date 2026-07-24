import { Link } from '@/libs/I18nNavigation';

type ProfileContractsTabProps = {
  contractsLoading: boolean;
  contractsData: any[];
  onOpenContractModal: (id: string) => void;
};

export const ProfileContractsTab = ({
  contractsLoading,
  contractsData,
  onOpenContractModal,
}: ProfileContractsTabProps) => {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-bold text-gray-900">Hợp đồng điện tử</h3>
        <p className="text-xs text-gray-400 font-medium">Quản lý và thực hiện ký số cho các hợp đồng hợp tác đầu tư sâm</p>
      </div>

      {contractsLoading ? (
        <div className="space-y-3 animate-pulse">
          <div className="h-20 bg-gray-100 rounded-2xl"></div>
          <div className="h-20 bg-gray-100 rounded-2xl"></div>
        </div>
      ) : !contractsData || contractsData.length === 0 ? (
        <div className="bg-gray-50 border border-gray-200 border-dashed rounded-2xl p-8 text-center space-y-3">
          <div className="w-12 h-12 bg-emerald-100 text-emerald-800 rounded-full flex items-center justify-center mx-auto">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h4 className="text-sm font-bold text-gray-800">Chưa có hợp đồng điện tử nào</h4>
          <p className="text-xs text-gray-500 max-w-sm mx-auto">
            Các hợp đồng đầu tư & ủy quyền chăm sóc sẽ tự động khởi tạo khi bạn hoàn tất đơn mua cây sâm hoặc gói chăm sóc.
          </p>
          <Link href="/products" className="inline-block bg-[#1C3F24] text-white hover:bg-emerald-900 px-5 py-2.5 rounded-xl text-xs font-bold transition-colors shadow-sm mt-2">
            Khám phá cây sâm giống
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {contractsData.map((contract: any) => {
            const isSigned = contract.status === 'SIGNED' || contract.signedAt;
            return (
              <div
                key={contract.id}
                className="bg-white border border-gray-200 rounded-2xl p-5 hover:shadow-md transition-shadow duration-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2">
                    <span className="font-extrabold text-slate-900 text-sm">Hợp đồng #{contract.code || contract.id.slice(0, 8)}</span>
                    {isSigned ? (
                      <span className="bg-emerald-100 text-emerald-800 text-[10px] font-extrabold px-2.5 py-0.5 rounded-full">
                        Đã ký kết
                      </span>
                    ) : (
                      <span className="bg-amber-100 text-amber-800 text-[10px] font-extrabold px-2.5 py-0.5 rounded-full">
                        Chờ ký số
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-500 font-medium">
                    Giá trị: <strong className="text-[#1C3F24] font-bold">{(contract.totalAmount || contract.value || 0).toLocaleString('vi-VN')} VNĐ</strong>
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => onOpenContractModal(contract.id)}
                  className={`px-5 py-2.5 rounded-xl font-bold text-xs transition-colors cursor-pointer ${
                    isSigned
                      ? 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                      : 'bg-[#1C3F24] text-white hover:bg-[#15301B] shadow-sm'
                  }`}
                >
                  {isSigned ? 'Xem chi tiết' : 'Ký điện tử ngay'}
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
