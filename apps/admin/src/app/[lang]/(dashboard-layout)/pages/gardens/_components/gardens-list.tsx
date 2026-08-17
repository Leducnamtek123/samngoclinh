"use client"

import { Pencil, Trash2 } from "lucide-react"
import { useTranslation } from "@/providers/i18n-provider"

import type { ColumnDef } from "@/components/shared/data-table"

import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { DataTable } from "@/components/shared/data-table"
import { StatusBadge } from "@/components/shared/status-badge"

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
  establishedAt?: string
  maxBeds?: number
}

interface GardensListProps {
  gardens: Garden[]
  selectedGardenIdsSet: Set<string>
  onToggleSelect: (id: string) => void
  onToggleAll: () => void
  onOpenEdit: (garden: Garden) => void
  onDelete: (id: string) => void
  deletingId: string | null
  searchVal: string
  onClearSearch: () => void
  onOpenCreate: () => void
}

export function GardensList({
  gardens,
  selectedGardenIdsSet,
  onToggleSelect,
  onToggleAll,
  onOpenEdit,
  onDelete,
  deletingId,
}: GardensListProps) {
  const { t } = useTranslation()

  const columns: ColumnDef<Garden>[] = [
    {
      header: (
        <Checkbox
          checked={
            gardens.length > 0 &&
            gardens.every((g) => selectedGardenIdsSet.has(g.id))
          }
          onCheckedChange={onToggleAll}
        />
      ),
      className: "w-[50px]",
      cell: (garden) => (
        <Checkbox
          checked={selectedGardenIdsSet.has(garden.id)}
          onCheckedChange={() => onToggleSelect(garden.id)}
        />
      ),
    },
    {
      header: t("trees.gardens.code"),
      className: "font-mono text-xs",
      cell: (garden) => garden.code,
    },
    {
      header: t("trees.gardens.name"),
      cell: (garden) => (
        <span className="font-semibold text-slate-800 dark:text-slate-200">
          {garden.name}
        </span>
      ),
    },
    {
      header: t("trees.gardens.location"),
      className: "text-sm",
      cell: (garden) => garden.location || "Kon Tum",
    },
    {
      header: t("trees.gardens.totalBeds"),
      className: "font-medium",
      cell: (garden) => garden.totalBeds,
    },
    {
      header: t("trees.gardens.activeBeds"),
      className: "text-emerald-600 dark:text-emerald-400 font-medium",
      cell: (garden) => garden.activeBeds,
    },
    {
      header: t("trees.gardens.totalTrees"),
      className: "font-medium",
      cell: (garden) => t("trees.gardens.treesUnit", { count: garden.totalTrees.toLocaleString("vi-VN") }),
    },
    {
      header: t("trees.gardens.status"),
      cell: (garden) => (
        <StatusBadge
          status={garden.status}
          label={garden.status === "active" ? t("trees.gardens.active") : garden.status}
        />
      ),
    },
    {
      header: t("trees.gardens.createdAt"),
      className: "text-xs text-muted-foreground",
      cell: (garden) =>
        new Date(garden.createdAt).toLocaleDateString("vi-VN", {
          timeZone: "Asia/Ho_Chi_Minh",
        }),
    },
  ]

  return (
    <DataTable
      columns={columns}
      data={gardens}
      emptyMessage={t("trees.gardens.emptyMessage")}
      rowActionsHeader={t("common.actions")}
      rowActions={(garden) => (
        <div className="flex items-center justify-end gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onOpenEdit(garden)}
            className="h-8 w-8 text-blue-600 hover:text-blue-700"
          >
            <Pencil className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onDelete(garden.id)}
            disabled={deletingId === garden.id}
            className="h-8 w-8 text-destructive hover:text-destructive/90"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      )}
    />
  )
}
