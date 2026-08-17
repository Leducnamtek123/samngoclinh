"use client"

import React from "react"
import {
  ChevronLeft,
  Eye,
  EyeOff,
  Pencil,
  Plus,
  Search,
  Sprout,
  Trash2,
} from "lucide-react"

import type { Bed, Garden } from "@/types"

import { useTranslation } from "@/providers/i18n-provider"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface BedsLeftSidebarProps {
  leftSidebarOpen: boolean
  setLeftSidebarOpen: (open: boolean) => void
  beds: Bed[]
  selectedBedCode: string
  setSelectedBedCode: (code: string) => void
  openCreateDialog: () => void
  searchVal: string
  setSearchVal: (val: string) => void
  statusFilter: string
  handleStatusFilterChange: (val: string) => void
  gardenFilter: string
  handleGardenFilterChange: (val: string) => void
  gardens: Garden[]
  handleToggleStatus: (bed: Bed) => void
  openEditDialog: (bed: Bed) => void
  handleDeleteBed: (bed: Bed) => void
  handleScroll: (e: React.UIEvent<HTMLDivElement>) => void
  filteredBeds: Bed[]
}
const formatDaysAgo = (dateStr: string | undefined) => {
  if (!dateStr) return "N/A"
  const diff = Date.now() - new Date(dateStr).getTime()
  const days = Math.floor(diff / (1000 * 60 * 60 * 24))
  if (days <= 0) return "0d"
  return `${days}d`
}

export function BedsLeftSidebar({
  leftSidebarOpen,
  setLeftSidebarOpen,
  beds,
  selectedBedCode,
  setSelectedBedCode,
  openCreateDialog,
  searchVal,
  setSearchVal,
  statusFilter,
  handleStatusFilterChange,
  gardenFilter,
  handleGardenFilterChange,
  gardens,
  handleToggleStatus,
  openEditDialog,
  handleDeleteBed,
  handleScroll,
  filteredBeds,
}: BedsLeftSidebarProps) {
  const { t } = useTranslation()

  return (
    <div
      className={`flex flex-col h-full bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl overflow-hidden shadow-xs transition-[width,opacity] duration-300 ${
        leftSidebarOpen
          ? "w-full lg:w-72"
          : "w-0 lg:w-0 opacity-0 pointer-events-none hidden"
      }`}
    >
      <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => setLeftSidebarOpen(false)}
            className="p-1 text-slate-400 hover:text-slate-600 rounded hover:bg-slate-100 dark:hover:bg-slate-800 hidden lg:block"
            title={t("common.actions.collapse")}
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <div>
            <h2 className="text-sm font-bold tracking-tight text-slate-800 dark:text-slate-100">
              {t("trees.fields.bed")} ({beds.length})
            </h2>
          </div>
        </div>
        <Button
          onClick={openCreateDialog}
          size="sm"
          className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold flex items-center gap-1 text-[10px] px-2 h-7"
        >
          <Plus className="w-3 h-3" /> {t("common.actions.add")}
        </Button>
      </div>

      <div className="p-3 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 space-y-2">
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-slate-400" />
          <Input
            placeholder={t("trees.placeholders.search")}
            value={searchVal}
            onChange={(e) => setSearchVal(e.target.value)}
            className="w-full h-9 text-xs pl-8 bg-white dark:bg-slate-900 border-slate-200"
          />
        </div>

        <div className="grid grid-cols-2 gap-1.5">
          <Select value={statusFilter} onValueChange={handleStatusFilterChange}>
            <SelectTrigger className="h-8 text-[10px] bg-white dark:bg-slate-900 border-slate-200">
              <SelectValue placeholder={t("trees.filters.status")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">
                {t("trees.filters.allStatus")}
              </SelectItem>
              <SelectItem value="active">
                {t("common.status.active")}
              </SelectItem>
              <SelectItem value="inactive">
                {t("common.status.inactive")}
              </SelectItem>
            </SelectContent>
          </Select>

          <Select value={gardenFilter} onValueChange={handleGardenFilterChange}>
            <SelectTrigger className="h-8 text-[10px] bg-white dark:bg-slate-900 border-slate-200">
              <SelectValue placeholder={t("trees.fields.garden")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t("trees.filters.allBeds")}</SelectItem>
              {gardens.map((garden) => (
                <SelectItem key={garden.id} value={garden.code}>
                  {garden.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div
        onScroll={handleScroll}
        className="flex-1 overflow-y-auto p-3 space-y-3 bg-slate-50/30 dark:bg-slate-900/30"
      >
        {filteredBeds.length === 0 ? (
          <div className="text-center py-12 text-xs text-muted-foreground">
            {t("common.table.noResults")}
          </div>
        ) : (
          filteredBeds.map((bed) => {
            const isSelected = bed.code === selectedBedCode
            const treeCount = bed.treeCount || bed.totalTrees || 0
            const maxTrees = bed.maxTrees || 100
            const percentOccupied = maxTrees
              ? Math.min(100, Math.round((treeCount / maxTrees) * 100))
              : 0

            const blocks = Array.from({ length: 12 }).map((_, i) => {
              if (i < Math.round((treeCount / maxTrees) * 12 * 0.8))
                return "bg-emerald-500"
              if (i < Math.round((treeCount / maxTrees) * 12))
                return "bg-amber-500"
              return "bg-slate-100 dark:bg-slate-800"
            })
            return (
              <div
                key={bed.id}
                className={`rounded-xl border transition-colors select-none relative group overflow-hidden ${
                  isSelected
                    ? "border-emerald-600 bg-emerald-50/20 dark:bg-emerald-950/20 shadow-xs ring-1 ring-emerald-500/20"
                    : "border-slate-200/60 dark:border-slate-800 hover:border-slate-350 dark:hover:border-slate-700 bg-white dark:bg-slate-900 hover:shadow-xs"
                }`}
              >
                <button
                  type="button"
                  onClick={() => setSelectedBedCode(bed.code)}
                  className="w-full text-left p-4 pb-2 space-y-3 cursor-pointer block"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2">
                      <Sprout
                        className={`h-4 w-4 ${isSelected ? "text-emerald-600" : "text-slate-400"}`}
                      />
                      <h3 className="font-bold text-sm text-slate-800 dark:text-slate-100">
                        {bed.name}
                      </h3>
                    </div>
                    <Badge
                      variant={
                        bed.status === "active" ? "default" : "secondary"
                      }
                      className={`text-[9px] px-1.5 py-0.5 rounded-md font-bold uppercase tracking-wider ${
                        bed.status === "active"
                          ? "bg-emerald-500/10 text-emerald-600 border-transparent"
                          : ""
                      }`}
                    >
                      {bed.status === "active" ? "Active" : "Inactive"}
                    </Badge>
                  </div>

                  <div className="flex gap-0.5 h-1.5 rounded-full overflow-hidden w-full">
                    {blocks.map((bg, idx) => (
                      <div key={idx} className={`flex-1 ${bg}`}></div>
                    ))}
                  </div>

                  <div className="flex justify-between items-center text-[10px] text-slate-500 dark:text-slate-400">
                    <span className="font-semibold">
                      {bed.treeCount} / {bed.maxTrees || 100} cây
                    </span>
                    <span>{percentOccupied}%</span>
                  </div>

                  <div className="grid grid-cols-2 gap-x-3 gap-y-2 text-[10px] text-slate-500 dark:text-slate-400 pt-2.5 border-t border-slate-100 dark:border-slate-800/80">
                    <div className="truncate">
                      Thổ nhưỡng:{" "}
                      <span className="font-semibold text-slate-700 dark:text-slate-300">
                        {bed.soilType || "Đất mùn rừng"}
                      </span>
                    </div>
                    <div>
                      Quy hoạch:{" "}
                      <span className="font-semibold text-slate-700 dark:text-slate-300">
                        {bed.ageYear} năm
                      </span>
                    </div>
                    <div className="truncate text-emerald-600 dark:text-emerald-400">
                      Tưới:{" "}
                      <span className="font-semibold">
                        {formatDaysAgo(bed.lastWateredAt)}
                      </span>
                    </div>
                    <div className="truncate text-amber-600 dark:text-amber-500">
                      Bón:{" "}
                      <span className="font-semibold">
                        {formatDaysAgo(bed.lastFertilizedAt)}
                      </span>
                    </div>
                  </div>
                </button>

                <div className="flex justify-end gap-1.5 px-4 py-2 border-t border-slate-100 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-900/50">
                  <button
                    type="button"
                    onClick={() => handleToggleStatus(bed)}
                    className="p-1 text-slate-400 hover:text-slate-600 rounded-md transition-colors"
                    title={
                      bed.status === "active" ? "Tạm ẩn luống" : "Mở luống"
                    }
                  >
                    {bed.status === "active" ? (
                      <Eye className="h-3.5 w-3.5" />
                    ) : (
                      <EyeOff className="h-3.5 w-3.5 text-red-500" />
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={() => openEditDialog(bed)}
                    className="p-1 text-slate-400 hover:text-emerald-600 rounded-md transition-colors"
                    title="Chỉnh sửa"
                  >
                    <Pencil className="h-3.5 w-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDeleteBed(bed)}
                    className="p-1 text-slate-400 hover:text-red-600 rounded-md transition-colors"
                    title="Xóa"
                  >
                    <Trash2 className="h-3.5 w-3.5 text-slate-400 hover:text-red-500" />
                  </button>
                </div>
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}
