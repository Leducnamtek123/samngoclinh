"use client"

import { Plus, Search } from "lucide-react"

import { useTranslation } from "@/providers/i18n-provider"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import {
  ConfirmationDialog,
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
import { NewsDialog } from "./news-dialog"
import { NewsList } from "./news-list"
import { useNewsManager } from "./use-news-manager"

interface Article {
  id: string
  slug: string
  title: string
  category: string
  summary: string
  body?: string
  status: string
  sortOrder?: number
  coverImage?: string
  image?: string
  metadata?: {
    authorName?: string
  }
  createdAt: string
}

interface NewsManagerProps {
  initialArticles: Article[]
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
  { value: "news", label: "Tin tức" },
  { value: "event", label: "Sự kiện" },
  { value: "guide", label: "Hướng dẫn sử dụng" },
  { value: "faq", label: "Kiến thức & FAQ" },
]

const categoryNameMap: Record<string, string> = {
  news: "Tin tức",
  event: "Sự kiện",
  guide: "Hướng dẫn sử dụng",
  faq: "Kiến thức & FAQ",
}

const statusOptions = [
  { value: "published", label: "Đã xuất bản" },
  { value: "draft", label: "Bản nháp" },
  { value: "inactive", label: "Ngưng hiển thị" },
]

const statusNameMap: Record<string, string> = {
  published: "Đã xuất bản",
  draft: "Bản nháp",
  inactive: "Ngưng hiển thị",
}

export function NewsManager({
  initialArticles,
  metadata,
  errorMsg: initialError,
}: NewsManagerProps) {
  const { t } = useTranslation()
  const {
    filteredArticles,
    errorMsg,
    setErrorMsg,
    successMsg,
    setSuccessMsg,
    searchQuery,
    setSearchQuery,
    categoryFilter,
    dialogState,
    setDialogState,
    confirmState,
    setConfirmState,
    handlePageChange,
    handleCategoryFilterChange,
    handleTitleChange,
    handleImageUpload,
    handleOpenCreate,
    handleOpenEdit,
    handleSave,
    handleOpenDelete,
    handleDeleteConfirm,
  } = useNewsManager({ initialArticles, initialError })

  return (
    <div className="space-y-5">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-800 dark:text-slate-100">
            Quản lý Tin tức
          </h1>
          <p className="text-xs text-slate-400">
            Danh sách bài viết tin tức, sự kiện nông trại, cẩm nang kiến thức và
            FAQ sâm Ngọc Linh
          </p>
        </div>
        <Button
          onClick={handleOpenCreate}
          className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold gap-2 self-start md:self-auto shadow-sm"
        >
          <Plus className="h-4 w-4" /> Thêm bài viết mới
        </Button>
      </div>

      {/* Filter Bar */}
      <Card className="p-4 border border-slate-200/80 dark:border-slate-800 shadow-xxs bg-white dark:bg-slate-900">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
            <Input
              placeholder="Tìm kiếm tiêu đề, tóm tắt bài viết..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 h-9 text-xs"
            />
          </div>
          <Select
            value={categoryFilter}
            onValueChange={handleCategoryFilterChange}
          >
            <SelectTrigger className="w-full sm:w-48 h-9 text-xs">
              <SelectValue placeholder={t("common.actions.filterAll")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">
                {t("common.actions.filterAll")}
              </SelectItem>
              {categoryOptions.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </Card>

      {/* Main Table */}
      <NewsList
        articles={filteredArticles}
        categoryNameMap={categoryNameMap}
        statusNameMap={statusNameMap}
        onEdit={handleOpenEdit}
        onDelete={handleOpenDelete}
        metadata={metadata}
        handlePageChange={handlePageChange}
      />

      {/* Add / Edit Dialog */}
      <NewsDialog
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
        onTitleChange={handleTitleChange}
        onImageUpload={handleImageUpload}
        onSubmit={handleSave}
        loading={dialogState.loading}
        error={dialogState.error}
        uploadingImage={dialogState.uploadingImage}
        categoryOptions={categoryOptions}
        statusOptions={statusOptions}
      />

      {/* Confirmation Dialog */}
      <ConfirmationDialog
        isOpen={confirmState.isOpen}
        onClose={() => setConfirmState((prev) => ({ ...prev, isOpen: false }))}
        onConfirm={handleDeleteConfirm}
        title="Xóa bài viết tin tức"
        description="Bạn có chắc chắn muốn xóa bài viết này không? Hành động này không thể hoàn tác."
        confirmLabel="Xác nhận xóa"
        cancelLabel="Hủy bỏ"
        type="danger"
        isLoading={confirmState.loading}
      />

      {/* Success/Error Toasts */}
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
