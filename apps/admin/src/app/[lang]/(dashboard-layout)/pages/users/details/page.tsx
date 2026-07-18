"use client"

import { useEffect, useState, Suspense } from "react"
import { useParams, useRouter, useSearchParams } from "next/navigation"
import { fetchApi } from "@/lib/api"
import { ensureLocalizedPathname } from "@/lib/i18n"
import type { LocaleType } from "@/types"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

interface CustomerDetail {
  id: string
  name: string | null
  username: string
  email: string
  phoneNumber: string | null
  status: string
  role: string
  isVerified: boolean
  createdAt: string
}

function CustomerDetailsContent() {
  const router = useRouter()
  const params = useParams()
  const locale = params.lang as LocaleType
  const searchParams = useSearchParams()
  const userId = searchParams.get("id")

  const [user, setUser] = useState<CustomerDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState(false)
  const [errorMsg, setErrorMsg] = useState("")
  const [successMsg, setSuccessMsg] = useState("")

  const loadUserDetails = async () => {
    if (!userId) {
      setErrorMsg("Không tìm thấy mã người dùng")
      setLoading(false)
      return
    }

    try {
      const res = await fetchApi(`/admin/user/get/${userId}`)
      const payload = await res.json()
      if (res.status >= 400) {
        setErrorMsg(payload?.message || "Không thể tải chi tiết khách hàng")
      } else {
        setUser(payload.data)
      }
    } catch (e) {
      console.error(e)
      setErrorMsg("Không thể kết nối đến máy chủ API")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadUserDetails()
  }, [userId])

  const handleUpdateStatus = async (status: "active" | "blocked") => {
    if (!userId) return
    setUpdating(true)
    setErrorMsg("")
    setSuccessMsg("")

    try {
      const res = await fetchApi(`/admin/user/update/${userId}/status`, {
        method: "PATCH",
        body: JSON.stringify({ status }),
      })

      const payload = await res.json()
      if (res.status >= 400) {
        setErrorMsg(payload?.message || "Không thể cập nhật trạng thái khách hàng")
      } else {
        setSuccessMsg(`Đã cập nhật trạng thái người dùng thành công sang "${status}"!`)
        await loadUserDetails()
      }
    } catch (e) {
      console.error(e)
      setErrorMsg("Lỗi khi kết nối đến máy chủ API")
    } finally {
      setUpdating(false)
    }
  }

  if (loading) {
    return <div className="text-center py-8 text-muted-foreground">Đang tải thông tin khách hàng...</div>
  }

  if (errorMsg && !user) {
    return (
      <Alert variant="destructive" className="max-w-xl mx-auto">
        <AlertTitle>Lỗi</AlertTitle>
        <AlertDescription>{errorMsg}</AlertDescription>
      </Alert>
    )
  }

  if (!user) {
    return <div className="text-center py-8 text-muted-foreground">Không tìm thấy thông tin khách hàng</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-bold tracking-tight">Chi tiết tài khoản</h1>
            <Badge variant={user.status === "ACTIVE" || user.status === "active" ? "default" : "destructive"}>
              {user.status.toUpperCase()}
            </Badge>
          </div>
          <p className="text-muted-foreground">
            Mã định danh (ID): <span className="font-mono text-sm">{user.id}</span>
          </p>
        </div>
        <div>
          <Button
            variant="outline"
            onClick={() => router.push(ensureLocalizedPathname("/pages/users", locale))}
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
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Thông tin hồ sơ</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4 border-b pb-3">
              <div>
                <span className="text-sm text-muted-foreground block">Tên hiển thị:</span>
                <span className="font-semibold text-lg">{user.name || "Chưa thiết lập"}</span>
              </div>
              <div>
                <span className="text-sm text-muted-foreground block">Tên tài khoản (Username):</span>
                <span className="font-semibold text-lg">{user.username}</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 border-b pb-3">
              <div>
                <span className="text-sm text-muted-foreground block">Địa chỉ Email:</span>
                <span className="font-medium">{user.email}</span>
              </div>
              <div>
                <span className="text-sm text-muted-foreground block">Số điện thoại:</span>
                <span className="font-medium">{user.phoneNumber || "Chưa thiết lập"}</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <span className="text-sm text-muted-foreground block">Vai trò:</span>
                <Badge variant="outline" className="capitalize text-sm font-semibold">
                  {typeof user.role === "object" && user.role ? (user.role as any).name : user.role}
                </Badge>
              </div>
              <div>
                <span className="text-sm text-muted-foreground block">Ngày đăng ký:</span>
                <span className="font-medium">
                  {new Date(user.createdAt).toLocaleString("vi-VN")}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Hành động</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {user.status === "ACTIVE" || user.status === "active" ? (
                <Button
                  disabled={updating}
                  onClick={() => handleUpdateStatus("blocked")}
                  variant="destructive"
                  className="w-full font-semibold"
                >
                  Khóa tài khoản
                </Button>
              ) : (
                <Button
                  disabled={updating}
                  onClick={() => handleUpdateStatus("active")}
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold"
                >
                  Kích hoạt tài khoản
                </Button>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default function CustomerDetailsPage() {
  return (
    <div className="container p-4 md:p-6 mx-auto">
      <Suspense fallback={<div className="text-center py-8">Đang tải...</div>}>
        <CustomerDetailsContent />
      </Suspense>
    </div>
  )
}
