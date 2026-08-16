"use client"

import React, { useState } from "react"
import { toast } from "sonner"
import { Droplets, Plus, RefreshCw, Sprout, Thermometer } from "lucide-react"

import { useApiMutation } from "@/hooks/use-api-mutation"
import { useApiQuery } from "@/hooks/use-api-query"
import { Pagination } from "@/components/ui/app-pagination"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Textarea } from "@/components/ui/textarea"
import { RoleGuard } from "@/components/guards/rbac-guard"

interface CareLog {
  id: string
  gardenId?: string
  gardenName?: string
  bedCode?: string
  treeCode?: string
  activityType?: string
  action?: string
  description?: string
  notes?: string
  temperature?: number
  humidity?: number
  createdAt: string
  performedBy?: string
}

const formatDateTimeVi = (dateStr?: string) => {
  if (!dateStr) return "—"
  try {
    const d = new Date(dateStr)
    if (isNaN(d.getTime())) return "—"
    const day = String(d.getDate()).padStart(2, "0")
    const month = String(d.getMonth() + 1).padStart(2, "0")
    const year = d.getFullYear()
    const hours = String(d.getHours()).padStart(2, "0")
    const minutes = String(d.getMinutes()).padStart(2, "0")
    return `${hours}:${minutes} ${day}/${month}/${year}`
  } catch {
    return "—"
  }
}

export default function CareLogsPage() {
  const [isOpen, setIsOpen] = useState(false)
  const [formData, setFormData] = useState({
    treeCode: "",
    bedCode: "",
    action: "Tưới nước & Đánh giá sức khỏe",
    description: "",
    temperature: "22",
    humidity: "85",
  })

  const [page, setPage] = useState(1)
  const perPage = 10

  const {
    data: response,
    isLoading,
    isError,
    refetch,
  } = useApiQuery<any>(
    ["care-logs", page],
    `/user/cultivation/logs?page=${page}&perPage=${perPage}`
  )

  const mutation = useApiMutation()

  const rawData = response?.data
  const careLogs: CareLog[] = Array.isArray(rawData)
    ? rawData
    : Array.isArray(rawData?.items)
      ? rawData.items
      : []
  const metadata = response?.metadata || response?.data?.metadata || null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (mutation.isPending) return
    try {
      await mutation.mutateAsync({
        endpoint: "/user/cultivation/logs",
        data: {
          ...formData,
          temperature: parseFloat(formData.temperature),
          humidity: parseFloat(formData.humidity),
        },
        method: "POST",
      })
      toast.success("Nhập nhật ký chăm sóc thành công")
      setIsOpen(false)
      refetch()
    } catch (error: any) {
      toast.error(error?.message || "Có lỗi xảy ra khi lưu nhật ký")
    }
  }

  return (
    <RoleGuard allowedRoles={["SUPER_ADMIN", "ADMIN"]}>
      <div className="container mx-auto p-4 md:p-6 space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
              <Sprout className="w-6 h-6 text-emerald-600" />
              Nhật ký Chăm sóc Sâm Ngọc Linh
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              Ghi nhận các hoạt động tưới nước, bón phân, đo đạc thông số môi
              trường từ REST API
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => refetch()}
              className="gap-2"
            >
              <RefreshCw className="w-4 h-4" /> Làm mới
            </Button>
            <Dialog open={isOpen} onOpenChange={setIsOpen}>
              <DialogTrigger asChild>
                <Button className="bg-emerald-600 hover:bg-emerald-700 text-white gap-2">
                  <Plus className="w-4 h-4" /> Nhập Nhật ký Mới
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                  <DialogTitle>Nhập Nhật ký Chăm sóc Sâm</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4 pt-2">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Mã Cây (Tree Code)</Label>
                      <Input
                        placeholder="VD: TREE-001"
                        value={formData.treeCode}
                        onChange={(e) =>
                          setFormData({ ...formData, treeCode: e.target.value })
                        }
                      />
                    </div>
                    <div>
                      <Label>Mã Luống (Bed Code)</Label>
                      <Input
                        placeholder="VD: BED-01"
                        value={formData.bedCode}
                        onChange={(e) =>
                          setFormData({ ...formData, bedCode: e.target.value })
                        }
                      />
                    </div>
                  </div>
                  <div>
                    <Label>Tên / Loại hoạt động</Label>
                    <Input
                      placeholder="Tưới nước, Bón phân, Kiểm tra sâu bệnh..."
                      value={formData.action}
                      onChange={(e) =>
                        setFormData({ ...formData, action: e.target.value })
                      }
                      required
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Nhiệt độ (°C)</Label>
                      <Input
                        type="number"
                        step="0.1"
                        value={formData.temperature}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            temperature: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div>
                      <Label>Độ ẩm (%)</Label>
                      <Input
                        type="number"
                        step="0.1"
                        value={formData.humidity}
                        onChange={(e) =>
                          setFormData({ ...formData, humidity: e.target.value })
                        }
                      />
                    </div>
                  </div>
                  <div>
                    <Label>Mô tả chi tiết</Label>
                    <Textarea
                      placeholder="Ghi chú thêm về quy trình thực hiện, tình trạng sức khỏe của sâm..."
                      value={formData.description}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          description: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div className="flex justify-end gap-2 pt-2">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setIsOpen(false)}
                    >
                      Hủy
                    </Button>
                    <Button
                      type="submit"
                      className="bg-emerald-600 hover:bg-emerald-700 text-white"
                      disabled={mutation.isPending}
                    >
                      {mutation.isPending ? "Đang lưu..." : "Lưu nhật ký"}
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-base font-semibold">
              Lịch sử Nhật ký Chăm sóc Thực tế
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="py-8 text-center text-sm text-muted-foreground">
                Đang tải nhật ký từ API...
              </div>
            ) : isError ? (
              <div className="py-8 text-center text-sm text-destructive">
                Không thể kết nối đến máy chủ API NestJS.
              </div>
            ) : careLogs.length === 0 ? (
              <div className="py-8 text-center text-sm text-muted-foreground">
                Chưa có nhật ký chăm sóc nào được tạo. Nhấn "Nhập Nhật ký Mới"
                để tạo nhật ký đầu tiên!
              </div>
            ) : (
              <>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Mã Cây / Luống</TableHead>
                      <TableHead>Hoạt Động</TableHead>
                      <TableHead>Thông Số Môi Trường</TableHead>
                      <TableHead>Mô Tả</TableHead>
                      <TableHead>Thời Gian</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {careLogs.map((log) => (
                      <TableRow key={log.id}>
                        <TableCell className="font-medium">
                          {log.treeCode ||
                            log.bedCode ||
                            log.gardenName ||
                            log.id}
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant="secondary"
                            className="bg-emerald-100 text-emerald-800 border-emerald-200"
                          >
                            {log.action ||
                              log.activityType ||
                              "Chăm sóc định kỳ"}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-3 text-xs text-muted-foreground">
                            {log.temperature && (
                              <span className="flex items-center gap-1">
                                <Thermometer className="w-3.5 h-3.5 text-amber-500" />{" "}
                                {log.temperature}°C
                              </span>
                            )}
                            {log.humidity && (
                              <span className="flex items-center gap-1">
                                <Droplets className="w-3.5 h-3.5 text-blue-500" />{" "}
                                {log.humidity}%
                              </span>
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="max-w-md text-sm">
                          {log.description || log.notes || "—"}
                        </TableCell>
                        <TableCell className="text-xs text-muted-foreground">
                          {formatDateTimeVi(log.createdAt)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                <Pagination
                  metadata={metadata}
                  onPageChange={(p) => setPage(p)}
                />
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </RoleGuard>
  )
}
