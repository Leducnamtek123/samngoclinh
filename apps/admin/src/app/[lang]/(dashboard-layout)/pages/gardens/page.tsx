import type { Metadata } from "next"
import { fetchApi } from "@/lib/api"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

export const metadata: Metadata = {
  title: "Vườn của tôi | Sâm Ngọc Linh Admin",
  description: "Quản lý danh sách các khu vườn trồng sâm",
}

interface Garden {
  id: string
  code: string
  name: string
  status: string
  totalBeds: number
  activeBeds: number
  totalTrees: number
  createdAt: string
}

export default async function GardensPage() {
  let gardens: Garden[] = []
  let errorMsg = ""

  try {
    const res = await fetchApi("/user/cultivation/gardens/list")
    const payload = await res.json()
    if (res.status >= 400) {
      errorMsg = payload?.message || "Không thể tải danh sách vườn"
    } else {
      gardens = Array.isArray(payload.data) ? payload.data : []
    }
  } catch (e) {
    console.error("Error fetching gardens:", e)
    errorMsg = "Không thể kết nối đến máy chủ API"
  }

  return (
    <div className="container mx-auto p-4 md:p-6 space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Vườn của tôi</h1>
          <p className="text-muted-foreground">
            Quản lý các khu vườn sâm và theo dõi số lượng luống, cây sâm.
          </p>
        </div>
      </div>

      {errorMsg && (
        <div className="bg-destructive/15 text-destructive border border-destructive/20 rounded-xl p-4 text-sm font-medium">
          {errorMsg}
        </div>
      )}

      <Card className="border-slate-200 shadow-sm dark:border-slate-800">
        <CardHeader>
          <CardTitle>Danh sách khu vườn</CardTitle>
          <CardDescription>
            Hiển thị tổng số {gardens.length} khu vườn đang canh tác sâm.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {gardens.length === 0 && !errorMsg ? (
            <div className="text-center py-12 text-muted-foreground">
              Chưa có khu vườn nào được tạo.
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Mã vườn</TableHead>
                  <TableHead>Tên khu vườn</TableHead>
                  <TableHead>Tổng số luống</TableHead>
                  <TableHead>Luống đang hoạt động</TableHead>
                  <TableHead>Tổng số gốc sâm</TableHead>
                  <TableHead>Trạng thái</TableHead>
                  <TableHead>Ngày tạo</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {gardens.map((garden) => (
                  <TableRow key={garden.id}>
                    <TableCell className="font-mono text-xs">{garden.code}</TableCell>
                    <TableCell className="font-semibold text-slate-800 dark:text-slate-200">
                      {garden.name}
                    </TableCell>
                    <TableCell className="font-medium">{garden.totalBeds}</TableCell>
                    <TableCell className="text-emerald-600 dark:text-emerald-400 font-medium">
                      {garden.activeBeds}
                    </TableCell>
                    <TableCell className="font-medium">
                      {garden.totalTrees.toLocaleString("vi-VN")} cây
                    </TableCell>
                    <TableCell>
                      <Badge variant={garden.status === "active" ? "default" : "outline"}>
                        {garden.status === "active" ? "Hoạt động" : garden.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground">
                      {new Date(garden.createdAt).toLocaleDateString("vi-VN")}
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
