"use client"

import React from "react"
import {
  ArrowLeft,
  CheckCircle2,
  Save,
  Send,
  ShieldCheck,
  UserCheck,
} from "lucide-react"

import type { AdminUser } from "@/types"

import { useTranslation } from "@/providers/i18n-provider"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

interface CreateContractStep4Props {
  title: string
  selectedUser: AdminUser | null
  contractValue: number
  paymentStatus: string
  selectedTreeCode: string
  expiredAt: string
  formatDateViDisplay: (dateStr: string) => string
  onBackToStep3: () => void
  onSubmit: (status: "draft" | "pending") => void
  isSubmitting: boolean
}

export function CreateContractStep4Confirm({
  title,
  selectedUser,
  contractValue,
  paymentStatus,
  selectedTreeCode,
  expiredAt,
  formatDateViDisplay,
  onBackToStep3,
  onSubmit,
  isSubmitting,
}: CreateContractStep4Props) {
  const { t } = useTranslation()

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Card className="border-emerald-200 dark:border-emerald-950 shadow-md">
        <CardHeader className="bg-emerald-50/50 dark:bg-emerald-950/20 border-b border-emerald-100 dark:border-emerald-900/40">
          <CardTitle className="text-lg flex items-center gap-2 text-emerald-800 dark:text-emerald-300">
            <ShieldCheck className="w-5 h-5 text-emerald-600" />{" "}
            {t("contracts.wizard.step4Title")}
          </CardTitle>
          <CardDescription>{t("contracts.wizard.step4Notice")}</CardDescription>
        </CardHeader>
        <CardContent className="p-6 space-y-6">
          {/* Summary Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-slate-50 dark:bg-slate-900/70 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 text-sm">
            <div>
              <span className="text-xs text-muted-foreground block">
                {t("contracts.wizard.contractTitleLabel")}
              </span>
              <span className="font-bold text-slate-900 dark:text-white">
                {title}
              </span>
            </div>
            <div>
              <span className="text-xs text-muted-foreground block">
                {t("contracts.wizard.sourceLabel")}
              </span>
              <Badge
                variant="outline"
                className="bg-purple-50 text-purple-700 border-purple-200"
              >
                {t("contracts.wizard.manualSource")}
              </Badge>
            </div>
            <div>
              <span className="text-xs text-muted-foreground block">
                {t("contracts.wizard.customerLabel")}
              </span>
              <span className="font-semibold text-slate-900 dark:text-white">
                {selectedUser?.name || selectedUser?.username} (
                {selectedUser?.email})
              </span>
            </div>
            <div>
              <span className="text-xs text-muted-foreground block">
                {t("contracts.wizard.ekycLabel")}
              </span>
              {selectedUser?.isVerified ? (
                <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700">
                  <UserCheck className="w-3.5 h-3.5" />{" "}
                  {t("contracts.wizard.ekycVerified")}
                </span>
              ) : (
                <span className="text-xs text-amber-600">
                  {t("contracts.wizard.ekycUnverified")}
                </span>
              )}
            </div>
            <div>
              <span className="text-xs text-muted-foreground block">
                {t("contracts.wizard.totalValueLabel")}
              </span>
              <span className="text-base font-extrabold text-primary">
                {contractValue.toLocaleString("vi-VN")} VNĐ
              </span>
            </div>
            <div>
              <span className="text-xs text-muted-foreground block">
                {t("contracts.wizard.paymentStatusLabel")}
              </span>
              <Badge
                variant="outline"
                className={
                  paymentStatus === "paid"
                    ? "bg-emerald-100 text-emerald-800 border-emerald-300"
                    : "bg-amber-100 text-amber-800 border-amber-300"
                }
              >
                {paymentStatus === "paid"
                  ? t("contracts.wizard.paid")
                  : t("contracts.wizard.unpaid")}
              </Badge>
            </div>
            <div>
              <span className="text-xs text-muted-foreground block">
                {t("contracts.wizard.treeCodeLabel")}
              </span>
              <span className="font-mono text-xs">
                {selectedTreeCode !== "none"
                  ? selectedTreeCode
                  : t("contracts.wizard.managedByQuantity")}
              </span>
            </div>
            <div>
              <span className="text-xs text-muted-foreground block">
                {t("contracts.wizard.validityLabel")}
              </span>
              <span className="font-semibold">
                {formatDateViDisplay(expiredAt)}
              </span>
            </div>
          </div>

          {/* Validation Checklist */}
          <div className="space-y-2.5">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
              {t("contracts.wizard.releaseConditions")}
            </h4>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-xs font-medium text-emerald-700 bg-emerald-50/70 dark:bg-emerald-950/30 p-2 rounded-lg border border-emerald-200 dark:border-emerald-900">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>
                  {t("contracts.wizard.condCustomerValid", {
                    email: selectedUser?.email || "",
                  })}
                </span>
              </div>
              <div className="flex items-center gap-2 text-xs font-medium text-emerald-700 bg-emerald-50/70 dark:bg-emerald-950/30 p-2 rounded-lg border border-emerald-200 dark:border-emerald-900">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>
                  {t("contracts.wizard.condValueValid", {
                    value: contractValue.toLocaleString("vi-VN"),
                  })}
                </span>
              </div>
              <div className="flex items-center gap-2 text-xs font-medium text-emerald-700 bg-emerald-50/70 dark:bg-emerald-950/30 p-2 rounded-lg border border-emerald-200 dark:border-emerald-900">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{t("contracts.wizard.condTemplateReady")}</span>
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter className="bg-slate-50 dark:bg-slate-900 p-6 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-slate-200 dark:border-slate-800">
          <Button variant="outline" onClick={onBackToStep3}>
            <ArrowLeft className="w-4 h-4 mr-1.5" />{" "}
            {t("contracts.wizard.backToContent")}
          </Button>
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <Button
              variant="outline"
              onClick={() => onSubmit("draft")}
              disabled={isSubmitting}
              className="flex-1 sm:flex-none"
            >
              <Save className="w-4 h-4 mr-1.5" />{" "}
              {t("contracts.wizard.saveDraft")}
            </Button>
            <Button
              onClick={() => onSubmit("pending")}
              disabled={isSubmitting}
              className="flex-1 sm:flex-none bg-emerald-600 hover:bg-emerald-700 text-white font-bold shadow-sm"
            >
              <Send className="w-4 h-4 mr-1.5" />{" "}
              {isSubmitting
                ? t("contracts.wizard.signing")
                : t("contracts.wizard.publishContract")}
            </Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}
