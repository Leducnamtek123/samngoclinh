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
import { Checkbox } from "@/components/ui/checkbox"
import { Trash2, Pencil, Plus } from "lucide-react"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"

interface Garden {
  id: string
  code: string
  name: string
  status: string
  totalBeds: number
  activeBeds: number
  totalTrees: number
  createdAt: string
  metadata?: any
}

interface GardensTableProps {
  initialGardens: Garden[]
  errorMsg?: string
}

export function GardensTable({ initialGardens, errorMsg: initialError }: GardensTableProps) {
  const [gardens, setGardens] = useState<Garden[]>(initialGardens)
  const [searchQuery, setSearchQuery] = useState("")
  const [errorMsg, setErrorMsg] = useState(initialError || "")
  const [successMsg, setSuccessMsg] = useState("")
  
  // Selection state
  const [selectedGardenIds, setSelectedGardenIds] = useState<string[]>([])
  const [deletingBulk, setDeletingBulk] = useState(false)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  // Dialog state
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [dialogMode, setDialogMode] = useState<"create" | "edit">("create")
  const [selectedGarden, setSelectedGarden] = useState<Garden | null>(null)
  const [dialogLoading, setDialogLoading] = useState(false)
  const [dialogError, setDialogError] = useState("")

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    location: "Kon Tum",
  })

  // Filter logic
  const filteredGardens = gardens.filter((garden) => {
    return garden.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
           garden.code.toLowerCase().includes(searchQuery.toLowerCase())
  })

  const handleToggleSelect = (id: string) => {
    setSelectedGardenIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    )
  }

  const handleToggleAll = () => {
    const allFilteredIds = filteredGardens.map((g) => g.id)
    const isAllSelected = allFilteredIds.every((id) => selectedGardenIds.includes(id))

    if (isAllSelected) {
      setSelectedGardenIds((prev) => prev.filter((id) => !allFilteredIds.includes(id)))
    } else {
      setSelectedGardenIds((prev) => Array.from(new Set([...prev, ...allFilteredIds])))
    }
  }

  const handleOpenCreate = () => {
    setDialogMode("create")
    setSelectedGarden(null)
    setFormData({
      name: "",
      location: "Kon Tum",
    })
    setDialogError("")
    setIsDialogOpen(true)
  }

  const handleOpenEdit = (garden: Garden) => {
    setDialogMode("edit")
    setSelectedGarden(garden)
    setFormData({
      name: garden.name,
      location: garden.metadata?.location || "Kon Tum",
    })
    setDialogError("")
    setIsDialogOpen(true)
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.name.trim()) {
      setDialogError("Tên khu vườn không được để trống")
      return
    }

    setDialogLoading(true)
    setDialogError("")
    setSuccessMsg("")

    try {
      if (dialogMode === "create") {
        const res = await fetchApi("/user/cultivation/gardens", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: formData.name,
            metadata: { location: formData.location },
          }),
        })
        const payload = await res.json()
        if (res.status >= 400) {
          setDialogError(payload?.message || "Không thể tạo khu vườn")
        } else {
          setGardens((prev) => [payload.data, ...prev])
          setSuccessMsg("Đã tạo khu vườn thành công!")
          setIsDialogOpen(false)
        }
      } else if (dialogMode === "edit" && selectedGarden) {
        const res = await fetchApi(`/user/cultivation/gardens/${selectedGarden.id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: formData.name,
            metadata: { ...selectedGarden.metadata, location: formData.location },
          }),
        })
        const payload = await res.json()
        if (res.status >= 400) {
          setDialogError(payload?.message || "Không thể cập nhật khu vườn")
        } else {
          setGardens((prev) =>
            prev.map((g) => (g.id === selectedGarden.id ? payload.data : g))
          )
          setSuccessMsg("Đã cập nhật khu vườn thành công!")
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
    if (!confirm("Bạn có chắc chắn muốn xóa khu vườn này?")) return

    setDeletingId(id)
    setErrorMsg("")
    setSuccessMsg("")

    try {
      const res = await fetchApi(`/user/cultivation/gardens/${id}`, {
        method: "DELETE",
      })
      if (res.status >= 400) {
        const payload = await res.json()
        setErrorMsg(payload?.message || "Không thể xóa khu vườn. Vui lòng kiểm tra xem vườn còn luống không.")
      } else {
        setGardens((prev) => prev.filter((g) => g.id !== id))
        setSuccessMsg("Xóa khu vườn thành công!")
      }
    } catch (err) {
      console.error(err)
      setErrorMsg("Lỗi kết nối máy chủ khi xóa")
    } finally {
      setDeletingId(null)
    }
  }

  const handleBulkDelete = async () => {
    if (selectedGardenIds.length === 0) return
    if (!confirm(`Bạn có chắc chắn muốn xóa ${selectedGardenIds.length} khu vườn đã chọn?`)) return

    setDeletingBulk(true)
    setErrorMsg("")
    setSuccessMsg("")

    let successCount = 0
    let failCount = 0

    await Promise.all(
      selectedGardenIds.map(async (id) => {
        try {
          const res = await fetchApi(`/user/cultivation/gardens/${id}`, {
            method: "DELETE",
          })
          if (res.status < 400) {
            successCount++
          } else {
            failCount++
          }
        } catch (e) {
          failCount++
        }
      })
    )

    if (successCount > 0) {
      setGardens((prev) => prev.filter((g) => !selectedGardenIds.includes(g.id)))
      setSelectedGardenIds([])
      setSuccessMsg(`Đã xóa thành công ${successCount} khu vườn!`)
      if (failCount > 0) {
        setErrorMsg(`Không thể xóa ${failCount} khu vườn vì chúng vẫn còn chứa luống sâm.`)
      }
    } else {
      setErrorMsg("Không thể xóa các khu vườn đã chọn vì chúng vẫn còn chứa luống sâm.")
    }

    setDeletingBulk(false)
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Quản lý khu vườn</h1>
          <p className="text-muted-foreground">
            Quản lý các khu vườn sâm và theo dõi số lượng luống, cây sâm.
          </p>
        </div>
        <Button onClick={handleOpenCreate} className="w-full md:w-auto bg-emerald-600 hover:bg-emerald-700 text-white gap-2">
          <Plus className="h-4 w-4" /> Thêm khu vườn
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
            <CardTitle>Danh sách khu vườn</CardTitle>
            <CardDescription>
              Hiển thị tổng số {filteredGardens.length} khu vườn đang canh tác sâm.
            </CardDescription>
          </div>
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Input
              placeholder="Tìm kiếm vườn..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="max-w-[250px]"
            />
            {selectedGardenIds.length > 0 && (
              <Button
                variant="destructive"
                onClick={handleBulkDelete}
                disabled={deletingBulk}
                className="gap-2 shrink-0"
              >
                <Trash2 className="h-4 w-4" /> Xóa ({selectedGardenIds.length})
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[50px]">
                    <Checkbox
                      checked={
                        filteredGardens.length > 0 &&
                        filteredGardens.every((g) => selectedGardenIds.includes(g.id))
                      }
                      onCheckedChange={handleToggleAll}
                    />
                  </TableHead>
                  <TableHead>Mã vườn</TableHead>
                  <TableHead>Tên khu vườn</TableHead>
                  <TableHead>Vị trí</TableHead>
                  <TableHead>Tổng số luống</TableHead>
                  <TableHead>Luống đang hoạt động</TableHead>
                  <TableHead>Tổng số gốc sâm</TableHead>
                  <TableHead>Trạng thái</TableHead>
                  <TableHead>Ngày tạo</TableHead>
                  <TableHead className="text-right">Thao tác</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredGardens.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={10} className="text-center py-12 text-muted-foreground">
                      Không tìm thấy khu vườn nào.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredGardens.map((garden) => (
                    <TableRow key={garden.id}>
                      <TableCell>
                        <Checkbox
                          checked={selectedGardenIds.includes(garden.id)}
                          onCheckedChange={() => handleToggleSelect(garden.id)}
                        />
                      </TableCell>
                      <TableCell className="font-mono text-xs">{garden.code}</TableCell>
                      <TableCell className="font-semibold text-slate-800 dark:text-slate-200">
                        {garden.name}
                      </TableCell>
                      <TableCell className="text-sm">
                        {garden.metadata?.location || "Kon Tum"}
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
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleOpenEdit(garden)}
                            className="h-8 w-8 text-blue-600 hover:text-blue-700"
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDelete(garden.id)}
                            disabled={deletingId === garden.id}
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
                {dialogMode === "create" ? "Thêm khu vườn mới" : "Chỉnh sửa khu vườn"}
              </DialogTitle>
              <DialogDescription>
                Nhập thông tin chi tiết khu vườn sâm trồng trọt. Nhấn Lưu khi hoàn tất.
              </DialogDescription>
            </DialogHeader>

            {dialogError && (
              <div className="my-3 p-3 bg-destructive/15 text-destructive rounded-md text-xs font-medium">
                {dialogError}
              </div>
            )}

            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="garden-name">Tên khu vườn</Label>
                <Input
                  id="garden-name"
                  value={formData.name}
                  onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                  placeholder="Nhập tên vườn, ví dụ: Vườn Sâm Số 1"
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="garden-location">Vị trí địa lý</Label>
                <Input
                  id="garden-location"
                  value={formData.location}
                  onChange={(e) => setFormData((prev) => ({ ...prev, location: e.target.value }))}
                  placeholder="Kon Tum, Quảng Nam..."
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
