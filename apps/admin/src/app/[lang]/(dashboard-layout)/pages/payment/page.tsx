import {
  ArrowDownLeft,
  ArrowUpRight,
  CreditCard,
  DollarSign,
} from "lucide-react"

import type { Metadata } from "next"

import { fetchApi } from "@/lib/api"
import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

export const metadata: Metadata = {
  title: "Quản lý Giao dịch & Thanh toán | Admin",
  description:
    "Theo dõi nhật ký giao dịch tài chính, nạp rút và lịch sử thanh toán hệ thống",
}

interface TransactionItem {
  id: string
  code?: string
  type: string
  title: string
  amount: number
  balanceAfter?: number | null
  status: string
  occurredAt?: string | Date
}

const currencyFormatter = new Intl.NumberFormat("vi-VN", {
  style: "currency",
  currency: "VND",
})

const formatMoney = (amount: number) => currencyFormatter.format(amount || 0)

export default async function PaymentPage({
  params,
}: {
  params: Promise<{ lang: string }>
}) {
  const { lang } = await params
  let transactions: TransactionItem[] = []
  let errorMsg = ""

  try {
    const res = await fetchApi("/admin/wallet/transactions")
    const payload = await res.json()
    if (res.status >= 400) {
      errorMsg = payload?.message || "Không thể tải danh sách giao dịch"
    } else {
      transactions = payload?.data?.items || payload?.data || []
    }
  } catch (err) {
    console.error("Error fetching transactions in payment page:", err)
    errorMsg = "Không thể kết nối đến máy chủ API"
  }

  return (
    <section className="container p-4 md:p-6 space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-emerald-950 dark:text-emerald-50">
            Quản lý Giao dịch & Thanh toán
          </h1>
          <p className="text-muted-foreground">
            Lịch sử giao dịch biến động số dư ví, nạp/rút điểm và doanh thu hệ
            thống.
          </p>
        </div>
        <Badge
          variant="outline"
          className="bg-emerald-50 border-emerald-200 text-emerald-700 font-semibold px-3 py-1.5 flex items-center gap-1.5 w-fit"
        >
          <DollarSign className="h-4 w-4" /> Hệ thống thanh toán SePay / Ví
        </Badge>
      </div>

      {/* Overview Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="bg-gradient-to-br from-emerald-900 to-teal-800 text-white shadow-md">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-emerald-100">
              Tổng số giao dịch
            </CardTitle>
            <CreditCard className="h-4 w-4 text-emerald-200" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{transactions.length}</div>
            <p className="text-xs text-emerald-200 mt-1">
              Giao dịch ghi nhận trên hệ thống
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Tổng giao dịch Cộng
            </CardTitle>
            <ArrowDownLeft className="h-4 w-4 text-emerald-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-emerald-600">
              {formatMoney(
                transactions
                  .filter(
                    (t) => t.type === "credit" || (t.amount && t.amount > 0)
                  )
                  .reduce((acc, curr) => acc + (curr.amount || 0), 0)
              )}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Nạp tiền & Tích lũy
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Tổng giao dịch Trừ
            </CardTitle>
            <ArrowUpRight className="h-4 w-4 text-rose-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-rose-600">
              {formatMoney(
                transactions
                  .filter(
                    (t) => t.type === "debit" || (t.amount && t.amount < 0)
                  )
                  .reduce((acc, curr) => acc + Math.abs(curr.amount || 0), 0)
              )}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Rút tiền & Rút vốn
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Real Transactions List */}
      <Card>
        <CardHeader>
          <CardTitle>Nhật ký Giao dịch Hệ thống (Real-time API)</CardTitle>
          <CardDescription>
            {errorMsg ? (
              <span className="text-amber-600 font-medium">
                {errorMsg} - Hiển thị cấu hình thanh toán bổ trợ bên dưới
              </span>
            ) : (
              "Danh sách giao dịch nạp, rút và mua gói sâm Ngọc Linh thu thập từ API"
            )}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {transactions.length > 0 ? (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Mã GD</TableHead>
                    <TableHead>Mô tả / Nội dung</TableHead>
                    <TableHead>Loại</TableHead>
                    <TableHead className="text-right">Số tiền / Điểm</TableHead>
                    <TableHead className="text-right">Số dư sau GD</TableHead>
                    <TableHead>Trạng thái</TableHead>
                    <TableHead>Thời gian</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {transactions.map((txn) => (
                    <TableRow key={txn.id}>
                      <TableCell className="font-mono text-xs font-semibold">
                        {txn.code || txn.id.slice(0, 8)}
                      </TableCell>
                      <TableCell className="font-medium">
                        {txn.title || "Giao dịch ví"}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            txn.type === "credit" ? "default" : "secondary"
                          }
                        >
                          {txn.type === "credit" ? "Nạp / Cộng" : "Trừ / Rút"}
                        </Badge>
                      </TableCell>
                      <TableCell
                        className={`text-right font-bold ${txn.type === "credit" ? "text-emerald-600" : "text-rose-600"}`}
                      >
                        {txn.type === "credit" ? "+" : "-"}
                        {formatMoney(Math.abs(txn.amount || 0))}
                      </TableCell>
                      <TableCell className="text-right text-muted-foreground">
                        {txn.balanceAfter != null
                          ? formatMoney(txn.balanceAfter)
                          : "---"}
                      </TableCell>
                      <TableCell>
                        <Badge
                          className={
                            txn.status === "success"
                              ? "bg-emerald-100 text-emerald-800 hover:bg-emerald-100"
                              : "bg-amber-100 text-amber-800"
                          }
                        >
                          {txn.status === "success" ? "Thành công" : txn.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-xs text-muted-foreground">
                        {txn.occurredAt
                          ? new Date(txn.occurredAt).toLocaleString("vi-VN")
                          : "---"}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="py-8 text-center text-muted-foreground">
              Chưa có dữ liệu giao dịch từ API backend hoặc máy chủ API chưa
              phản hồi.
            </div>
          )}
        </CardContent>
      </Card>
    </section>
  )
}
