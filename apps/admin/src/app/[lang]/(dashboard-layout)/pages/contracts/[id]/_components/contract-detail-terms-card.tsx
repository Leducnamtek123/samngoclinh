"use client"

import React from "react"
import { DollarSign } from "lucide-react"
import { useTranslation } from "@/providers/i18n-provider"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

import type { EContract } from "@/types"

interface ContractDetailTermsCardProps {
  contract: EContract
  meta: Record<string, unknown>
  formatVND: (val: number) => string
}

export function ContractDetailTermsCard({
  contract,
  meta,
  formatVND,
}: ContractDetailTermsCardProps) {
  const { t } = useTranslation()
  const paymentStatus = contract.paymentStatus || "unpaid"
  const expireDateStr = contract.expiresAt || contract.expiredAt
  const effectiveExpireDateStr = contract.effectiveExpiredAt || contract.expiresAt || contract.expiredAt

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base flex items-center gap-2">
          <DollarSign className="w-4 h-4 text-emerald-600" /> {t("contracts.contractInfo")}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3 text-sm">
        <div className="flex justify-between items-center py-1 border-b border-border/40">
          <span className="text-muted-foreground">{t("contracts.fields.totalValue")}:</span>
          <span className="font-extrabold text-primary text-base">
            {formatVND(contract.totalValue || contract.contractValue || 0)}
          </span>
        </div>
        <div className="flex justify-between items-center py-1 border-b border-border/40">
          <span className="text-muted-foreground">{t("contracts.fields.paymentStatus")}:</span>
          <Badge
            variant="outline"
            className={
              paymentStatus === "paid"
                ? "bg-emerald-50 text-emerald-700 border-emerald-300 font-semibold"
                : "bg-amber-50 text-amber-700 border-amber-300 font-semibold"
            }
          >
            {paymentStatus === "paid" ? t("contracts.wizard.paid") : t("contracts.wizard.unpaid")}
          </Badge>
        </div>
        <div className="flex justify-between items-center py-1 border-b border-border/40">
          <span className="text-muted-foreground">{t("contracts.fields.tree")}:</span>
          <span className="font-mono font-semibold">
            {contract.treeCode || (contract.treeCodes ? contract.treeCodes.join(", ") : null) || (meta?.totalPlants ? t("contracts.wizard.plantsUnit", { count: String(meta.totalPlants) }) : "—")}
          </span>
        </div>
        <div className="flex justify-between items-center py-1 border-b border-border/40">
          <span className="text-muted-foreground">{t("contracts.fields.createdAt")}:</span>
          <span className="font-medium">
            {contract.createdAt ? new Date(contract.createdAt).toLocaleDateString("vi-VN", { timeZone: "Asia/Ho_Chi_Minh" }) : "—"}
          </span>
        </div>
        <div className="flex justify-between items-center py-1 border-b border-border/40">
          <span className="text-muted-foreground">{t("contracts.fields.initialDuration")}:</span>
          <span className="font-semibold text-slate-700 dark:text-slate-300">
            {expireDateStr ? new Date(expireDateStr).toLocaleDateString("vi-VN", { timeZone: "Asia/Ho_Chi_Minh" }) : "—"}
          </span>
        </div>
        <div className="flex justify-between items-center py-1">
          <span className="text-muted-foreground">{t("contracts.fields.currentValidity")}:</span>
          <span className="font-bold text-emerald-600 dark:text-emerald-400">
            {effectiveExpireDateStr ? new Date(effectiveExpireDateStr).toLocaleDateString("vi-VN", { timeZone: "Asia/Ho_Chi_Minh" }) : "—"}
          </span>
        </div>
      </CardContent>
    </Card>
  )
}
