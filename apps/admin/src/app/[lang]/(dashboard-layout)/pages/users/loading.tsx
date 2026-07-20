import { TableSkeleton } from "@/components/ui/loading-skeletons"

export default function Loading() {
  return (
    <div className="container p-4 md:p-6 mx-auto space-y-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Người dùng</h1>
        <p className="text-muted-foreground">
          Quản lý tất cả tài khoản người dùng, đối tác, nhân viên và quản trị viên trong hệ thống.
        </p>
      </div>

      <div className="bg-card text-card-foreground border border-border rounded-2xl p-6 shadow-xs">
        <div className="mb-4">
          <h2 className="text-lg font-bold tracking-tight text-slate-800 dark:text-slate-100">Danh sách tài khoản</h2>
          <p className="text-xs text-muted-foreground">
            Hiển thị thông tin tên, email, trạng thái hoạt động và ngày đăng ký.
          </p>
        </div>
        <TableSkeleton cols={6} rows={5} />
      </div>
    </div>
  )
}
