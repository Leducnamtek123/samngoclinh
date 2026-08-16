"use client"

import { Pencil, Trash2 } from "lucide-react"

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
      header: "Mã vườn",
      className: "font-mono text-xs",
      cell: (garden) => garden.code,
    },
    {
      header: "Tên khu vườn",
      cell: (garden) => (
        <span className="font-semibold text-slate-800 dark:text-slate-200">
          {garden.name}
        </span>
      ),
    },
    {
      header: "Vị trí",
      className: "text-sm",
      cell: (garden) => garden.location || "Kon Tum",
    },
    {
      header: "Tổng số luống",
      className: "font-medium",
      cell: (garden) => garden.totalBeds,
    },
    {
      header: "Luống đang hoạt động",
      className: "text-emerald-600 dark:text-emerald-400 font-medium",
      cell: (garden) => garden.activeBeds,
    },
    {
      header: "Tổng số gốc sâm",
      className: "font-medium",
      cell: (garden) => `${garden.totalTrees.toLocaleString("vi-VN")} cây`,
    },
    {
      header: "Trạng thái",
      cell: (garden) => (
        <StatusBadge
          status={garden.status}
          label={garden.status === "active" ? "Hoạt động" : garden.status}
        />
      ),
    },
    {
      header: "Ngày tạo",
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
      emptyMessage="Không tìm thấy khu vườn nào trong hệ thống."
      rowActionsHeader="Thao tác"
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
