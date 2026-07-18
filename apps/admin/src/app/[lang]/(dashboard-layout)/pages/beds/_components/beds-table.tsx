"use client"

import { useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { fetchApi } from "@/lib/api"
import type { LocaleType } from "@/types"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Trash2, Pencil, Eye, EyeOff, Plus, LayoutGrid } from "lucide-react"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"

interface Bed {
  id: string
  code: string
  gardenCode: string
  name: string
  ageYear: number
  treeCount: number
  status: string
  createdAt: string
}

interface CultivationBedLocation {
  id: string
  code: string
  bedCode: string
  row: number
  col: number
  status: string
  treeCode?: string
}

interface Tree {
  id: string
  code: string
  name: string
  quantity: number
}

interface Garden {
  id: string
  code: string
  name: string
}

interface BedsTableProps {
  initialBeds: Bed[]
  gardens: Garden[]
  errorMsg?: string
}

export function BedsTable({ initialBeds, gardens, errorMsg: initialError }: BedsTableProps) {
  const router = useRouter()
  const params = useParams()
  const locale = params.lang as LocaleType

  const [beds, setBeds] = useState<Bed[]>(initialBeds)
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [errorMsg, setErrorMsg] = useState(initialError || "")
  const [successMsg, setSuccessMsg] = useState("")
  const [deletingId, setDeletingId] = useState<string | null>(null)

  // Selection state
  const [selectedBedIds, setSelectedBedIds] = useState<string[]>([])
  const [deletingBulk, setDeletingBulk] = useState(false)

  // Dialog state
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [dialogMode, setDialogMode] = useState<"create" | "edit">("create")
  const [selectedBed, setSelectedBed] = useState<Bed | null>(null)
  const [dialogLoading, setDialogLoading] = useState(false)
  const [dialogError, setDialogError] = useState("")

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    gardenCode: gardens[0]?.code || "",
    ageYear: 1,
    treeCount: 50,
  })

  // Bed Locations Grid state
  const [isGridOpen, setIsGridOpen] = useState(false)
  const [selectedBedForGrid, setSelectedBedForGrid] = useState<Bed | null>(null)
  const [locations, setLocations] = useState<CultivationBedLocation[]>([])
  const [loadingGrid, setLoadingGrid] = useState(false)
  const [gridRows, setGridRows] = useState(5)
  const [gridCols, setGridCols] = useState(10)
  const [trees, setTrees] = useState<Tree[]>([])
  
  // Edit Location state
  const [selectedLocationForEdit, setSelectedLocationForEdit] = useState<CultivationBedLocation | null>(null)
  const [editLocationStatus, setEditLocationStatus] = useState("empty")
  const [editLocationTreeCode, setEditLocationTreeCode] = useState("none")
  const [savingLocation, setSavingLocation] = useState(false)

  const openGridDialog = async (bed: Bed) => {
    setSelectedBedForGrid(bed)
    setIsGridOpen(true)
    setLoadingGrid(true)
    setLocations([])
    setSelectedLocationForEdit(null)

    try {
      // 1. Fetch locations
      const locRes = await fetchApi(`/user/cultivation/beds/${bed.code}/locations`)
      const locPayload = await locRes.json()
      if (locRes.status < 400 && Array.isArray(locPayload.data)) {
        setLocations(locPayload.data)
      }

      // 2. Fetch trees
      const treeRes = await fetchApi("/user/cultivation/trees/admin-list")
      const treePayload = await treeRes.json()
      if (treeRes.status < 400 && Array.isArray(treePayload.data)) {
        setTrees(treePayload.data)
      }
    } catch (e) {
      console.error("Error loading grid locations:", e)
    } finally {
      setLoadingGrid(false)
    }
  }

  const handleGenerateGrid = async () => {
    if (!selectedBedForGrid) return
    setLoadingGrid(true)
    try {
      const res = await fetchApi(`/user/cultivation/beds/${selectedBedForGrid.code}/locations/generate`, {
        method: "POST",
        body: JSON.stringify({
          rows: gridRows,
          cols: gridCols,
        }),
      })
      if (res.status < 400) {
        // Reload locations
        const locRes = await fetchApi(`/user/cultivation/beds/${selectedBedForGrid.code}/locations`)
        const locPayload = await locRes.json()
        if (locRes.status < 400 && Array.isArray(locPayload.data)) {
          setLocations(locPayload.data)
        }
      } else {
        alert("Không thể khởi tạo lưới vị trí.")
      }
    } catch (e) {
      console.error(e)
    } finally {
      setLoadingGrid(false)
    }
  }

  const handleOpenEditLocation = (loc: CultivationBedLocation) => {
    setSelectedLocationForEdit(loc)
    setEditLocationStatus(loc.status)
    setEditLocationTreeCode(loc.treeCode || "none")
  }

  const handleSaveLocation = async () => {
    if (!selectedLocationForEdit) return
    setSavingLocation(true)
    try {
      const res = await fetchApi(`/user/cultivation/beds/locations/${selectedLocationForEdit.id}`, {
        method: "PUT",
        body: JSON.stringify({
          status: editLocationStatus,
          treeCode: editLocationTreeCode === "none" ? null : editLocationTreeCode,
        }),
      })
      if (res.status < 400) {
        const payload = await res.json()
        setLocations((prev) =>
          prev.map((l) => (l.id === selectedLocationForEdit.id ? payload.data : l))
        )
        setSelectedLocationForEdit(null)
      } else {
        alert("Không thể cập nhật vị trí.")
      }
    } catch (e) {
      console.error(e)
    } finally {
      setSavingLocation(false)
    }
  }

  // Filter logic
  const filteredBeds = beds.filter((bed) => {
    const matchesSearch = bed.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          bed.gardenCode.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === "all" || bed.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const handleToggleSelect = (id: string) => {
    setSelectedBedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    )
  }

  const handleToggleAll = () => {
    const allFilteredIds = filteredBeds.map((b) => b.id)
    const isAllSelected = allFilteredIds.every((id) => selectedBedIds.includes(id))

    if (isAllSelected) {
      // Unselect all filtered
      setSelectedBedIds((prev) => prev.filter((id) => !allFilteredIds.includes(id)))
    } else {
      // Select all filtered
      setSelectedBedIds((prev) => {
        const unique = new Set([...prev, ...allFilteredIds])
        return Array.from(unique)
      })
    }
  }

  const handleBulkDelete = async () => {
    if (selectedBedIds.length === 0) return
    if (!confirm(`Bạn có chắc chắn muốn xóa ${selectedBedIds.length} luống sâm đã chọn?`)) return

    setDeletingBulk(true)
    setErrorMsg("")
    setSuccessMsg("")

    let successCount = 0
    let failCount = 0

    // Perform sequential/parallel deletions
    await Promise.all(
      selectedBedIds.map(async (id) => {
        try {
          const res = await fetchApi(`/user/cultivation/beds/${id}`, {
            method: "DELETE",
          })
          if (res.status < 400) {
            successCount++
          } else {
            failCount++
          }
        } catch (e) {
          console.error(e)
          failCount++
        }
      })
    )

    // Reload or filter beds
    if (successCount > 0) {
      setBeds((prev) => prev.filter((b) => !selectedBedIds.includes(b.id) || successCount === 0))
      // Re-fetch remaining beds to be absolutely accurate
      try {
        const bedsRes = await fetchApi("/user/cultivation/beds")
        const bedsPayload = await bedsRes.json()
        if (bedsRes.status < 400) {
          const loadedBeds = Array.isArray(bedsPayload.data?.items) ? bedsPayload.data.items : (bedsPayload.data || [])
          setBeds(loadedBeds)
        }
      } catch (err) {
        console.error(err)
      }

      setSuccessMsg(`Đã xóa thành công ${successCount} luống sâm!`)
    }

    if (failCount > 0) {
      setErrorMsg(`Có ${failCount} luống không thể xóa do vẫn đang chứa sâm Ngọc Linh.`)
    }

    setSelectedBedIds([])
    setDeletingBulk(false)
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Bạn có chắc chắn muốn xóa luống trồng này?")) return
    setDeletingId(id)
    setErrorMsg("")
    setSuccessMsg("")

    try {
      const res = await fetchApi(`/user/cultivation/beds/${id}`, {
        method: "DELETE",
      })

      if (res.status >= 400) {
        const payload = await res.json()
        setErrorMsg(payload?.message || "Không thể xóa luống trồng. Hãy kiểm tra xem luống có chứa cây sâm nào không.")
      } else {
        setBeds(beds.filter((b) => b.id !== id))
        setSuccessMsg("Xóa luống trồng thành công!")
        setSelectedBedIds((prev) => prev.filter((item) => item !== id))
      }
    } catch (e) {
      console.error(e)
      setErrorMsg("Không thể kết nối đến máy chủ API")
    } finally {
      setDeletingId(null)
    }
  }

  const handleToggleStatus = async (bed: Bed) => {
    const newStatus = bed.status === "active" ? "inactive" : "active"
    setErrorMsg("")
    setSuccessMsg("")

    try {
      const res = await fetchApi(`/user/cultivation/beds/${bed.id}`, {
        method: "PUT",
        body: JSON.stringify({
          status: newStatus,
        }),
      })

      if (res.status >= 400) {
        const payload = await res.json()
        setErrorMsg(payload?.message || "Không thể cập nhật trạng thái luống.")
      } else {
        setBeds(
          beds.map((b) => (b.id === bed.id ? { ...b, status: newStatus } : b))
        )
        setSuccessMsg(`Đã ${newStatus === "active" ? "mở lại" : "tạm ẩn"} luống ${bed.name}!`)
      }
    } catch (e) {
      console.error(e)
      setErrorMsg("Không thể kết nối đến máy chủ API")
    }
  }

  const openCreateDialog = () => {
    setDialogMode("create")
    setSelectedBed(null)
    setFormData({
      name: "",
      gardenCode: gardens[0]?.code || "",
      ageYear: 1,
      treeCount: 50,
    })
    setDialogError("")
    setIsDialogOpen(true)
  }

  const openEditDialog = (bed: Bed) => {
    setDialogMode("edit")
    setSelectedBed(bed)
    setFormData({
      name: bed.name,
      gardenCode: bed.gardenCode,
      ageYear: bed.ageYear,
      treeCount: bed.treeCount,
    })
    setDialogError("")
    setIsDialogOpen(true)
  }

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: type === "number" ? parseInt(value) || 0 : value,
    }))
  }

  const handleSelectGarden = (code: string) => {
    setFormData((prev) => ({
      ...prev,
      gardenCode: code,
    }))
  }

  const handleSaveBed = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.name) {
      setDialogError("Vui lòng nhập tên luống")
      return
    }
    if (!formData.gardenCode) {
      setDialogError("Vui lòng chọn khu vườn")
      return
    }

    setDialogLoading(true)
    setDialogError("")
    setErrorMsg("")
    setSuccessMsg("")

    try {
      if (dialogMode === "create") {
        const res = await fetchApi("/user/cultivation/beds", {
          method: "POST",
          body: JSON.stringify({
            name: formData.name,
            gardenCode: formData.gardenCode,
            ageYear: formData.ageYear,
            treeCount: formData.treeCount,
            metadata: {},
          }),
        })

        const payload = await res.json()
        if (res.status >= 400) {
          setDialogError(payload?.message || "Đã xảy ra lỗi khi tạo luống sâm")
        } else {
          setBeds((prev) => [payload.data, ...prev])
          setSuccessMsg(`Đã tạo luống sâm "${formData.name}" thành công!`)
          setIsDialogOpen(false)
        }
      } else {
        // Edit mode
        if (!selectedBed) return
        const res = await fetchApi(`/user/cultivation/beds/${selectedBed.id}`, {
          method: "PUT",
          body: JSON.stringify({
            name: formData.name,
            ageYear: formData.ageYear,
            treeCount: formData.treeCount,
          }),
        })

        const payload = await res.json()
        if (res.status >= 400) {
          setDialogError(payload?.message || "Đã xảy ra lỗi khi cập nhật luống sâm")
        } else {
          setBeds((prev) =>
            prev.map((b) => (b.id === selectedBed.id ? { ...b, ...payload.data } : b))
          )
          setSuccessMsg(`Cập nhật thông tin luống "${formData.name}" thành công!`)
          setIsDialogOpen(false)
        }
      }
    } catch (err) {
      console.error(err)
      setDialogError("Không thể kết nối đến máy chủ API")
    } finally {
      setDialogLoading(false)
    }
  }

  const allFilteredSelected = filteredBeds.length > 0 && filteredBeds.every((b) => selectedBedIds.includes(b.id))

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Quản lý luống</h1>
          <p className="text-muted-foreground">
            Quản lý các luống trồng sâm Ngọc Linh tại các vườn.
          </p>
        </div>
        <div className="flex items-center gap-3">
          {selectedBedIds.length > 0 && (
            <Button
              variant="destructive"
              onClick={handleBulkDelete}
              disabled={deletingBulk}
              className="font-semibold flex items-center gap-2 shadow-sm"
            >
              <Trash2 className="w-4 h-4" />
              Xóa {selectedBedIds.length} mục đã chọn
            </Button>
          )}
          <Button
            onClick={openCreateDialog}
            className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Thêm luống
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
          <AlertTitle>Lỗi xảy ra</AlertTitle>
          <AlertDescription>{errorMsg}</AlertDescription>
        </Alert>
      )}

      {/* Filters */}
      <Card className="border-slate-200 shadow-sm dark:border-slate-800">
        <CardHeader className="pb-4">
          <CardTitle className="text-lg">Tìm kiếm &amp; Lọc</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <Input
                placeholder="Tìm kiếm theo tên luống hoặc mã vườn..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full"
              />
            </div>
            <div className="w-full sm:w-48">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Lọc theo trạng thái" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả trạng thái</SelectItem>
                  <SelectItem value="active">Hoạt động</SelectItem>
                  <SelectItem value="inactive">Tạm ẩn</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* List Beds Table */}
      <Card className="border-slate-200 shadow-sm dark:border-slate-800">
        <CardHeader>
          <CardTitle>Danh sách luống</CardTitle>
          <CardDescription>
            Hiển thị {filteredBeds.length} trên tổng số {beds.length} luống trong hệ thống.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {filteredBeds.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              Không tìm thấy luống trồng nào phù hợp.
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">
                    <Checkbox
                      checked={allFilteredSelected}
                      onCheckedChange={handleToggleAll}
                    />
                  </TableHead>
                  <TableHead>Tên luống</TableHead>
                  <TableHead>Mã Vườn</TableHead>
                  <TableHead>Số gốc sâm</TableHead>
                  <TableHead>Trạng thái</TableHead>
                  <TableHead>Ngày xuống giống</TableHead>
                  <TableHead>Tuổi (năm)</TableHead>
                  <TableHead className="text-right">Thao tác</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredBeds.map((bed) => {
                  const isSelected = selectedBedIds.includes(bed.id)
                  return (
                    <TableRow key={bed.id} className={isSelected ? "bg-slate-50 dark:bg-slate-900" : ""}>
                      <TableCell className="w-12">
                        <Checkbox
                          checked={isSelected}
                          onCheckedChange={() => handleToggleSelect(bed.id)}
                        />
                      </TableCell>
                      <TableCell className="font-semibold text-slate-800 dark:text-slate-200">
                        {bed.name}
                      </TableCell>
                      <TableCell className="font-mono text-xs">{bed.gardenCode}</TableCell>
                      <TableCell className="font-medium text-emerald-700 dark:text-emerald-400">
                        {bed.treeCount.toLocaleString("vi-VN")} cây
                      </TableCell>
                      <TableCell>
                        <Badge variant={bed.status === "active" ? "default" : "secondary"}>
                          {bed.status === "active" ? "Hoạt động" : "Tạm ẩn"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-xs text-muted-foreground">
                        {new Date(bed.createdAt).toLocaleDateString("vi-VN")}
                      </TableCell>
                      <TableCell className="font-medium">{bed.ageYear} năm</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => openGridDialog(bed)}
                            title="Quản lý vị trí trong luống"
                          >
                            <LayoutGrid className="w-4 h-4 text-emerald-600 hover:text-emerald-700" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleToggleStatus(bed)}
                            title={bed.status === "active" ? "Tạm ẩn luống" : "Kích hoạt luống"}
                          >
                            {bed.status === "active" ? (
                              <Eye className="w-4 h-4 text-slate-500" />
                            ) : (
                              <EyeOff className="w-4 h-4 text-red-500" />
                            )}
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => openEditDialog(bed)}
                            title="Sửa thông tin luống"
                          >
                            <Pencil className="w-4 h-4 text-slate-600 hover:text-emerald-600" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDelete(bed.id)}
                            disabled={deletingId === bed.id}
                            title="Xóa luống"
                          >
                            <Trash2 className="w-4 h-4 text-red-600" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Dialog Modal for Create & Edit */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <form onSubmit={handleSaveBed}>
            <DialogHeader>
              <DialogTitle>
                {dialogMode === "create" ? "Thêm luống sâm mới" : "Chỉnh sửa luống sâm"}
              </DialogTitle>
              <DialogDescription>
                {dialogMode === "create"
                  ? "Khai báo luống mới xuống giống sâm Ngọc Linh vào vườn."
                  : "Cập nhật các thông số chi tiết của luống sâm đang canh tác."}
              </DialogDescription>
            </DialogHeader>

            {dialogError && (
              <Alert variant="destructive" className="my-3">
                <AlertTitle>Lỗi</AlertTitle>
                <AlertDescription>{dialogError}</AlertDescription>
              </Alert>
            )}

            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="dialog-name">Tên luống trồng</Label>
                <Input
                  id="dialog-name"
                  name="name"
                  placeholder="Ví dụ: Luống 04"
                  value={formData.name}
                  onChange={handleFormChange}
                  required
                />
              </div>

              {dialogMode === "create" && (
                <div className="grid gap-2">
                  <Label htmlFor="dialog-gardenCode">Thuộc khu vườn</Label>
                  {gardens.length === 0 ? (
                    <span className="text-sm text-red-500 font-semibold">
                      Chưa có khu vườn nào. Vui lòng tạo vườn trước!
                    </span>
                  ) : (
                    <Select value={formData.gardenCode} onValueChange={handleSelectGarden}>
                      <SelectTrigger>
                        <SelectValue placeholder="Chọn khu vườn" />
                      </SelectTrigger>
                      <SelectContent>
                        {gardens.map((garden) => (
                          <SelectItem key={garden.code} value={garden.code}>
                            {garden.name} ({garden.code})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="dialog-ageYear">Tuổi sâm (năm)</Label>
                  <Input
                    id="dialog-ageYear"
                    name="ageYear"
                    type="number"
                    min={0}
                    value={formData.ageYear}
                    onChange={handleFormChange}
                    required
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="dialog-treeCount">Số ô / gốc sâm</Label>
                  <Input
                    id="dialog-treeCount"
                    name="treeCount"
                    type="number"
                    min={0}
                    value={formData.treeCount}
                    onChange={handleFormChange}
                    required
                  />
                </div>
              </div>
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                Hủy bỏ
              </Button>
              <Button
                type="submit"
                disabled={dialogLoading || (dialogMode === "create" && gardens.length === 0)}
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold"
              >
                {dialogLoading ? "Đang lưu..." : dialogMode === "create" ? "Thêm mới" : "Lưu thay đổi"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Visual Bed Location Grid Dialog */}
      <Dialog open={isGridOpen} onOpenChange={setIsGridOpen}>
        <DialogContent className="max-w-[700px] max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Quản lý Vị trí Luống - {selectedBedForGrid?.name}</DialogTitle>
            <DialogDescription>
              Xem và phân bổ vị trí cây sâm trong luống trồng sâm Ngọc Linh.
            </DialogDescription>
          </DialogHeader>

          {loadingGrid ? (
            <div className="text-center py-12">Đang tải lưới vị trí luống sâm...</div>
          ) : locations.length === 0 ? (
            <div className="space-y-4 py-6 text-center">
              <p className="text-slate-500">Luống này chưa được phân bổ lưới ô trồng trọt.</p>
              <div className="flex items-center justify-center gap-4">
                <div className="flex items-center gap-2">
                  <Label htmlFor="grid-rows">Số hàng</Label>
                  <Input
                    id="grid-rows"
                    type="number"
                    value={gridRows}
                    onChange={(e) => setGridRows(Number(e.target.value))}
                    className="w-16"
                    min={1}
                  />
                </div>
                <div className="flex items-center gap-2">
                  <Label htmlFor="grid-cols">Số cột</Label>
                  <Input
                    id="grid-cols"
                    type="number"
                    value={gridCols}
                    onChange={(e) => setGridCols(Number(e.target.value))}
                    className="w-16"
                    min={1}
                  />
                </div>
                <Button onClick={handleGenerateGrid} className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold">
                  Khởi tạo lưới {gridRows}x{gridCols}
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Legend */}
              <div className="flex items-center justify-center gap-6 text-xs font-semibold">
                <div className="flex items-center gap-1.5">
                  <div className="w-4 h-4 rounded bg-slate-100 border border-slate-300"></div>
                  <span>Ô trống</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-4 h-4 rounded bg-emerald-500"></div>
                  <span>Đang trồng sâm</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-4 h-4 rounded bg-slate-300"></div>
                  <span>Hỏng/Lỗi</span>
                </div>
              </div>

              {/* Grid Scrollable Wrapper */}
              <div className="border border-slate-200 rounded-xl p-4 bg-slate-50 dark:bg-slate-900/50 max-h-[350px] overflow-auto">
                <div
                  className="grid gap-2 mx-auto"
                  style={{
                    gridTemplateColumns: `repeat(${locations.reduce((max, loc) => Math.max(max, loc.col), 0) + 1}, minmax(48px, 1fr))`,
                    width: "max-content",
                  }}
                >
                  {locations.map((loc) => {
                    let cellBg = "bg-slate-100 hover:bg-slate-200 border-slate-300 text-slate-500"
                    if (loc.status === "planted") {
                      cellBg = "bg-emerald-500 hover:bg-emerald-600 text-white border-emerald-600"
                    } else if (loc.status === "inactive") {
                      cellBg = "bg-slate-300 text-slate-500 border-slate-400 line-through"
                    }

                    return (
                      <button
                        key={loc.id}
                        type="button"
                        onClick={() => handleOpenEditLocation(loc)}
                        className={`w-12 h-12 rounded-lg border text-[10px] font-mono flex flex-col items-center justify-center transition-all ${cellBg}`}
                        title={`Hàng ${loc.row + 1}, Cột ${loc.col + 1} - Mã: ${loc.code}`}
                      >
                        <span className="font-bold">H{loc.row + 1}</span>
                        <span>C{loc.col + 1}</span>
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Edit Specific Slot Form */}
              {selectedLocationForEdit && (
                <Card className="border border-slate-200 dark:border-slate-800">
                  <CardHeader className="py-3">
                    <CardTitle className="text-sm">
                      Cập nhật vị trí Ô: Hàng {selectedLocationForEdit.row + 1} - Cột {selectedLocationForEdit.col + 1}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4 pb-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="grid gap-2">
                        <Label htmlFor="loc-status">Trạng thái ô trồng</Label>
                        <Select value={editLocationStatus} onValueChange={setEditLocationStatus}>
                          <SelectTrigger id="loc-status">
                            <SelectValue placeholder="Chọn trạng thái" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="empty">Trống (Empty)</SelectItem>
                            <SelectItem value="planted">Đang trồng sâm (Planted)</SelectItem>
                            <SelectItem value="inactive">Không sử dụng (Inactive)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="grid gap-2">
                        <Label htmlFor="loc-treeCode">Mã cây sâm trồng</Label>
                        <Select
                          value={editLocationTreeCode}
                          onValueChange={setEditLocationTreeCode}
                          disabled={editLocationStatus !== "planted"}
                        >
                          <SelectTrigger id="loc-treeCode">
                            <SelectValue placeholder="Chọn cây trồng" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="none">— Chọn lô cây sâm —</SelectItem>
                            {trees.map((tree) => (
                              <SelectItem key={tree.id} value={tree.code}>
                                {tree.name} ({tree.code}) - {tree.quantity} gốc
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="flex justify-end gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => setSelectedLocationForEdit(null)}
                      >
                        Đóng
                      </Button>
                      <Button
                        type="button"
                        size="sm"
                        onClick={handleSaveLocation}
                        disabled={savingLocation}
                        className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold"
                      >
                        {savingLocation ? "Đang lưu..." : "Lưu ô vị trí"}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Re-generate button if already exists */}
              <div className="pt-4 border-t flex justify-between items-center text-xs text-muted-foreground">
                <span>Ô vị trí hiện tại: {locations.length} ô</span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    if (confirm("Hành động này sẽ xóa toàn bộ ô vị trí hiện có trong luống và tạo mới lại. Bạn có chắc không?")) {
                      setLocations([])
                    }
                  }}
                  className="text-red-500 hover:text-red-600 border-red-200 font-semibold"
                >
                  Xóa lưới cũ để chia lại
                </Button>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsGridOpen(false)}>
              Đóng hộp thoại
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
