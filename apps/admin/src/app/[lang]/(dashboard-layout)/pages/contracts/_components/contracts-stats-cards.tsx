"use client"

import React from "react"
import {
  FileText,
  Clock,
  CheckCircle2,
  AlertTriangle,
  FileCheck,
  FileEdit,
} from "lucide-react"
import { Card } from "@/components/ui/card"

interface ContractsStatsCardsProps {
  stats: {
    total: number
    draft?: number
    pending: number
    signed: number
    expiringSoon: number
    expired: number
  }
}

export function ContractsStatsCards({ stats }: ContractsStatsCardsProps) {
  const statItems = [
    {
      title: "Tổng hợp đồng",
      value: stats.total,
      unit: "văn bản",
      icon: FileText,
      iconColor: "text-slate-600 dark:text-slate-400",
      iconBg: "bg-slate-100 dark:bg-slate-800",
    },
    {
      title: "Chờ BQL phát hành",
      value: stats.draft || 0,
      unit: "bản nháp",
      icon: FileEdit,
      iconColor: "text-purple-600 dark:text-purple-400",
      iconBg: "bg-purple-100/70 dark:bg-purple-950/40",
    },
    {
      title: "Chờ khách ký",
      value: stats.pending,
      unit: "hợp đồng",
      icon: Clock,
      iconColor: "text-amber-600 dark:text-amber-400",
      iconBg: "bg-amber-100/70 dark:bg-amber-950/40",
    },
    {
      title: "Đã ký hợp lệ",
      value: stats.signed,
      unit: "có hiệu lực",
      icon: CheckCircle2,
      iconColor: "text-emerald-600 dark:text-emerald-400",
      iconBg: "bg-emerald-100/70 dark:bg-emerald-950/40",
    },
    {
      title: "Sắp hết hạn (≤30 ngày)",
      value: stats.expiringSoon,
      unit: "cần gia hạn",
      icon: AlertTriangle,
      iconColor: "text-orange-600 dark:text-orange-400",
      iconBg: "bg-orange-100/70 dark:bg-orange-950/40",
    },
    {
      title: "Đã hết hạn",
      value: stats.expired,
      unit: "hết hiệu lực",
      icon: FileCheck,
      iconColor: "text-slate-500 dark:text-slate-400",
      iconBg: "bg-slate-100 dark:bg-slate-800",
    },
  ]

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5">
      {statItems.map((item) => {
        const Icon = item.icon
        return (
          <Card
            key={item.title}
            className="p-4 bg-card border-border/80 shadow-2xs hover:shadow-xs transition-shadow"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground font-medium truncate">
                {item.title}
              </span>
              <div className={`p-1.5 rounded-lg ${item.iconBg}`}>
                <Icon className={`w-3.5 h-3.5 ${item.iconColor}`} />
              </div>
            </div>
            <div className="mt-2.5 flex items-baseline gap-1.5">
              <span className="text-2xl font-black tracking-tight text-foreground">
                {item.value}
              </span>
              <span className="text-[11px] text-muted-foreground">
                {item.unit}
              </span>
            </div>
          </Card>
        )
      })}
    </div>
  )
}

