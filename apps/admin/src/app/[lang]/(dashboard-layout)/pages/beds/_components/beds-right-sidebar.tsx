"use client"

import React from "react"
import {
  Activity,
  Calendar,
  ChevronRight,
  Droplets,
  Flame,
  Heart,
  Loader2,
  RefreshCw,
  ShieldAlert,
  Sprout,
  User,
} from "lucide-react"

import type { CultivationBedLocation, Tree } from "./use-beds-table"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"

interface BedsRightSidebarProps {
  rightSidebarOpen: boolean
  setRightSidebarOpen: (open: boolean) => void
  selectedLocationId: string | null
  locations: CultivationBedLocation[]
  loadingTreeDetails: boolean
  selectedTreeDetails: any | null
  selectedTreeCareLogs: any[]
  handleSingleWatering: (loc: CultivationBedLocation) => void
  handleSingleFertilizing: (loc: CultivationBedLocation) => void
  getOwnerName: (userId: string | undefined) => string
}

const vndFormatter = new Intl.NumberFormat("vi-VN", {
  style: "currency",
  currency: "VND",
})

const formatVND = (price: number) => {
  return vndFormatter.format(price)
}

const getHealthBadge = (health: string | undefined) => {
  switch (health?.toLowerCase()) {
    case "healthy":
      return (
        <Badge className="bg-emerald-500/15 text-emerald-600 border-transparent text-[9px] font-bold py-0.5 rounded-md flex items-center gap-1">
          <Heart className="h-2.5 w-2.5 fill-emerald-600 text-emerald-600" />
          Khỏe mạnh
        </Badge>
      )
    case "sick":
      return (
        <Badge className="bg-amber-500/15 text-amber-600 border-transparent text-[9px] font-bold py-0.5 rounded-md flex items-center gap-1">
          <Droplets className="h-2.5 w-2.5 text-amber-600" />
          Cần tưới nước
        </Badge>
      )
    case "dead":
      return (
        <Badge className="bg-red-500/15 text-red-600 border-transparent text-[9px] font-bold py-0.5 rounded-md flex items-center gap-1">
          <ShieldAlert className="h-2.5 w-2.5 text-red-600" />
          Sâu bệnh hại
        </Badge>
      )
    default:
      return (
        <Badge
          variant="outline"
          className="text-[9px] font-bold py-0.5 rounded-md"
        >
          Chưa trồng
        </Badge>
      )
  }
}

export function BedsRightSidebar({
  rightSidebarOpen,
  setRightSidebarOpen,
  selectedLocationId,
  locations,
  loadingTreeDetails,
  selectedTreeDetails,
  selectedTreeCareLogs,
  handleSingleWatering,
  handleSingleFertilizing,
  getOwnerName,
}: BedsRightSidebarProps) {
  const activeLoc = locations.find((l) => l.id === selectedLocationId)

  return (
    <div
      className={`flex flex-col h-full bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl overflow-hidden shadow-xs transition-all duration-300 ${
        rightSidebarOpen
          ? "w-full lg:w-80"
          : "w-0 lg:w-0 opacity-0 pointer-events-none hidden"
      }`}
    >
      <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
        <div>
          <h2 className="text-sm font-bold tracking-tight text-slate-800 dark:text-slate-100">
            Chi tiết tọa độ
          </h2>
        </div>
        <button
          type="button"
          onClick={() => setRightSidebarOpen(false)}
          className="p-1 text-slate-400 hover:text-slate-600 rounded hover:bg-slate-100 dark:hover:bg-slate-800 hidden lg:block"
          title="Thu gọn bảng tin"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {activeLoc ? (
          <>
            {/* Header Coordinate Card */}
            <div className="bg-slate-50 dark:bg-slate-800/40 p-3 rounded-xl border border-slate-200/50 dark:border-slate-800 flex items-center justify-between">
              <div>
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  Tọa độ ô đất
                </div>
                <div className="text-sm font-bold text-slate-700 dark:text-slate-300 font-mono mt-0.5">
                  Hàng {activeLoc.row + 1} - Cột {activeLoc.col + 1}
                </div>
              </div>
              <div className="h-8 px-2.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 font-mono font-bold text-xs flex items-center justify-center">
                {activeLoc.code}
              </div>
            </div>

            {loadingTreeDetails ? (
              <div className="flex flex-col items-center justify-center py-16 gap-3">
                <Loader2 className="h-6 w-6 text-emerald-600 animate-spin" />
                <span className="text-xs text-slate-400 font-semibold">
                  Đang tải hồ sơ gốc sâm...
                </span>
              </div>
            ) : selectedTreeDetails ? (
              <>
                {/* Tree Identity Card */}
                <div className="space-y-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-bold text-sm text-slate-800 dark:text-slate-100">
                        {selectedTreeDetails.name}
                      </h4>
                      <p className="text-[10px] text-slate-400 font-mono mt-0.5">
                        Mã sâm: {selectedTreeDetails.code}
                      </p>
                    </div>
                    {getHealthBadge(selectedTreeDetails.healthStatus)}
                  </div>

                  <div className="border-t border-slate-100 dark:border-slate-800 pt-3 space-y-2 text-xs">
                    <div className="flex justify-between py-1 border-b border-slate-50 dark:border-slate-800/40">
                      <span className="text-slate-400 flex items-center gap-1.5">
                        <User className="h-3.5 w-3.5 text-slate-400" />
                        Chủ sở hữu:
                      </span>
                      <span className="font-semibold text-slate-700 dark:text-slate-350">
                        {getOwnerName(selectedTreeDetails.ownerUserId)}
                      </span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-slate-50 dark:border-slate-800/40">
                      <span className="text-slate-400 flex items-center gap-1.5">
                        <Activity className="h-3.5 w-3.5 text-slate-400" />
                        Độ tuổi cây:
                      </span>
                      <span className="font-bold text-slate-700 dark:text-slate-350">
                        {selectedTreeDetails.ageYear} năm tuổi
                      </span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-slate-50 dark:border-slate-800/40">
                      <span className="text-slate-400 flex items-center gap-1.5">
                        <Calendar className="h-3.5 w-3.5 text-slate-400" />
                        Thời gian trồng:
                      </span>
                      <span className="font-semibold text-slate-700 dark:text-slate-350 font-mono">
                        {selectedTreeDetails.plantedAt
                          ? new Date(
                              selectedTreeDetails.plantedAt
                            ).toLocaleDateString("vi-VN", {
                              timeZone: "Asia/Ho_Chi_Minh",
                            })
                          : "N/A"}
                      </span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-slate-50 dark:border-slate-800/40">
                      <span className="text-slate-400 flex items-center gap-1.5">
                        <RefreshCw className="h-3.5 w-3.5 text-slate-400" />
                        Dự kiến thu hoạch:
                      </span>
                      <span className="font-bold text-emerald-600 font-mono">
                        {selectedTreeDetails.expectedHarvestAt
                          ? new Date(
                              selectedTreeDetails.expectedHarvestAt
                            ).toLocaleDateString("vi-VN", {
                              timeZone: "Asia/Ho_Chi_Minh",
                            })
                          : "N/A"}
                      </span>
                    </div>
                    <div className="flex justify-between py-1">
                      <span className="text-slate-400 flex items-center gap-1.5">
                        <Flame className="h-3.5 w-3.5 text-slate-400" />
                        Giá trị mua:
                      </span>
                      <span className="font-bold text-emerald-700 dark:text-emerald-400 font-mono">
                        {formatVND(selectedTreeDetails.priceBought || 0)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Operations Quick Card */}
                <div className="bg-slate-50/50 dark:bg-slate-800/20 border border-slate-200/50 dark:border-slate-800 p-3 rounded-xl space-y-2">
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                    Thao tác chăm sóc
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <Button
                      onClick={() => handleSingleWatering(activeLoc)}
                      size="sm"
                      variant="outline"
                      className="h-8 text-[10px] font-semibold border-slate-200 hover:text-emerald-600"
                    >
                      <Droplets className="h-3.5 w-3.5 mr-1 text-emerald-500" />{" "}
                      Tưới nước
                    </Button>
                    <Button
                      onClick={() => handleSingleFertilizing(activeLoc)}
                      size="sm"
                      variant="outline"
                      className="h-8 text-[10px] font-semibold border-slate-200 hover:text-amber-600"
                    >
                      <Flame className="h-3.5 w-3.5 mr-1 text-amber-500" /> Bón
                      phân
                    </Button>
                  </div>
                </div>

                {/* Care logs chronological view */}
                <div className="space-y-2.5">
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    Nhật ký chăm sóc gốc sâm
                  </div>
                  <ScrollArea className="h-[150px] w-full border rounded-lg p-2.5 bg-white dark:bg-slate-900/20">
                    {selectedTreeCareLogs.length === 0 ? (
                      <div className="text-center py-8 text-[10px] text-slate-450 font-semibold">
                        Chưa có hoạt động nào được ghi nhận.
                      </div>
                    ) : (
                      <div className="space-y-3 relative before:absolute before:left-2 before:top-2 before:bottom-2 before:w-[1px] before:bg-slate-100 dark:before:bg-slate-800">
                        {selectedTreeCareLogs.map((log: any) => (
                          <div
                            key={log.id}
                            className="relative pl-5 text-[10px]"
                          >
                            <div className="absolute left-[5px] top-1.5 w-1.5 h-1.5 rounded-full bg-emerald-500 ring-2 ring-white dark:ring-slate-900"></div>
                            <div className="flex justify-between items-center text-slate-400">
                              <span className="font-bold">
                                {log.title || "Chăm sóc"}
                              </span>
                              <span className="font-mono text-[9px]">
                                {new Date(log.createdAt).toLocaleDateString(
                                  "vi-VN",
                                  { timeZone: "Asia/Ho_Chi_Minh" }
                                )}
                              </span>
                            </div>
                            <p className="text-slate-500 dark:text-slate-400 mt-0.5 leading-relaxed">
                              {log.description}
                            </p>
                          </div>
                        ))}
                      </div>
                    )}
                  </ScrollArea>
                </div>
              </>
            ) : (
              <div className="flex flex-col items-center justify-center py-20 text-center text-slate-400 font-semibold gap-2 border border-dashed rounded-xl bg-slate-50/20 dark:bg-slate-800/10">
                <Sprout className="h-8 w-8 text-slate-300" />
                <div className="text-[11px]">Ô đất trống (Empty)</div>
                <p className="text-[10px] text-slate-400 max-w-[200px] font-normal">
                  Chưa có cây sâm Ngọc Linh nào được gieo trồng tại ô đất này.
                  Kéo sâm thả vào để bắt đầu.
                </p>
              </div>
            )}
          </>
        ) : (
          <div className="flex flex-col items-center justify-center py-32 text-center text-slate-455 font-semibold gap-2.5">
            <Sprout className="h-7 w-7 text-slate-350 animate-pulse" />
            <div className="text-xs">Chưa chọn vị trí ô đất</div>
            <p className="text-[10px] text-slate-400 max-w-[220px] font-medium leading-relaxed">
              Vui lòng nhấp vào bất kỳ tọa độ ô đất nào trên sơ đồ lưới trung
              tâm để xem và biên soạn hồ sơ cây sâm.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
