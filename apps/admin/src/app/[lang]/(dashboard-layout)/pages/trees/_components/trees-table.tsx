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
import { TreeDialog } from "./tree-dialog"
import { TreesList } from "./trees-list"
import { useTreesManager } from "./use-trees-manager"

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

export function TreesTable({
  initialTrees,
  beds,
  metadata,
  errorMsg: initialError,
}: TreesTableProps) {
  const { t } = useTranslation()
  const {
    trees,
    filteredTrees,
    searchQuery,
    setSearchQuery,
    statusFilter,
    users,
    getOwnerName,
    errorMsg,
    setErrorMsg,
    successMsg,
    setSuccessMsg,
    confirmDialog,
    setConfirmDialog,
    dialogState,
    setDialogState,
    handlePageChange,
    handleStatusFilterChange,
    handleOpenCreate,
    handleOpenEdit,
    handleSave,
    handleDelete,
    handleFormChange: _handleFormChange,
  } = useTreesManager({ initialTrees, beds, initialError })

  if (trees.length === 0 && errorMsg) {
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
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            {t("trees.title")}
          </h1>
          <p className="text-muted-foreground">{t("trees.subtitle")}</p>
        </div>
        <Button
          onClick={handleOpenCreate}
          className="w-full md:w-auto bg-emerald-600 hover:bg-emerald-700 text-white gap-2"
        >
          <Plus className="h-4 w-4" /> {t("trees.addTree")}
        </Button>
      </div>

      <Card className="border-slate-200 shadow-sm dark:border-slate-800">
        <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4">
          <div>
            <CardTitle>{t("trees.title")}</CardTitle>
            <CardDescription>
              {filteredTrees.length} total entries
            </CardDescription>
          </div>
          <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
            <Input
              placeholder={t("common.actions.search")}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="max-w-[250px]"
            />
            <Select
              value={statusFilter}
              onValueChange={handleStatusFilterChange}
            >
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder={t("trees.fields.healthStatus")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">
                  {t("common.actions.filter")}: All
                </SelectItem>
                <SelectItem value="active">
                  {t("common.status.active")}
                </SelectItem>
                <SelectItem value="harvested">
                  {t("common.status.completed")}
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          <TreesList
            filteredTrees={filteredTrees}
            searchQuery={searchQuery}
            onClearSearch={() => setSearchQuery("")}
            onOpenCreate={handleOpenCreate}
            onOpenEdit={handleOpenEdit}
            onDelete={handleDelete}
            getOwnerName={getOwnerName}
            metadata={metadata}
            handlePageChange={handlePageChange}
          />
        </CardContent>
      </Card>

      <TreeDialog
        isOpen={dialogState.isOpen}
        onClose={() => setDialogState((prev) => ({ ...prev, isOpen: false }))}
        mode={dialogState.mode}
        formData={dialogState.formData}
        beds={beds}
        users={users}
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
