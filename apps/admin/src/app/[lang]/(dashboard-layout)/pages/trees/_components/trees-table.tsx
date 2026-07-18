"use client"

import { useState } from "react"
import { fetchApi } from "@/lib/api"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Trash2, Pencil, Plus } from "lucide-react"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"

interface Tree {
  id: string
  code: string
  name: string
  ageYear: number
  quantity: number
  status: string
  bedCode?: string
  ownerUserId?: string
  carePackageCode?: string
  carePackageExpiredAt?: string
  protectionPackageCode?: string
  protectionPackageExpiredAt?: string
  metadata?: any
}

interface Bed {
  id: string
  code: string
  name: string
}

interface TreesTableProps {
  initialTrees: Tree[]
  beds: Bed[]
  errorMsg?: string
}

export function TreesTable({ initialTrees, beds, errorMsg: initialError }: TreesTableProps) {
  const [trees, setTrees] = useState<Tree[]>(initialTrees)
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  
  const [errorMsg, setErrorMsg] = useState(initialError || "")
  const [successMsg, setSuccessMsg] = useState("")
  const [deletingId, setDeletingId] = useState<string | null>(null)

  // Dialog state
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [dialogMode, setDialogMode] = useState<"create" | "edit">("create")
  const [selectedTree, setSelectedTree] = useState<Tree | null>(null)
  const [dialogLoading, setDialogLoading] = useState(false)
  const [dialogError, setDialogError] = useState("")

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    ageYear: 1,
    quantity: 1,
    bedCode: "none",
    status: "active",
    healthStatus: "Tốt",
  })

  // Filter logic
  const filteredTrees = trees.filter((tree) => {
    const matchesSearch = tree.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          tree.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          (tree.ownerUserId && tree.ownerUserId.toLowerCase().includes(searchQuery.toLowerCase()))
    const matchesStatus = statusFilter === "all" || tree.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const handleOpenCreate = () => {
    setDialogMode("create")
    setSelectedTree(null)
    setFormData({
      name: "Sâm Ngọc Linh",
      ageYear: 3,
      quantity: 10,
      bedCode: beds[0]?.code || "none",
      status: "active",
      healthStatus: "Tốt",
    })
    setDialogError("")
    setIsDialogOpen(true)
  }

  const handleOpenEdit = (tree: Tree) => {
    setDialogMode("edit")
    setSelectedTree(tree)
    setFormData({
      name: tree.name,
      ageYear: tree.ageYear,
      quantity: tree.quantity,
      bedCode: tree.bedCode || "none",
      status: tree.status,
      healthStatus: tree.metadata?.healthStatus || "Tốt",
    })
    setDialogError("")
    setIsDialogOpen(true)
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.name.trim()) {
      setDialogError("Tên cây giống không được để trống")
      return
    }

    setDialogLoading(true)
    setDialogError("")
    setSuccessMsg("")

    try {
      if (dialogMode === "create") {
        const payload: any = {
          name: formData.name,
          ageYear: Number(formData.ageYear),
          quantity: Number(formData.quantity),
          metadata: { healthStatus: formData.healthStatus },
        }
        if (formData.bedCode !== "none") {
          payload.bedCode = formData.bedCode
        }

        const res = await fetchApi("/user/cultivation/trees", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        })
        const dataPayload = await res.json()
        if (res.status >= 400) {
          setDialogError(dataPayload?.message || "Không thể thêm cây giống")
        } else {
          setTrees((prev) => [dataPayload.data, ...prev])
          setSuccessMsg("Đã trồng thêm cây giống mới thành công!")
          setIsDialogOpen(false)
        }
      } else if (dialogMode === "edit" && selectedTree) {
        const payload: any = {
          name: formData.name,
          ageYear: Number(formData.ageYear),
          quantity: Number(formData.quantity),
          status: formData.status,
          metadata: { ...selectedTree.metadata, healthStatus: formData.healthStatus },
        }

        const res = await fetchApi(`/user/cultivation/trees/${selectedTree.id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        })
        const dataPayload = await res.json()
        if (res.status >= 400) {
          setDialogError(dataPayload?.message || "Không thể cập nhật cây giống")
        } else {
          setTrees((prev) =>
            prev.map((t) => (t.id === selectedTree.id ? dataPayload.data : t))
          )
          setSuccessMsg("Cập nhật cây trồng thành công!")
          setIsDialogOpen(false)
        }
      }
    } catch (err) {
      console.error(err)
      setDialogError("Lỗi kết nối đến máy chủ")
    } finally {
      setDialogLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Bạn có chắc chắn muốn xóa cây trồng này khỏi hệ thống?")) return

    setDeletingId(id)
    setErrorMsg("")
    setSuccessMsg("")

    try {
      const res = await fetchApi(`/user/cultivation/trees/${id}`, {
        method: "DELETE",
      })
      if (res.status >= 400) {
        const payload = await res.json()
        setErrorMsg(payload?.message || "Không thể xóa cây trồng")
      } else {
        setTrees((prev) => prev.filter((t) => t.id !== id))
        setSuccessMsg("Đã xóa cây trồng thành công!")
      }
    } catch (err) {
      console.error(err)
      setErrorMsg("Lỗi kết nối máy chủ khi xóa")
    } finally {
      setDeletingId(null)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Quản lý Cây trồng thực tế</h1>
          <p className="text-muted-foreground">
            Theo dõi chi tiết số lượng, tuổi, trạng thái sinh trưởng của các gốc sâm đã trồng trong các luống.
          </p>
        </div>
        <Button onClick={handleOpenCreate} className="w-full md:w-auto bg-emerald-600 hover:bg-emerald-700 text-white gap-2">
          <Plus className="h-4 w-4" /> Trồng cây mới
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

      <Card className="border-slate-200 shadow-sm dark:border-slate-800">
        <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4">
          <div>
            <CardTitle>Danh sách gốc sâm trong hệ thống</CardTitle>
            <CardDescription>
              Tổng số {filteredTrees.length} lô gốc sâm đang được theo dõi chăm sóc.
            </CardDescription>
          </div>
          <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
            <Input
              placeholder="Tìm kiếm cây, mã cây, chủ sở hữu..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="max-w-[250px]"
            />
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Trạng thái" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả trạng thái</SelectItem>
                <SelectItem value="active">Đang trồng (Active)</SelectItem>
                <SelectItem value="harvested">Đã thu hoạch</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Mã cây</TableHead>
                  <TableHead>Tên cây giống</TableHead>
                  <TableHead>Mã Luống</TableHead>
                  <TableHead>Tuổi sâm</TableHead>
                  <TableHead>Số lượng gốc</TableHead>
                  <TableHead>Chủ sở hữu</TableHead>
                  <TableHead>Sức khỏe</TableHead>
                  <TableHead>Gói Chăm Sóc</TableHead>
                  <TableHead>Gói Bảo Vệ</TableHead>
                  <TableHead>Trạng thái</TableHead>
                  <TableHead className="text-right">Thao tác</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTrees.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={11} className="text-center py-12 text-muted-foreground">
                      Không tìm thấy cây trồng nào trong hệ thống.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredTrees.map((tree) => (
                    <TableRow key={tree.id}>
                      <TableCell className="font-mono text-xs font-semibold">{tree.code}</TableCell>
                      <TableCell className="font-semibold text-slate-800 dark:text-slate-200">
                        {tree.name}
                      </TableCell>
                      <TableCell className="font-mono text-xs">
                        {tree.bedCode ? (
                          <Badge variant="secondary" className="font-mono text-xs">
                            {tree.bedCode}
                          </Badge>
                        ) : (
                          <span className="text-muted-foreground text-xs">— Chưa gán luống —</span>
                        )}
                      </TableCell>
                      <TableCell className="font-medium">{tree.ageYear} tuổi</TableCell>
                      <TableCell className="font-semibold text-slate-700 dark:text-slate-300">
                        {tree.quantity} gốc
                      </TableCell>
                      <TableCell className="font-mono text-xs truncate max-w-[120px]" title={tree.ownerUserId}>
                        {tree.ownerUserId || "Hệ thống"}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                          {tree.metadata?.healthStatus || "Tốt"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-xs">
                        {tree.carePackageCode ? (
                          <div className="flex flex-col gap-0.5">
                            <span className="font-semibold text-emerald-700">{tree.carePackageCode}</span>
                            {tree.carePackageExpiredAt && (
                              <span className="text-[10px] text-muted-foreground">
                                Hết hạn: {new Date(tree.carePackageExpiredAt).toLocaleDateString("vi-VN")}
                              </span>
                            )}
                          </div>
                        ) : (
                          <span className="text-muted-foreground text-xs">Chưa đăng ký</span>
                        )}
                      </TableCell>
                      <TableCell className="text-xs">
                        {tree.protectionPackageCode ? (
                          <div className="flex flex-col gap-0.5">
                            <span className="font-semibold text-indigo-700">{tree.protectionPackageCode}</span>
                            {tree.protectionPackageExpiredAt && (
                              <span className="text-[10px] text-muted-foreground">
                                Hết hạn: {new Date(tree.protectionPackageExpiredAt).toLocaleDateString("vi-VN")}
                              </span>
                            )}
                          </div>
                        ) : (
                          <span className="text-muted-foreground text-xs">Chưa đăng ký</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <Badge variant={tree.status === "active" ? "default" : "outline"}>
                          {tree.status === "active" ? "Đang trồng" : tree.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleOpenEdit(tree)}
                            className="h-8 w-8 text-blue-600 hover:text-blue-700"
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDelete(tree.id)}
                            disabled={deletingId === tree.id}
                            className="h-8 w-8 text-destructive hover:text-destructive/90"
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

      {/* Create / Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <form onSubmit={handleSave}>
            <DialogHeader>
              <DialogTitle>
                {dialogMode === "create" ? "Trồng thêm cây giống" : "Cập nhật thông tin cây trồng"}
              </DialogTitle>
              <DialogDescription>
                Nhập thông số chi tiết cây trồng. Lô cây sẽ được gán vào cơ sở dữ liệu trồng trọt.
              </DialogDescription>
            </DialogHeader>

            {dialogError && (
              <div className="my-3 p-3 bg-destructive/15 text-destructive rounded-md text-xs font-medium">
                {dialogError}
              </div>
            )}

            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="tree-name">Tên cây giống</Label>
                <Input
                  id="tree-name"
                  value={formData.name}
                  onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                  placeholder="Nhập tên cây sâm, ví dụ: Sâm Ngọc Linh Trà My"
                  required
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="tree-age">Độ tuổi (năm tuổi)</Label>
                <Input
                  id="tree-age"
                  type="number"
                  value={formData.ageYear}
                  onChange={(e) => setFormData((prev) => ({ ...prev, ageYear: Number(e.target.value) }))}
                  min={0}
                  required
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="tree-quantity">Số lượng gốc</Label>
                <Input
                  id="tree-quantity"
                  type="number"
                  value={formData.quantity}
                  onChange={(e) => setFormData((prev) => ({ ...prev, quantity: Number(e.target.value) }))}
                  min={1}
                  required
                />
              </div>

              {dialogMode === "create" && (
                <div className="grid gap-2">
                  <Label htmlFor="tree-bedCode">Gán vào luống</Label>
                  <Select
                    value={formData.bedCode}
                    onValueChange={(val) => setFormData((prev) => ({ ...prev, bedCode: val }))}
                  >
                    <SelectTrigger id="tree-bedCode">
                      <SelectValue placeholder="Chọn luống trồng" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">— Không gán luống (Trống) —</SelectItem>
                      {beds.map((bed) => (
                        <SelectItem key={bed.id} value={bed.code}>
                          {bed.name} ({bed.code})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              {dialogMode === "edit" && (
                <div className="grid gap-2">
                  <Label htmlFor="tree-status">Trạng thái sinh trưởng</Label>
                  <Select
                    value={formData.status}
                    onValueChange={(val) => setFormData((prev) => ({ ...prev, status: val }))}
                  >
                    <SelectTrigger id="tree-status">
                      <SelectValue placeholder="Chọn trạng thái" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Đang sinh trưởng (Active)</SelectItem>
                      <SelectItem value="harvested">Đã thu hoạch (Harvested)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}

              <div className="grid gap-2">
                <Label htmlFor="tree-health">Tình trạng sức khỏe</Label>
                <Select
                  value={formData.healthStatus}
                  onValueChange={(val) => setFormData((prev) => ({ ...prev, healthStatus: val }))}
                >
                  <SelectTrigger id="tree-health">
                    <SelectValue placeholder="Chọn tình trạng sức khỏe" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Tốt">Tốt (Khỏe mạnh)</SelectItem>
                    <SelectItem value="Bình thường">Bình thường</SelectItem>
                    <SelectItem value="Cần theo dõi">Cần theo dõi sát (Kém)</SelectItem>
                    <SelectItem value="Sâu bệnh">Bị nhiễm sâu bệnh</SelectItem>
                  </SelectContent>
                </Select>
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
