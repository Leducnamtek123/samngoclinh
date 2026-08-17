"use client"

import React from "react"
import Image from "next/image"
import {
  Check,
  CheckCircle2,
  Clock,
  Copy,
  FileEdit,
  ShieldCheck,
} from "lucide-react"

import type { EContract } from "@/types"

import { useTranslation } from "@/providers/i18n-provider"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface ContractDetailVerificationCardProps {
  contract: EContract
  meta: Record<string, unknown>
  isOrderSource: boolean
  isSigned: boolean
  documentHash: string
  copiedHash: boolean
  onCopyHash: () => void
}

export function ContractDetailVerificationCard({
  contract,
  meta,
  isOrderSource,
  isSigned,
  documentHash,
  copiedHash,
  onCopyHash,
}: ContractDetailVerificationCardProps) {
  const { t } = useTranslation()
  const isDraft =
    contract.status === "draft" || contract.status === "pending_issue"
  const isPending =
    contract.status === "pending" || contract.status === "pending_signature"

  return (
    <>
      {/* Lifecycle Timeline */}
      <Card className="border-border/80 shadow-xs">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-bold flex items-center gap-2">
            <Clock className="w-4 h-4 text-emerald-600" />{" "}
            {t("contracts.contractDetails")}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="relative pl-6 space-y-4 border-l-2 border-slate-200 dark:border-slate-800 ml-2">
            {/* BƯỚC 1: KHỞI TẠO */}
            <div className="relative">
              <div className="absolute -left-[31px] top-0.5 w-4 h-4 rounded-full bg-emerald-600 ring-4 ring-white dark:ring-slate-950 flex items-center justify-center">
                <Check className="w-2.5 h-2.5 text-white" />
              </div>
              <div>
                <h5 className="font-bold text-xs text-slate-900 dark:text-white">
                  {t("contracts.wizard.step1")}
                </h5>
                <p className="text-[11px] text-muted-foreground">
                  {new Date(contract.createdAt).toLocaleString("vi-VN", {
                    timeZone: "Asia/Ho_Chi_Minh",
                  })}{" "}
                  •{" "}
                  {isOrderSource
                    ? t("orders.tabs.product")
                    : t("navigation.menu.dashboard")}
                </p>
              </div>
            </div>

            {/* BƯỚC 2: PHÁT HÀNH / SOẠN THẢO */}
            <div className="relative">
              <div
                className={`absolute -left-[31px] top-0.5 w-4 h-4 rounded-full ring-4 ring-white dark:ring-slate-950 flex items-center justify-center ${
                  isDraft
                    ? "bg-purple-600 text-white animate-pulse"
                    : "bg-emerald-600 text-white"
                }`}
              >
                {isDraft ? (
                  <FileEdit className="w-2.5 h-2.5" />
                ) : (
                  <Check className="w-2.5 h-2.5" />
                )}
              </div>
              <div>
                <h5 className="font-bold text-xs text-slate-900 dark:text-white">
                  {t("contracts.wizard.step2")}
                </h5>
                <p className="text-[11px] text-muted-foreground">
                  {t("contracts.wizard.step2Desc")}
                </p>
              </div>
            </div>

            {/* BƯỚC 3: KÝ ĐIỆN TỬ */}
            <div className="relative">
              <div
                className={`absolute -left-[31px] top-0.5 w-4 h-4 rounded-full ring-4 ring-white dark:ring-slate-950 flex items-center justify-center ${
                  isSigned
                    ? "bg-emerald-600 text-white"
                    : isPending
                      ? "bg-amber-500 text-white"
                      : "bg-slate-300 dark:bg-slate-700 text-slate-500"
                }`}
              >
                {isSigned ? (
                  <Check className="w-2.5 h-2.5 text-white" />
                ) : isPending ? (
                  <Clock className="w-2.5 h-2.5 text-white" />
                ) : (
                  <span className="w-1.5 h-1.5 rounded-full bg-white dark:bg-slate-400" />
                )}
              </div>
              <div>
                <h5 className="font-bold text-xs text-slate-900 dark:text-white">
                  {t("contracts.wizard.step3")}
                </h5>
                <p className="text-[11px] text-muted-foreground">
                  {isSigned && contract.signedAt
                    ? `${new Date(contract.signedAt).toLocaleString("vi-VN", { timeZone: "Asia/Ho_Chi_Minh" })}`
                    : t("contracts.wizard.step3Desc")}
                </p>
              </div>
            </div>

            {/* BƯỚC 4: HIỆU LỰC & HẾT HẠN */}
            <div className="relative">
              <div
                className={`absolute -left-[31px] top-0.5 w-4 h-4 rounded-full ring-4 ring-white dark:ring-slate-950 flex items-center justify-center ${
                  isSigned
                    ? "bg-emerald-600 text-white"
                    : "bg-slate-300 dark:bg-slate-700 text-slate-500"
                }`}
              >
                {isSigned ? (
                  <CheckCircle2 className="w-2.5 h-2.5 text-white" />
                ) : (
                  <span className="w-1.5 h-1.5 rounded-full bg-white dark:bg-slate-400" />
                )}
              </div>
              <div>
                <h5 className="font-bold text-xs text-slate-900 dark:text-white">
                  {t("contracts.wizard.step4")}
                </h5>
                <p className="text-[11px] text-muted-foreground">
                  {contract.expiresAt || contract.expiredAt
                    ? `${t("contracts.fields.expiryDate")}: ${new Date(
                        contract.expiresAt || contract.expiredAt || ""
                      ).toLocaleDateString("vi-VN", {
                        timeZone: "Asia/Ho_Chi_Minh",
                      })}`
                    : "—"}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Digital Verification & Hash */}
      <Card className="bg-slate-50/60 dark:bg-slate-900/40 border-border/80 shadow-xs">
        <CardHeader className="pb-2">
          <CardTitle className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-600" /> SHA-256
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-xs">
          <div>
            <span className="text-muted-foreground block text-[11px]">
              SHA-256:
            </span>
            <div className="flex items-center gap-2 mt-1">
              <code className="font-mono text-[10px] bg-slate-200 dark:bg-slate-800 p-1.5 rounded break-all flex-1">
                {documentHash}
              </code>
              <Button
                variant="ghost"
                size="icon"
                onClick={onCopyHash}
                className="h-7 w-7 cursor-pointer"
              >
                {copiedHash ? (
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                ) : (
                  <Copy className="w-3.5 h-3.5" />
                )}
              </Button>
            </div>
          </div>

          {contract.signatureUrl && (
            <div className="border border-slate-200 dark:border-slate-800 rounded-lg p-2 bg-white dark:bg-slate-900">
              <span className="text-[10px] text-muted-foreground font-semibold block mb-1">
                {t("contracts.notifications.signSuccess")}
              </span>
              <Image
                src={contract.signatureUrl}
                alt="Signature"
                width={160}
                height={48}
                className="h-12 w-auto object-contain mx-auto"
                unoptimized
              />
            </div>
          )}
        </CardContent>
      </Card>
    </>
  )
}
