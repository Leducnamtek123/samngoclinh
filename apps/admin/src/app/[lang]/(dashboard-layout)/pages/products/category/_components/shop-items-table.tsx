"use client"

import { Plus } from "lucide-react"

import { useTranslation } from "@/providers/i18n-provider"
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { ShopItemDialog } from "./shop-item-dialog"
import { ShopItemsList } from "./shop-items-list"
import { useShopItemsManager } from "./use-shop-items-manager"

interface ShopItem {
  id: string
  code: string
  name: string
  price: number
  unit: string
  category: string
  stock?: number
  status?: string
  images?: string[]
  description?: string
}

interface ShopItemsTableProps {
  initialItems: ShopItem[]
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

const categoryOptions = [
  { value: "processed", label: "Processed Products" },
  { value: "supplies", label: "Agricultural Supplies" },
  { value: "organic", label: "Organic Products" },
  { value: "beverage", label: "Ginseng Beverages" },
  { value: "other", label: "Other" },
]

const categoryNameMap: Record<string, string> = {
  processed: "Processed Products",
  supplies: "Agricultural Supplies",
  organic: "Organic Products",
  beverage: "Ginseng Beverages",
  other: "Other",
}

export function ShopItemsTable({
  initialItems,
  metadata,
  errorMsg: initialError,
}: ShopItemsTableProps) {
  const { t } = useTranslation()
  const {
    items,
    filteredItems,
    searchQuery,
    setSearchQuery,
    categoryFilter,
    errorMsg,
    setErrorMsg,
    successMsg,
    setSuccessMsg,
    confirmDialog,
    setConfirmDialog,
    dialogState,
    setDialogState,
    cropState,
    setCropState,
    handlePageChange,
    handleCategoryFilterChange,
    handleDelete,
    openCreateDialog,
    openEditDialog,
    handleImageFileChange,
    handleCropComplete,
    handleCropSave,
    handleFormChange,
    handleFormSubmit,
  } = useShopItemsManager({ initialItems, initialError })

  if (items.length === 0 && errorMsg) {
    return (
      <div className="py-12">
        <ErrorState
          title={t("messages.errorOccurred")}
          description={errorMsg}
          onRetry={() => window.location.reload()}
        />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex flex-col gap-1">
          <h1 className="text-3xl font-bold tracking-tight">
            Quản lý Sản phẩm thương mại
          </h1>
          <p className="text-muted-foreground">
            Quản lý danh sách các sản phẩm chế biến, đồ uống và vật tư thương mại
          </p>
        </div>
        <Button onClick={openCreateDialog}>
          <Plus className="size-4 mr-2" />
          {t("products.addProduct")}
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
            <div className="space-y-1">
              <CardTitle>{t("products.title")}</CardTitle>
              <CardDescription>
                {filteredItems.length} total entries
              </CardDescription>
            </div>
            <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
              <Input
                placeholder={t("common.actions.search")}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="max-w-xs"
              />
              <Select
                value={categoryFilter}
                onValueChange={handleCategoryFilterChange}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder={t("products.categories")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">
                    {t("common.actions.filter")}: All
                  </SelectItem>
                  {categoryOptions.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <ShopItemsList
            filteredItems={filteredItems}
            searchQuery={searchQuery}
            onClearSearch={() => setSearchQuery("")}
            openCreateDialog={openCreateDialog}
            openEditDialog={openEditDialog}
            onDelete={handleDelete}
            metadata={metadata}
            handlePageChange={handlePageChange}
            formatVND={formatVND}
            categoryNameMap={categoryNameMap}
          />
        </CardContent>
      </Card>

      {/* Interactive Add/Edit Dialog */}
      <ShopItemDialog
        isOpen={dialogState.isOpen}
        onClose={() => setDialogState((prev) => ({ ...prev, isOpen: false }))}
        mode={dialogState.mode}
        formData={dialogState.formData}
        categoryOptions={categoryOptions}
        onChange={handleFormChange}
        onSelectCategory={(val) =>
          setDialogState((prev) => ({
            ...prev,
            formData: { ...prev.formData, category: val },
          }))
        }
        onSelectUnit={(val) =>
          setDialogState((prev) => ({
            ...prev,
            formData: { ...prev.formData, unit: val },
          }))
        }
        onSelectStatus={(val) =>
          setDialogState((prev) => ({
            ...prev,
            formData: { ...prev.formData, status: val },
          }))
        }
        onImageFileChange={handleImageFileChange}
        onSubmit={handleFormSubmit}
        loading={dialogState.loading}
        error={dialogState.error}
        uploadingImage={dialogState.uploadingImage}
        cropState={cropState}
        onCropStateChange={setCropState}
        onCropComplete={handleCropComplete}
        onCropSave={handleCropSave}
        onCloseCrop={() =>
          setCropState((prev) => ({ ...prev, isOpen: false, imageSrc: null }))
        }
      />

      {/* Confirmation Dialog */}
      <ConfirmationDialog
        isOpen={confirmDialog.isOpen}
        onClose={() => setConfirmDialog((prev) => ({ ...prev, isOpen: false }))}
        onConfirm={confirmDialog.action}
        title={confirmDialog.title}
        description={confirmDialog.description}
        confirmLabel={t("common.actions.confirm")}
        cancelLabel={t("common.actions.cancel")}
        type="danger"
        isLoading={confirmDialog.loading}
      />

      {/* Toast notifications */}
      <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-3 pointer-events-auto">
        {successMsg && (
          <ToastCard
            type="success"
            title={t("common.status.success")}
            description={successMsg}
            onClose={() => setSuccessMsg("")}
          />
        )}
        {errorMsg && (
          <ToastCard
            type="error"
            title={t("common.status.error")}
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
