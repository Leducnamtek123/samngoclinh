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
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Trash2, Pencil, Plus, Bell, CheckSquare, ChevronLeft, ChevronRight } from "lucide-react"

interface EContract {
  id: string
  code: string
  userId: string
  treeCode?: string
  title: string
  content: string
  status: string
  contractValue: number
  paymentStatus: string
  signedAt?: string
  expiredAt: string
  signatureUrl?: string
  isReminderSent: boolean
  reminderSentAt?: string
  contractType?: string
  partyA?: string
  partyB?: string
  pdfUrl?: string
  terms?: string
}

interface User {
  id: string
  name?: string
  username: string
  email: string
}

interface Tree {
  id: string
  code: string
  name: string
}

interface ContractsManagerProps {
  initialContracts: EContract[]
  users: User[]
  trees: Tree[]
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

export function ContractsManager({
  initialContracts,
  users,
  trees,
  metadata,
  errorMsg: initialError,
}: ContractsManagerProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const [contracts, setContracts] = useState<EContract[]>(initialContracts)

  // URL query params states
  const initialSearch = searchParams.get("search") || ""
  const [searchQuery, setSearchQuery] = useState(initialSearch)

  const statusFilter = searchParams.get("status") || "all"
  const [paymentFilter, setPaymentFilter] = useState("all")

  // Sync contracts on props change
  useEffect(() => {
    setContracts(initialContracts)
  }, [initialContracts])

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

  // Since filtering is done on backend, we only filter by payment status on client

  const [errorMsg, setErrorMsg] = useState(initialError || "")
  const [successMsg, setSuccessMsg] = useState("")

  // Dialog State
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [dialogLoading, setDialogLoading] = useState(false)
  const [dialogError, setDialogError] = useState("")
  const [selectedContract, setSelectedContract] = useState<EContract | null>(null)
  const [dialogMode, setDialogMode] = useState<"create" | "edit">("create")

  // Form State
  const [formData, setFormData] = useState({
    userId: "",
    treeCode: "none",
    title: "",
    content: "",
    contractValue: 0,
    paymentStatus: "unpaid",
    status: "pending",
    expiredAt: "",
    contractType: "purchase",
    partyA: "Sâm Ngọc Linh Farm",
    partyB: "",
    pdfUrl: "",
    terms: "",
  })

  // Format currency
  const formatVND = (value: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(value)
  }

  // Filter list
  const filteredContracts = contracts.filter((contract) => {
    const matchesPayment = paymentFilter === "all" || contract.paymentStatus === paymentFilter
    return matchesPayment
  })

  const handleOpenCreate = () => {
    setDialogMode("create")
    setSelectedContract(null)
    const nextYear = new Date()
    nextYear.setFullYear(nextYear.getFullYear() + 1)
    
    setFormData({
      userId: users[0]?.id || "",
      treeCode: trees[0]?.code || "none",
      title: "Hợp đồng ký gửi và chăm sóc sâm Ngọc Linh giống",
      content: "BÊN A đồng ý ký gửi sâm Ngọc Linh tại nông trại của BÊN B. BÊN B cam kết thực hiện quy trình chăm sóc tiêu chuẩn, bón phân hữu cơ và bảo vệ cây giống...",
      contractValue: 5000000,
      paymentStatus: "unpaid",
      status: "pending",
      expiredAt: nextYear.toISOString().substring(0, 10),
      contractType: "purchase",
      partyA: "Sâm Ngọc Linh Farm",
      partyB: "",
      pdfUrl: "",
      terms: "",
    })
    setDialogError("")
    setIsDialogOpen(true)
  }

  const handleOpenEdit = (contract: EContract) => {
    setDialogMode("edit")
    setSelectedContract(contract)
    setFormData({
      userId: contract.userId,
      treeCode: contract.treeCode || "none",
      title: contract.title,
      content: contract.content,
      contractValue: contract.contractValue,
      paymentStatus: contract.paymentStatus,
      status: contract.status,
      expiredAt: new Date(contract.expiredAt).toISOString().substring(0, 10),
      contractType: contract.contractType || "purchase",
      partyA: contract.partyA || "Sâm Ngọc Linh Farm",
      partyB: contract.partyB || "",
      pdfUrl: contract.pdfUrl || "",
      terms: contract.terms || "",
    })
    setDialogError("")
    setIsDialogOpen(true)
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.userId) {
      setDialogError("Vui lòng chọn khách hàng chủ hợp đồng")
      return
    }
    if (!formData.title.trim()) {
      setDialogError("Vui lòng nhập tiêu đề hợp đồng")
      return
    }

    setDialogLoading(true)
    setDialogError("")
    setSuccessMsg("")

    try {
      const payload: any = {
        userId: formData.userId,
        title: formData.title,
        content: formData.content,
        contractValue: Number(formData.contractValue),
        paymentStatus: formData.paymentStatus,
        expiredAt: new Date(formData.expiredAt).toISOString(),
        contractType: formData.contractType,
        partyA: formData.partyA,
        partyB: formData.partyB || undefined,
        pdfUrl: formData.pdfUrl || undefined,
        terms: formData.terms || undefined,
      }
      if (formData.treeCode !== "none") {
        payload.treeCode = formData.treeCode
      }

      if (dialogMode === "create") {
        const res = await fetchApi("/admin/contracts", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        })
        const payloadData = await res.json()
        if (res.status >= 400) {
          setDialogError(payloadData?.message || "Không thể tạo hợp đồng mới")
        } else {
          setContracts((prev) => [payloadData.data, ...prev])
          setSuccessMsg("Tạo hợp đồng điện tử mới thành công!")
          setIsDialogOpen(false)
          router.refresh()
        }
      } else if (dialogMode === "edit" && selectedContract) {
        payload.status = formData.status
        const res = await fetchApi(`/admin/contracts/${selectedContract.id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        })
        const payloadData = await res.json()
        if (res.status >= 400) {
          setDialogError(payloadData?.message || "Không thể cập nhật hợp đồng")
        } else {
          setContracts((prev) =>
            prev.map((c) => (c.id === selectedContract.id ? payloadData.data : c))
          )
          setSuccessMsg("Cập nhật thông tin hợp đồng thành công!")
          setIsDialogOpen(false)
          router.refresh()
        }
      }
    } catch (err) {
      console.error(err)
      setDialogError("Lỗi kết nối máy chủ API")
    } finally {
      setDialogLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Bạn có chắc chắn muốn xóa hợp đồng điện tử này?")) return

    setErrorMsg("")
    setSuccessMsg("")

    try {
      const res = await fetchApi(`/admin/contracts/${id}`, {
        method: "DELETE",
      })
      if (res.status >= 400) {
        const payload = await res.json()
        setErrorMsg(payload?.message || "Không thể xóa hợp đồng này.")
      } else {
        setContracts((prev) => prev.filter((c) => c.id !== id))
        setSuccessMsg("Đã xóa hợp đồng điện tử thành công!")
        router.refresh()
      }
    } catch (err) {
      console.error(err)
      setErrorMsg("Lỗi hệ thống khi thực hiện xóa.")
    }
  }

  const handleCheckExpiry = async () => {
    setSuccessMsg("")
    setErrorMsg("")
    try {
      const res = await fetchApi("/admin/contracts/check-expiry", {
        method: "POST",
      })
      const payload = await res.json()
      if (res.status >= 400) {
        setErrorMsg(payload?.message || "Không thể kiểm tra hạn hợp đồng.")
      } else {
        const count = payload.data?.count || 0
        const notifiedList = payload.data?.notified || []
        
        // Reload list to get updated reminder states
        const listRes = await fetchApi("/admin/contracts")
        const listPayload = await listRes.json()
        if (listRes.status < 400 && Array.isArray(listPayload.data)) {
          setContracts(listPayload.data)
        }

        if (count === 0) {
          setSuccessMsg("Đã quét xong: Không có hợp đồng nào sắp hết hạn trong vòng 7 ngày tới.")
        } else {
          setSuccessMsg(`Quét & thông báo thành công: Phát hiện ${count} hợp đồng sắp hết hạn. Đã gửi cảnh báo nhắc gia hạn tới các hợp đồng: ${notifiedList.join(", ")}.`)
        }
      }
    } catch (err) {
      console.error(err)
      setErrorMsg("Lỗi kết nối máy chủ khi quét hạn hợp đồng.")
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">Chờ ký kết</Badge>
      case "signed":
        return <Badge variant="default" className="bg-emerald-500 text-white">Đã ký</Badge>
      case "expired":
        return <Badge variant="secondary" className="bg-slate-200 text-slate-700">Hết hạn</Badge>
      case "terminated":
        return <Badge variant="destructive">Đã hủy</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Quản lý Hợp đồng Điện tử</h1>
          <p className="text-muted-foreground">
            Lập, ký kết và theo dõi các hợp đồng ký gửi trồng sâm Ngọc Linh với đối tác, khách hàng.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
          <Button onClick={handleCheckExpiry} variant="outline" className="border-emerald-600 text-emerald-700 hover:bg-emerald-50 gap-2 font-semibold">
            <Bell className="h-4 w-4" /> Quét & Nhắc gia hạn
          </Button>
          <Button onClick={handleOpenCreate} className="bg-emerald-600 hover:bg-emerald-700 text-white gap-2 font-semibold">
            <Plus className="h-4 w-4" /> Soạn hợp đồng mới
          </Button>
        </div>
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
            <CardTitle>Danh sách Hợp đồng</CardTitle>
            <CardDescription>
              Tổng số {filteredContracts.length} hợp đồng điện tử trong hệ thống.
            </CardDescription>
          </div>
          <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
            <Input
              placeholder="Tìm mã hợp đồng, tên khách hàng..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="max-w-[220px]"
            />
            <Select value={statusFilter} onValueChange={handleStatusFilterChange}>
              <SelectTrigger className="w-[130px]">
                <SelectValue placeholder="Trạng thái" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Mọi trạng thái</SelectItem>
                <SelectItem value="pending">Chờ ký kết</SelectItem>
                <SelectItem value="signed">Đã ký</SelectItem>
                <SelectItem value="expired">Hết hạn</SelectItem>
                <SelectItem value="terminated">Đã hủy</SelectItem>
              </SelectContent>
            </Select>
            <Select value={paymentFilter} onValueChange={setPaymentFilter}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Thanh toán" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Mọi thanh toán</SelectItem>
                <SelectItem value="unpaid">Chưa thanh toán</SelectItem>
                <SelectItem value="paid">Đã thanh toán</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Mã HĐ</TableHead>
                  <TableHead>Tiêu đề</TableHead>
                  <TableHead>Khách hàng</TableHead>
                  <TableHead>Cây trồng</TableHead>
                  <TableHead>Giá trị (VND)</TableHead>
                  <TableHead>Thanh toán</TableHead>
                  <TableHead>Trạng thái</TableHead>
                  <TableHead>Ngày hết hạn</TableHead>
                  <TableHead>Cảnh báo nhắc</TableHead>
                  <TableHead className="text-right">Thao tác</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredContracts.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={10} className="text-center py-12 text-muted-foreground">
                      Không tìm thấy hợp đồng nào phù hợp.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredContracts.map((contract) => {
                    const userObj = users.find((u) => u.id === contract.userId)
                    return (
                      <TableRow key={contract.id}>
                        <TableCell className="font-mono text-xs font-semibold">{contract.code}</TableCell>
                        <TableCell className="font-semibold text-slate-800 dark:text-slate-200">
                          {contract.title}
                        </TableCell>
                        <TableCell className="text-xs">
                          <div className="flex flex-col">
                            <span className="font-medium">{userObj?.name || "Hệ thống"}</span>
                            <span className="text-muted-foreground">{userObj?.email}</span>
                          </div>
                        </TableCell>
                        <TableCell className="font-mono text-xs text-slate-600">
                          {contract.treeCode ? (
                            <Badge variant="outline" className="font-mono text-xs">
                              {contract.treeCode}
                            </Badge>
                          ) : (
                            <span className="text-muted-foreground">—</span>
                          )}
                        </TableCell>
                        <TableCell className="font-semibold text-slate-700">
                          {formatVND(contract.contractValue)}
                        </TableCell>
                        <TableCell>
                          <Badge variant={contract.paymentStatus === "paid" ? "default" : "secondary"}>
                            {contract.paymentStatus === "paid" ? "Đã thanh toán" : "Chưa thanh toán"}
                          </Badge>
                        </TableCell>
                        <TableCell>{getStatusBadge(contract.status)}</TableCell>
                        <TableCell className="text-xs text-muted-foreground">
                          {new Date(contract.expiredAt).toLocaleDateString("vi-VN")}
                        </TableCell>
                        <TableCell className="text-xs">
                          {contract.isReminderSent ? (
                            <div className="flex flex-col text-[10px] text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200 w-max">
                              <span className="font-bold">Đã gửi nhắc</span>
                              {contract.reminderSentAt && (
                                <span>{new Date(contract.reminderSentAt).toLocaleDateString("vi-VN")}</span>
                              )}
                            </div>
                          ) : (
                            <span className="text-muted-foreground">—</span>
                          )}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleOpenEdit(contract)}
                              className="h-8 w-8 text-blue-600 hover:text-blue-700"
                            >
                              <Pencil className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleDelete(contract.id)}
                              className="h-8 w-8 text-destructive hover:text-destructive/90"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    )
                  })
                )}
              </TableBody>
            </Table>
          </div>

          {/* Pagination Controls */}
          {metadata && (
            <div className="mt-4 flex items-center justify-between">
              <span className="text-xs text-slate-500 dark:text-slate-400">
                Hiển thị trang {metadata.page} / {metadata.totalPage} (Tổng số {metadata.count} hợp đồng)
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
                {dialogMode === "create" ? "Soạn hợp đồng điện tử mới" : "Chỉnh sửa điều khoản hợp đồng"}
              </DialogTitle>
              <DialogDescription>
                Nhập thông số hợp đồng. Khách hàng sẽ nhận được thông báo ký hợp đồng trên thiết bị di động.
              </DialogDescription>
            </DialogHeader>

            {dialogError && (
              <div className="my-3 p-3 bg-destructive/15 text-destructive rounded-md text-xs font-medium">
                {dialogError}
              </div>
            )}

            <div className="grid gap-4 py-4 grid-cols-2">
              <div className="grid gap-2 col-span-2">
                <Label htmlFor="ctr-user">Khách hàng (Chủ hợp đồng)</Label>
                <Select
                  value={formData.userId}
                  onValueChange={(val) => setFormData((prev) => ({ ...prev, userId: val }))}
                  disabled={dialogMode === "edit"}
                >
                  <SelectTrigger id="ctr-user">
                    <SelectValue placeholder="Chọn khách hàng" />
                  </SelectTrigger>
                  <SelectContent>
                    {users.map((user) => (
                      <SelectItem key={user.id} value={user.id}>
                        {user.name || user.username} ({user.email})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="ctr-tree">Gán vào lô cây giống (Optional)</Label>
                <Select
                  value={formData.treeCode}
                  onValueChange={(val) => setFormData((prev) => ({ ...prev, treeCode: val }))}
                >
                  <SelectTrigger id="ctr-tree">
                    <SelectValue placeholder="Chọn cây trồng" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">— Không gán lô cây giống —</SelectItem>
                    {trees.map((tree) => (
                      <SelectItem key={tree.id} value={tree.code}>
                        {tree.name} ({tree.code})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="ctr-type">Loại hợp đồng</Label>
                <Select
                  value={formData.contractType}
                  onValueChange={(val) => setFormData((prev) => ({ ...prev, contractType: val }))}
                >
                  <SelectTrigger id="ctr-type">
                    <SelectValue placeholder="Chọn loại hợp đồng" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="purchase">Mua bán sâm (Purchase)</SelectItem>
                    <SelectItem value="care_service">Dịch vụ chăm sóc (Care Service)</SelectItem>
                    <SelectItem value="leasing">Cho thuê đất vườn (Leasing)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-2 col-span-2">
                <Label htmlFor="ctr-title">Tiêu đề hợp đồng</Label>
                <Input
                  id="ctr-title"
                  value={formData.title}
                  onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
                  placeholder="Ví dụ: Hợp đồng ký gửi chăm sóc sâm Ngọc Linh"
                  required
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="ctr-partyA">Bên A (Đại diện Trang trại)</Label>
                <Input
                  id="ctr-partyA"
                  value={formData.partyA}
                  onChange={(e) => setFormData((prev) => ({ ...prev, partyA: e.target.value }))}
                  required
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="ctr-partyB">Bên B (Khách hàng)</Label>
                <Input
                  id="ctr-partyB"
                  value={formData.partyB}
                  onChange={(e) => setFormData((prev) => ({ ...prev, partyB: e.target.value }))}
                  placeholder="Nhập tên khách hàng"
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="ctr-value">Giá trị hợp đồng (VND)</Label>
                <Input
                  id="ctr-value"
                  type="number"
                  value={formData.contractValue}
                  onChange={(e) => setFormData((prev) => ({ ...prev, contractValue: Number(e.target.value) }))}
                  min={0}
                  required
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="ctr-pay-status">Thanh toán</Label>
                <Select
                  value={formData.paymentStatus}
                  onValueChange={(val) => setFormData((prev) => ({ ...prev, paymentStatus: val }))}
                >
                  <SelectTrigger id="ctr-pay-status">
                    <SelectValue placeholder="Chọn trạng thái" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="unpaid">Chưa thanh toán (Unpaid)</SelectItem>
                    <SelectItem value="paid">Đã thanh toán (Paid)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="ctr-expiry">Ngày hết hạn hợp đồng</Label>
                <Input
                  id="ctr-expiry"
                  type="date"
                  value={formData.expiredAt}
                  onChange={(e) => setFormData((prev) => ({ ...prev, expiredAt: e.target.value }))}
                  required
                />
              </div>

              {dialogMode === "edit" && (
                <div className="grid gap-2">
                  <Label htmlFor="ctr-status">Trạng thái ký kết</Label>
                  <Select
                    value={formData.status}
                    onValueChange={(val) => setFormData((prev) => ({ ...prev, status: val }))}
                  >
                    <SelectTrigger id="ctr-status">
                      <SelectValue placeholder="Chọn trạng thái" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">Chờ ký kết (Pending)</SelectItem>
                      <SelectItem value="signed">Đã ký (Signed)</SelectItem>
                      <SelectItem value="expired">Hết hạn (Expired)</SelectItem>
                      <SelectItem value="terminated">Đã hủy (Terminated)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}

              <div className="grid gap-2 col-span-2">
                <Label htmlFor="ctr-pdf">Đường dẫn tệp PDF hợp đồng</Label>
                <Input
                  id="ctr-pdf"
                  value={formData.pdfUrl}
                  onChange={(e) => setFormData((prev) => ({ ...prev, pdfUrl: e.target.value }))}
                  placeholder="Ví dụ: https://storage.googleapis.com/contracts/contract_xyz.pdf"
                />
              </div>

              <div className="grid gap-2 col-span-2">
                <Label htmlFor="ctr-terms">Điều khoản bổ sung</Label>
                <Input
                  id="ctr-terms"
                  value={formData.terms}
                  onChange={(e) => setFormData((prev) => ({ ...prev, terms: e.target.value }))}
                  placeholder="Nhập điều khoản bổ sung nếu có..."
                />
              </div>

              <div className="grid gap-2 col-span-2">
                <Label htmlFor="ctr-content">Nội dung điều khoản</Label>
                <Textarea
                  id="ctr-content"
                  value={formData.content}
                  onChange={(e) => setFormData((prev) => ({ ...prev, content: e.target.value }))}
                  placeholder="Nhập chi tiết các điều khoản ràng buộc..."
                  rows={4}
                  required
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
              <Button type="submit" disabled={dialogLoading} className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold">
                {dialogLoading ? "Đang lưu..." : "Lưu hợp đồng"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
