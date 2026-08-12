"use client"

import { Pencil, Trash2 } from "lucide-react"

import type { ColumnDef } from "@/components/shared/data-table"

import { useTranslation } from "@/providers/i18n-provider"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { DataTable } from "@/components/shared/data-table"
import { StatusBadge } from "@/components/shared/status-badge"

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

interface TreesListProps {
  filteredTrees: Tree[]
  searchQuery: string
  onClearSearch: () => void
  onOpenCreate: () => void
  onOpenEdit: (tree: Tree) => void
  onDelete: (id: string) => void
  getOwnerName: (userId: string | undefined) => string
  metadata: {
    page: number
    perPage: number
    totalPage: number
    count: number
    hasNext: boolean
    hasPrevious: boolean
  } | null
  handlePageChange: (page: number) => void
}

export function TreesList({
  filteredTrees,
  onOpenEdit,
  onDelete,
  getOwnerName,
  metadata,
  handlePageChange,
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
          {tree.name}
        </span>
      ),
    },
    {
      header: t("trees.fields.bed"),
      className: "font-mono text-xs",
      cell: (tree) =>
        tree.bedCode ? (
          <Badge variant="secondary" className="font-mono text-xs">
            {tree.bedCode}
          </Badge>
        ) : (
          <span className="text-muted-foreground text-xs">—</span>
        ),
    },
    {
      header: t("trees.fields.age"),
      className: "font-medium",
      cell: (tree) => `${tree.ageYear} y`,
    },
    {
      header: t("trees.fields.quantity"),
      className: "font-semibold text-slate-700 dark:text-slate-300",
      cell: (tree) => tree.quantity,
    },
    {
      header: t("trees.fields.owner"),
      className: "text-xs truncate max-w-[150px]",
      cell: (tree) => getOwnerName(tree.ownerUserId),
    },
    {
      header: t("trees.fields.healthStatus"),
      cell: (tree) => (
        <StatusBadge
          status={tree.metadata?.healthStatus || "healthy"}
          label={tree.metadata?.healthStatus || t("common.status.healthy")}
        />
      ),
    },
    {
      header: t("trees.fields.carePackage"),
      className: "text-xs",
      cell: (tree) =>
        tree.carePackageCode ? (
          <div className="flex flex-col gap-0.5">
            <span className="font-semibold text-emerald-700">
              {tree.carePackageCode}
            </span>
            {tree.carePackageExpiredAt && (
              <span className="text-[10px] text-muted-foreground">
                Exp:{" "}
                {new Date(tree.carePackageExpiredAt).toLocaleDateString(
                  "vi-VN",
                  { timeZone: "Asia/Ho_Chi_Minh" }
                )}
              </span>
            )}
          </div>
        ) : (
          <span className="text-muted-foreground text-xs">—</span>
        ),
    },
    {
      header: t("trees.fields.protectionPackage"),
      className: "text-xs",
      cell: (tree) =>
        tree.protectionPackageCode ? (
          <div className="flex flex-col gap-0.5">
            <span className="font-semibold text-indigo-700">
              {tree.protectionPackageCode}
            </span>
            {tree.protectionPackageExpiredAt && (
              <span className="text-[10px] text-muted-foreground">
                Exp:{" "}
                {new Date(tree.protectionPackageExpiredAt).toLocaleDateString(
                  "vi-VN",
                  { timeZone: "Asia/Ho_Chi_Minh" }
                )}
              </span>
            )}
          </div>
        ) : (
          <span className="text-muted-foreground text-xs">—</span>
        ),
    },
    {
      header: t("trees.fields.status"),
      cell: (tree) => (
        <StatusBadge
          status={tree.status}
          label={
            tree.status === "active" ? t("common.status.active") : tree.status
          }
        />
      ),
    },
  ]

  return (
    <DataTable
      columns={columns}
      data={filteredTrees}
      metadata={metadata}
      onPageChange={handlePageChange}
      emptyMessage={t("common.table.noResults")}
      rowActionsHeader={t("common.actions.actions")}
      rowActions={(tree) => (
        <div className="flex items-center justify-end gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onOpenEdit(tree)}
            className="h-8 w-8 text-blue-600 hover:text-blue-700"
          >
            <Pencil className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onDelete(tree.id)}
            className="h-8 w-8 text-destructive hover:text-destructive/90"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      )}
    />
  )
}
