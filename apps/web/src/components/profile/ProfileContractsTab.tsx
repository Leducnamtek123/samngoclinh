import { Link } from '@/lib/I18nNavigation';
import { Button, Badge } from '@/components/ui';
import { EmptyState, LoadingState } from '@/components/common';
import { FileText } from 'lucide-react';
import type { EContractData } from '@/types';

type ProfileContractsTabProps = {
  contractsLoading: boolean;
  contractsData: EContractData[];
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
        <LoadingState variant="centered" message="Đang tải danh sách hợp đồng..." />
      ) : !contractsData || contractsData.length === 0 ? (
        <EmptyState
          title="Chưa có hợp đồng điện tử nào"
          description="Các hợp đồng đầu tư & ủy quyền chăm sóc sẽ tự động khởi tạo khi bạn hoàn tất đơn mua cây sâm hoặc gói chăm sóc."
          icon={FileText}
        >
          <Button asChild variant="default" className="mt-2">
            <Link href="/products">Khám phá cây sâm giống</Link>
          </Button>
        </EmptyState>
      ) : (
        <div className="space-y-4">
          {contractsData.map((contract: any) => {
            const isSigned = (contract.status || '').toLowerCase() === 'signed' || contract.signedAt;
            const createdAtStr = contract.createdAt
              ? new Date(contract.createdAt).toLocaleDateString('vi-VN')
              : '—';
            const expiredAtStr = contract.expiredAt
              ? new Date(contract.expiredAt).toLocaleDateString('vi-VN')
              : '—';
            const contractVal = contract.contractValue || contract.totalAmount || contract.value || 0;

            return (
              <div
                key={contract.id}
                className="bg-white border border-gray-200 rounded-2xl p-5 hover:shadow-md transition-shadow duration-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="space-y-1.5 flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-extrabold text-slate-900 text-sm">
                      {contract.title || `Hợp đồng #${contract.code || contract.id.slice(0, 8)}`}
                    </span>
                    {isSigned ? (
                      <Badge variant="secondary" className="bg-emerald-100 text-emerald-800 border-none font-bold text-xs">
                        ✓ Đã ký kết
                      </Badge>
                    ) : (
                      <Badge variant="secondary" className="bg-amber-100 text-amber-800 border-none font-bold text-xs animate-pulse">
                        ✍️ Chờ ký số
                      </Badge>
                    )}
                  </div>
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-500 font-medium">
                    <span>Mã: <strong className="text-slate-700">{contract.code || contract.id.slice(0, 8)}</strong></span>
                    <span>Ngày tạo: <strong className="text-slate-700">{createdAtStr}</strong></span>
                    <span>Hiệu lực đến: <strong className="text-slate-700">{expiredAtStr}</strong></span>
                  </div>
                  <p className="text-xs text-slate-500 font-medium pt-0.5">
                    Giá trị hợp đồng: <strong className="text-primary font-bold text-sm">{(Number(contractVal) || 0).toLocaleString('vi-VN')} VNĐ</strong>
                  </p>
                </div>

                <div className="flex-shrink-0">
                  <Button
                    type="button"
                    variant={isSigned ? 'outline' : 'default'}
                    className={!isSigned ? 'bg-emerald-700 hover:bg-emerald-800 text-white font-bold' : ''}
                    onClick={() => onOpenContractModal(contract.id)}
                  >
                    {isSigned ? 'Xem chi tiết' : 'Ký điện tử ngay'}
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
