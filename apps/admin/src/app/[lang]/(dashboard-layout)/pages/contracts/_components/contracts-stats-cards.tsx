"use client"

import React from "react"
import {
  FileText,
  Clock,
  CheckCircle2,
  AlertTriangle,
  FileCheck,
} from "lucide-react"
import { Card } from "@/components/ui/card"

interface ContractsStatsCardsProps {
  stats: {
    total: number
    pending: number
    signed: number
    expiringSoon: number
    expired: number
  }
}

export function ContractsStatsCards({ stats }: ContractsStatsCardsProps) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
      <Card className="p-4 bg-white dark:bg-slate-900 shadow-2xs border-slate-200 dark:border-slate-800">
        <div className="flex items-center justify-between">
          <span className="text-xs text-muted-foreground font-medium">Tổng hợp đồng</span>
          <FileText className="w-4 h-4 text-slate-500" />
        </div>
        <div className="mt-2 flex items-baseline gap-2">
          <span className="text-2xl font-black text-slate-900 dark:text-white">{stats.total}</span>
          <span className="text-[10px] text-muted-foreground">văn bản</span>
        </div>
      </Card>

      <Card className="p-4 bg-amber-50/50 dark:bg-amber-950/20 border-amber-200/80 dark:border-amber-900/40 shadow-2xs">
        <div className="flex items-center justify-between">
          <span className="text-xs text-amber-800 dark:text-amber-300 font-semibold">Chờ khách ký</span>
          <Clock className="w-4 h-4 text-amber-600" />
        </div>
        <div className="mt-2 flex items-baseline gap-2">
          <span className="text-2xl font-black text-amber-700 dark:text-amber-400">{stats.pending}</span>
          <span className="text-[10px] text-amber-700/70">hợp đồng</span>
        </div>
      </Card>

      <Card className="p-4 bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-200/80 dark:border-emerald-900/40 shadow-2xs">
        <div className="flex items-center justify-between">
          <span className="text-xs text-emerald-800 dark:text-emerald-300 font-semibold">Đã ký</span>
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
        </div>
        <div className="mt-2 flex items-baseline gap-2">
          <span className="text-2xl font-black text-emerald-700 dark:text-emerald-400">{stats.signed}</span>
          <span className="text-[10px] text-emerald-700/70">có hiệu lực</span>
        </div>
      </Card>

      <Card className="p-4 bg-orange-50/50 dark:bg-orange-950/20 border-orange-200/80 dark:border-orange-900/40 shadow-2xs">
        <div className="flex items-center justify-between">
          <span className="text-xs text-orange-800 dark:text-orange-300 font-semibold">Sắp hết hạn (&le;30 ngày)</span>
          <AlertTriangle className="w-4 h-4 text-orange-600" />
        </div>
        <div className="mt-2 flex items-baseline gap-2">
          <span className="text-2xl font-black text-orange-700 dark:text-orange-400">{stats.expiringSoon}</span>
          <span className="text-[10px] text-orange-700/70">cần gia hạn</span>
        </div>
      </Card>

      <Card className="p-4 bg-slate-50 dark:bg-slate-900/80 border-slate-200 dark:border-slate-800 shadow-2xs">
        <div className="flex items-center justify-between">
          <span className="text-xs text-muted-foreground font-medium">Đã hết hạn</span>
          <FileCheck className="w-4 h-4 text-slate-400" />
        </div>
        <div className="mt-2 flex items-baseline gap-2">
          <span className="text-2xl font-black text-slate-700 dark:text-slate-300">{stats.expired}</span>
          <span className="text-[10px] text-muted-foreground">hết hiệu lực</span>
        </div>
      </Card>
    </div>
  )
}
