"use client"

import Image from "next/image"
import { ChevronLeft, ChevronRight, Pencil, Trash2 } from "lucide-react"

import { useTranslation } from "@/providers/i18n-provider"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import {
  EmptySearchResult,
  EmptyState,
  ImagePlaceholder,
} from "@/components/ui/feedback-components"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

interface Plant {
  id: string
  code: string
  name: string
  ageYear: number
  price: number
  stock: number
  status: string
  description?: string
  images?: string[]
}

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
  plants,
  totalCount,
  filteredPlants,
  selectedPlantIds,
  onToggleSelect,
  onToggleAll,
  onEdit,
  onDelete,
  searchQuery,
  onClearSearch,
  openCreateDialog,
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

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("products.title")}</CardTitle>
        <CardDescription>
          {filteredPlants.length} / {totalCount} {t("products.title")}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {filteredPlants.length === 0 ? (
          searchQuery ? (
            <EmptySearchResult query={searchQuery} onClear={onClearSearch} />
          ) : (
            <EmptyState
              title={t("common.table.noResults")}
              description={t("products.subtitle")}
              actionLabel={t("products.addProduct")}
              onAction={openCreateDialog}
            />
          )
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12">
                  <Checkbox
                    checked={allFilteredSelected}
                    onCheckedChange={onToggleAll}
                  />
                </TableHead>
                <TableHead>{t("products.fields.name")}</TableHead>
                <TableHead>{t("products.fields.description")}</TableHead>
                <TableHead>{t("products.fields.image")}</TableHead>
                <TableHead>{t("products.fields.status")}</TableHead>
                <TableHead>Approval</TableHead>
                <TableHead>
                  {t("products.fields.price")} / {t("products.fields.stock")}
                </TableHead>
                <TableHead>Import Price</TableHead>
                <TableHead>Planted Date</TableHead>
                <TableHead>Age</TableHead>
                <TableHead className="text-right">
                  {t("common.actions.actions")}
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPlants.map((plant) => {
                const isSelected = selectedPlantIdsSet.has(plant.id)
                return (
                  <TableRow
                    key={plant.id}
                    className={
                      isSelected ? "bg-slate-50 dark:bg-slate-900" : ""
                    }
                  >
                    <TableCell className="w-12">
                      <Checkbox
                        checked={isSelected}
                        onCheckedChange={() => onToggleSelect(plant.id)}
                      />
                    </TableCell>
                    <TableCell className="font-semibold">
                      {plant.name}
                    </TableCell>
                    <TableCell className="max-w-xs truncate text-muted-foreground text-sm">
                      {plant.description || "-"}
                    </TableCell>
                    <TableCell>
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
                    </TableCell>
                    <TableCell>
                      <span className="text-sm font-medium">
                        {plant.status === "available"
                          ? t("common.status.active")
                          : t("common.status.completed")}
                      </span>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="default"
                        className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold"
                      >
                        {t("common.status.approved")}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col text-sm">
                        <span className="font-semibold text-emerald-700 dark:text-emerald-400">
                          {formatVND(plant.price)}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {plant.stock} left
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      0 VND
                    </TableCell>
                    <TableCell className="text-sm">
                      {getPlantingDate(plant.ageYear)}
                    </TableCell>
                    <TableCell className="font-semibold">
                      {plant.ageYear}
                    </TableCell>
                    <TableCell className="text-right">
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
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        )}
      </CardContent>

      {/* Pagination Controls */}
      {metadata && (
        <div className="p-4 border-t border-slate-100 dark:border-slate-800/80 bg-slate-50/30 dark:bg-slate-900/30 flex items-center justify-between">
          <span className="text-xs text-slate-500 dark:text-slate-400">
            {t("common.table.pageOf", {
              page: metadata.page,
              total: metadata.totalPage,
            })}{" "}
            ({metadata.count} total)
          </span>
          <div className="flex items-center gap-1.5">
            <Button
              variant="outline"
              size="sm"
              disabled={!metadata.hasPrevious}
              onClick={() => handlePageChange(metadata.page - 1)}
              className="h-8 text-xs flex items-center gap-1 text-slate-600 dark:text-slate-400"
            >
              <ChevronLeft className="h-3.5 w-3.5" />
              <span>{t("common.actions.back")}</span>
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={!metadata.hasNext}
              onClick={() => handlePageChange(metadata.page + 1)}
              className="h-8 text-xs flex items-center gap-1 text-slate-600 dark:text-slate-400"
            >
              <span>{t("common.actions.confirm")}</span>
              <ChevronRight className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>
      )}
    </Card>
  )
}
