import type { Metadata } from "next"
import Link from "next/link"
import { fetchApi } from "@/lib/api"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

export const metadata: Metadata = {
  title: "Quản lý Người dùng | Sâm Ngọc Linh Admin",
  description: "Danh sách tài khoản người dùng trong hệ thống Sâm Ngọc Linh",
}

interface User {
  id: string
  name?: string
  username: string
  email: string
  status: string
  isVerified: boolean
  signUpDate?: string
  createdAt?: string
}

export default async function UsersPage() {
  let customers: User[] = []
  let errorMsg = ""

  try {
    const res = await fetchApi("/admin/user/list")
    const payload = await res.json()
    if (res.status >= 400) {
      errorMsg = payload?.message || "Failed to load users"
    } else {
      customers = Array.isArray(payload.data) ? payload.data : (payload.data?.data || [])
    }
  } catch (e) {
    console.error("Error fetching users:", e)
    errorMsg = "Không thể kết nối đến máy chủ API"
  }

  return (
    <div className="container p-4 md:p-6 mx-auto space-y-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Người dùng</h1>
        <p className="text-muted-foreground">
          Quản lý tất cả tài khoản người dùng, đối tác, nhân viên và quản trị viên trong hệ thống.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Danh sách tài khoản</CardTitle>
          <CardDescription>
            Hiển thị thông tin tên, email, trạng thái hoạt động và ngày đăng ký.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {errorMsg ? (
            <div className="rounded-md bg-destructive/15 p-4 text-sm text-destructive">
              {errorMsg}
            </div>
          ) : customers.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              Không tìm thấy khách hàng nào.
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Tên hiển thị</TableHead>
                  <TableHead>Username</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Xác minh</TableHead>
                  <TableHead>Trạng thái</TableHead>
                  <TableHead className="text-right">Ngày đăng ký</TableHead>
                  <TableHead className="text-center">Thao tác</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {customers.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell className="font-medium">{user.name || "-"}</TableCell>
                    <TableCell>{user.username}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>
                      <Badge variant={user.isVerified ? "default" : "outline"}>
                        {user.isVerified ? "Đã xác minh" : "Chưa xác minh"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={user.status === "ACTIVE" || user.status === "active" ? "default" : "destructive"}>
                        {user.status.toUpperCase()}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      {user.signUpDate || user.createdAt
                        ? new Date(user.signUpDate || user.createdAt!).toLocaleDateString("vi-VN")
                        : "-"}
                    </TableCell>
                    <TableCell className="text-center">
                      <Link
                        href={`/pages/users/details?id=${user.id}`}
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
