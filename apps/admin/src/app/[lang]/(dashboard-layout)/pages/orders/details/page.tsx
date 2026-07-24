"use client"

import { Suspense, useCallback, useEffect, useState } from "react"
import { useParams, useRouter, useSearchParams } from "next/navigation"

import type { LocaleType } from "@/types"

import { fetchApi } from "@/lib/api"
import { ensureLocalizedPathname } from "@/lib/i18n"

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { DetailsSkeleton } from "@/components/ui/loading-skeletons"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

interface OrderItem {
  code: string
  name: string
  quantity: number
  price: number
}

interface OrderDetail {
  id: string
  code: string
  status: string
  currency: string
  subtotal: number
  shippingFee: number
  discount: number
  total: number
  paymentMethod: string | null
  items: OrderItem[]
  paidAt: string | null
  cancelledAt: string | null
  createdAt: string
  user?: {
    fullName: string
    email: string
    phone: string
  }
}

function OrderDetailsContent() {
  const router = useRouter()
  const params = useParams()
  const locale = params.lang as LocaleType
  const searchParams = useSearchParams()
  const orderId = searchParams.get("id")

  const [order, setOrder] = useState<OrderDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState(false)
  const [errorMsg, setErrorMsg] = useState("")
  const [successMsg, setSuccessMsg] = useState("")

  const loadOrderDetails = useCallback(async () => {
    if (!orderId) {
      setErrorMsg("Không tìm thấy mã đơn hàng")
      setLoading(false)
      return
    }

    try {
      const res = await fetchApi(`/admin/orders/${orderId}`)
      const payload = await res.json()
      if (res.status >= 400) {
        setErrorMsg(payload?.message || "Không thể tải chi tiết đơn hàng")
      } else {
        setOrder(payload.data)
      }
    } catch (e) {
      console.error(e)
      setErrorMsg("Không thể kết nối đến máy chủ API")
    } finally {
      setLoading(false)
    }
  }, [orderId])

  useEffect(() => {
    loadOrderDetails()
  }, [orderId, loadOrderDetails])

  const handleUpdateStatus = async (status: string) => {
    if (!orderId) return
    setUpdating(true)
    setErrorMsg("")
    setSuccessMsg("")

    try {
      const res = await fetchApi(`/admin/orders/${orderId}/status`, {
        method: "PATCH",
        body: JSON.stringify({ status }),
      })

      const payload = await res.json()
      if (res.status >= 400) {
        setErrorMsg(
          payload?.message || "Không thể cập nhật trạng thái đơn hàng"
        )
      } else {
        setSuccessMsg(
          `Cập nhật trạng thái sang "${status.toUpperCase()}" thành công!`
        )
        await loadOrderDetails()
      }
    } catch (e) {
      console.error(e)
      setErrorMsg("Lỗi khi kết nối đến máy chủ API")
    } finally {
      setUpdating(false)
    }
  }

  if (loading) {
    return <DetailsSkeleton />
  }

  if (errorMsg && !order) {
    return (
      <Alert variant="destructive" className="max-w-xl mx-auto">
        <AlertTitle>Lỗi</AlertTitle>
        <AlertDescription>{errorMsg}</AlertDescription>
      </Alert>
    )
  }

  if (!order) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        Không tìm thấy đơn hàng
      </div>
    )
  }

  const itemsList = Array.isArray(order.items)
    ? order.items
    : typeof order.items === "string"
      ? JSON.parse(order.items)
      : []

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-bold tracking-tight">
              Chi tiết đơn hàng
            </h1>
            <Badge
              variant={getStatusBadgeVariant(order.status)}
              className="text-sm font-semibold"
            >
              {order.status.toUpperCase()}
            </Badge>
          </div>
          <p className="text-muted-foreground font-mono">
            Mã đơn: {order.code} | Ngày tạo:{" "}
            {new Date(order.createdAt).toLocaleString("vi-VN", {
              timeZone: "Asia/Ho_Chi_Minh",
            })}
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() =>
              router.push(ensureLocalizedPathname("/pages/orders", locale))
            }
          >
            Quay lại
          </Button>
        </div>
      </div>

      {successMsg && (
        <Alert className="border-emerald-600 bg-emerald-50 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
          <AlertTitle>Thành công</AlertTitle>
          <AlertDescription>{successMsg}</AlertDescription>
        </Alert>
      )}

      {errorMsg && (
        <Alert variant="destructive">
          <AlertTitle>Lỗi cập nhật</AlertTitle>
          <AlertDescription>{errorMsg}</AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <OrderProductsCard order={order} itemsList={itemsList} />

        <div className="space-y-6">
          {order.user && <CustomerInfoCard user={order.user} />}
          <PaymentMethodCard order={order} />
          <OrderStatusUpdateCard
            order={order}
            updating={updating}
            handleUpdateStatus={handleUpdateStatus}
          />
        </div>
      </div>
    </div>
  )
}

function OrderProductsCard({
  order,
  itemsList,
}: {
  order: OrderDetail
  itemsList: any[]
}) {
  return (
    <Card className="md:col-span-2">
      <CardHeader>
        <CardTitle>Sản phẩm đã đặt</CardTitle>
        <CardDescription>
          Chi tiết danh sách các loại sâm và hàng hóa
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Mã vật phẩm</TableHead>
              <TableHead>Tên sản phẩm</TableHead>
              <TableHead className="text-right">Đơn giá</TableHead>
              <TableHead className="text-center">Số lượng</TableHead>
              <TableHead className="text-right">Thành tiền</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {itemsList.map((item: any) => (
              <TableRow key={item.code}>
                <TableCell className="font-mono text-sm">{item.code}</TableCell>
                <TableCell className="font-semibold">{item.name}</TableCell>
                <TableCell className="text-right">
                  {formatVND(item.price)}
                </TableCell>
                <TableCell className="text-center">{item.quantity}</TableCell>
                <TableCell className="text-right font-semibold">
                  {formatVND(item.price * item.quantity)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
      <CardFooter className="flex flex-col items-end gap-2 border-t pt-4 bg-muted/20">
        <div className="flex justify-between w-64 text-sm text-muted-foreground">
          <span>Tạm tính:</span>
          <span>{formatVND(order.subtotal)}</span>
        </div>
        <div className="flex justify-between w-64 text-sm text-muted-foreground">
          <span>Phí vận chuyển:</span>
          <span>{formatVND(order.shippingFee)}</span>
        </div>
        {order.discount > 0 && (
          <div className="flex justify-between w-64 text-sm text-destructive font-semibold">
            <span>Khuyến mãi:</span>
            <span>-{formatVND(order.discount)}</span>
          </div>
        )}
        <div className="flex justify-between w-64 text-lg font-bold border-t pt-2 mt-2">
          <span>Tổng thanh toán:</span>
          <span className="text-emerald-700 dark:text-emerald-400">
            {formatVND(order.total)}
          </span>
        </div>
      </CardFooter>
    </Card>
  )
}

function CustomerInfoCard({
  user,
}: {
  user: NonNullable<OrderDetail["user"]>
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Thông tin khách hàng</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3 text-sm">
        <div className="flex flex-col gap-1 border-b pb-2">
          <span className="text-xs text-muted-foreground">Tên khách hàng:</span>
          <span className="font-semibold text-gray-900 dark:text-gray-100">
            {user.fullName}
          </span>
        </div>
        <div className="flex flex-col gap-1 border-b pb-2">
          <span className="text-xs text-muted-foreground">Số điện thoại:</span>
          <span className="font-mono font-semibold text-gray-900 dark:text-gray-100">
            {user.phone}
          </span>
        </div>
        <div className="flex flex-col gap-1">
          <span className="text-xs text-muted-foreground">Địa chỉ Email:</span>
          <span className="font-semibold text-gray-900 dark:text-gray-100 break-all">
            {user.email}
          </span>
        </div>
      </CardContent>
    </Card>
  )
}

function PaymentMethodCard({ order }: { order: OrderDetail }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Phương thức thanh toán</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3 text-sm">
        <div className="flex justify-between">
          <span className="text-muted-foreground">Hình thức:</span>
          <span className="font-semibold uppercase">
            {order.paymentMethod || "COD"}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Trạng thái:</span>
          <span>
            {order.paidAt ? (
              <Badge className="bg-emerald-600 text-white font-medium">
                Đã thanh toán
              </Badge>
            ) : (
              <Badge
                variant="outline"
                className="text-amber-600 border-amber-600 font-medium"
              >
                Chưa thanh toán
              </Badge>
            )}
          </span>
        </div>
        {order.paidAt && (
          <div className="flex justify-between">
            <span className="text-muted-foreground">Ngày thanh toán:</span>
            <span className="font-mono">
              {new Date(order.paidAt).toLocaleString("vi-VN", {
                timeZone: "Asia/Ho_Chi_Minh",
              })}
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

function OrderStatusUpdateCard({
  order,
  updating,
  handleUpdateStatus,
}: {
  order: OrderDetail
  updating: boolean
  handleUpdateStatus: (status: string) => void
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Cập nhật trạng thái</CardTitle>
        <CardDescription>Xử lý quy trình đơn hàng</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-2">
        {order.status === "pending" && (
          <>
            <Button
              type="button"
              disabled={updating}
              onClick={() => handleUpdateStatus("paid")}
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold"
            >
              Xác nhận thanh toán
            </Button>
            <Button
              type="button"
              disabled={updating}
              onClick={() => handleUpdateStatus("cancelled")}
              variant="destructive"
              className="w-full font-semibold"
            >
              Hủy đơn hàng
            </Button>
          </>
        )}

        {order.status === "paid" && (
          <>
            <Button
              type="button"
              disabled={updating}
              onClick={() => handleUpdateStatus("shipping")}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold"
            >
              Bắt đầu giao hàng
            </Button>
            <Button
              type="button"
              disabled={updating}
              onClick={() => handleUpdateStatus("cancelled")}
              variant="destructive"
              className="w-full font-semibold"
            >
              Hủy đơn hàng
            </Button>
          </>
        )}

        {order.status === "shipping" && (
          <>
            <Button
              type="button"
              disabled={updating}
              onClick={() => handleUpdateStatus("completed")}
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold"
            >
              Hoàn thành giao hàng
            </Button>
            <Button
              type="button"
              disabled={updating}
              onClick={() => handleUpdateStatus("cancelled")}
              variant="destructive"
              className="w-full font-semibold"
            >
              Hủy đơn hàng
            </Button>
          </>
        )}

        {["completed", "cancelled", "refunded"].includes(
          order.status.toLowerCase()
        ) && (
          <div className="text-center p-3 bg-muted rounded-md text-xs text-muted-foreground font-medium">
            Đơn hàng đã hoàn thành hoặc đã hủy. Không thể thay đổi trạng thái
            thêm.
          </div>
        )}
      </CardContent>
    </Card>
  )
}

export default function OrderDetailsPage() {
  return (
    <div className="container p-4 md:p-6 mx-auto">
      <Suspense fallback={<DetailsSkeleton />}>
        <OrderDetailsContent />
      </Suspense>
    </div>
  )
}

const vndFormatter = new Intl.NumberFormat("vi-VN", {
  style: "currency",
  currency: "VND",
})

const formatVND = (price: number) => {
  return vndFormatter.format(price)
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
