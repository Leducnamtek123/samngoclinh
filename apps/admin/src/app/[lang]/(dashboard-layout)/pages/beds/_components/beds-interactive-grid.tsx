"use client"

import React, { useRef, useState, useEffect } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { 
  ChevronRight, Pencil, FileText, ZoomIn, ZoomOut, Maximize2, Move, Droplets, 
  Flame, Leaf, Sprout, Heart, ShieldAlert, SlidersHorizontal, Activity, QrCode, Eye, Search
} from "lucide-react"
import { fetchApi } from "@/lib/api"
import type { CultivationBedLocation, Tree, Garden, Bed } from "./use-beds-table"

interface BedsInteractiveGridProps {
  tableData: any
  gardens: Garden[]
}

const formatDaysAgo = (dateStr: string | undefined) => {
  if (!dateStr) return "N/A"
  const diff = Date.now() - new Date(dateStr).getTime()
  const days = Math.floor(diff / (1000 * 60 * 60 * 24))
  if (days <= 0) return "Hôm nay"
  return `${days} ngày trước`
}

const vndFormatter = new Intl.NumberFormat("vi-VN", {
  style: "currency",
  currency: "VND",
})

const formatVND = (price: number) => {
  return vndFormatter.format(price)
}

const getHealthBadge = (health: string) => {
  switch (health?.toLowerCase()) {
    case "healthy":
      return <Badge className="bg-emerald-500/10 text-emerald-600 border-transparent text-[10px] font-bold">Khỏe mạnh</Badge>
    case "sick":
      return <Badge className="bg-amber-500/10 text-amber-600 border-transparent text-[10px] font-bold">Cần tưới nước</Badge>
    case "dead":
      return <Badge className="bg-red-500/10 text-red-650 border-transparent text-[10px] font-bold">Sâu bệnh</Badge>
    default:
      return <Badge variant="outline" className="text-[10px] font-bold">N/A</Badge>
  }
}

const handleDragOver = (e: React.DragEvent) => {
  e.preventDefault()
}

const handleDragStart = (e: React.DragEvent, sourceLoc: CultivationBedLocation) => {
  e.dataTransfer.setData("application/json", JSON.stringify(sourceLoc))
}

export function BedsInteractiveGrid({ tableData, gardens }: BedsInteractiveGridProps) {
  const {
    activeBed,
    activeTab,
    setActiveTab,
    openEditDialog,
  } = tableData

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden">
      {/* 1. Header breadcrumb & info cards */}
      <div className="p-4 border-b border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="text-[10px] text-slate-400 font-semibold mb-1 flex items-center gap-1.5">
            <span>Vườn {activeBed.gardenCode}</span>
            <ChevronRight className="h-2.5 w-2.5" />
            <span className="text-emerald-600">{activeBed.name}</span>
          </div>
          <div className="flex items-center gap-2">
            <h1 className="text-lg font-bold text-slate-800 dark:text-slate-100 tracking-tight">{activeBed.name}</h1>
            <Badge variant="outline" className="bg-emerald-50 text-emerald-600 border-emerald-200 dark:bg-emerald-950/20 text-[9px] font-bold py-0.5 rounded-md">
              Active
            </Badge>
          </div>
        </div>

        {/* Horizontal KPI blocks */}
        <div className="flex flex-wrap gap-2 text-xs md:mr-auto md:ml-6">
          <div className="bg-slate-50 dark:bg-slate-800/60 border rounded-lg px-2.5 py-1 flex flex-col items-center justify-center min-w-[70px]">
            <span className="text-[9px] text-slate-400 uppercase tracking-wider font-semibold">Khu Vườn</span>
            <span className="font-bold text-slate-700 dark:text-slate-300">{activeBed.gardenCode}</span>
          </div>
          <div className="bg-slate-50 dark:bg-slate-800/60 border rounded-lg px-2.5 py-1 flex flex-col items-center justify-center min-w-[90px]">
            <span className="text-[9px] text-slate-400 uppercase tracking-wider font-semibold">Sức chứa</span>
            <span className="font-bold text-slate-700 dark:text-slate-300">{activeBed.treeCount}/{activeBed.maxTrees || 100}</span>
          </div>
          <div className="bg-slate-50 dark:bg-slate-800/60 border rounded-lg px-2.5 py-1 flex flex-col items-center justify-center min-w-[70px]">
            <span className="text-[9px] text-slate-400 uppercase tracking-wider font-semibold">Độ Tuổi</span>
            <span className="font-bold text-slate-700 dark:text-slate-300">{activeBed.ageYear} năm</span>
          </div>
          <div className="bg-slate-50 dark:bg-slate-800/60 border rounded-lg px-2.5 py-1 flex flex-col items-center justify-center min-w-[85px]">
            <span className="text-[9px] text-slate-400 uppercase tracking-wider font-semibold">Thổ Nhưỡng</span>
            <span className="font-bold text-slate-700 dark:text-slate-300 truncate max-w-[80px]">{activeBed.soilType || "Đất rừng"}</span>
          </div>
          <div className="bg-slate-50 dark:bg-slate-800/60 border rounded-lg px-2.5 py-1 flex flex-col items-center justify-center min-w-[80px]">
            <span className="text-[9px] text-slate-400 uppercase tracking-wider font-semibold">Tưới Nước</span>
            <span className="font-bold text-emerald-600">{formatDaysAgo(activeBed.lastWateredAt)}</span>
          </div>
          <div className="bg-red-50 dark:bg-red-950/20 border border-red-100 dark:border-red-900 rounded-lg px-2.5 py-1 flex flex-col items-center justify-center min-w-[75px]">
            <span className="text-[9px] text-red-400 uppercase tracking-wider font-semibold">Cần Chăm</span>
            <span className="font-bold text-red-600 dark:text-red-400">{tableData.sickCount} cây</span>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-1.5 self-end md:self-auto">
          <Button size="sm" variant="outline" className="h-8 text-xs font-semibold px-2.5 border-slate-200" onClick={() => openEditDialog(activeBed)}>
            <Pencil className="h-3 w-3 mr-1" /> Chỉnh sửa
          </Button>
          <Button size="sm" variant="outline" className="h-8 text-xs font-semibold px-2.5 border-slate-200" onClick={() => setActiveTab("logs")}>
            <FileText className="h-3 w-3 mr-1" /> Lịch sử
          </Button>
        </div>
      </div>

      {/* 2. Tabs selection */}
      <div className="border-b border-slate-100 dark:border-slate-800 flex items-center justify-between px-4 bg-white dark:bg-slate-900">
        <div className="flex gap-6">
          <button type="button" 
            onClick={() => setActiveTab("grid")}
            className={`py-3 text-xs font-bold border-b-2 transition-all ${activeTab === "grid" ? "border-emerald-600 text-emerald-600" : "border-transparent text-slate-400 hover:text-slate-700"}`}
          >
            Sơ đồ (Grid)
          </button>
          <button type="button" 
            onClick={() => setActiveTab("trees")}
            className={`py-3 text-xs font-bold border-b-2 transition-all ${activeTab === "trees" ? "border-emerald-600 text-emerald-600" : "border-transparent text-slate-400 hover:text-slate-700"}`}
          >
            Danh sách cây
          </button>
          <button type="button" 
            onClick={() => setActiveTab("overview")}
            className={`py-3 text-xs font-bold border-b-2 transition-all ${activeTab === "overview" ? "border-emerald-600 text-emerald-600" : "border-transparent text-slate-400 hover:text-slate-700"}`}
          >
            Tổng quan luống
          </button>
        </div>
      </div>

      {/* 3. Render current tab view */}
      <div className="flex-1 overflow-hidden flex flex-col p-4 bg-slate-50/50 dark:bg-slate-950/20 relative">
        {activeTab === "grid" && <BedsGridTab tableData={tableData} />}
        {activeTab === "trees" && <BedsTreesTab tableData={tableData} />}
        {activeTab === "overview" && <BedsOverviewTab tableData={tableData} />}
        {activeTab === "logs" && <BedsLogsTab tableData={tableData} />}
      </div>
    </div>
  )
}

interface BedsGridToolbarProps {
  searchGridQuery: string
  setSearchGridQuery: (q: string) => void
  gridHealthFilter: string
  setGridHealthFilter: (f: string) => void
  gridStatusFilter: string
  setGridStatusFilter: (f: string) => void
  gridCustomerFilter: string
  setGridCustomerFilter: (f: string) => void
  onlyEmpty: boolean
  setOnlyEmpty: (o: boolean) => void
  users: any[]
  handleBulkWatering: () => void
  handleBulkFertilizing: () => void
}

function BedsGridToolbar({
  searchGridQuery,
  setSearchGridQuery,
  gridHealthFilter,
  setGridHealthFilter,
  gridStatusFilter,
  setGridStatusFilter,
  gridCustomerFilter,
  setGridCustomerFilter,
  onlyEmpty,
  setOnlyEmpty,
  users,
  handleBulkWatering,
  handleBulkFertilizing,
}: BedsGridToolbarProps) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 bg-white dark:bg-slate-950 p-2 px-3 rounded-xl border border-slate-200/80 dark:border-slate-800 shadow-xxs">
      <div className="flex flex-wrap items-center gap-2">
        <div className="relative w-36">
          <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-slate-400" />
          <Input
            placeholder="Tìm mã sâm..."
            value={searchGridQuery}
            onChange={(e) => setSearchGridQuery(e.target.value)}
            className="h-8 pl-8 text-[11px] w-full bg-slate-50 border-slate-200"
          />
        </div>
        <Select value={gridHealthFilter} onValueChange={setGridHealthFilter}>
          <SelectTrigger className="h-8 text-[11px] w-24 bg-slate-50 border-slate-200">
            <SelectValue placeholder="Sức khỏe" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Sức khỏe</SelectItem>
            <SelectItem value="healthy">Khỏe mạnh</SelectItem>
            <SelectItem value="sick">Cần tưới nước</SelectItem>
            <SelectItem value="dead">Sâu bệnh</SelectItem>
          </SelectContent>
        </Select>

        <Select value={gridStatusFilter} onValueChange={setGridStatusFilter}>
          <SelectTrigger className="h-8 text-[11px] w-24 bg-slate-50 border-slate-200">
            <SelectValue placeholder="Cơ cấu" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Cơ cấu</SelectItem>
            <SelectItem value="empty">Ô trống</SelectItem>
            <SelectItem value="planted">Đã trồng</SelectItem>
          </SelectContent>
        </Select>

        <Select value={gridCustomerFilter} onValueChange={setGridCustomerFilter}>
          <SelectTrigger className="h-8 text-[11px] w-32 bg-slate-50 border-slate-200">
            <SelectValue placeholder="Khách hàng" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tất cả chủ sở hữu</SelectItem>
            {users.map((u: any) => (
              <SelectItem key={u.id} value={u.id}>
                {u.name || u.username}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <div className="flex items-center gap-1.5 ml-1">
          <input
            type="checkbox"
            id="onlyEmptyCheck"
            checked={onlyEmpty}
            onChange={(e) => setOnlyEmpty(e.target.checked)}
            className="rounded border-slate-350 text-emerald-600 focus:ring-emerald-500 h-3.5 w-3.5"
          />
          <label htmlFor="onlyEmptyCheck" className="text-[10px] font-bold text-slate-500 select-none">
            Chỉ ô trống
          </label>
        </div>
      </div>

      <div className="flex items-center gap-1.5 ml-auto">
        <Button
          size="sm"
          variant="outline"
          className="h-8 text-[10px] font-bold text-emerald-800 border-slate-200"
          onClick={handleBulkWatering}
        >
          <Droplets className="h-3 w-3 mr-1 text-emerald-500" /> Tưới hàng loạt
        </Button>
        <Button
          size="sm"
          variant="outline"
          className="h-8 text-[10px] font-bold text-amber-800 border-slate-200"
          onClick={handleBulkFertilizing}
        >
          <Flame className="h-3 w-3 mr-1 text-amber-500" /> Bón hàng loạt
        </Button>
      </div>
    </div>
  )
}

interface BedsGridCanvasProps {
  locations: CultivationBedLocation[]
  filteredLocations: CultivationBedLocation[]
  selectedLocationId: string | null
  handleCellClick: (loc: CultivationBedLocation) => void
  handleMouseDown: (e: React.MouseEvent) => void
  handleMouseMove: (e: React.MouseEvent) => void
  handleMouseUpOrLeave: () => void
  handleDrop: (e: React.DragEvent, destLoc: CultivationBedLocation) => void
  hoveredCell: CultivationBedLocation | null
  setHoveredCell: (loc: CultivationBedLocation | null) => void
  tooltipPos: { x: number; y: number }
  setTooltipPos: (pos: { x: number; y: number }) => void
  getCellTree: (treeCode?: string) => any
  getOwnerName: (userId: string | undefined) => string
  zoomScale: number
  zoomIn: () => void
  zoomOut: () => void
  zoomReset: () => void
  panOffset: { x: number; y: number }
  isPanning: boolean
  gridRows: number
  setGridRows: (r: number) => void
  gridCols: number
  setGridCols: (c: number) => void
  handleGenerateGrid: () => void
}

function BedsGridCanvas({
  locations,
  filteredLocations,
  selectedLocationId,
  handleCellClick,
  handleMouseDown,
  handleMouseMove,
  handleMouseUpOrLeave,
  handleDrop,
  hoveredCell,
  setHoveredCell,
  tooltipPos,
  setTooltipPos,
  getCellTree,
  getOwnerName,
  zoomScale,
  zoomIn,
  zoomOut,
  zoomReset,
  panOffset,
  isPanning,
  gridRows,
  setGridRows,
  gridCols,
  setGridCols,
  handleGenerateGrid,
}: BedsGridCanvasProps) {

  return (
    <div className="flex-1 bg-slate-50 dark:bg-slate-950 rounded-xl relative overflow-hidden group select-none shadow-inner border border-slate-200 dark:border-slate-900">
      {locations.length === 0 ? (
        <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center z-10 bg-white/95 dark:bg-slate-900/95 text-slate-500 dark:text-slate-400">
          <SlidersHorizontal className="h-8 w-8 text-slate-400 dark:text-slate-500 mb-3 animate-pulse" />
          <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200">Chưa có ô lưới vị trí</h4>
          <p className="text-[10px] text-slate-600 dark:text-slate-400 max-w-[280px] mt-1.5 leading-relaxed">
            Bạn cần khởi tạo sơ đồ dòng/cột để kéo thả quản lý cây sâm Ngọc Linh tại luống này.
          </p>
          <div className="flex items-center gap-1.5 mt-4">
            <Input
              type="number"
              min="2"
              max="20"
              value={gridRows}
              onChange={(e) => setGridRows(Number(e.target.value))}
              className="w-14 h-8 bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-center text-xs font-semibold text-slate-850 dark:text-white"
            />
            <span className="text-slate-400 dark:text-slate-600 text-xs">x</span>
            <Input
              type="number"
              min="2"
              max="25"
              value={gridCols}
              onChange={(e) => setGridCols(Number(e.target.value))}
              className="w-14 h-8 bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-center text-xs font-semibold text-slate-850 dark:text-white"
            />
            <Button onClick={handleGenerateGrid} size="sm" className="bg-emerald-600 hover:bg-emerald-700 h-8 text-[10px] font-bold text-white px-3">
              Khởi tạo lưới
            </Button>
          </div>
        </div>
      ) : (
        <div
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUpOrLeave}
          onMouseLeave={handleMouseUpOrLeave}
          role="application"
          aria-label="Sơ đồ luống sâm"
          className={`w-full h-full relative cursor-grab ${isPanning ? "cursor-grabbing" : ""}`}
        >
          <div
            style={{
              transform: `translate(${panOffset.x}px, ${panOffset.y}px) scale(${zoomScale / 100})`,
              transformOrigin: "center center",
            }}
            className="absolute inset-0 transition-transform duration-75 flex items-center justify-center pointer-events-none"
          >
            <div
              style={{
                gridTemplateRows: `repeat(${Math.max(...locations.map((l) => l.row)) + 1}, minmax(0, 1fr))`,
                gridTemplateColumns: `repeat(${Math.max(...locations.map((l) => l.col)) + 1}, minmax(0, 1fr))`,
              }}
              className="grid gap-2 p-12 pointer-events-auto bg-slate-100/50 dark:bg-slate-900/20 rounded-2xl border border-slate-200/80 dark:border-slate-900/60"
            >
              {locations.map((loc) => {
                const isVisible = filteredLocations.some((fl) => fl.id === loc.id)
                const tree = getCellTree(loc.treeCode)
                const isSelected = loc.id === selectedLocationId

                return (
                  <div
                    key={loc.id}
                    onDragOver={handleDragOver}
                    onDrop={(e) => handleDrop(e, loc)}
                    draggable={loc.status === "planted"}
                    onDragStart={(e) => handleDragStart(e, loc)}
                    onMouseEnter={(e) => {
                      setHoveredCell(loc)
                      const rect = e.currentTarget.getBoundingClientRect()
                      const parentRect = e.currentTarget.parentElement?.parentElement?.parentElement?.getBoundingClientRect()
                      if (parentRect) {
                        setTooltipPos({
                          x: rect.left - parentRect.left + rect.width / 2,
                          y: rect.top - parentRect.top - 60,
                        })
                      }
                    }}
                    onMouseLeave={() => setHoveredCell(null)}
                    onClick={() => handleCellClick(loc)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault()
                        handleCellClick(loc)
                      }
                    }}
                    style={{ opacity: isVisible ? 1 : 0.15 }}
                    className={`w-12 h-12 rounded-lg border flex flex-col items-center justify-center relative cursor-pointer select-none transition-all grid-cell-btn ${
                      isSelected
                        ? "bg-emerald-600 border-white dark:border-slate-950 ring-2 ring-emerald-500/50 shadow-md scale-105 text-white"
                        : loc.status === "planted"
                        ? tree?.healthStatus === "sick"
                          ? "bg-amber-50 dark:bg-amber-650/90 border-amber-250 dark:border-amber-400 hover:border-amber-400 text-amber-800 dark:text-amber-100"
                          : tree?.healthStatus === "dead"
                          ? "bg-red-50 dark:bg-red-950/90 border-red-250 dark:border-red-700 hover:border-red-400 text-red-800 dark:text-red-100"
                          : "bg-emerald-50 dark:bg-emerald-950/80 border-emerald-250 dark:border-emerald-800/80 hover:border-emerald-400 text-emerald-800 dark:text-emerald-100"
                        : "bg-white dark:bg-slate-900/80 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 text-slate-400 dark:text-slate-500"
                    }`}
                  >
                    {loc.status === "planted" ? (
                      <>
                        <Leaf className={`h-4.5 w-4.5 ${isSelected ? "text-white" : tree?.healthStatus === "sick" ? "text-amber-600 dark:text-amber-250" : tree?.healthStatus === "dead" ? "text-red-650 dark:text-red-400" : "text-emerald-600 dark:text-emerald-400"}`} />
                        <span className={`text-[7px] font-mono font-bold mt-1 ${isSelected ? "text-white" : "text-slate-700 dark:text-slate-200"}`}>
                          {loc.treeCode?.slice(-3)}
                        </span>
                      </>
                    ) : (
                      <div className="w-1.5 h-1.5 rounded-full bg-slate-300 dark:bg-slate-700"></div>
                    )}

                    <span className="absolute bottom-0.5 right-0.5 text-[5px] text-slate-400 dark:text-slate-500 font-mono">
                      {loc.row + 1},{loc.col + 1}
                    </span>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      )}

      {hoveredCell && (
        <div
          style={{
            position: "absolute",
            left: `${tooltipPos.x}px`,
            top: `${tooltipPos.y}px`,
            transform: "translateX(-50%)",
          }}
          className="z-40 bg-slate-900 text-white border border-slate-800 rounded-lg p-2.5 shadow-xl text-[10px] pointer-events-none w-44 space-y-1"
        >
          <div className="flex justify-between items-center font-bold">
            <span>H{hoveredCell.row + 1} - C{hoveredCell.col + 1}</span>
            <span className="text-slate-500 font-mono text-[9px]">{hoveredCell.code}</span>
          </div>
          {hoveredCell.status === "planted" ? (
            <>
              <div className="text-emerald-400 font-semibold">{getCellTree(hoveredCell.treeCode)?.name}</div>
              <div className="text-slate-400 truncate">
                Chủ: {getOwnerName(getCellTree(hoveredCell.treeCode)?.ownerUserId)}
              </div>
              <div className="flex justify-between items-center mt-1 pt-1 border-t border-slate-800 text-[9px]">
                <span>Sức khỏe:</span>
                <span className="uppercase font-bold font-mono">
                  {getCellTree(hoveredCell.treeCode)?.healthStatus}
                </span>
              </div>
            </>
          ) : (
            <div className="text-slate-500 font-medium italic">Ô đất trống (Chưa gieo trồng)</div>
          )}
        </div>
      )}

      {locations.length > 0 && (
        <div className="absolute bottom-4 right-4 bg-white/90 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 rounded-lg p-1.5 flex items-center gap-1.5 shadow-xl z-20">
          <Button size="icon" variant="ghost" onClick={zoomOut} className="h-7 w-7 text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white">
            <ZoomOut className="h-3.5 w-3.5" />
          </Button>
          <span className="text-[10px] font-bold font-mono text-slate-500 dark:text-slate-400 w-10 text-center">{zoomScale}%</span>
          <Button size="icon" variant="ghost" onClick={zoomIn} className="h-7 w-7 text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white">
            <ZoomIn className="h-3.5 w-3.5" />
          </Button>
          <div className="w-[1px] h-4 bg-slate-200 dark:bg-slate-800 mx-0.5"></div>
          <Button size="icon" variant="ghost" onClick={zoomReset} className="h-7 w-7 text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white" title="Đặt lại hiển thị">
            <Maximize2 className="h-3.5 w-3.5" />
          </Button>
        </div>
      )}
    </div>
  )
}

function BedsGridTab({ tableData }: { tableData: any }) {
  return (
    <div className="flex-1 flex flex-col overflow-hidden space-y-4">
      <BedsGridToolbar
        searchGridQuery={tableData.searchGridQuery}
        setSearchGridQuery={tableData.setSearchGridQuery}
        gridHealthFilter={tableData.gridHealthFilter}
        setGridHealthFilter={tableData.setGridHealthFilter}
        gridStatusFilter={tableData.gridStatusFilter}
        setGridStatusFilter={tableData.setGridStatusFilter}
        gridCustomerFilter={tableData.gridCustomerFilter}
        setGridCustomerFilter={tableData.setGridCustomerFilter}
        onlyEmpty={tableData.onlyEmpty}
        setOnlyEmpty={tableData.setOnlyEmpty}
        users={tableData.users}
        handleBulkWatering={tableData.handleBulkWatering}
        handleBulkFertilizing={tableData.handleBulkFertilizing}
      />
      <BedsGridCanvas
        locations={tableData.locations}
        filteredLocations={tableData.filteredLocations}
        selectedLocationId={tableData.selectedLocationId}
        handleCellClick={tableData.handleCellClick}
        handleMouseDown={tableData.handleMouseDown}
        handleMouseMove={tableData.handleMouseMove}
        handleMouseUpOrLeave={tableData.handleMouseUpOrLeave}
        handleDrop={tableData.handleDrop}
        hoveredCell={tableData.hoveredCell}
        setHoveredCell={tableData.setHoveredCell}
        tooltipPos={tableData.tooltipPos}
        setTooltipPos={tableData.setTooltipPos}
        getCellTree={tableData.getCellTree}
        getOwnerName={tableData.getOwnerName}
        zoomScale={tableData.zoomScale}
        zoomIn={tableData.zoomIn}
        zoomOut={tableData.zoomOut}
        zoomReset={tableData.zoomReset}
        panOffset={tableData.panOffset}
        isPanning={tableData.isPanning}
        gridRows={tableData.gridRows}
        setGridRows={tableData.setGridRows}
        gridCols={tableData.gridCols}
        setGridCols={tableData.setGridCols}
        handleGenerateGrid={tableData.handleGenerateGrid}
      />
    </div>
  )
}

function BedsTreesTab({ tableData }: { tableData: any }) {
  const { trees, activeBed, getOwnerName } = tableData

  const bedTrees = trees.filter((t: Tree) => t.bedCode === activeBed.code)

  return (
    <div className="flex-1 bg-white dark:bg-slate-900 border rounded-xl overflow-hidden shadow-xxs">
      <Table>
        <TableHeader className="bg-slate-50/50">
          <TableRow>
            <TableHead className="font-bold text-xs text-slate-600">Mã cây sâm</TableHead>
            <TableHead className="font-bold text-xs text-slate-600">Tên giống cây</TableHead>
            <TableHead className="font-bold text-xs text-slate-600">Tuổi cây</TableHead>
            <TableHead className="font-bold text-xs text-slate-600">Chủ sở hữu</TableHead>
            <TableHead className="font-bold text-xs text-slate-600">Giá trị mua</TableHead>
            <TableHead className="font-bold text-xs text-slate-600">Ngày trồng</TableHead>
            <TableHead className="font-bold text-xs text-slate-600 text-right">Trạng thái</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {bedTrees.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className="text-center py-12 text-slate-400 font-semibold">
                Chưa có cây sâm nào được trồng trong luống hiện tại.
              </TableCell>
            </TableRow>
          ) : (
            bedTrees.map((tree: Tree) => (
              <TableRow key={tree.id} className="hover:bg-slate-50/20">
                <TableCell className="font-mono text-xs font-bold text-emerald-800">{tree.code}</TableCell>
                <TableCell className="font-semibold text-slate-800 text-xs">{tree.name}</TableCell>
                <TableCell className="text-slate-600 text-xs font-bold">{tree.ageYear} năm tuổi</TableCell>
                <TableCell className="text-slate-600 text-xs font-medium">{getOwnerName(tree.ownerUserId)}</TableCell>
                <TableCell className="font-mono text-slate-700 text-xs font-bold">{formatVND(tree.priceBought || 0)}</TableCell>
                <TableCell className="text-slate-500 font-mono text-xs">
                  {tree.plantedAt ? new Date(tree.plantedAt).toLocaleDateString("vi-VN", { timeZone: "Asia/Ho_Chi_Minh" }) : "N/A"}
                </TableCell>
                <TableCell className="text-right">{getHealthBadge(tree.healthStatus)}</TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  )
}

function BedsOverviewTab({ tableData }: { tableData: any }) {
  const { activeBed, totalGridCells, emptyCount, plantedCount, sickCount, deadCount } = tableData

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {/* Parameters specs list */}
      <div className="bg-white dark:bg-slate-900 border rounded-xl p-4 shadow-xxs space-y-4">
        <h4 className="font-bold text-slate-800 dark:text-slate-100 text-sm flex items-center gap-1.5">
          <Activity className="h-4 w-4 text-emerald-600" />
          Thông số canh tác chi tiết
        </h4>
        <div className="grid grid-cols-2 gap-3 text-xs">
          <div className="flex flex-col gap-1 border-b pb-2 border-slate-50">
            <span className="text-slate-400">Tên luống trồng:</span>
            <span className="font-bold text-slate-700 dark:text-slate-350">{activeBed.name}</span>
          </div>
          <div className="flex flex-col gap-1 border-b pb-2 border-slate-50">
            <span className="text-slate-400">Khu vực vườn:</span>
            <span className="font-bold text-slate-700 dark:text-slate-350">{activeBed.gardenCode}</span>
          </div>
          <div className="flex flex-col gap-1 border-b pb-2 border-slate-50">
            <span className="text-slate-400">Kích thước luống:</span>
            <span className="font-bold text-slate-700 dark:text-slate-350 font-mono">
              {activeBed.width || 2}m × {activeBed.length || 10}m
            </span>
          </div>
          <div className="flex flex-col gap-1 border-b pb-2 border-slate-50">
            <span className="text-slate-400">Diện tích quy hoạch:</span>
            <span className="font-bold text-slate-700 dark:text-slate-350 font-mono">
              {(activeBed.width || 2) * (activeBed.length || 10)} m²
            </span>
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-slate-400">Lần tưới gần nhất:</span>
            <span className="font-bold text-emerald-600">{formatDaysAgo(activeBed.lastWateredAt)}</span>
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-slate-400">Lần bón phân gần nhất:</span>
            <span className="font-bold text-amber-600">{formatDaysAgo(activeBed.lastFertilizedAt)}</span>
          </div>
        </div>
        {activeBed.description && (
          <div className="pt-2 border-t text-xs">
            <span className="text-slate-400 block mb-1">Ghi chú đặc thù:</span>
            <p className="text-slate-650 dark:text-slate-400 leading-relaxed font-semibold italic">{activeBed.description}</p>
          </div>
        )}
      </div>

      {/* Grid capacity pie cards layout */}
      <div className="bg-white dark:bg-slate-900 border rounded-xl p-4 shadow-xxs space-y-4">
        <h4 className="font-bold text-slate-800 dark:text-slate-100 text-sm flex items-center gap-1.5">
          <Leaf className="h-4 w-4 text-emerald-600" />
          Phân bổ mật độ & Sức khỏe
        </h4>
        <div className="grid grid-cols-2 gap-3 text-xs">
          <div className="bg-slate-50 dark:bg-slate-800/40 rounded-lg p-2.5 border border-slate-150 dark:border-slate-800/60">
            <span className="text-slate-400 dark:text-slate-500 text-[10px] block">MẬT ĐỘ Ô ĐẤT LƯỚI</span>
            <span className="font-bold text-base text-slate-700 dark:text-slate-300 mt-1 block">
              {plantedCount} / {totalGridCells || 80} ô
            </span>
          </div>
          <div className="bg-slate-50 dark:bg-slate-800/40 rounded-lg p-2.5 border border-slate-150 dark:border-slate-800/60">
            <span className="text-slate-400 dark:text-slate-500 text-[10px] block">SỐ LƯỢNG Ô ĐẤT TRỐNG</span>
            <span className="font-bold text-base text-slate-700 dark:text-slate-300 mt-1 block">
              {emptyCount} ô trống
            </span>
          </div>
          <div className="bg-emerald-50/50 dark:bg-emerald-950/20 text-emerald-800 dark:text-emerald-350 rounded-lg p-2.5 border border-emerald-100/80 dark:border-emerald-900/50">
            <span className="text-emerald-600 dark:text-emerald-500 text-[10px] block font-bold">KHỎE MẠNH (HEALTHY)</span>
            <span className="font-bold text-base mt-1 block">
              {plantedCount - sickCount - deadCount} cây sâm
            </span>
          </div>
          <div className="bg-red-50/50 dark:bg-red-950/20 text-red-800 dark:text-red-350 rounded-lg p-2.5 border border-red-100/80 dark:border-red-900/50">
            <span className="text-red-650 dark:text-red-500 text-[10px] block font-bold">CẦN CHĂM SÓC / HẠI</span>
            <span className="font-bold text-base mt-1 block">
              {sickCount + deadCount} cây sâm
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

function BedsLogsTab({ tableData }: { tableData: any }) {
  const { selectedBedCode } = tableData
  const [logs, setLogs] = useState<any[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const fetchLogs = async () => {
      setLoading(true)
      try {
        const res = await fetchApi(`/user/cultivation/care-logs?bedCode=${selectedBedCode}`)
        const payload = await res.json()
        if (res.status < 400 && Array.isArray(payload.data)) {
          setLogs(payload.data)
        }
      } catch (e) {
        console.error(e)
      } finally {
        setLoading(false)
      }
    }
    if (selectedBedCode) {
      fetchLogs()
    }
  }, [selectedBedCode])

  return (
    <div className="flex-1 bg-white dark:bg-slate-900 border rounded-xl overflow-hidden shadow-xxs flex flex-col">
      <div className="p-3 border-b bg-slate-50/50 dark:bg-slate-900/50 flex items-center justify-between border-slate-100 dark:border-slate-800">
        <span className="text-xs font-bold text-slate-650 dark:text-slate-350">Nhật ký lịch sử canh tác luống</span>
      </div>
      <div className="flex-1 overflow-y-auto p-4">
        {loading ? (
          <div className="text-center py-12 text-slate-500 dark:text-slate-400 font-bold">Đang tải lịch sử...</div>
        ) : logs.length === 0 ? (
          <div className="text-center py-12 text-slate-400 dark:text-slate-500 font-semibold text-xs">Chưa ghi nhận hoạt động chăm sóc nào tại luống này.</div>
        ) : (
          <div className="space-y-4 relative before:absolute before:left-3 before:top-2 before:bottom-2 before:w-[1px] before:bg-slate-100 dark:before:bg-slate-800">
            {logs.map((log) => (
              <div key={log.id} className="relative pl-6 text-xs">
                <div className="absolute left-[9px] top-1.5 w-2 h-2 rounded-full bg-emerald-600 ring-4 ring-white dark:ring-slate-950"></div>
                <div className="flex justify-between items-center text-slate-400 dark:text-slate-500 mb-1">
                  <span className="font-bold text-slate-700 dark:text-slate-350 text-xs">
                    {log.title || "Chăm sóc định kỳ"}
                  </span>
                  <span className="font-mono text-[10px]">
                    {new Date(log.createdAt).toLocaleString("vi-VN", { timeZone: "Asia/Ho_Chi_Minh" })}
                  </span>
                </div>
                <p className="text-slate-600 dark:text-slate-400 leading-relaxed font-medium">{log.description}</p>
                {log.treeCode && (
                  <span className="inline-block bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-mono text-[8px] font-bold px-1.5 py-0.5 rounded mt-1 border border-slate-200 dark:border-slate-700">
                    Cây: {log.treeCode}
                  </span>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
