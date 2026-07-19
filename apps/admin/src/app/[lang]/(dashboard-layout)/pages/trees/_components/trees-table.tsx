"use client"

import { useState, useEffect } from "react"
import { useRouter, usePathname, useSearchParams } from "next/navigation"
import { fetchApi } from "@/lib/api"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Trash2, Pencil, Plus, ChevronLeft, ChevronRight } from "lucide-react"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { ToastCard, EmptyState, EmptySearchResult, ErrorState, ConfirmationDialog } from "@/components/ui/feedback-components"

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
  plantedAt?: string
  healthStatus?: string
  lastCareDate?: string
  nextCareDate?: string
  expectedHarvestAt?: string
  images?: string[]
  priceBought?: number
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
  metadata: {
    page: number
    perPage: number
    totalPage: number
    count: number
    hasNext: boolean
    hasPrevious: boolean
  } | null
  errorMsg?: string
}

export function TreesTable({ initialTrees, beds, metadata, errorMsg: initialError }: TreesTableProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const [trees, setTrees] = useState<Tree[]>(initialTrees)
  const [users, setUsers] = useState<any[]>([])

  // URL query params states
  const initialSearch = searchParams.get("search") || ""
  const [searchQuery, setSearchQuery] = useState(initialSearch)

  const statusFilter = searchParams.get("status") || "all"

  // Sync trees on props change
  useEffect(() => {
    setTrees(initialTrees)
  }, [initialTrees])

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await fetchApi("/admin/user/list")
        const payload = await res.json()
        if (res.status < 400) {
          const list = Array.isArray(payload.data) 
            ? payload.data 
            : (payload.data?.data || [])
          setUsers(list)
        }
      } catch (err) {
        console.error("Error fetching users:", err)
      }
    }
    fetchUsers()
  }, [])

  const createQueryString = (newParams: Record<string, string | null>) => {
    const updatedSearchParams = new URLSearchParams(searchParams.toString())
    for (const [key, value] of Object.entries(newParams)) {
      if (value === null || value === "all" || value === "") {
        updatedSearchParams.delete(key)
      } else {
        updatedSearchParams.set(key, value)
      }
    }
    if (!newParams.hasOwnProperty("page")) {
      updatedSearchParams.set("page", "1")
    }
    return updatedSearchParams.toString()
  }

  // Debounce search input
  useEffect(() => {
    const handler = setTimeout(() => {
      const currentSearch = searchParams.get("search") || ""
      if (searchQuery !== currentSearch) {
        router.push(`${pathname}?${createQueryString({ search: searchQuery })}`)
      }
    }, 400)
    return () => clearTimeout(handler)
  }, [searchQuery])

  const handlePageChange = (newPage: number) => {
    router.push(`${pathname}?${createQueryString({ page: newPage.toString() })}`)
  }

  const handleStatusFilterChange = (val: string) => {
    router.push(`${pathname}?${createQueryString({ status: val })}`)
  }

  const getOwnerName = (userId: string | undefined) => {
    if (!userId) return "Hệ thống"
    const matched = users.find((u) => u.id === userId)
    return matched ? `${matched.firstName || ""} ${matched.lastName || ""} (${matched.username || matched.email})`.trim() : userId
  }
  
  const [errorMsg, setErrorMsg] = useState(initialError || "")
  const [successMsg, setSuccessMsg] = useState("")
  const [deletingId, setDeletingId] = useState<string | null>(null)

  // Confirmation Dialog States
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false)
  const [confirmDialogTitle, setConfirmDialogTitle] = useState("")
  const [confirmDialogDesc, setConfirmDialogDesc] = useState("")
  const [confirmDialogAction, setConfirmDialogAction] = useState<() => void>(() => {})
  const [confirmDialogLoading, setConfirmDialogLoading] = useState(false)

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
    healthStatus: "healthy",
    plantedAt: "",
    lastCareDate: "",
    nextCareDate: "",
    expectedHarvestAt: "",
    priceBought: "",
    ownerUserId: "",
  })

  // Since filtering is done on backend, filteredTrees is just trees state
  const filteredTrees = trees

  const handleOpenCreate = () => {
    setDialogMode("create")
    setSelectedTree(null)
    setFormData({
      name: "Sâm Ngọc Linh",
      ageYear: 3,
      quantity: 10,
      bedCode: beds[0]?.code || "none",
      status: "active",
      healthStatus: "healthy",
      plantedAt: new Date().toISOString().substring(0, 10),
      lastCareDate: "",
      nextCareDate: "",
      expectedHarvestAt: "",
      priceBought: "0",
      ownerUserId: "",
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
      healthStatus: tree.healthStatus || "healthy",
      plantedAt: tree.plantedAt ? tree.plantedAt.substring(0, 10) : "",
      lastCareDate: tree.lastCareDate ? tree.lastCareDate.substring(0, 10) : "",
      nextCareDate: tree.nextCareDate ? tree.nextCareDate.substring(0, 10) : "",
      expectedHarvestAt: tree.expectedHarvestAt ? tree.expectedHarvestAt.substring(0, 10) : "",
      priceBought: tree.priceBought !== undefined && tree.priceBought !== null ? String(tree.priceBought) : "",
      ownerUserId: tree.ownerUserId || "",
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
      const payload: any = {
        name: formData.name,
        ageYear: Number(formData.ageYear),
        quantity: Number(formData.quantity),
        healthStatus: formData.healthStatus,
        plantedAt: formData.plantedAt ? new Date(formData.plantedAt).toISOString() : undefined,
        lastCareDate: formData.lastCareDate ? new Date(formData.lastCareDate).toISOString() : undefined,
        nextCareDate: formData.nextCareDate ? new Date(formData.nextCareDate).toISOString() : undefined,
        expectedHarvestAt: formData.expectedHarvestAt ? new Date(formData.expectedHarvestAt).toISOString() : undefined,
        priceBought: formData.priceBought ? parseInt(formData.priceBought) : undefined,
        ownerUserId: formData.ownerUserId || undefined,
        status: formData.status,
      }
      if (formData.bedCode !== "none") {
        payload.bedCode = formData.bedCode
      }

      if (dialogMode === "create") {
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
          router.refresh()
        }
      } else if (dialogMode === "edit" && selectedTree) {
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
          router.refresh()
        }
      }
    } catch (err) {
      console.error(err)
      setDialogError("Lỗi kết nối đến máy chủ")
    } finally {
      setDialogLoading(false)
    }
  }

  const handleDelete = (id: string) => {
    const tree = trees.find((t) => t.id === id)
    setConfirmDialogTitle("Xóa cây trồng này?")
    setConfirmDialogDesc(`Hành động này sẽ xóa vĩnh viễn lô cây sâm "${tree?.name || ""}" (${tree?.code || ""}) khỏi hệ thống. Bạn không thể hoàn tác thao tác này.`)
    setConfirmDialogAction(() => () => performDelete(id))
    setConfirmDialogOpen(true)
  }

  const performDelete = async (id: string) => {
    setConfirmDialogLoading(true)
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
        router.refresh()
      }
    } catch (err) {
      console.error(err)
      setErrorMsg("Lỗi kết nối máy chủ khi xóa")
    } finally {
      setConfirmDialogOpen(false)
      setConfirmDialogLoading(false)
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
            <Select value={statusFilter} onValueChange={handleStatusFilterChange}>
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
                    <TableCell colSpan={11} className="py-8">
                      {searchQuery ? (
                        <EmptySearchResult
                          query={searchQuery}
                          onClear={() => setSearchQuery("")}
                        />
                      ) : (
                        <EmptyState
                          title="Chưa có cây trồng"
                          description="Không tìm thấy lô gốc sâm nào trong hệ thống hoặc luống hiện tại. Hãy trồng thêm lô cây mới để bắt đầu theo dõi."
                          actionLabel="Trồng cây mới"
                          onAction={handleOpenCreate}
                        />
                      )}
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
                      <TableCell className="text-xs truncate max-w-[150px]" title={tree.ownerUserId}>
                        {getOwnerName(tree.ownerUserId)}
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

          {/* Pagination Controls */}
          {metadata && (
            <div className="mt-4 flex items-center justify-between">
              <span className="text-xs text-slate-500 dark:text-slate-400">
                Hiển thị trang {metadata.page} / {metadata.totalPage} (Tổng số {metadata.count} lô gốc sâm)
              </span>
              <div className="flex items-center gap-1.5">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={!metadata.hasPrevious}
                  onClick={() => handlePageChange(metadata.page - 1)}
                  className="h-8 text-xs flex items-center gap-1 text-slate-600 dark:text-slate-400"
                >
                  <ChevronLeft className="h-3.5 w-3.5" />
                  <span>Trước</span>
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={!metadata.hasNext}
                  onClick={() => handlePageChange(metadata.page + 1)}
                  className="h-8 text-xs flex items-center gap-1 text-slate-600 dark:text-slate-400"
                >
                  <span>Kế tiếp</span>
                  <ChevronRight className="h-3.5 w-3.5" />
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Create / Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[600px] max-h-[85vh] overflow-y-auto">
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

            <div className="grid gap-4 py-4 grid-cols-2">
              <div className="grid gap-2 col-span-2">
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
                    <SelectItem value="healthy">Khỏe mạnh (Tốt)</SelectItem>
                    <SelectItem value="diseased">Bị nhiễm sâu bệnh</SelectItem>
                    <SelectItem value="weak">Cần theo dõi sát (Kém)</SelectItem>
                    <SelectItem value="dead">Đã chết (Hỏng)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="tree-planted">Ngày xuống giống</Label>
                <Input
                  id="tree-planted"
                  type="date"
                  value={formData.plantedAt}
                  onChange={(e) => setFormData((prev) => ({ ...prev, plantedAt: e.target.value }))}
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="tree-expected-harvest">Dự kiến thu hoạch</Label>
                <Input
                  id="tree-expected-harvest"
                  type="date"
                  value={formData.expectedHarvestAt}
                  onChange={(e) => setFormData((prev) => ({ ...prev, expectedHarvestAt: e.target.value }))}
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="tree-last-care">Ngày chăm sóc cuối</Label>
                <Input
                  id="tree-last-care"
                  type="date"
                  value={formData.lastCareDate}
                  onChange={(e) => setFormData((prev) => ({ ...prev, lastCareDate: e.target.value }))}
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="tree-next-care">Lịch chăm sóc tiếp</Label>
                <Input
                  id="tree-next-care"
                  type="date"
                  value={formData.nextCareDate}
                  onChange={(e) => setFormData((prev) => ({ ...prev, nextCareDate: e.target.value }))}
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="tree-price">Giá mua gốc sâm (VND)</Label>
                <Input
                  id="tree-price"
                  type="number"
                  value={formData.priceBought}
                  onChange={(e) => setFormData((prev) => ({ ...prev, priceBought: e.target.value }))}
                  placeholder="Ví dụ: 5000000"
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="tree-owner">Khách hàng sở hữu</Label>
                <Select
                  value={formData.ownerUserId || "system"}
                  onValueChange={(val) => setFormData((prev) => ({ ...prev, ownerUserId: val === "system" ? "" : val }))}
                >
                  <SelectTrigger id="tree-owner">
                    <SelectValue placeholder="Chọn khách hàng sở hữu" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="system">Hệ thống (Không có chủ)</SelectItem>
                    {users.map((u) => {
                      const name = `${u.firstName || ""} ${u.lastName || ""} (${u.username || u.email})`.trim();
                      return (
                        <SelectItem key={u.id} value={u.id}>
                          {name}
                        </SelectItem>
                      )
                    })}
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
      {/* Confirmation Dialog */}
      <ConfirmationDialog
        isOpen={confirmDialogOpen}
        onClose={() => setConfirmDialogOpen(false)}
        onConfirm={confirmDialogAction}
        title={confirmDialogTitle}
        description={confirmDialogDesc}
        confirmLabel="Xác nhận"
        cancelLabel="Hủy bỏ"
        type="danger"
        isLoading={confirmDialogLoading}
      />

      {/* Toast notifications */}
      <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-3 pointer-events-auto">
        {successMsg && (
          <ToastCard
            type="success"
            title="Thành công"
            description={successMsg}
            onClose={() => setSuccessMsg("")}
          />
        )}
        {errorMsg && (
          <ToastCard
            type="error"
            title="Lỗi xảy ra"
            description={errorMsg}
            onClose={() => setErrorMsg("")}
          />
        )}
      </div>
    </div>
  )
}
