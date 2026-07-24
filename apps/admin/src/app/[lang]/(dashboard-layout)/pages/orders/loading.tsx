import { TableSkeleton } from "@/components/ui/loading-skeletons"

export default function Loading() {
  return (
    <div className="container p-4 md:p-6 mx-auto space-y-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Đơn hàng</h1>
        <p className="text-muted-foreground">
          Theo dõi và xử lý đơn đặt hàng của khách hàng từ website.
        </p>
      </div>

      <div className="bg-card text-card-foreground border border-border rounded-2xl p-6 shadow-xs">
        <div className="mb-4">
          <h2 className="text-lg font-bold tracking-tight text-slate-800 dark:text-slate-100">
            Danh sách đơn hàng
          </h2>
          <p className="text-xs text-muted-foreground">
            Hiển thị thông tin mã đơn, trạng thái, tổng tiền thanh toán và thời
            gian tạo.
          </p>
        </div>
        <TableSkeleton cols={5} rows={5} />
      </div>
    </div>
  )
}
