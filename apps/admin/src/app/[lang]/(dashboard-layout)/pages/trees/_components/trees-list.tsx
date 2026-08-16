"use client"

import { Pencil, Trash2 } from "lucide-react"

import type { ColumnDef } from "@/components/shared/data-table"
import type { PaginationMeta, Tree } from "@/types"

import { useTranslation } from "@/providers/i18n-provider"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { DataTable } from "@/components/shared/data-table"
import { StatusBadge } from "@/components/shared/status-badge"

interface TreesListProps {
  trees: Tree[]
  selectedTreeIdsSet?: Set<string>
  onToggleSelect?: (id: string) => void
  onToggleAll?: () => void
  onOpenEdit: (tree: Tree) => void
  onDelete: (id: string) => void
  onBulkDelete?: () => void
  deletingId?: string | null
  searchVal?: string
  onClearSearch?: () => void
  onOpenCreate?: () => void
  metadata?: PaginationMeta | null
  onPageChange?: (page: number) => void
}

export function TreesList({
  trees,
  selectedTreeIdsSet,
  onToggleSelect,
  onToggleAll,
  onOpenEdit,
  onDelete,
  onBulkDelete,
  searchVal,
  onClearSearch,
  onOpenCreate,
  metadata,
  onPageChange,
}: TreesListProps) {
  const { t } = useTranslation()

  const columns: ColumnDef<Tree>[] = [
    {
      header: t("trees.fields.code"),
      className: "font-mono text-xs font-semibold",
      cell: (tree) => tree.code,
    },
    {
      header: t("trees.fields.name"),
      cell: (tree) => (
        <span className="font-semibold text-slate-800 dark:text-slate-200">
          {tree.name || "Cây Sâm Ngọc Linh"}
        </span>
      ),
    },
    {
      header: t("trees.fields.bed"),
      className: "font-mono text-xs",
      cell: (tree) =>
        tree.bedCode || tree.bed?.code ? (
          <Badge variant="secondary" className="font-mono text-xs">
            {tree.bedCode || tree.bed?.code}
          </Badge>
        ) : (
          <span className="text-muted-foreground text-xs">—</span>
        ),
    },
    {
      header: t("trees.fields.age"),
      className: "font-medium",
      cell: (tree) => `${tree.ageYears !== undefined ? tree.ageYears : 1} tuổi`,
    },
    {
      header: t("trees.fields.healthStatus"),
      cell: (tree) => (
        <StatusBadge
          status={tree.healthStatus || "healthy"}
          label={tree.healthStatus || t("common.status.healthy")}
        />
      ),
    },
    {
      header: t("trees.fields.carePackage"),
      className: "text-xs",
      cell: (tree) =>
        tree.carePackageCode ? (
          <div className="flex flex-col gap-0.5">
            <Badge
              variant="outline"
              className="bg-emerald-50 text-emerald-700 border-emerald-200 text-[10px] w-fit"
            >
              {tree.carePackageCode}
            </Badge>
          </div>
        ) : (
          <span className="text-muted-foreground text-xs">—</span>
        ),
    },
    {
      header: t("trees.fields.status"),
      cell: (tree) => (
        <Badge
          variant="outline"
          className={
            tree.status === "active"
              ? "bg-emerald-50 text-emerald-700 border-emerald-200"
              : "bg-slate-50 text-slate-700 border-slate-200"
          }
        >
          {tree.status === "active" ? t("trees.status.active") : tree.status || "active"}
        </Badge>
      ),
    },
    {
      header: t("common.table.actions"),
      className: "text-right",
      cell: (tree) => (
        <div className="flex justify-end gap-1">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onOpenEdit(tree)}
            className="h-8 w-8 text-slate-600 hover:text-slate-900"
          >
            <Pencil className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onDelete(tree.id)}
            className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ),
    },
  ]

  return (
    <DataTable
      data={trees}
      columns={columns}
      metadata={metadata}
      onPageChange={onPageChange}
      emptyMessage="Không tìm thấy cây sâm nào phù hợp với bộ lọc hiện tại."
    />
  )
}
