"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Trash2, Plus } from "lucide-react"
import { ToastCard, ErrorState, ConfirmationDialog } from "@/components/ui/feedback-components"
import { PlantsList } from "./plants-list"
import { PlantDialog } from "./plant-dialog"
import { usePlantsManager } from "./use-plants-manager"

interface Plant {
  id: string
  code: string
  name: string
  ageYear: number
  price: number
  stock: number
  status: string
  description?: string
  images?: string[]
}

interface PlantsTableProps {
  initialPlants: Plant[]
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

export function PlantsTable({ initialPlants, metadata, errorMsg: initialError }: PlantsTableProps) {
  const {
    plants,
    filteredPlants,
    searchQuery,
    setSearchQuery,
    statusFilter,
    ageTab,
    setAgeTab,
    errorMsg,
    setErrorMsg,
    successMsg,
    setSuccessMsg,
    selectedPlantIds,
    confirmState,
    setConfirmState,
    dialogState,
    setDialogState,
    cropState,
    setCropState,
    handlePageChange,
    handleStatusFilterChange,
    handleToggleSelect,
    handleToggleAll,
    handleBulkDelete,
    handleDelete,
    openCreateDialog,
    openEditDialog,
    handleImageFileChange,
    handleCropComplete,
    handleCropSubmit,
    handleFormChange,
    handleSelectStatus,
    handleSavePlant,
  } = usePlantsManager({ initialPlants, initialError })

  // Group age years for tabs dynamically
  const ageYears = Array.from(new Set(plants.map((p) => p.ageYear))).sort((a, b) => a - b)

  if (plants.length === 0 && errorMsg) {
    return (
      <div className="py-12">
        <ErrorState
          title="Không thể tải dữ liệu sản phẩm sâm"
          description={errorMsg}
          onRetry={() => window.location.reload()}
        />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100">Sản phẩm Sâm giống</h1>
          <p className="text-sm text-slate-400">Quản lý lô cây sâm giống, độ tuổi, giá bán và tình trạng tồn kho trên gian hàng.</p>
        </div>
        <div className="flex items-center gap-2 self-start md:self-auto">
          {selectedPlantIds.length > 0 && (
            <Button
              variant="destructive"
              onClick={handleBulkDelete}
              className="flex items-center gap-2 font-semibold bg-red-650 hover:bg-red-700"
            >
              <Trash2 className="w-4 h-4" />
              Xóa {selectedPlantIds.length} dòng đã chọn
            </Button>
          )}
          <Button
            onClick={openCreateDialog}
            className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Thêm sản phẩm
          </Button>
        </div>
      </div>

      {/* Search & Filter section */}
      <div className="flex flex-col gap-4 p-4 rounded-xl border bg-card text-card-foreground shadow-sm">
        <h3 className="font-semibold text-lg">Tìm kiếm &amp; Lọc</h3>
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <Input
              placeholder="Tìm kiếm sản phẩm..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="max-w-md"
            />
          </div>
          <div className="w-full md:w-56">
            <Select value={statusFilter} onValueChange={handleStatusFilterChange}>
              <SelectTrigger>
                <SelectValue placeholder="Tất cả trạng thái" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả trạng thái</SelectItem>
                <SelectItem value="available">Sâm đang phát triển</SelectItem>
                <SelectItem value="harvested">Sâm đã thu hoạch</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Tabs */}
      {plants.length > 0 && (
        <Tabs value={ageTab} onValueChange={setAgeTab} className="w-full">
          <TabsList className="w-full justify-start overflow-x-auto h-auto p-1 bg-muted/50">
            <TabsTrigger value="all" className="px-6 py-2">
              Tất cả ({plants.length})
            </TabsTrigger>
            {ageYears.map((age) => {
              const count = plants.filter((p) => p.ageYear === age).length
              return (
                <TabsTrigger key={age} value={age.toString()} className="px-6 py-2">
                  {age} tuổi ({count})
                </TabsTrigger>
              )
            })}
          </TabsList>
        </Tabs>
      )}

      {/* Main Table */}
      <PlantsList
        plants={plants}
        totalCount={plants.length}
        filteredPlants={filteredPlants}
        selectedPlantIds={selectedPlantIds}
        onToggleSelect={handleToggleSelect}
        onToggleAll={handleToggleAll}
        onEdit={openEditDialog}
        onDelete={handleDelete}
        searchQuery={searchQuery}
        onClearSearch={() => setSearchQuery("")}
        openCreateDialog={openCreateDialog}
        metadata={metadata}
        handlePageChange={handlePageChange}
        formatVND={formatVND}
        getPlantingDate={getPlantingDate}
      />

      {/* Dialog Modal for Create & Edit */}
      <PlantDialog
        isOpen={dialogState.isOpen}
        onClose={() => setDialogState((prev) => ({ ...prev, isOpen: false }))}
        mode={dialogState.mode}
        formData={dialogState.formData}
        onChange={handleFormChange}
        onSelectStatus={handleSelectStatus}
        onImageFileChange={handleImageFileChange}
        onSubmit={handleSavePlant}
        loading={dialogState.loading}
        error={dialogState.error}
        uploadingImage={dialogState.uploadingImage}
        cropState={cropState}
        onCropStateChange={setCropState}
        onCropComplete={handleCropComplete}
        onCropSubmit={handleCropSubmit}
        onCloseCrop={() => setCropState((prev) => ({ ...prev, isOpen: false, imageSrc: null }))}
      />

      {/* Confirmation Dialog component */}
      <ConfirmationDialog
        isOpen={confirmState.isOpen}
        onClose={() => setConfirmState((prev) => ({ ...prev, isOpen: false }))}
        onConfirm={confirmState.action}
        title={confirmState.title}
        description={confirmState.desc}
        confirmLabel="Xác nhận"
        cancelLabel="Hủy bỏ"
        type="danger"
        isLoading={confirmState.loading}
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

const vndFormatter = new Intl.NumberFormat("vi-VN", {
  style: "currency",
  currency: "VND",
})

const formatVND = (price: number) => {
  return vndFormatter.format(price)
}

const getPlantingDate = (ageYear: number) => {
  const currentYear = new Date().getFullYear()
  return `01/01/${currentYear - ageYear}`
}
