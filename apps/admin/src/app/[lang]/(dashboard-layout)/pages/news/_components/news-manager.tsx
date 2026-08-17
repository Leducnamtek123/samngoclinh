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
import type { Article, PaginationMeta } from "@/types"
import { NewsDialog } from "./news-dialog"
import { NewsList } from "./news-list"
import { useNewsManager } from "./use-news-manager"

interface NewsManagerProps {
  initialArticles: Article[]
  metadata: PaginationMeta | null
  errorMsg?: string
}

export function NewsManager({
  initialArticles,
  metadata,
  errorMsg: initialError,
}: NewsManagerProps) {
  const { t } = useTranslation()

  const categoryOptions = [
    { value: "news", label: t("content.articles.categories.news") },
    { value: "event", label: t("content.articles.categories.event") },
    { value: "guide", label: t("content.articles.categories.guide") },
    { value: "faq", label: t("content.articles.categories.faq") },
  ]

  const categoryNameMap: Record<string, string> = {
    news: t("content.articles.categories.news"),
    event: t("content.articles.categories.event"),
    guide: t("content.articles.categories.guide"),
    faq: t("content.articles.categories.faq"),
  }

  const statusOptions = [
    { value: "published", label: t("content.articles.status.published") },
    { value: "draft", label: t("content.articles.status.draft") },
    { value: "inactive", label: t("content.articles.status.inactive") },
  ]

  const statusNameMap: Record<string, string> = {
    published: t("content.articles.status.published"),
    draft: t("content.articles.status.draft"),
    inactive: t("content.articles.status.inactive"),
  }

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
            {t("content.articles.title")}
          </h1>
          <p className="text-xs text-slate-400">
            {t("content.subtitle")}
          </p>
        </div>
        <Button
          onClick={handleOpenCreate}
          className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold gap-2 self-start md:self-auto shadow-sm"
        >
          <Plus className="h-4 w-4" /> {t("content.articles.addArticle")}
        </Button>
      </div>

      {/* Filter Bar */}
      <Card className="p-4 border border-slate-200/80 dark:border-slate-800 shadow-xxs bg-white dark:bg-slate-900">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
            <Input
              placeholder={t("content.articles.searchPlaceholder")}
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
        title={t("common.confirmations.deleteTitle")}
        description={t("common.confirmations.deleteDescription")}
        confirmLabel={t("common.confirmations.confirmText")}
        cancelLabel={t("common.confirmations.cancelText")}
        type="danger"
        isLoading={confirmState.loading}
      />

      {/* Success/Error Toasts */}
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
