"use client"

import { Plus, Trash2 } from "lucide-react"

import { Pagination } from "@/components/ui/app-pagination"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ConfirmationDialog,
  ErrorState,
  ToastCard,
} from "@/components/ui/feedback-components"
import { Input } from "@/components/ui/input"
import { GardenDialog } from "./garden-dialog"
import { GardensList } from "./gardens-list"
import { useGardensManager } from "./use-gardens-manager"

interface Garden {
  id: string
  code: string
  name: string
  status: string
  totalBeds: number
  activeBeds: number
  totalTrees: number
  createdAt: string
  location?: string
  description?: string
  area?: number
  images?: string[]
  latitude?: number
  longitude?: number
  managerName?: string
  managerPhone?: string
  establishedAt?: string
  maxBeds?: number
  metadata?: any
}

interface GardensTableProps {
  initialGardens: Garden[]
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

export function GardensTable({
  initialGardens,
  metadata,
  errorMsg: initialError,
}: GardensTableProps) {
  const {
    gardens,
    filteredGardens,
    searchVal,
    setSearchVal,
    errorMsg,
    setErrorMsg,
    successMsg,
    setSuccessMsg,
    selectedGardenIds,
    confirmDialog,
    setConfirmDialog,
    dialogState,
    setDialogState,
    handleToggleSelect,
    handleToggleAll,
    handleOpenCreate,
    handleOpenEdit,
    handleSave,
    handleDelete,
    handleBulkDelete,
    handlePageChange,
  } = useGardensManager({ initialGardens, initialError })

  const selectedGardenIdsSet = new Set(selectedGardenIds)

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Quản lý khu vườn
          </h1>
          <p className="text-muted-foreground">
            Quản lý các khu vườn sâm và theo dõi số lượng luống, cây sâm.
          </p>
        </div>
        <Button
          onClick={handleOpenCreate}
          className="w-full md:w-auto bg-emerald-600 hover:bg-emerald-700 text-white gap-2"
        >
          <Plus className="h-4 w-4" /> Thêm khu vườn
        </Button>
      </div>

      <Card className="border-slate-200 shadow-sm dark:border-slate-800">
        <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4">
          <div>
            <CardTitle>Danh sách khu vườn</CardTitle>
            <CardDescription>
              Hiển thị tổng số {filteredGardens.length} khu vườn đang canh tác
              sâm.
            </CardDescription>
          </div>
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Input
              placeholder="Tìm kiếm vườn..."
              value={searchVal}
              onChange={(e) => setSearchVal(e.target.value)}
              className="max-w-[250px]"
            />
            {selectedGardenIds.length > 0 && (
              <Button
                variant="destructive"
                onClick={handleBulkDelete}
                className="gap-2 shrink-0 bg-red-650 hover:bg-red-700"
              >
                <Trash2 className="h-4 w-4" /> Xóa ({selectedGardenIds.length})
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <GardensList
            gardens={filteredGardens}
            selectedGardenIdsSet={selectedGardenIdsSet}
            onToggleSelect={handleToggleSelect}
            onToggleAll={handleToggleAll}
            onOpenEdit={handleOpenEdit}
            onDelete={handleDelete}
            deletingId={null}
            searchVal={searchVal}
            onClearSearch={() => setSearchVal("")}
            onOpenCreate={handleOpenCreate}
          />

          {/* Pagination Controls */}
          <Pagination metadata={metadata} onPageChange={handlePageChange} />
        </CardContent>
      </Card>

      {/* Create / Edit Dialog */}
      <GardenDialog
        isOpen={dialogState.isOpen}
        onClose={() => setDialogState((prev) => ({ ...prev, isOpen: false }))}
        mode={dialogState.mode}
        formData={dialogState.formData}
        onChange={(updater) =>
          setDialogState((prev) => ({
            ...prev,
            formData: updater(prev.formData),
          }))
        }
        onSubmit={handleSave}
        loading={dialogState.loading}
        error={dialogState.error}
      />

      {/* Confirmation Dialog */}
      <ConfirmationDialog
        isOpen={confirmDialog.isOpen}
        onClose={() => setConfirmDialog((prev) => ({ ...prev, isOpen: false }))}
        onConfirm={confirmDialog.action}
        title={confirmDialog.title}
        description={confirmDialog.description}
        confirmLabel="Xác nhận"
        cancelLabel="Hủy bỏ"
        type="danger"
        isLoading={confirmDialog.loading}
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
