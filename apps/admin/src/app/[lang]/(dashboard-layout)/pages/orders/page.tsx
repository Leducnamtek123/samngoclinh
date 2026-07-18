import type { Metadata } from "next"
import Link from "next/link"
import { fetchApi } from "@/lib/api"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

export const metadata: Metadata = {
  title: "Quản lý Đơn hàng | Sâm Ngọc Linh Admin",
  description: "Danh sách đơn hàng trong hệ thống Sâm Ngọc Linh",
}

interface Order {
  id: string
  code: string
  status: string
  total: number
  createdAt: string
}

export default async function OrdersPage() {
  let orders: Order[] = []
  let errorMsg = ""

  try {
    const res = await fetchApi("/admin/orders")
    const payload = await res.json()
    if (res.status >= 400) {
      errorMsg = payload?.message || "Failed to load orders"
    } else {
      orders = Array.isArray(payload.data?.items) ? payload.data.items : (payload.data || [])
    }
  } catch (e) {
    console.error("Error fetching orders:", e)
    errorMsg = "Không thể kết nối đến máy chủ API"
  }

  const formatVND = (price: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price)
  }

  const getStatusBadgeVariant = (status: string) => {
    switch (status?.toLowerCase()) {
      case "completed":
      case "success":
        return "default"
      case "pending":
      case "processing":
        return "secondary"
      case "cancelled":
      case "failed":
        return "destructive"
      default:
        return "outline"
    }
  }

  return (
    <div className="container p-4 md:p-6 mx-auto space-y-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Đơn hàng</h1>
        <p className="text-muted-foreground">
          Theo dõi và xử lý đơn đặt hàng của khách hàng từ website.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Danh sách đơn hàng</CardTitle>
          <CardDescription>
            Hiển thị thông tin mã đơn, trạng thái, tổng tiền thanh toán và thời gian tạo.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {errorMsg ? (
            <div className="rounded-md bg-destructive/15 p-4 text-sm text-destructive">
              {errorMsg}
            </div>
          ) : orders.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              Không tìm thấy đơn hàng nào.
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Mã đơn hàng</TableHead>
                  <TableHead>Ngày tạo</TableHead>
                  <TableHead>Trạng thái</TableHead>
                  <TableHead className="text-right">Tổng giá trị</TableHead>
                  <TableHead className="text-center">Thao tác</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {orders.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell className="font-mono font-medium">{order.code}</TableCell>
                    <TableCell>
                      {new Date(order.createdAt).toLocaleString("vi-VN")}
                    </TableCell>
                    <TableCell>
                      <Badge variant={getStatusBadgeVariant(order.status)}>
                        {order.status.toUpperCase()}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right font-semibold text-primary">
                      {formatVND(order.total)}
                    </TableCell>
                    <TableCell className="text-center">
                      <Link
                        href={`/pages/orders/details?id=${order.id}`}
                        className="text-sm font-semibold text-emerald-600 hover:text-emerald-700 hover:underline"
                      >
                        Chi tiết
                      </Link>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
