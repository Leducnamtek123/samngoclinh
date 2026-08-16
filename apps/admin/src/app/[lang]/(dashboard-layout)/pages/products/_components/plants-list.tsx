"use client"

import Image from "next/image"
import { Pencil, Trash2 } from "lucide-react"

import type { ColumnDef } from "@/components/shared/data-table"
import type { Plant } from "./use-plants-manager"

import { useTranslation } from "@/providers/i18n-provider"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { ImagePlaceholder } from "@/components/ui/feedback-components"
import { DataTable } from "@/components/shared/data-table"
import { StatusBadge } from "@/components/shared/status-badge"

interface PlantsListProps {
  plants: Plant[]
  totalCount: number
  filteredPlants: Plant[]
  selectedPlantIds: string[]
  onToggleSelect: (id: string) => void
  onToggleAll: () => void
  onEdit: (plant: Plant) => void
  onDelete: (id: string) => void
  searchQuery: string
  onClearSearch: () => void
  openCreateDialog: () => void
  metadata: {
    page: number
    perPage: number
    totalPage: number
    count: number
    hasNext: boolean
    hasPrevious: boolean
  } | null
  handlePageChange: (page: number) => void
  formatVND: (price: number) => string
  getPlantingDate: (ageYear: number) => string
}

export function PlantsList({
  filteredPlants,
  selectedPlantIds,
  onToggleSelect,
  onToggleAll,
  onEdit,
  onDelete,
  metadata,
  handlePageChange,
  formatVND,
  getPlantingDate,
}: PlantsListProps) {
  const { t } = useTranslation()
  const selectedPlantIdsSet = new Set(selectedPlantIds)
  const allFilteredSelected =
    filteredPlants.length > 0 &&
    filteredPlants.every((p) => selectedPlantIdsSet.has(p.id))

  const columns: ColumnDef<Plant>[] = [
    {
      header: (
        <Checkbox checked={allFilteredSelected} onCheckedChange={onToggleAll} />
      ),
      className: "w-12",
      cell: (plant) => (
        <Checkbox
          checked={selectedPlantIdsSet.has(plant.id)}
          onCheckedChange={() => onToggleSelect(plant.id)}
        />
      ),
    },
    {
      header: t("products.fields.name"),
      className: "font-semibold",
      cell: (plant) => plant.name,
    },
    {
      header: t("products.fields.description"),
      className: "max-w-xs truncate text-muted-foreground text-sm",
      cell: (plant) => plant.description || "-",
    },
    {
      header: t("products.fields.image"),
      cell: (plant) => (
        <div className="relative w-12 h-12 rounded-lg overflow-hidden border">
          {plant.images?.[0] ? (
            <Image
              src={plant.images[0]}
              alt={plant.name}
              fill
              sizes="48px"
              className="object-cover"
            />
          ) : (
            <ImagePlaceholder
              className="rounded-none border-none min-h-0 h-full w-full p-1"
              showText={false}
            />
          )}
        </div>
      ),
    },
    {
      header: t("products.fields.status"),
      cell: (plant) => (
        <StatusBadge
          status={plant.status}
          label={
            plant.status === "available"
              ? t("common.status.active")
              : t("common.status.completed")
          }
        />
      ),
    },
    {
      header: t("products.fields.approval"),
      cell: () => (
        <Badge
          variant="default"
          className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold"
        >
          {t("common.status.approved")}
        </Badge>
      ),
    },
    {
      header: `${t("products.fields.price")} / ${t("products.fields.stock")}`,
      cell: (plant) => (
        <div className="flex flex-col text-sm">
          <span className="font-semibold text-emerald-700 dark:text-emerald-400">
            {formatVND(plant.price)}
          </span>
          <span className="text-xs text-muted-foreground">
            {plant.stock} left
          </span>
        </div>
      ),
    },
    {
      header: t("products.fields.importPrice"),
      className: "text-sm text-muted-foreground",
      cell: () => "0 VND",
    },
    {
      header: t("products.fields.plantedDate"),
      className: "text-sm",
      cell: (plant) => getPlantingDate(plant.ageYear),
    },
    {
      header: t("products.fields.age"),
      className: "font-semibold",
      cell: (plant) => plant.ageYear,
    },
  ]

  return (
    <DataTable
      columns={columns}
      data={filteredPlants}
      metadata={metadata}
      onPageChange={handlePageChange}
      emptyMessage={t("common.table.noResults")}
      rowActionsHeader={t("common.actions.actions")}
      rowActions={(plant) => (
        <div className="flex justify-end gap-1">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onEdit(plant)}
            title={t("common.actions.edit")}
          >
            <Pencil className="w-4 h-4 text-slate-600 hover:text-emerald-600" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onDelete(plant.id)}
            title={t("common.actions.delete")}
          >
            <Trash2 className="w-4 h-4 text-red-600" />
          </Button>
        </div>
      )}
    />
  )
}
