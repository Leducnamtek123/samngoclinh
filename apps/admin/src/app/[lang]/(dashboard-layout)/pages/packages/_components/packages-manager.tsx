"use client"

import { useState } from "react"
import { fetchApi } from "@/lib/api"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Plus, Pencil, Trash2 } from "lucide-react"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface CarePackage {
  id: string
  code: string
  name: string
  price: number
  description?: string
  durationMonths: number
  status: string
}

interface ProtectionPackage {
  id: string
  code: string
  name: string
  price: number
  description?: string
  coverage?: string
  status: string
}

interface PackagesManagerProps {
  initialCarePackages: CarePackage[]
  initialProtectionPackages: ProtectionPackage[]
  errorMsg?: string
}

export function PackagesManager({
  initialCarePackages,
  initialProtectionPackages,
  errorMsg: initialError,
}: PackagesManagerProps) {
  const [activeTab, setActiveTab] = useState<"care" | "protection">("care")
  const [carePackages, setCarePackages] = useState<CarePackage[]>(initialCarePackages)
  const [protectionPackages, setProtectionPackages] = useState<ProtectionPackage[]>(initialProtectionPackages)

  const [errorMsg, setErrorMsg] = useState(initialError || "")
  const [successMsg, setSuccessMsg] = useState("")

  // Dialog State
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [dialogLoading, setDialogLoading] = useState(false)
  const [dialogError, setDialogError] = useState("")
  const [selectedPackage, setSelectedPackage] = useState<any | null>(null)
  const [dialogMode, setDialogMode] = useState<"create" | "edit">("create")

  // Form State
  const [formData, setFormData] = useState({
    code: "",
    name: "",
    price: 0,
    durationMonths: 12,
    coverage: "",
    description: "",
    status: "active",
  })

  const formatVND = (price: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price)
  }

  const handleOpenCreate = () => {
    setDialogMode("create")
    setSelectedPackage(null)
    setFormData({
      code: "",
      name: "",
      price: 100000,
      durationMonths: 12,
      coverage: "",
      description: "",
      status: "active",
    })
    setDialogError("")
    setIsDialogOpen(true)
  }

  const handleOpenEdit = (pkg: any) => {
    setDialogMode("edit")
    setSelectedPackage(pkg)
    setFormData({
      code: pkg.code,
      name: pkg.name,
      price: pkg.price,
      durationMonths: pkg.durationMonths || 12,
      coverage: pkg.coverage || "",
      description: pkg.description || "",
      status: pkg.status,
    })
    setDialogError("")
    setIsDialogOpen(true)
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.code.trim() || !formData.name.trim()) {
      setDialogError("Mã và tên gói không được để trống")
      return
    }

    setDialogLoading(true)
    setDialogError("")
    setSuccessMsg("")

    try {
      const endpoint = activeTab === "care" ? "/admin/packages/care" : "/admin/packages/protection"
      const bodyPayload: any = {
        code: formData.code,
        name: formData.name,
        price: Number(formData.price),
        description: formData.description || undefined,
        status: formData.status,
      }

      if (activeTab === "care") {
        bodyPayload.durationMonths = Number(formData.durationMonths)
      } else {
        bodyPayload.coverage = formData.coverage || undefined
      }

      if (dialogMode === "create") {
        const res = await fetchApi(endpoint, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(bodyPayload),
        })
        const payload = await res.json()
        if (res.status >= 400) {
          setDialogError(payload?.message || "Không thể tạo gói dịch vụ")
        } else {
          if (activeTab === "care") {
            setCarePackages((prev) => [payload.data, ...prev])
          } else {
            setProtectionPackages((prev) => [payload.data, ...prev])
          }
          setSuccessMsg("Tạo gói dịch vụ thành công!")
          setIsDialogOpen(false)
        }
      } else if (dialogMode === "edit" && selectedPackage) {
        const res = await fetchApi(`${endpoint}/${selectedPackage.id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(bodyPayload),
        })
        const payload = await res.json()
        if (res.status >= 400) {
          setDialogError(payload?.message || "Không thể cập nhật gói dịch vụ")
        } else {
          if (activeTab === "care") {
            setCarePackages((prev) =>
              prev.map((item) => (item.id === selectedPackage.id ? payload.data : item))
            )
          } else {
            setProtectionPackages((prev) =>
              prev.map((item) => (item.id === selectedPackage.id ? payload.data : item))
            )
          }
          setSuccessMsg("Cập nhật gói dịch vụ thành công!")
          setIsDialogOpen(false)
        }
      }
    } catch (err) {
      console.error(err)
      setDialogError("Lỗi kết nối máy chủ")
    } finally {
      setDialogLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Bạn có chắc chắn muốn xóa gói dịch vụ này?")) return

    setErrorMsg("")
    setSuccessMsg("")

    try {
      const endpoint = activeTab === "care" ? `/admin/packages/care/${id}` : `/admin/packages/protection/${id}`
      const res = await fetchApi(endpoint, {
        method: "DELETE",
      })
      if (res.status >= 400) {
        const payload = await res.json()
        setErrorMsg(payload?.message || "Không thể xóa gói dịch vụ này.")
      } else {
        if (activeTab === "care") {
          setCarePackages((prev) => prev.filter((item) => item.id !== id))
        } else {
          setProtectionPackages((prev) => prev.filter((item) => item.id !== id))
        }
        setSuccessMsg("Đã xóa gói dịch vụ thành công!")
      }
    } catch (err) {
      console.error(err)
      setErrorMsg("Lỗi hệ thống khi thực hiện xóa.")
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Quản lý Gói dịch vụ</h1>
          <p className="text-muted-foreground">
            Cấu hình các gói chăm sóc định kỳ và bảo hiểm/bảo vệ cây giống sâm.
          </p>
        </div>
        <Button onClick={handleOpenCreate} className="w-full md:w-auto bg-emerald-600 hover:bg-emerald-700 text-white gap-2">
          <Plus className="h-4 w-4" /> Thêm gói mới
        </Button>
      </div>

      {successMsg && (
        <Alert className="bg-emerald-50 text-emerald-800 border-emerald-200">
          <AlertTitle>Thành công</AlertTitle>
          <AlertDescription>{successMsg}</AlertDescription>
        </Alert>
      )}

      {errorMsg && (
        <Alert variant="destructive">
          <AlertTitle>Lỗi</AlertTitle>
          <AlertDescription>{errorMsg}</AlertDescription>
        </Alert>
      )}

      <Tabs
        defaultValue="care"
        onValueChange={(val) => {
          setActiveTab(val as any)
          setErrorMsg("")
          setSuccessMsg("")
        }}
        className="w-full"
      >
        <TabsList className="grid w-full sm:w-[400px] grid-cols-2 mb-4">
          <TabsTrigger value="care">Gói Chăm Sóc</TabsTrigger>
          <TabsTrigger value="protection">Gói Bảo Vệ</TabsTrigger>
        </TabsList>

        <TabsContent value="care">
          <Card className="border-slate-200 shadow-sm dark:border-slate-800">
            <CardHeader>
              <CardTitle>Gói Chăm Sóc Định Kỳ</CardTitle>
              <CardDescription>
                Cung cấp phân bón, tưới nước và chăm sóc sâm theo định kỳ tháng.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Mã gói</TableHead>
                      <TableHead>Tên gói dịch vụ</TableHead>
                      <TableHead>Đơn giá</TableHead>
                      <TableHead>Thời hạn</TableHead>
                      <TableHead>Mô tả</TableHead>
                      <TableHead>Trạng thái</TableHead>
                      <TableHead className="text-right">Thao tác</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {carePackages.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                          Chưa có gói chăm sóc nào.
                        </TableCell>
                      </TableRow>
                    ) : (
                      carePackages.map((pkg) => (
                        <TableRow key={pkg.id}>
                          <TableCell className="font-mono text-xs font-semibold">{pkg.code}</TableCell>
                          <TableCell className="font-semibold text-slate-800 dark:text-slate-200">
                            {pkg.name}
                          </TableCell>
                          <TableCell className="font-medium text-emerald-600">
                            {formatVND(pkg.price)}
                          </TableCell>
                          <TableCell>{pkg.durationMonths} tháng</TableCell>
                          <TableCell className="text-sm max-w-[200px] truncate">
                            {pkg.description || "—"}
                          </TableCell>
                          <TableCell>
                            <Badge variant={pkg.status === "active" ? "default" : "outline"}>
                              {pkg.status === "active" ? "Hoạt động" : "Tạm ngưng"}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex items-center justify-end gap-2">
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleOpenEdit(pkg)}
                                className="h-8 w-8 text-blue-600"
                              >
                                <Pencil className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleDelete(pkg.id)}
                                className="h-8 w-8 text-destructive"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="protection">
          <Card className="border-slate-200 shadow-sm dark:border-slate-800">
            <CardHeader>
              <CardTitle>Gói Bảo Vệ & Bảo Hiểm Cây</CardTitle>
              <CardDescription>
                Bảo vệ cây giống trước dịch bệnh, rủi ro thiên tai và bồi thường.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Mã gói</TableHead>
                      <TableHead>Tên gói bảo vệ</TableHead>
                      <TableHead>Đơn giá</TableHead>
                      <TableHead>Phạm vi bảo hiểm</TableHead>
                      <TableHead>Mô tả</TableHead>
                      <TableHead>Trạng thái</TableHead>
                      <TableHead className="text-right">Thao tác</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {protectionPackages.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                          Chưa có gói bảo vệ nào.
                        </TableCell>
                      </TableRow>
                    ) : (
                      protectionPackages.map((pkg) => (
                        <TableRow key={pkg.id}>
                          <TableCell className="font-mono text-xs font-semibold">{pkg.code}</TableCell>
                          <TableCell className="font-semibold text-slate-800 dark:text-slate-200">
                            {pkg.name}
                          </TableCell>
                          <TableCell className="font-medium text-emerald-600">
                            {formatVND(pkg.price)}
                          </TableCell>
                          <TableCell className="text-sm">{pkg.coverage || "—"}</TableCell>
                          <TableCell className="text-sm max-w-[200px] truncate">
                            {pkg.description || "—"}
                          </TableCell>
                          <TableCell>
                            <Badge variant={pkg.status === "active" ? "default" : "outline"}>
                              {pkg.status === "active" ? "Hoạt động" : "Tạm ngưng"}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex items-center justify-end gap-2">
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleOpenEdit(pkg)}
                                className="h-8 w-8 text-blue-600"
                              >
                                <Pencil className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleDelete(pkg.id)}
                                className="h-8 w-8 text-destructive"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Create / Edit Modal Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <form onSubmit={handleSave}>
            <DialogHeader>
              <DialogTitle>
                {dialogMode === "create" ? "Thêm gói dịch vụ mới" : "Chỉnh sửa gói dịch vụ"}
              </DialogTitle>
              <DialogDescription>
                Nhập thông số cho gói {activeTab === "care" ? "chăm sóc định kỳ" : "bảo hiểm cây sâm"}.
              </DialogDescription>
            </DialogHeader>

            {dialogError && (
              <div className="my-3 p-3 bg-destructive/15 text-destructive rounded-md text-xs font-medium">
                {dialogError}
              </div>
            )}

            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="pkg-code">Mã gói dịch vụ</Label>
                <Input
                  id="pkg-code"
                  value={formData.code}
                  onChange={(e) => setFormData((prev) => ({ ...prev, code: e.target.value }))}
                  placeholder="Ví dụ: CARE_GOLD, PROT_MAX"
                  disabled={dialogMode === "edit"}
                  required
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="pkg-name">Tên gói dịch vụ</Label>
                <Input
                  id="pkg-name"
                  value={formData.name}
                  onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                  placeholder="Ví dụ: Gói Chăm Sóc Vàng"
                  required
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="pkg-price">Giá tiền (VND)</Label>
                <Input
                  id="pkg-price"
                  type="number"
                  value={formData.price}
                  onChange={(e) => setFormData((prev) => ({ ...prev, price: Number(e.target.value) }))}
                  min={0}
                  required
                />
              </div>

              {activeTab === "care" ? (
                <div className="grid gap-2">
                  <Label htmlFor="pkg-duration">Thời hạn gói (tháng)</Label>
                  <Input
                    id="pkg-duration"
                    type="number"
                    value={formData.durationMonths}
                    onChange={(e) => setFormData((prev) => ({ ...prev, durationMonths: Number(e.target.value) }))}
                    min={1}
                    required
                  />
                </div>
              ) : (
                <div className="grid gap-2">
                  <Label htmlFor="pkg-coverage">Phạm vi bảo vệ / bồi thường</Label>
                  <Input
                    id="pkg-coverage"
                    value={formData.coverage}
                    onChange={(e) => setFormData((prev) => ({ ...prev, coverage: e.target.value }))}
                    placeholder="Ví dụ: Bồi thường 100% khi cây chết"
                  />
                </div>
              )}

              <div className="grid gap-2">
                <Label htmlFor="pkg-status">Trạng thái hoạt động</Label>
                <Select
                  value={formData.status}
                  onValueChange={(val) => setFormData((prev) => ({ ...prev, status: val }))}
                >
                  <SelectTrigger id="pkg-status">
                    <SelectValue placeholder="Chọn trạng thái" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Hoạt động (Active)</SelectItem>
                    <SelectItem value="inactive">Tạm ngưng (Inactive)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="pkg-desc">Mô tả dịch vụ</Label>
                <Textarea
                  id="pkg-desc"
                  value={formData.description}
                  onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                  placeholder="Mô tả chi tiết quyền lợi dịch vụ..."
                  rows={3}
                />
              </div>
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsDialogOpen(false)}
                disabled={dialogLoading}
              >
                Hủy
              </Button>
              <Button type="submit" disabled={dialogLoading} className="bg-emerald-600 hover:bg-emerald-700 text-white">
                {dialogLoading ? "Đang lưu..." : "Lưu thay đổi"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
