"use client"

import { Plus } from "lucide-react"

import type { Bed, PaginationMeta, Tree } from "@/types"

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

interface TreesTableProps {
  initialTrees: Tree[]
  beds: Bed[]
  metadata: PaginationMeta | null
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
    users,
    searchVal,
    setSearchVal,
    errorMsg,
    setErrorMsg,
    successMsg,
    setSuccessMsg,
    selectedTreeIds,
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
    handleFilterStatus,
    handleFilterBed,
  } = useTreesManager({ initialTrees, beds, initialError })

  const selectedTreeIdsSet = new Set(selectedTreeIds)

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
            <CardTitle>{t("trees.tableTitle")}</CardTitle>
            <CardDescription>
              {t("trees.tableDescription").replace(
                "{count}",
                String(filteredTrees.length)
              )}
            </CardDescription>
          </div>
          <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
            <Input
              placeholder={t("trees.placeholders.search")}
              value={searchVal}
              onChange={(e) => setSearchVal(e.target.value)}
              className="max-w-[200px]"
            />

            {/* Filter by Bed */}
            <Select defaultValue="all" onValueChange={handleFilterBed}>
              <SelectTrigger className="w-[160px]">
                <SelectValue placeholder={t("trees.filters.bed")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t("trees.filters.allBeds")}</SelectItem>
                {beds.map((b) => (
                  <SelectItem key={b.id} value={b.code}>
                    {b.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Filter by Status */}
            <Select defaultValue="all" onValueChange={handleFilterStatus}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder={t("trees.filters.status")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t("trees.filters.allStatus")}</SelectItem>
                <SelectItem value="active">{t("trees.status.active")}</SelectItem>
                <SelectItem value="harvested">
                  {t("trees.status.harvested")}
                </SelectItem>
                <SelectItem value="diseased">
                  {t("trees.status.diseased")}
                </SelectItem>
                <SelectItem value="dead">{t("trees.status.dead")}</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          <TreesList
            trees={filteredTrees}
            selectedTreeIdsSet={selectedTreeIdsSet}
            onToggleSelect={handleToggleSelect}
            onToggleAll={handleToggleAll}
            onOpenEdit={handleOpenEdit}
            onDelete={handleDelete}
            onBulkDelete={handleBulkDelete}
            deletingId={null}
            searchVal={searchVal}
            onClearSearch={() => setSearchVal("")}
            onOpenCreate={handleOpenCreate}
            metadata={metadata}
            onPageChange={handlePageChange}
          />
        </CardContent>
      </Card>

      {/* Create / Edit Dialog */}
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
