"use client"

import React from "react"
import { DollarSign } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface ContractDetailTermsCardProps {
  contract: any
  meta: any
  formatVND: (val: number) => string
}

export function ContractDetailTermsCard({
  contract,
  meta,
  formatVND,
}: ContractDetailTermsCardProps) {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base flex items-center gap-2">
          <DollarSign className="w-4 h-4 text-emerald-600" /> Thông tin hợp đồng
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3 text-sm">
        <div className="flex justify-between items-center py-1 border-b border-border/40">
          <span className="text-muted-foreground">Giá trị hợp đồng:</span>
          <span className="font-extrabold text-primary text-base">
            {formatVND(contract.contractValue)}
          </span>
        </div>
        <div className="flex justify-between items-center py-1 border-b border-border/40">
          <span className="text-muted-foreground">Thanh toán:</span>
          <Badge
            variant="outline"
            className={
              contract.paymentStatus === "paid"
                ? "bg-emerald-50 text-emerald-700 border-emerald-300 font-semibold"
                : "bg-amber-50 text-amber-700 border-amber-300 font-semibold"
            }
          >
            {contract.paymentStatus === "paid" ? "Đã thanh toán" : "Chưa thanh toán"}
          </Badge>
        </div>
        <div className="flex justify-between items-center py-1 border-b border-border/40">
          <span className="text-muted-foreground">Mã cây sâm:</span>
          <span className="font-mono font-semibold">
            {contract.treeCode || (meta?.totalPlants ? `${meta.totalPlants} cây sâm (Lô)` : "—")}
          </span>
        </div>
        <div className="flex justify-between items-center py-1 border-b border-border/40">
          <span className="text-muted-foreground">Ngày lập:</span>
          <span className="font-medium">
            {new Date(contract.createdAt).toLocaleDateString("vi-VN", { timeZone: "Asia/Ho_Chi_Minh" })}
          </span>
        </div>
        <div className="flex justify-between items-center py-1 border-b border-border/40">
          <span className="text-muted-foreground">Thời hạn ban đầu:</span>
          <span className="font-semibold text-slate-700 dark:text-slate-300">
            {new Date(contract.expiredAt).toLocaleDateString("vi-VN", { timeZone: "Asia/Ho_Chi_Minh" })}
          </span>
        </div>
        <div className="flex justify-between items-center py-1">
          <span className="text-muted-foreground">Hiệu lực hiện tại:</span>
          <span className="font-bold text-emerald-600 dark:text-emerald-400">
            {new Date(contract.effectiveExpiredAt || contract.expiredAt).toLocaleDateString("vi-VN", { timeZone: "Asia/Ho_Chi_Minh" })}
          </span>
        </div>
      </CardContent>
    </Card>
  )
}
