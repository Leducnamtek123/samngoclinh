"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Bell, Plus, ChevronLeft, ChevronRight } from "lucide-react"
import { ContractDialog } from "./contract-dialog"
import { ContractsList } from "./contracts-list"
import { useContractsManager } from "./use-contracts-manager"

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
  const {
    filteredContracts,
    successMsg,
    errorMsg,
    searchQuery,
    setSearchQuery,
    statusFilter,
    paymentFilter,
    setPaymentFilter,
    dialogState,
    setDialogState,
    handleOpenCreate,
    handleOpenEdit,
    handleSave,
    handleDelete,
    handleCheckExpiry,
    handlePageChange,
    handleStatusFilterChange,
  } = useContractsManager({
    initialContracts,
    users,
    trees,
    initialError,
  })

  return (
    <div className="space-y-6">
      <ContractsHeader
        handleCheckExpiry={handleCheckExpiry}
        handleOpenCreate={handleOpenCreate}
      />

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
          <ContractsFilters
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            statusFilter={statusFilter}
            handleStatusFilterChange={handleStatusFilterChange}
            paymentFilter={paymentFilter}
            setPaymentFilter={setPaymentFilter}
          />
        </CardHeader>
        <CardContent>
          <ContractsList
            contracts={filteredContracts}
            users={users}
            onEdit={handleOpenEdit}
            onDelete={handleDelete}
            formatVND={formatVND}
            getStatusBadge={getStatusBadge}
          />

          <ContractsPagination
            metadata={metadata}
            handlePageChange={handlePageChange}
          />
        </CardContent>
      </Card>

      {/* Create / Edit Dialog */}
      <ContractDialog
        isOpen={dialogState.isOpen}
        onClose={() => setDialogState((prev) => ({ ...prev, isOpen: false }))}
        mode={dialogState.mode}
        formData={dialogState.formData}
        onChange={(updater) => setDialogState((prev) => ({ ...prev, formData: updater(prev.formData) }))}
        onSubmit={handleSave}
        loading={dialogState.loading}
        error={dialogState.error}
        users={users}
        trees={trees}
      />
    </div>
  )
}

interface ContractsHeaderProps {
  handleCheckExpiry: () => void
  handleOpenCreate: () => void
}

function ContractsHeader({ handleCheckExpiry, handleOpenCreate }: ContractsHeaderProps) {
  return (
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
  )
}

interface ContractsFiltersProps {
  searchQuery: string
  setSearchQuery: (query: string) => void
  statusFilter: string
  handleStatusFilterChange: (val: string) => void
  paymentFilter: string
  setPaymentFilter: (val: string) => void
}

function ContractsFilters({
  searchQuery,
  setSearchQuery,
  statusFilter,
  handleStatusFilterChange,
  paymentFilter,
  setPaymentFilter,
}: ContractsFiltersProps) {
  return (
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
  )
}

interface ContractsPaginationProps {
  metadata: any
  handlePageChange: (page: number) => void
}

function ContractsPagination({ metadata, handlePageChange }: ContractsPaginationProps) {
  if (!metadata) return null
  return (
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
  )
}

const vndFormatter = new Intl.NumberFormat("vi-VN", {
  style: "currency",
  currency: "VND",
})

const formatVND = (value: number) => {
  return vndFormatter.format(value)
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
