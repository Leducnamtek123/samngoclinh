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

import type { Bed, Garden } from "./use-beds-table"

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
  if (days <= 0) return "Hôm nay"
  return `${days} ngày trước`
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
  return (
    <div
      className={`flex flex-col h-full bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl overflow-hidden shadow-xs transition-all duration-300 ${
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
            title="Thu gọn danh sách"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <div>
            <h2 className="text-sm font-bold tracking-tight text-slate-800 dark:text-slate-100">
              Tất cả luống ({beds.length})
            </h2>
          </div>
        </div>
        <Button
          onClick={openCreateDialog}
          size="sm"
          className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold flex items-center gap-1 text-[10px] px-2 h-7"
        >
          <Plus className="w-3 h-3" /> Thêm
        </Button>
      </div>

      <div className="p-3 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 space-y-2">
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-slate-400" />
          <Input
            placeholder="Tìm kiếm luống..."
            value={searchVal}
            onChange={(e) => setSearchVal(e.target.value)}
            className="w-full h-9 text-xs pl-8 bg-white dark:bg-slate-900 border-slate-200"
          />
        </div>

        <div className="grid grid-cols-2 gap-1.5">
          <Select value={statusFilter} onValueChange={handleStatusFilterChange}>
            <SelectTrigger className="h-8 text-[10px] bg-white dark:bg-slate-900 border-slate-200">
              <SelectValue placeholder="Trạng thái" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất cả trạng thái</SelectItem>
              <SelectItem value="active">Hoạt động</SelectItem>
              <SelectItem value="inactive">Tạm ngưng</SelectItem>
            </SelectContent>
          </Select>

          <Select value={gardenFilter} onValueChange={handleGardenFilterChange}>
            <SelectTrigger className="h-8 text-[10px] bg-white dark:bg-slate-900 border-slate-200">
              <SelectValue placeholder="Vườn" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất cả vườn</SelectItem>
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
            Không tìm thấy luống nào.
          </div>
        ) : (
          filteredBeds.map((bed) => {
            const isSelected = bed.code === selectedBedCode
            const percentOccupied = bed.maxTrees
              ? Math.min(100, Math.round((bed.treeCount / bed.maxTrees) * 100))
              : 0

            const blocks = Array.from({ length: 12 }).map((_, i) => {
              if (
                i <
                Math.round((bed.treeCount / (bed.maxTrees || 100)) * 12 * 0.8)
              )
                return "bg-emerald-500"
              if (i < Math.round((bed.treeCount / (bed.maxTrees || 100)) * 12))
                return "bg-amber-500"
              return "bg-slate-100 dark:bg-slate-800"
            })
            return (
              <div
                key={bed.id}
                onClick={() => setSelectedBedCode(bed.code)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault()
                    setSelectedBedCode(bed.code)
                  }
                }}
                className={`p-4 rounded-xl border transition-all cursor-pointer select-none space-y-3 relative group ${
                  isSelected
                    ? "border-emerald-600 bg-emerald-50/20 dark:bg-emerald-950/20 shadow-xs ring-1 ring-emerald-500/20"
                    : "border-slate-200/60 dark:border-slate-800 hover:border-slate-350 dark:hover:border-slate-700 bg-white dark:bg-slate-900 hover:shadow-xs"
                }`}
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
                    variant={bed.status === "active" ? "default" : "secondary"}
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

                <div
                  className="flex justify-end gap-1.5 pt-2 border-t border-slate-100 dark:border-slate-800/80"
                  onClick={(e) => e.stopPropagation()}
                >
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
